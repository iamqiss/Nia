import { View, type ViewStyle } from 'react-native';
import { type StyleProp } from 'react-native';
import { type KeyboardAwareScrollViewProps } from 'react-native-keyboard-controller';
import { type AnimatedScrollViewProps } from 'react-native-reanimated';
export * from '#/components/Layout/const';
export * as Header from '#/components/Layout/Header';
export type ScreenProps = React.ComponentProps<typeof View> & {
    style?: StyleProp<ViewStyle>;
    noInsetTop?: boolean;
};
/**
 * Outermost component of every screen
 */
export declare const Screen: any;
export type ContentProps = AnimatedScrollViewProps & {
    style?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
    ignoreTabletLayoutOffset?: boolean;
};
/**
 * Default scroll view for simple pages
 */
export declare const Content: any;
export type KeyboardAwareContentProps = KeyboardAwareScrollViewProps & {
    children: React.ReactNode;
    contentContainerStyle?: StyleProp<ViewStyle>;
};
/**
 * Default scroll view for simple pages.
 *
 * BE SURE TO TEST THIS WHEN USING, it's untested as of writing this comment.
 */
export declare const KeyboardAwareContent: any;
/**
 * Utility component to center content within the screen
 */
export declare const Center: any;
//# sourceMappingURL=index.d.ts.map