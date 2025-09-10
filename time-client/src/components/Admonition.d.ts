import { type StyleProp, type ViewStyle } from 'react-native';
import { type ButtonProps } from '#/components/Button';
import { type TextProps } from '#/components/Typography';
export declare const colors: {
    warning: {
        light: string;
        dark: string;
    };
};
type Context = {
    type: 'info' | 'tip' | 'warning' | 'error';
};
declare const Context: any;
export declare function Icon(): any;
export declare function Text({ children, style, ...rest }: Pick<TextProps, 'children' | 'style'>): any;
export declare function Button({ children, ...props }: Omit<ButtonProps, 'size' | 'variant' | 'color'>): any;
export declare function Row({ children }: {
    children: React.ReactNode;
}): any;
export declare function Outer({ children, type, style, }: {
    children: React.ReactNode;
    type?: Context['type'];
    style?: StyleProp<ViewStyle>;
}): any;
export declare function Admonition({ children, type, style, }: {
    children: TextProps['children'];
    type?: Context['type'];
    style?: StyleProp<ViewStyle>;
}): any;
export {};
//# sourceMappingURL=Admonition.d.ts.map