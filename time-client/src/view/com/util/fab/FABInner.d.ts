import { type ComponentProps, type JSX } from 'react';
import { type Pressable, type StyleProp, type ViewStyle } from 'react-native';
export interface FABProps extends ComponentProps<typeof Pressable> {
    testID?: string;
    icon: JSX.Element;
    style?: StyleProp<ViewStyle>;
}
export declare function FABInner({ testID, icon, onPress, style, ...props }: FABProps): any;
//# sourceMappingURL=FABInner.d.ts.map