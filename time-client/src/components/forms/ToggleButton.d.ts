import React from 'react';
import { type AccessibilityProps } from 'react-native';
import * as Toggle from '#/components/forms/Toggle';
type ItemProps = Omit<Toggle.ItemProps, 'style' | 'role' | 'children'> & AccessibilityProps & {
    children: React.ReactElement<any>;
    testID?: string;
};
export type GroupProps = Omit<Toggle.GroupProps, 'style' | 'type'> & {
    multiple?: boolean;
};
export declare function Group({ children, multiple, ...props }: GroupProps): any;
export declare function Button({ children, ...props }: ItemProps): any;
export declare function ButtonText({ children }: {
    children: React.ReactNode;
}): any;
export {};
//# sourceMappingURL=ToggleButton.d.ts.map