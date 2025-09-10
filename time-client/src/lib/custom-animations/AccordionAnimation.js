import { jsx as _jsx } from "react/jsx-runtime";
import { View, } from 'react-native';
import Animated, { Easing, FadeInUp, FadeOutUp, useAnimatedStyle, useSharedValue, withTiming, } from 'react-native-reanimated';
import { isIOS, isWeb } from '#/platform/detection';
function WebAccordion({ isExpanded, duration = 300, style, children, }) {
    const heightValue = useSharedValue(0);
    const animatedStyle = useAnimatedStyle(() => {
        const targetHeight = isExpanded ? heightValue.get() : 0;
        return {
            height: withTiming(targetHeight, {
                duration,
                easing: Easing.out(Easing.cubic),
            }),
            overflow: 'hidden',
        };
    });
    const onLayout = (e) => {
        if (heightValue.get() === 0) {
            heightValue.set(e.nativeEvent.layout.height);
        }
    };
    return (_jsx(Animated.View, { style: [animatedStyle, style], children: _jsx(View, { onLayout: onLayout, children: children }) }));
}
function MobileAccordion({ isExpanded, duration = 200, style, children, }) {
    if (!isExpanded)
        return null;
    return (_jsx(Animated.View, { style: style, entering: FadeInUp.duration(duration), exiting: FadeOutUp.duration(duration / 2), pointerEvents: isIOS ? 'auto' : 'box-none', children: children }));
}
export function AccordionAnimation(props) {
    return isWeb ? _jsx(WebAccordion, { ...props }) : _jsx(MobileAccordion, { ...props });
}
//# sourceMappingURL=AccordionAnimation.js.map