import {} from 'expo-image-crop-tool';
import {} from './picker.shared';
import {} from './types';
export { openPicker, openUnifiedPicker } from './picker.shared';
export async function openCamera(_opts) {
    throw new Error('openCamera is not supported on web');
}
export async function openCropper(_opts) {
    throw new Error('openCropper is not supported on web. Use EditImageDialog instead.');
}
//# sourceMappingURL=picker.web.js.map