import React from 'react';
import { type DialogInnerProps, type DialogOuterProps } from '#/components/Dialog/types';
export { useDialogContext, useDialogControl } from '#/components/Dialog/context';
export * from '#/components/Dialog/shared';
export * from '#/components/Dialog/types';
export * from '#/components/Dialog/utils';
export { Input } from '#/components/forms/TextField';
export declare const WEB_DIALOG_HEIGHT = "80vh";
export declare function Outer({ children, control, onClose, webOptions, }: React.PropsWithChildren<DialogOuterProps>): any;
export declare function Inner({ children, style, label, accessibilityLabelledBy, accessibilityDescribedBy, header, contentContainerStyle, }: DialogInnerProps): any;
export declare const ScrollableInner: typeof Inner;
export declare const InnerFlatList: any;
export declare function FlatListFooter({ children }: {
    children: React.ReactNode;
}): any;
export declare function Close(): any;
export declare function Handle(): null;
//# sourceMappingURL=index.web.d.ts.map