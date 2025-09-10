import { type TextProps } from 'react-native';
import { type PathProps, type SvgProps } from 'react-native-svg';
import { tokens } from '#/alf';
export type Props = {
    fill?: PathProps['fill'];
    style?: TextProps['style'];
    size?: keyof typeof sizes;
    gradient?: keyof typeof tokens.gradients;
} & Omit<SvgProps, 'style' | 'size'>;
export declare const sizes: {
    readonly xs: 12;
    readonly sm: 16;
    readonly md: 20;
    readonly lg: 24;
    readonly xl: 28;
    readonly '2xl': 32;
};
export declare function useCommonSVGProps(props: Props): {
    style: TextProps["style"];
    fill: any;
    size: number;
    gradient: any;
};
//# sourceMappingURL=common.d.ts.map