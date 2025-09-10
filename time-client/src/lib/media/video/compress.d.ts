import { type ImagePickerAsset } from 'expo-image-picker';
import { type CompressedVideo } from './types';
export declare function compressVideo(file: ImagePickerAsset, opts?: {
    signal?: AbortSignal;
    onProgress?: (progress: number) => void;
}): Promise<CompressedVideo>;
//# sourceMappingURL=compress.d.ts.map