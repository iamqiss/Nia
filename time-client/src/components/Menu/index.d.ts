import { type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import * as Dialog from '#/components/Dialog';
import { useMenuContext } from '#/components/Menu/context';
import { type GroupProps, type ItemIconProps, type ItemProps, type ItemTextProps, type TriggerProps } from '#/components/Menu/types';
export { type DialogControlProps as MenuControlProps, useDialogControl as useMenuControl, } from '#/components/Dialog';
export { useMenuContext };
export declare function Root({ children, control, }: React.PropsWithChildren<{
    control?: Dialog.DialogControlProps;
}>): any;
export declare function Trigger({ children, label, role, hint, }: TriggerProps): any;
export declare function Outer({ children, showCancel, }: React.PropsWithChildren<{
    showCancel?: boolean;
    style?: StyleProp<ViewStyle>;
}>): any;
export declare function Item({ children, label, style, onPress, ...rest }: ItemProps): any;
export declare function ItemText({ children, style }: ItemTextProps): any;
export declare function ItemIcon({ icon: Comp }: ItemIconProps): any;
export declare function ItemRadio({ selected }: {
    selected: boolean;
}): any;
/**
 * NATIVE ONLY - for adding non-pressable items to the menu
 *
 * @platform ios, android
 */
export declare function ContainerItem({ children, style, }: {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}): any;
export declare function LabelText({ children, style, }: {
    children: React.ReactNode;
    style?: StyleProp<TextStyle>;
}): any;
export declare function Group({ children, style }: GroupProps): any;
export declare function Divider(): null;
//# sourceMappingURL=index.d.ts.map