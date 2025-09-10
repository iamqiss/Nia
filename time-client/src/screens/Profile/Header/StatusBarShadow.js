import { jsx as _jsx } from "react/jsx-runtime";
import Animated, { useAnimatedStyle, } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { isIOS } from '#/platform/detection';
import { usePagerHeaderContext } from '#/view/com/pager/PagerHeaderContext';
import { atoms as a } from '#/alf';
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
export function StatusBarShadow() {
    const { top: topInset } = useSafeAreaInsets();
    const pagerContext = usePagerHeaderContext();
    if (isIOS && pagerContext) {
        const { scrollY } = pagerContext;
        return _jsx(StatusBarShadowInnner, { scrollY: scrollY });
    }
    return (_jsx(LinearGradient, { colors: ['rgba(0,0,0,0.5)', 'rgba(0,0,0,0)'], style: [
            a.absolute,
            a.z_10,
            { height: topInset, top: 0, left: 0, right: 0 },
        ] }));
}
function StatusBarShadowInnner({ scrollY }) {
    const { top: topInset } = useSafeAreaInsets();
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: Math.min(0, scrollY.get()),
                },
            ],
        };
    });
    return (_jsx(AnimatedLinearGradient, { colors: ['rgba(0,0,0,0.5)', 'rgba(0,0,0,0)'], style: [
            animatedStyle,
            a.absolute,
            a.z_10,
            { height: topInset, top: 0, left: 0, right: 0 },
        ] }));
}
//# sourceMappingURL=StatusBarShadow.js.map