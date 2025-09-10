import React from 'react';
import { type ImageSource } from '#/view/com/lightbox/ImageViewing/@types';
export type Lightbox = {
    id: string;
    images: ImageSource[];
    index: number;
};
export declare function Provider({ children }: React.PropsWithChildren<{}>): any;
export declare function useLightbox(): any;
export declare function useLightboxControls(): any;
//# sourceMappingURL=lightbox.d.ts.map