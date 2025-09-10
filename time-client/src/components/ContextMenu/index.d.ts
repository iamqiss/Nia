import React from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { type AuxiliaryViewProps, type ItemIconProps, type ItemProps, type ItemTextProps, type TriggerProps } from '#/components/ContextMenu/types';
export { type DialogControlProps as ContextMenuControlProps, useDialogControl as useContextMenuControl, } from '#/components/Dialog';
/**
 * Needs placing near the top of the provider stack, but BELOW the theme provider.
 */
export declare function Provider({ children }: {
    children: React.ReactNode;
}): any;
export declare function Root({ children }: {
    children: React.ReactNode;
}): any;
export declare function Trigger({ children, label, contentLabel, style }: TriggerProps): any;
export declare function AuxiliaryView({ children, align }: AuxiliaryViewProps): any;
export declare function Outer({ children, style, align, }: {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    align?: 'left' | 'right';
}): any;
export declare function Item({ children, label, unstyled, style, onPress, position, ...rest }: ItemProps): any;
export declare function ItemText({ children, style }: ItemTextProps): any;
export declare function ItemIcon({ icon: Comp }: ItemIconProps): any;
export declare function ItemRadio({ selected }: {
    selected: boolean;
}): any;
export declare function LabelText({ children }: {
    children: React.ReactNode;
}): any;
export declare function Divider(): any;
//# sourceMappingURL=index.d.ts.map