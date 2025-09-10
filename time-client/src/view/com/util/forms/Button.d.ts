import React from 'react';
import { type NativeSyntheticEvent, type NativeTouchEvent, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
export type ButtonType = 'primary' | 'secondary' | 'default' | 'inverted' | 'primary-outline' | 'secondary-outline' | 'primary-light' | 'secondary-light' | 'default-light';
declare module 'react-native' {
    interface PressableStateCallbackType {
        hovered?: boolean;
        focused?: boolean;
    }
}
/**
 * @deprecated use Button from `#/components/Button.tsx` instead
 */
export declare function Button({ type, label, style, labelContainerStyle, labelStyle, onPress, children, testID, accessibilityLabel, accessibilityHint, accessibilityLabelledBy, onAccessibilityEscape, withLoading, disabled, }: React.PropsWithChildren<{
    type?: ButtonType;
    label?: string;
    style?: StyleProp<ViewStyle>;
    labelContainerStyle?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
    onPress?: (e: NativeSyntheticEvent<NativeTouchEvent>) => void | Promise<void>;
    testID?: string;
    accessibilityLabel?: string;
    accessibilityHint?: string;
    accessibilityLabelledBy?: string;
    onAccessibilityEscape?: () => void;
    withLoading?: boolean;
    disabled?: boolean;
}>): any;
//# sourceMappingURL=Button.d.ts.map