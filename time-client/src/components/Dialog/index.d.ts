import React from 'react';
import { type DialogInnerProps, type DialogOuterProps } from '#/components/Dialog/types';
export { useDialogContext, useDialogControl } from '#/components/Dialog/context';
export * from '#/components/Dialog/shared';
export * from '#/components/Dialog/types';
export * from '#/components/Dialog/utils';
export declare const Input: any;
export declare function Outer({ children, control, onClose, nativeOptions, testID, }: React.PropsWithChildren<DialogOuterProps>): any;
export declare function Inner({ children, style, header }: DialogInnerProps): any;
export declare const ScrollableInner: any;
export declare const InnerFlatList: any;
export declare function FlatListFooter({ children }: {
    children: React.ReactNode;
}): any;
export declare function Handle({ difference }: {
    difference?: boolean;
}): any;
export declare function Close(): null;
//# sourceMappingURL=index.d.ts.map