import { type OpenCropperOptions } from 'expo-image-crop-tool';
import { type ImagePickerOptions } from 'expo-image-picker';
export { openPicker, openUnifiedPicker, type PickerImage as RNImage, } from './picker.shared';
export declare function openCamera(customOpts: ImagePickerOptions): Promise<{
    path: any;
    mime: any;
    size: any;
    width: any;
    height: any;
}>;
export declare function openCropper(opts: OpenCropperOptions): Promise<{
    path: any;
    mime: any;
    size: any;
    width: any;
    height: any;
}>;
//# sourceMappingURL=picker.d.ts.map