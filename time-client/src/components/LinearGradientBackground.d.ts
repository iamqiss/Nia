import { type StyleProp, type ViewStyle } from 'react-native';
import type React from 'react';
import { gradients } from '#/alf/tokens';
export declare function LinearGradientBackground({ style, gradient, children, start, end, }: {
    style?: StyleProp<ViewStyle>;
    gradient?: keyof typeof gradients;
    children?: React.ReactNode;
    start?: [number, number];
    end?: [number, number];
}): any;
//# sourceMappingURL=LinearGradientBackground.d.ts.map