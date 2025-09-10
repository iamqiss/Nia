import React from 'react';
import { type ComposerImage } from '#/state/gallery';
import * as Dialog from '#/components/Dialog';
type Props = {
    control: Dialog.DialogOuterProps['control'];
    image: ComposerImage;
    onChange: (next: ComposerImage) => void;
};
export declare const ImageAltTextDialog: ({ control, image, onChange, }: Props) => React.ReactNode;
export {};
//# sourceMappingURL=ImageAltTextDialog.d.ts.map