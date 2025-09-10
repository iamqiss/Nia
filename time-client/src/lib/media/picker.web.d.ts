import { type OpenCropperOptions } from 'expo-image-crop-tool';
import { type PickerImage } from './picker.shared';
import { type CameraOpts } from './types';
export { openPicker, openUnifiedPicker } from './picker.shared';
export declare function openCamera(_opts: CameraOpts): Promise<PickerImage>;
export declare function openCropper(_opts: OpenCropperOptions): Promise<PickerImage>;
//# sourceMappingURL=picker.web.d.ts.map