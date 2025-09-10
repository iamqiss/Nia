import React from 'react';
import { type AccessibilityProps, type PressableProps, type StyleProp, type TextProps, type ViewStyle } from 'react-native';
import { type Props as SVGIconProps } from '#/components/icons/common';
/**
 * The `Button` component, and some extensions of it like `Link` are intended
 * to be generic and therefore apply no styles by default. These `VariantProps`
 * are what control the `Button`'s presentation, and are intended only use cases where the buttons appear as, well, buttons.
 *
 * If `Button` or an extension of it are used for other compound components, use this property to avoid misuse of these variant props further down the line.
 *
 * @example
 * type MyComponentProps = Omit<ButtonProps, UninheritableButtonProps> & {...}
 */
export type UninheritableButtonProps = 'variant' | 'color' | 'size' | 'shape';
export type ButtonVariant = 'solid' | 'outline' | 'ghost';
export type ButtonColor = 'primary' | 'secondary' | 'secondary_inverted' | 'negative' | 'primary_subtle' | 'negative_subtle';
export type ButtonSize = 'tiny' | 'small' | 'large';
export type ButtonShape = 'round' | 'square' | 'default';
export type VariantProps = {
    /**
     * The style variation of the button
     * @deprecated Use `color` instead.
     */
    variant?: ButtonVariant;
    /**
     * The color of the button
     */
    color?: ButtonColor;
    /**
     * The size of the button
     */
    size?: ButtonSize;
    /**
     * The shape of the button
     */
    shape?: ButtonShape;
};
export type ButtonState = {
    hovered: boolean;
    focused: boolean;
    pressed: boolean;
    disabled: boolean;
};
export type ButtonContext = VariantProps & ButtonState;
type NonTextElements = React.ReactElement<any> | Iterable<React.ReactElement<any> | null | undefined | boolean>;
export type ButtonProps = Pick<PressableProps, 'disabled' | 'onPress' | 'testID' | 'onLongPress' | 'hitSlop' | 'onHoverIn' | 'onHoverOut' | 'onPressIn' | 'onPressOut' | 'onFocus' | 'onBlur'> & AccessibilityProps & VariantProps & {
    testID?: string;
    /**
     * For a11y, try to make this descriptive and clear
     */
    label: string;
    style?: StyleProp<ViewStyle>;
    hoverStyle?: StyleProp<ViewStyle>;
    children: NonTextElements | ((context: ButtonContext) => NonTextElements);
    PressableComponent?: React.ComponentType<PressableProps>;
};
export type ButtonTextProps = TextProps & VariantProps & {
    disabled?: boolean;
};
export declare function useButtonContext(): any;
export declare const Button: any;
export declare function useSharedButtonTextStyles(): any;
export declare function ButtonText({ children, style, ...rest }: ButtonTextProps): any;
export declare function ButtonIcon({ icon: Comp, size, }: {
    icon: React.ComponentType<SVGIconProps>;
    /**
     * @deprecated no longer needed
     */
    position?: 'left' | 'right';
    size?: SVGIconProps['size'];
}): any;
export {};
//# sourceMappingURL=Button.d.ts.map