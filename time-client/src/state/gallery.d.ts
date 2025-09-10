import { type ActionCrop } from 'expo-image-manipulator';
import { type PickerImage } from '#/lib/media/picker.shared';
export type ImageTransformation = {
    crop?: ActionCrop['crop'];
};
export type ImageMeta = {
    path: string;
    width: number;
    height: number;
    mime: string;
};
export type ImageSource = ImageMeta & {
    id: string;
};
type ComposerImageBase = {
    alt: string;
    source: ImageSource;
};
type ComposerImageWithoutTransformation = ComposerImageBase & {
    transformed?: undefined;
    manips?: undefined;
};
type ComposerImageWithTransformation = ComposerImageBase & {
    transformed: ImageMeta;
    manips?: ImageTransformation;
};
export type ComposerImage = ComposerImageWithoutTransformation | ComposerImageWithTransformation;
export declare function createComposerImage(raw: ImageMeta): Promise<ComposerImageWithoutTransformation>;
export type InitialImage = {
    uri: string;
    width: number;
    height: number;
    altText?: string;
};
export declare function createInitialImages(uris?: InitialImage[]): ComposerImageWithoutTransformation[];
export declare function pasteImage(uri: string): Promise<ComposerImageWithoutTransformation>;
export declare function cropImage(img: ComposerImage): Promise<ComposerImage>;
export declare function manipulateImage(img: ComposerImage, trans: ImageTransformation): Promise<ComposerImage>;
export declare function resetImageManipulation(img: ComposerImage): ComposerImageWithoutTransformation;
export declare function compressImage(img: ComposerImage): Promise<PickerImage>;
/** Purge files that were created to accomodate image manipulation */
export declare function purgeTemporaryImageFiles(): Promise<void>;
export {};
//# sourceMappingURL=gallery.d.ts.map