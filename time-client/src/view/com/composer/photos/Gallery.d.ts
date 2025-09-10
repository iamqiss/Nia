import React from 'react';
import { type ComposerImage } from '#/state/gallery';
import { type PostAction } from '../state/composer';
interface GalleryProps {
    images: ComposerImage[];
    dispatch: (action: PostAction) => void;
}
export declare let Gallery: (props: GalleryProps) => React.ReactNode;
export declare function AltTextReminder(): any;
export {};
//# sourceMappingURL=Gallery.d.ts.map