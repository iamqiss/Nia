import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useImperativeHandle } from 'react';
import { Pressable, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming, } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { isWeb } from '#/platform/detection';
import { atoms as a, useTheme } from '#/alf';
import { Portal } from '#/components/Portal';
import { AnimatedCheck } from '../anim/AnimatedCheck';
import { Text } from '../Typography';
export const ProgressGuideToast = React.forwardRef(function ProgressGuideToast({ title, subtitle, visibleDuration }, ref) {
    const t = useTheme();
    const { _ } = useLingui();
    const insets = useSafeAreaInsets();
    const [isOpen, setIsOpen] = React.useState(false);
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(0);
    const animatedCheckRef = React.useRef(null);
    const timeoutRef = React.useRef(undefined);
    const winDim = useWindowDimensions();
    /**
     * Methods
     */
    const close = React.useCallback(() => {
        // clear the timeout, in case this was called imperatively
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = undefined;
        }
        // animate the opacity then set isOpen to false when done
        const setIsntOpen = () => setIsOpen(false);
        opacity.set(() => withTiming(0, {
            duration: 400,
            easing: Easing.out(Easing.cubic),
        }, () => runOnJS(setIsntOpen)()));
    }, [setIsOpen, opacity]);
    const open = React.useCallback(() => {
        // set isOpen=true to render
        setIsOpen(true);
        // animate the vertical translation, the opacity, and the checkmark
        const playCheckmark = () => animatedCheckRef.current?.play();
        opacity.set(0);
        opacity.set(() => withTiming(1, {
            duration: 100,
            easing: Easing.out(Easing.cubic),
        }, () => runOnJS(playCheckmark)()));
        translateY.set(0);
        translateY.set(() => withTiming(insets.top + 10, {
            duration: 500,
            easing: Easing.out(Easing.cubic),
        }));
        // start the countdown timer to autoclose
        timeoutRef.current = setTimeout(close, visibleDuration || 5e3);
    }, [setIsOpen, translateY, opacity, insets, close, visibleDuration]);
    useImperativeHandle(ref, () => ({
        open,
        close,
    }), [open, close]);
    const containerStyle = React.useMemo(() => {
        let left = 10;
        let right = 10;
        if (isWeb && winDim.width > 400) {
            left = right = (winDim.width - 380) / 2;
        }
        return {
            position: isWeb ? 'fixed' : 'absolute',
            top: 0,
            left,
            right,
        };
    }, [winDim.width]);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.get() }],
        opacity: opacity.get(),
    }));
    return (isOpen && (_jsx(Portal, { children: _jsx(Animated.View, { style: [
                // @ts-ignore position: fixed is web only
                containerStyle,
                animatedStyle,
            ], children: _jsxs(Pressable, { style: [
                    t.atoms.bg,
                    a.flex_row,
                    a.align_center,
                    a.gap_md,
                    a.border,
                    t.atoms.border_contrast_high,
                    a.rounded_md,
                    a.px_lg,
                    a.py_md,
                    a.shadow_sm,
                    {
                        shadowRadius: 8,
                        shadowOpacity: 0.1,
                        shadowOffset: { width: 0, height: 2 },
                        elevation: 8,
                    },
                ], onPress: close, accessibilityLabel: _(msg `Tap to dismiss`), accessibilityHint: "", children: [_jsx(AnimatedCheck, { fill: t.palette.primary_500, ref: animatedCheckRef }), _jsxs(View, { children: [_jsx(Text, { style: [a.text_md, a.font_bold], children: title }), subtitle && (_jsx(Text, { style: [a.text_sm, t.atoms.text_contrast_medium], children: subtitle }))] })] }) }) })));
});
//# sourceMappingURL=Toast.js.map