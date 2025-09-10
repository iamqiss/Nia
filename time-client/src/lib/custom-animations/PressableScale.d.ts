import { type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
export declare function PressableScale({ targetScale, children, style, onPressIn, onPressOut, ...rest }: {
    targetScale?: number;
    style?: StyleProp<ViewStyle>;
} & Exclude<PressableProps, 'onPressIn' | 'onPressOut' | 'style'>): any;
//# sourceMappingURL=PressableScale.d.ts.map