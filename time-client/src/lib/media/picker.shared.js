import { launchImageLibraryAsync, UIImagePickerPreferredAssetRepresentationMode, } from 'expo-image-picker';
import { t } from '@lingui/macro';
import { isIOS, isWeb } from '#/platform/detection';
import {} from '#/state/gallery';
import * as Toast from '#/view/com/util/Toast';
import { VIDEO_MAX_DURATION_MS } from '../constants';
import { getDataUriSize } from './util';
export async function openPicker(opts) {
    const response = await launchImageLibraryAsync({
        exif: false,
        mediaTypes: ['images'],
        quality: 1,
        selectionLimit: 1,
        ...opts,
        legacy: true,
        preferredAssetRepresentationMode: UIImagePickerPreferredAssetRepresentationMode.Automatic,
    });
    return (response.assets ?? [])
        .filter(asset => {
        if (asset.mimeType?.startsWith('image/'))
            return true;
        Toast.show(t `Only image files are supported`, 'exclamation-circle');
        return false;
    })
        .map(image => ({
        mime: image.mimeType || 'image/jpeg',
        height: image.height,
        width: image.width,
        path: image.uri,
        size: getDataUriSize(image.uri),
    }));
}
export async function openUnifiedPicker({ selectionCountRemaining, }) {
    return await launchImageLibraryAsync({
        exif: false,
        mediaTypes: ['images', 'videos'],
        quality: 1,
        allowsMultipleSelection: true,
        legacy: true,
        base64: isWeb,
        selectionLimit: isIOS ? selectionCountRemaining : undefined,
        preferredAssetRepresentationMode: UIImagePickerPreferredAssetRepresentationMode.Automatic,
        videoMaxDuration: VIDEO_MAX_DURATION_MS / 1000,
    });
}
//# sourceMappingURL=picker.shared.js.map