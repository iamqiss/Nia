import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useCameraPermission, usePhotoLibraryPermission, } from '#/lib/hooks/usePermissions';
import { compressIfNeeded } from '#/lib/media/manip';
import { openCamera, openCropper, openPicker } from '#/lib/media/picker';
import {} from '#/lib/media/picker.shared';
import { logger } from '#/logger';
import { isAndroid, isNative } from '#/platform/detection';
import { compressImage, createComposerImage, } from '#/state/gallery';
import { EditImageDialog } from '#/view/com/composer/photos/EditImageDialog';
import { EventStopper } from '#/view/com/util/EventStopper';
import { atoms as a, tokens, useTheme } from '#/alf';
import { useDialogControl } from '#/components/Dialog';
import { useSheetWrapper } from '#/components/Dialog/sheet-wrapper';
import { Camera_Filled_Stroke2_Corner0_Rounded as CameraFilledIcon, Camera_Stroke2_Corner0_Rounded as CameraIcon, } from '#/components/icons/Camera';
import { StreamingLive_Stroke2_Corner0_Rounded as LibraryIcon } from '#/components/icons/StreamingLive';
import { Trash_Stroke2_Corner0_Rounded as TrashIcon } from '#/components/icons/Trash';
import * as Menu from '#/components/Menu';
export function UserBanner({ type, banner, moderation, onSelectNewBanner, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const { requestCameraAccessIfNeeded } = useCameraPermission();
    const { requestPhotoAccessIfNeeded } = usePhotoLibraryPermission();
    const sheetWrapper = useSheetWrapper();
    const [rawImage, setRawImage] = useState();
    const editImageDialogControl = useDialogControl();
    const onOpenCamera = useCallback(async () => {
        if (!(await requestCameraAccessIfNeeded())) {
            return;
        }
        onSelectNewBanner?.(await compressIfNeeded(await openCamera({
            aspect: [3, 1],
        })));
    }, [onSelectNewBanner, requestCameraAccessIfNeeded]);
    const onOpenLibrary = useCallback(async () => {
        if (!(await requestPhotoAccessIfNeeded())) {
            return;
        }
        const items = await sheetWrapper(openPicker());
        if (!items[0]) {
            return;
        }
        try {
            if (isNative) {
                onSelectNewBanner?.(await compressIfNeeded(await openCropper({
                    imageUri: items[0].path,
                    aspectRatio: 3 / 1,
                })));
            }
            else {
                setRawImage(await createComposerImage(items[0]));
                editImageDialogControl.open();
            }
        }
        catch (e) {
            if (!String(e).includes('Canceled')) {
                logger.error('Failed to crop banner', { error: e });
            }
        }
    }, [
        onSelectNewBanner,
        requestPhotoAccessIfNeeded,
        sheetWrapper,
        editImageDialogControl,
    ]);
    const onRemoveBanner = useCallback(() => {
        onSelectNewBanner?.(null);
    }, [onSelectNewBanner]);
    const onChangeEditImage = useCallback(async (image) => {
        const compressed = await compressImage(image);
        onSelectNewBanner?.(compressed);
    }, [onSelectNewBanner]);
    // setUserBanner is only passed as prop on the EditProfile component
    return onSelectNewBanner ? (_jsxs(_Fragment, { children: [_jsx(EventStopper, { onKeyDown: true, children: _jsxs(Menu.Root, { children: [_jsx(Menu.Trigger, { label: _(msg `Edit avatar`), children: ({ props }) => (_jsxs(Pressable, { ...props, testID: "changeBannerBtn", children: [banner ? (_jsx(Image, { testID: "userBannerImage", style: styles.bannerImage, source: { uri: banner }, accessible: true, accessibilityIgnoresInvertColors: true })) : (_jsx(View, { testID: "userBannerFallback", style: [styles.bannerImage, t.atoms.bg_contrast_25] })), _jsx(View, { style: [
                                            styles.editButtonContainer,
                                            t.atoms.bg_contrast_25,
                                            a.border,
                                            t.atoms.border_contrast_low,
                                        ], children: _jsx(CameraFilledIcon, { height: 14, width: 14, style: t.atoms.text }) })] })) }), _jsxs(Menu.Outer, { showCancel: true, children: [_jsxs(Menu.Group, { children: [isNative && (_jsxs(Menu.Item, { testID: "changeBannerCameraBtn", label: _(msg `Upload from Camera`), onPress: onOpenCamera, children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Upload from Camera" }) }), _jsx(Menu.ItemIcon, { icon: CameraIcon })] })), _jsxs(Menu.Item, { testID: "changeBannerLibraryBtn", label: _(msg `Upload from Library`), onPress: onOpenLibrary, children: [_jsx(Menu.ItemText, { children: isNative ? (_jsx(Trans, { children: "Upload from Library" })) : (_jsx(Trans, { children: "Upload from Files" })) }), _jsx(Menu.ItemIcon, { icon: LibraryIcon })] })] }), !!banner && (_jsxs(_Fragment, { children: [_jsx(Menu.Divider, {}), _jsx(Menu.Group, { children: _jsxs(Menu.Item, { testID: "changeBannerRemoveBtn", label: _(msg `Remove Banner`), onPress: onRemoveBanner, children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Remove Banner" }) }), _jsx(Menu.ItemIcon, { icon: TrashIcon })] }) })] }))] })] }) }), _jsx(EditImageDialog, { control: editImageDialogControl, image: rawImage, onChange: onChangeEditImage, aspectRatio: 3 })] })) : banner &&
        !((moderation?.blur && isAndroid) /* android crashes with blur */) ? (_jsx(Image, { testID: "userBannerImage", style: [styles.bannerImage, t.atoms.bg_contrast_25], contentFit: "cover", source: { uri: banner }, blurRadius: moderation?.blur ? 100 : 0, accessible: true, accessibilityIgnoresInvertColors: true })) : (_jsx(View, { testID: "userBannerFallback", style: [
            styles.bannerImage,
            type === 'labeler' ? styles.labelerBanner : t.atoms.bg_contrast_25,
        ] }));
}
const styles = StyleSheet.create({
    editButtonContainer: {
        position: 'absolute',
        width: 24,
        height: 24,
        bottom: 8,
        right: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bannerImage: {
        width: '100%',
        height: 150,
    },
    labelerBanner: {
        backgroundColor: tokens.color.temp_purple,
    },
});
//# sourceMappingURL=UserBanner.js.map