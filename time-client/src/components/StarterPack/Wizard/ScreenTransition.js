import { jsx as _jsx } from "react/jsx-runtime";
import {} from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInLeft, SlideInRight, } from 'react-native-reanimated';
import { isWeb } from '#/platform/detection';
export function ScreenTransition({ direction, style, children, }) {
    const entering = direction === 'Forward' ? SlideInRight : SlideInLeft;
    return (_jsx(Animated.View, { entering: isWeb ? FadeIn.duration(90) : entering, exiting: FadeOut.duration(90), style: style, children: children }));
}
//# sourceMappingURL=ScreenTransition.js.map