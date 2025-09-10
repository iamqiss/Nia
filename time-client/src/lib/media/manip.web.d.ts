import { type PickerImage } from './picker.shared';
import { type Dimensions } from './types';
export declare function compressIfNeeded(img: PickerImage, maxSize: number): Promise<PickerImage>;
export interface DownloadAndResizeOpts {
    uri: string;
    width: number;
    height: number;
    mode: 'contain' | 'cover' | 'stretch';
    maxSize: number;
    timeout: number;
}
export declare function downloadAndResize(opts: DownloadAndResizeOpts): Promise<any>;
export declare function shareImageModal(_opts: {
    uri: string;
}): Promise<void>;
export declare function saveImageToMediaLibrary(_opts: {
    uri: string;
}): Promise<void>;
export declare function getImageDim(path: string): Promise<Dimensions>;
export declare function saveBytesToDisk(filename: string, bytes: Uint8Array, type: string): Promise<boolean>;
export declare function safeDeleteAsync(): Promise<void>;
//# sourceMappingURL=manip.web.d.ts.map