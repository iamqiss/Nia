import { type GestureResponderEvent, type StyleProp, type ViewStyle } from 'react-native';
import { type ViewStyleProp } from '#/alf';
import * as Button from '#/components/Button';
import { type LinkProps } from '#/components/Link';
export declare function Container({ children }: {
    children: React.ReactNode;
}): any;
/**
 * This uses `Portal` magic ✨ to render the icons and title correctly. ItemIcon and ItemText components
 * get teleported to the top row, leaving the rest of the children in the bottom row.
 */
export declare function Group({ children, destructive, iconInset, style, contentContainerStyle, }: {
    children: React.ReactNode;
    destructive?: boolean;
    iconInset?: boolean;
    style?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
}): any;
export declare function Item({ children, destructive, iconInset, style, }: {
    children?: React.ReactNode;
    destructive?: boolean;
    /**
     * Adds left padding so that the content will be aligned with other Items that contain icons
     * @default false
     */
    iconInset?: boolean;
    style?: StyleProp<ViewStyle>;
}): any;
export declare function LinkItem({ children, destructive, contentContainerStyle, chevronColor, ...props }: Omit<LinkProps, Button.UninheritableButtonProps> & {
    contentContainerStyle?: StyleProp<ViewStyle>;
    destructive?: boolean;
    chevronColor?: string;
}): any;
export declare function PressableItem({ children, destructive, contentContainerStyle, hoverStyle, ...props }: Omit<Button.ButtonProps, Button.UninheritableButtonProps> & {
    contentContainerStyle?: StyleProp<ViewStyle>;
    destructive?: boolean;
}): any;
export declare function ItemIcon({ icon: Comp, size, color: colorProp, }: Omit<React.ComponentProps<typeof Button.ButtonIcon>, 'position'> & {
    color?: string;
}): any;
export declare function ItemText({ style, ...props }: React.ComponentProps<typeof Button.ButtonText>): any;
export declare function Divider({ style }: ViewStyleProp): any;
export declare function Chevron({ color: colorProp }: {
    color?: string;
}): any;
export declare function BadgeText({ children, style, }: {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}): any;
export declare function BadgeButton({ label, onPress, }: {
    label: string;
    onPress: (evt: GestureResponderEvent) => void;
}): any;
//# sourceMappingURL=SettingsList.d.ts.map