import { jsx as _jsx } from "react/jsx-runtime";
import {} from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
export function ScreenTransition({ style, children, }) {
    return (_jsx(Animated.View, { style: style, entering: FadeInRight, exiting: FadeOutLeft, children: children }));
}
//# sourceMappingURL=ScreenTransition.js.map