import React from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { type TextStyleProp, useTheme, type ViewStyleProp } from '#/alf';
export type ItemState = {
    name: string;
    selected: boolean;
    disabled: boolean;
    isInvalid: boolean;
    hovered: boolean;
    pressed: boolean;
    focused: boolean;
};
export type GroupProps = React.PropsWithChildren<{
    type?: 'radio' | 'checkbox';
    values: string[];
    maxSelections?: number;
    disabled?: boolean;
    onChange: (value: string[]) => void;
    label: string;
    style?: StyleProp<ViewStyle>;
}>;
export type ItemProps = ViewStyleProp & {
    type?: 'radio' | 'checkbox';
    name: string;
    label: string;
    value?: boolean;
    disabled?: boolean;
    onChange?: (selected: boolean) => void;
    isInvalid?: boolean;
    children: ((props: ItemState) => React.ReactNode) | React.ReactNode;
};
export declare function useItemContext(): any;
export declare function Group({ children, values: providedValues, onChange, disabled, type, maxSelections, label, style, }: GroupProps): any;
export declare function Item({ children, name, value, disabled: itemDisabled, onChange, isInvalid, style, type, label, ...rest }: ItemProps): any;
export declare function LabelText({ children, style, }: React.PropsWithChildren<TextStyleProp>): any;
export declare function createSharedToggleStyles({ theme: t, hovered, selected, disabled, isInvalid, }: {
    theme: ReturnType<typeof useTheme>;
    selected: boolean;
    hovered: boolean;
    focused: boolean;
    disabled: boolean;
    isInvalid: boolean;
}): {
    baseStyles: ViewStyle[];
    baseHoverStyles: ViewStyle[];
    indicatorStyles: ViewStyle[];
};
export declare function Checkbox(): any;
export declare function Switch(): any;
export declare function Radio(): any;
export declare const Platform: typeof Switch;
//# sourceMappingURL=Toggle.d.ts.map