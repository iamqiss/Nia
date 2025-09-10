import { jsx as _jsx } from "react/jsx-runtime";
import { View } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedStyle, } from 'react-native-reanimated';
import { isIOS } from '#/platform/detection';
import { usePagerHeaderContext } from '#/view/com/pager/PagerHeaderContext';
export function GrowableAvatar({ children, style, }) {
    const pagerContext = usePagerHeaderContext();
    // pagerContext should only be present on iOS, but better safe than sorry
    if (!pagerContext || !isIOS) {
        return _jsx(View, { style: style, children: children });
    }
    const { scrollY } = pagerContext;
    return (_jsx(GrowableAvatarInner, { scrollY: scrollY, style: style, children: children }));
}
function GrowableAvatarInner({ scrollY, children, style, }) {
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            {
                scale: interpolate(scrollY.get(), [-150, 0], [1.2, 1], {
                    extrapolateRight: Extrapolation.CLAMP,
                }),
            },
        ],
    }));
    return (_jsx(Animated.View, { style: [style, { transformOrigin: 'bottom left' }, animatedStyle], children: children }));
}
//# sourceMappingURL=GrowableAvatar.js.map