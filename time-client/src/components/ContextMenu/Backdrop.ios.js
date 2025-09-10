import { jsx as _jsx } from "react/jsx-runtime";
import { Pressable } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedProps, useAnimatedStyle, } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { atoms as a, useTheme } from '#/alf';
import { useContextMenuContext } from './context';
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
export function Backdrop(props) {
    const { mode } = useContextMenuContext();
    switch (mode) {
        case 'full':
            return _jsx(BlurredBackdrop, { ...props });
        case 'auxiliary-only':
            return _jsx(OpacityBackdrop, { ...props });
    }
}
function BlurredBackdrop({ animation, intensity = 50, onPress }) {
    const { _ } = useLingui();
    const animatedProps = useAnimatedProps(() => ({
        intensity: interpolate(animation.get(), [0, 1], [0, intensity], Extrapolation.CLAMP),
    }));
    return (_jsx(AnimatedBlurView, { animatedProps: animatedProps, style: [a.absolute, a.inset_0], tint: "systemMaterialDark", children: _jsx(Pressable, { style: a.flex_1, accessibilityLabel: _(msg `Close menu`), accessibilityHint: _(msg `Tap to close context menu`), onPress: onPress }) }));
}
function OpacityBackdrop({ animation, onPress }) {
    const t = useTheme();
    const { _ } = useLingui();
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(animation.get(), [0, 1], [0, 0.05], Extrapolation.CLAMP),
    }));
    return (_jsx(Animated.View, { style: [a.absolute, a.inset_0, t.atoms.bg_contrast_975, animatedStyle], children: _jsx(Pressable, { style: a.flex_1, accessibilityLabel: _(msg `Close menu`), accessibilityHint: _(msg `Tap to close context menu`), onPress: onPress }) }));
}
//# sourceMappingURL=Backdrop.ios.js.map