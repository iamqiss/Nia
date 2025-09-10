import { View } from 'react-native';
import { type TextStyleProp } from '#/alf';
import { type ButtonProps } from '#/components/Button';
export declare function Outer({ children, noBottomBorder, headerRef, sticky, }: {
    children: React.ReactNode;
    noBottomBorder?: boolean;
    headerRef?: React.MutableRefObject<View | null>;
    sticky?: boolean;
}): any;
export declare function Content({ children, align, }: {
    children?: React.ReactNode;
    align?: 'platform' | 'left';
}): any;
export declare function Slot({ children }: {
    children?: React.ReactNode;
}): any;
export declare function BackButton({ onPress, style, ...props }: Partial<ButtonProps>): any;
export declare function MenuButton(): any;
export declare function TitleText({ children, style, }: {
    children: React.ReactNode;
} & TextStyleProp): any;
export declare function SubtitleText({ children }: {
    children: React.ReactNode;
}): any;
//# sourceMappingURL=index.d.ts.map