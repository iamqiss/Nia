import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { s } from '#/lib/styles';
import { useTheme } from '#/alf';
import { Heart2_Filled_Stroke2_Corner0_Rounded as HeartIconFilled, Heart2_Stroke2_Corner0_Rounded as HeartIconOutline, } from '#/components/icons/Heart2';
const animationConfig = {
    duration: 600,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    fill: 'forwards',
};
const keyframe = [
    { transform: 'scale(1)' },
    { transform: 'scale(0.7)' },
    { transform: 'scale(1.2)' },
    { transform: 'scale(1)' },
];
const circle1Keyframe = [
    { opacity: 0, transform: 'scale(0)' },
    { opacity: 0.4 },
    { transform: 'scale(1.5)' },
    { opacity: 0.4 },
    { opacity: 0, transform: 'scale(1.5)' },
];
const circle2Keyframe = [
    { opacity: 0, transform: 'scale(0)' },
    { opacity: 1 },
    { transform: 'scale(0)' },
    { opacity: 1 },
    { opacity: 0, transform: 'scale(1.5)' },
];
export function AnimatedLikeIcon({ isLiked, big, hasBeenToggled, }) {
    const t = useTheme();
    const size = big ? 22 : 18;
    const shouldAnimate = !useReducedMotion() && hasBeenToggled;
    const prevIsLiked = React.useRef(isLiked);
    const likeIconRef = React.useRef(null);
    const circle1Ref = React.useRef(null);
    const circle2Ref = React.useRef(null);
    React.useEffect(() => {
        if (prevIsLiked.current === isLiked) {
            return;
        }
        if (shouldAnimate && isLiked) {
            likeIconRef.current?.animate?.(keyframe, animationConfig);
            circle1Ref.current?.animate?.(circle1Keyframe, animationConfig);
            circle2Ref.current?.animate?.(circle2Keyframe, animationConfig);
        }
        prevIsLiked.current = isLiked;
    }, [shouldAnimate, isLiked]);
    return (_jsxs(View, { children: [isLiked ? (
            // @ts-expect-error is div
            _jsx(View, { ref: likeIconRef, children: _jsx(HeartIconFilled, { style: s.likeColor, width: size }) })) : (_jsx(HeartIconOutline, { style: [{ color: t.palette.contrast_500 }, { pointerEvents: 'none' }], width: size })), _jsx(View
            // @ts-expect-error is div
            , { 
                // @ts-expect-error is div
                ref: circle1Ref, style: {
                    position: 'absolute',
                    backgroundColor: s.likeColor.color,
                    top: 0,
                    left: 0,
                    width: size,
                    height: size,
                    zIndex: -1,
                    pointerEvents: 'none',
                    borderRadius: size / 2,
                    opacity: 0,
                } }), _jsx(View
            // @ts-expect-error is div
            , { 
                // @ts-expect-error is div
                ref: circle2Ref, style: {
                    position: 'absolute',
                    backgroundColor: t.atoms.bg.backgroundColor,
                    top: 0,
                    left: 0,
                    width: size,
                    height: size,
                    zIndex: -1,
                    pointerEvents: 'none',
                    borderRadius: size / 2,
                    opacity: 0,
                } })] }));
}
//# sourceMappingURL=LikeIcon.web.js.map