import { type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import type * as Dialog from '#/components/Dialog';
import { useMenuContext } from '#/components/Menu/context';
import { type GroupProps, type ItemIconProps, type ItemProps, type ItemTextProps, type TriggerProps } from '#/components/Menu/types';
export { useMenuContext };
export declare function useMenuControl(): Dialog.DialogControlProps;
export declare function Root({ children, control, }: React.PropsWithChildren<{
    control?: Dialog.DialogControlProps;
}>): any;
export declare function Trigger({ children, label, role, hint, }: TriggerProps): any;
export declare function Outer({ children, style, }: React.PropsWithChildren<{
    showCancel?: boolean;
    style?: StyleProp<ViewStyle>;
}>): any;
export declare function Item({ children, label, onPress, style, ...rest }: ItemProps): any;
export declare function ItemText({ children, style }: ItemTextProps): any;
export declare function ItemIcon({ icon: Comp, position }: ItemIconProps): any;
export declare function ItemRadio({ selected }: {
    selected: boolean;
}): any;
export declare function LabelText({ children, style, }: {
    children: React.ReactNode;
    style?: StyleProp<TextStyle>;
}): any;
export declare function Group({ children }: GroupProps): GroupProps;
export declare function Divider(): any;
export declare function ContainerItem(): null;
//# sourceMappingURL=index.web.d.ts.map