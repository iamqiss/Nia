import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback } from 'react';
import { Keyboard } from 'react-native';
import {} from 'expo-image-picker';
import { msg, plural } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { VIDEO_MAX_DURATION_MS, VIDEO_MAX_SIZE } from '#/lib/constants';
import { usePhotoLibraryPermission, useVideoLibraryPermission, } from '#/lib/hooks/usePermissions';
import { openUnifiedPicker } from '#/lib/media/picker';
import { extractDataUriMime } from '#/lib/media/util';
import { isNative, isWeb } from '#/platform/detection';
import { MAX_IMAGES } from '#/view/com/composer/state/composer';
import { atoms as a, useTheme } from '#/alf';
import { Button } from '#/components/Button';
import { useSheetWrapper } from '#/components/Dialog/sheet-wrapper';
import { Image_Stroke2_Corner0_Rounded as ImageIcon } from '#/components/icons/Image';
import * as toast from '#/components/Toast';
/**
 * Codes for known validation states
 */
var SelectedAssetError;
(function (SelectedAssetError) {
    SelectedAssetError["Unsupported"] = "Unsupported";
    SelectedAssetError["MixedTypes"] = "MixedTypes";
    SelectedAssetError["MaxImages"] = "MaxImages";
    SelectedAssetError["MaxVideos"] = "MaxVideos";
    SelectedAssetError["VideoTooLong"] = "VideoTooLong";
    SelectedAssetError["FileTooBig"] = "FileTooBig";
    SelectedAssetError["MaxGIFs"] = "MaxGIFs";
})(SelectedAssetError || (SelectedAssetError = {}));
/**
 * Supported video mime types. This differs slightly from
 * `SUPPORTED_MIME_TYPES` from `#/lib/constants` because we only care about
 * videos here.
 */
const SUPPORTED_VIDEO_MIME_TYPES = [
    'video/mp4',
    'video/mpeg',
    'video/webm',
    'video/quicktime',
];
function isSupportedVideoMimeType(mimeType) {
    return SUPPORTED_VIDEO_MIME_TYPES.includes(mimeType);
}
/**
 * Supported image mime types.
 */
const SUPPORTED_IMAGE_MIME_TYPES = [
    'image/gif',
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'image/webp',
    'image/avif',
    isNative && 'image/heic',
].filter(Boolean);
function isSupportedImageMimeType(mimeType) {
    return SUPPORTED_IMAGE_MIME_TYPES.includes(mimeType);
}
/**
 * This is a last-ditch effort type thing here, try not to rely on this.
 */
const extensionToMimeType = {
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    webm: 'video/webm',
    webp: 'image/webp',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    heic: 'image/heic',
};
/**
 * Attempts to bucket the given asset into one of our known types based on its
 * `mimeType`. If `mimeType` is not available, we try to infer it through
 * various means.
 */
function classifyImagePickerAsset(asset) {
    /*
     * Try to use the `mimeType` reported by `expo-image-picker` first.
     */
    let mimeType = asset.mimeType;
    if (!mimeType) {
        /*
         * We can try to infer this from the data-uri.
         */
        const maybeMimeType = extractDataUriMime(asset.uri);
        if (maybeMimeType.startsWith('image/') ||
            maybeMimeType.startsWith('video/')) {
            mimeType = maybeMimeType;
        }
        else if (maybeMimeType.startsWith('file/')) {
            /*
             * On the off-chance we get a `file/*` mime, try to infer from the
             * extension.
             */
            const extension = asset.uri.split('.').pop()?.toLowerCase();
            mimeType = extensionToMimeType[extension || ''];
        }
    }
    if (!mimeType) {
        return {
            success: false,
            type: undefined,
            mimeType: undefined,
        };
    }
    /*
     * Distill this down into a type "class".
     */
    let type;
    if (mimeType === 'image/gif') {
        type = 'gif';
    }
    else if (mimeType?.startsWith('video/')) {
        type = 'video';
    }
    else if (mimeType?.startsWith('image/')) {
        type = 'image';
    }
    /*
     * If we weren't able to find a valid type, we don't support this asset.
     */
    if (!type) {
        return {
            success: false,
            type: undefined,
            mimeType: undefined,
        };
    }
    return {
        success: true,
        type,
        mimeType,
    };
}
/**
 * Takes in raw assets from `expo-image-picker` and applies validation. Returns
 * the dominant `AssetType`, any valid assets, and any errors encountered along
 * the way.
 */
async function processImagePickerAssets(assets, { selectionCountRemaining, allowedAssetTypes, }) {
    /*
     * A deduped set of error codes, which we'll use later
     */
    const errors = new Set();
    /*
     * We only support selecting a single type of media at a time, so this gets
     * set to whatever the first valid asset type is, OR to whatever
     * `allowedAssetTypes` is set to.
     */
    let selectableAssetType;
    /*
     * This will hold the assets that we can actually use, after filtering
     */
    let supportedAssets = [];
    for (const asset of assets) {
        const { success, type, mimeType } = classifyImagePickerAsset(asset);
        if (!success) {
            errors.add(SelectedAssetError.Unsupported);
            continue;
        }
        /*
         * If we have an `allowedAssetTypes` prop, constrain to that. Otherwise,
         * set this to the first valid asset type we see, and then use that to
         * constrain all remaining selected assets.
         */
        selectableAssetType = allowedAssetTypes || selectableAssetType || type;
        // ignore mixed types
        if (type !== selectableAssetType) {
            errors.add(SelectedAssetError.MixedTypes);
            continue;
        }
        if (type === 'video') {
            /**
             * We don't care too much about mimeType at this point on native,
             * since the `processVideo` step later on will convert to `.mp4`.
             */
            if (isWeb && !isSupportedVideoMimeType(mimeType)) {
                errors.add(SelectedAssetError.Unsupported);
                continue;
            }
            /*
             * Filesize appears to be stable across all platforms, so we can use it
             * to filter out large files on web. On native, we compress these anyway,
             * so we only check on web.
             */
            if (isWeb && asset.fileSize && asset.fileSize > VIDEO_MAX_SIZE) {
                errors.add(SelectedAssetError.FileTooBig);
                continue;
            }
        }
        if (type === 'image') {
            if (!isSupportedImageMimeType(mimeType)) {
                errors.add(SelectedAssetError.Unsupported);
                continue;
            }
        }
        if (type === 'gif') {
            /*
             * Filesize appears to be stable across all platforms, so we can use it
             * to filter out large files on web. On native, we compress GIFs as
             * videos anyway, so we only check on web.
             */
            if (isWeb && asset.fileSize && asset.fileSize > VIDEO_MAX_SIZE) {
                errors.add(SelectedAssetError.FileTooBig);
                continue;
            }
        }
        /*
         * All validations passed, we have an asset!
         */
        supportedAssets.push({
            mimeType,
            ...asset,
            /*
             * In `expo-image-picker` >= v17, `uri` is now a `blob:` URL, not a
             * data-uri. Our handling elsewhere in the app (for web) relies on the
             * base64 data-uri, so we construct it here for web only.
             */
            uri: isWeb && asset.base64
                ? `data:${mimeType};base64,${asset.base64}`
                : asset.uri,
        });
    }
    if (supportedAssets.length > 0) {
        if (selectableAssetType === 'image') {
            if (supportedAssets.length > selectionCountRemaining) {
                errors.add(SelectedAssetError.MaxImages);
                supportedAssets = supportedAssets.slice(0, selectionCountRemaining);
            }
        }
        else if (selectableAssetType === 'video') {
            if (supportedAssets.length > 1) {
                errors.add(SelectedAssetError.MaxVideos);
                supportedAssets = supportedAssets.slice(0, 1);
            }
            if (supportedAssets[0].duration) {
                if (isWeb) {
                    /*
                     * Web reports duration as seconds
                     */
                    supportedAssets[0].duration = supportedAssets[0].duration * 1000;
                }
                if (supportedAssets[0].duration > VIDEO_MAX_DURATION_MS) {
                    errors.add(SelectedAssetError.VideoTooLong);
                    supportedAssets = [];
                }
            }
            else {
                errors.add(SelectedAssetError.Unsupported);
                supportedAssets = [];
            }
        }
        else if (selectableAssetType === 'gif') {
            if (supportedAssets.length > 1) {
                errors.add(SelectedAssetError.MaxGIFs);
                supportedAssets = supportedAssets.slice(0, 1);
            }
        }
    }
    return {
        type: selectableAssetType, // set above
        assets: supportedAssets,
        errors,
    };
}
export function SelectMediaButton({ disabled, allowedAssetTypes, selectedAssetsCount, onSelectAssets, }) {
    const { _ } = useLingui();
    const { requestPhotoAccessIfNeeded } = usePhotoLibraryPermission();
    const { requestVideoAccessIfNeeded } = useVideoLibraryPermission();
    const sheetWrapper = useSheetWrapper();
    const t = useTheme();
    const selectionCountRemaining = MAX_IMAGES - selectedAssetsCount;
    const processSelectedAssets = useCallback(async (rawAssets) => {
        const { type, assets, errors: errorCodes, } = await processImagePickerAssets(rawAssets, {
            selectionCountRemaining,
            allowedAssetTypes,
        });
        /*
         * Convert error codes to user-friendly messages.
         */
        const errors = Array.from(errorCodes).map(error => {
            return {
                [SelectedAssetError.Unsupported]: _(msg `One or more of your selected files are not supported.`),
                [SelectedAssetError.MixedTypes]: _(msg `Selecting multiple media types is not supported.`),
                [SelectedAssetError.MaxImages]: _(msg({
                    message: `You can select up to ${plural(MAX_IMAGES, {
                        other: '# images',
                    })} in total.`,
                    comment: `Error message for maximum number of images that can be selected to add to a post, currently 4 but may change.`,
                })),
                [SelectedAssetError.MaxVideos]: _(msg `You can only select one video at a time.`),
                [SelectedAssetError.VideoTooLong]: _(msg `Videos must be less than 3 minutes long.`),
                [SelectedAssetError.MaxGIFs]: _(msg `You can only select one GIF at a time.`),
                [SelectedAssetError.FileTooBig]: _(msg `One or more of your selected files are too large. Maximum size is 100 MB.`),
            }[error];
        });
        /*
         * Report the selected assets and any errors back to the
         * composer.
         */
        onSelectAssets({
            type,
            assets,
            errors,
        });
    }, [_, onSelectAssets, selectionCountRemaining, allowedAssetTypes]);
    const onPressSelectMedia = useCallback(async () => {
        if (isNative) {
            const [photoAccess, videoAccess] = await Promise.all([
                requestPhotoAccessIfNeeded(),
                requestVideoAccessIfNeeded(),
            ]);
            if (!photoAccess && !videoAccess) {
                toast.show(_(msg `You need to allow access to your media library.`), {
                    type: 'error',
                });
                return;
            }
        }
        if (isNative && Keyboard.isVisible()) {
            Keyboard.dismiss();
        }
        const { assets, canceled } = await sheetWrapper(openUnifiedPicker({ selectionCountRemaining }));
        if (canceled)
            return;
        await processSelectedAssets(assets);
    }, [
        _,
        requestPhotoAccessIfNeeded,
        requestVideoAccessIfNeeded,
        sheetWrapper,
        processSelectedAssets,
        selectionCountRemaining,
    ]);
    return (_jsx(Button, { testID: "openMediaBtn", onPress: onPressSelectMedia, label: _(msg({
            message: `Add media to post`,
            comment: `Accessibility label for button in composer to add images, a video, or a GIF to a post`,
        })), accessibilityHint: _(msg({
            message: `Opens device gallery to select up to ${plural(MAX_IMAGES, {
                other: '# images',
            })}, or a single video or GIF.`,
            comment: `Accessibility hint for button in composer to add images, a video, or a GIF to a post. Maximum number of images that can be selected is currently 4 but may change.`,
        })), style: a.p_sm, variant: "ghost", shape: "round", color: "primary", disabled: disabled, children: _jsx(ImageIcon, { size: "lg", style: disabled && t.atoms.text_contrast_low, accessibilityIgnoresInvertColors: true }) }));
}
//# sourceMappingURL=SelectMediaButton.js.map