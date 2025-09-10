import { type ImagePickerOptions } from 'expo-image-picker';
import { type ImageMeta } from '#/state/gallery';
export type PickerImage = ImageMeta & {
    size: number;
};
export declare function openPicker(opts?: ImagePickerOptions): Promise<any>;
export declare function openUnifiedPicker({ selectionCountRemaining, }: {
    selectionCountRemaining: number;
}): Promise<any>;
//# sourceMappingURL=picker.shared.d.ts.map