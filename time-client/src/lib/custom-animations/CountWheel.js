import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import Animated, { Easing, LayoutAnimationConfig, useReducedMotion, withTiming, } from 'react-native-reanimated';
import { decideShouldRoll } from '#/lib/custom-animations/util';
import { s } from '#/lib/styles';
import { Text } from '#/view/com/util/text/Text';
import { atoms as a, useTheme } from '#/alf';
import { useFormatPostStatCount } from '#/components/PostControls/util';
const animationConfig = {
    duration: 400,
    easing: Easing.out(Easing.cubic),
};
function EnteringUp() {
    'worklet';
    const animations = {
        opacity: withTiming(1, animationConfig),
        transform: [{ translateY: withTiming(0, animationConfig) }],
    };
    const initialValues = {
        opacity: 0,
        transform: [{ translateY: 18 }],
    };
    return {
        animations,
        initialValues,
    };
}
function EnteringDown() {
    'worklet';
    const animations = {
        opacity: withTiming(1, animationConfig),
        transform: [{ translateY: withTiming(0, animationConfig) }],
    };
    const initialValues = {
        opacity: 0,
        transform: [{ translateY: -18 }],
    };
    return {
        animations,
        initialValues,
    };
}
function ExitingUp() {
    'worklet';
    const animations = {
        opacity: withTiming(0, animationConfig),
        transform: [
            {
                translateY: withTiming(-18, animationConfig),
            },
        ],
    };
    const initialValues = {
        opacity: 1,
        transform: [{ translateY: 0 }],
    };
    return {
        animations,
        initialValues,
    };
}
function ExitingDown() {
    'worklet';
    const animations = {
        opacity: withTiming(0, animationConfig),
        transform: [{ translateY: withTiming(18, animationConfig) }],
    };
    const initialValues = {
        opacity: 1,
        transform: [{ translateY: 0 }],
    };
    return {
        animations,
        initialValues,
    };
}
export function CountWheel({ likeCount, big, isLiked, hasBeenToggled, }) {
    const t = useTheme();
    const shouldAnimate = !useReducedMotion() && hasBeenToggled;
    const shouldRoll = decideShouldRoll(isLiked, likeCount);
    // Incrementing the key will cause the `Animated.View` to re-render, with the newly selected entering/exiting
    // animation
    // The initial entering/exiting animations will get skipped, since these will happen on screen mounts and would
    // be unnecessary
    const [key, setKey] = React.useState(0);
    const [prevCount, setPrevCount] = React.useState(likeCount);
    const prevIsLiked = React.useRef(isLiked);
    const formatPostStatCount = useFormatPostStatCount();
    const formattedCount = formatPostStatCount(likeCount);
    const formattedPrevCount = formatPostStatCount(prevCount);
    React.useEffect(() => {
        if (isLiked === prevIsLiked.current) {
            return;
        }
        const newPrevCount = isLiked ? likeCount - 1 : likeCount + 1;
        setKey(prev => prev + 1);
        setPrevCount(newPrevCount);
        prevIsLiked.current = isLiked;
    }, [isLiked, likeCount]);
    const enteringAnimation = shouldAnimate && shouldRoll
        ? isLiked
            ? EnteringUp
            : EnteringDown
        : undefined;
    const exitingAnimation = shouldAnimate && shouldRoll
        ? isLiked
            ? ExitingUp
            : ExitingDown
        : undefined;
    return (_jsx(LayoutAnimationConfig, { skipEntering: true, skipExiting: true, children: likeCount > 0 ? (_jsxs(View, { style: [a.justify_center], children: [_jsx(Animated.View, { entering: enteringAnimation, children: _jsx(Text, { testID: "likeCount", style: [
                            big ? a.text_md : a.text_sm,
                            a.user_select_none,
                            isLiked
                                ? [a.font_bold, s.likeColor]
                                : { color: t.palette.contrast_500 },
                        ], children: formattedCount }) }, key), shouldAnimate && (likeCount > 1 || !isLiked) ? (_jsx(Animated.View, { entering: exitingAnimation, style: [a.absolute, { width: 50, opacity: 0 }], "aria-disabled": true, children: _jsx(Text, { style: [
                            big ? a.text_md : a.text_sm,
                            a.user_select_none,
                            isLiked
                                ? [a.font_bold, s.likeColor]
                                : { color: t.palette.contrast_500 },
                        ], children: formattedPrevCount }) }, key + 2)) : null] })) : null }));
}
//# sourceMappingURL=CountWheel.js.map