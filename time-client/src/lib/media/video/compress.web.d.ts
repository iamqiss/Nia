import { type ImagePickerAsset } from 'expo-image-picker';
import { type CompressedVideo } from './types';
export declare function compressVideo(asset: ImagePickerAsset, _opts?: {
    signal?: AbortSignal;
    onProgress?: (progress: number) => void;
}): Promise<CompressedVideo>;
//# sourceMappingURL=compress.web.d.ts.map