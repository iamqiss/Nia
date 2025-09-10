import { jsx as _jsx } from "react/jsx-runtime";
import { Pressable, } from 'react-native';
import Animated, { cancelAnimation, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming, } from 'react-native-reanimated';
import { isTouchDevice } from '#/lib/browser';
import { isNative } from '#/platform/detection';
const DEFAULT_TARGET_SCALE = isNative || isTouchDevice ? 0.98 : 1;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export function PressableScale({ targetScale = DEFAULT_TARGET_SCALE, children, style, onPressIn, onPressOut, ...rest }) {
    const reducedMotion = useReducedMotion();
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.get() }],
    }));
    return (_jsx(AnimatedPressable, { accessibilityRole: "button", onPressIn: e => {
            if (onPressIn) {
                onPressIn(e);
            }
            cancelAnimation(scale);
            scale.set(() => withTiming(targetScale, { duration: 100 }));
        }, onPressOut: e => {
            if (onPressOut) {
                onPressOut(e);
            }
            cancelAnimation(scale);
            scale.set(() => withTiming(1, { duration: 100 }));
        }, style: [!reducedMotion && animatedStyle, style], ...rest, children: children }));
}
//# sourceMappingURL=PressableScale.js.map