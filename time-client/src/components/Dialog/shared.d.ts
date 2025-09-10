import { type LayoutChangeEvent, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
export declare function Header({ renderLeft, renderRight, children, style, onLayout, }: {
    renderLeft?: () => React.ReactNode;
    renderRight?: () => React.ReactNode;
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    onLayout?: (event: LayoutChangeEvent) => void;
}): any;
export declare function HeaderText({ children, style, }: {
    children?: React.ReactNode;
    style?: StyleProp<TextStyle>;
}): any;
//# sourceMappingURL=shared.d.ts.map