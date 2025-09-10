import { type OpenCropperOptions } from 'expo-image-crop-tool';
import { type PickerImage } from './picker.shared';
import { ImagePickerResult } from 'expo-image-picker';
export declare function openPicker(): Promise<PickerImage[]>;
export declare function openUnifiedPicker(): Promise<ImagePickerResult>;
export declare function openCamera(): Promise<PickerImage>;
export declare function openCropper(opts: OpenCropperOptions): Promise<{
    path: any;
    mime: any;
    size: any;
    width: any;
    height: any;
}>;
//# sourceMappingURL=picker.e2e.d.ts.map