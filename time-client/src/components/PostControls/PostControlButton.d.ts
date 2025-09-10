import { type Insets, type View } from 'react-native';
import { type ButtonProps } from '#/components/Button';
import { type Props as SVGIconProps } from '#/components/icons/common';
import { type TextProps } from '#/components/Typography';
export declare const DEFAULT_HITSLOP: {
    top: number;
    bottom: number;
    left: number;
    right: number;
};
export declare function PostControlButton({ ref, onPress, onLongPress, children, big, active, activeColor, ...props }: Omit<ButtonProps, 'hitSlop'> & {
    ref?: React.Ref<View>;
    active?: boolean;
    big?: boolean;
    color?: string;
    activeColor?: string;
    hitSlop?: Insets;
}): any;
export declare function PostControlButtonIcon({ icon: Comp, style, ...rest }: SVGIconProps & {
    icon: React.ComponentType<SVGIconProps>;
}): any;
export declare function PostControlButtonText({ style, ...props }: TextProps): any;
//# sourceMappingURL=PostControlButton.d.ts.map