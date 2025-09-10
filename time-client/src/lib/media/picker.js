import ExpoImageCropTool, {} from 'expo-image-crop-tool';
import { launchCameraAsync } from 'expo-image-picker';
export { openPicker, openUnifiedPicker, } from './picker.shared';
export async function openCamera(customOpts) {
    const opts = {
        mediaTypes: 'images',
        ...customOpts,
    };
    const res = await launchCameraAsync(opts);
    if (!res || !res.assets) {
        throw new Error('Camera was closed before taking a photo');
    }
    const asset = res?.assets[0];
    return {
        path: asset.uri,
        mime: asset.mimeType ?? 'image/jpeg',
        size: asset.fileSize ?? 0,
        width: asset.width,
        height: asset.height,
    };
}
export async function openCropper(opts) {
    const item = await ExpoImageCropTool.openCropperAsync({
        ...opts,
        format: 'jpeg',
    });
    return {
        path: item.path,
        mime: item.mime,
        size: item.size,
        width: item.width,
        height: item.height,
    };
}
//# sourceMappingURL=picker.js.map