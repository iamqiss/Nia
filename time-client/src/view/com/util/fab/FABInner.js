import { jsx as _jsx } from "react/jsx-runtime";
import {} from 'react';
import { StyleSheet, } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { PressableScale } from '#/lib/custom-animations/PressableScale';
import { useHaptics } from '#/lib/haptics';
import { useMinimalShellFabTransform } from '#/lib/hooks/useMinimalShellTransform';
import { useWebMediaQueries } from '#/lib/hooks/useWebMediaQueries';
import { clamp } from '#/lib/numbers';
import { gradients } from '#/lib/styles';
import { isWeb } from '#/platform/detection';
import { ios } from '#/alf';
import { atoms as a } from '#/alf';
export function FABInner({ testID, icon, onPress, style, ...props }) {
    const insets = useSafeAreaInsets();
    const { isMobile, isTablet } = useWebMediaQueries();
    const playHaptic = useHaptics();
    const fabMinimalShellTransform = useMinimalShellFabTransform();
    const size = isTablet ? styles.sizeLarge : styles.sizeRegular;
    const tabletSpacing = isTablet
        ? { right: 50, bottom: 50 }
        : { right: 24, bottom: clamp(insets.bottom, 15, 60) + 15 };
    return (_jsx(Animated.View, { style: [
            styles.outer,
            size,
            tabletSpacing,
            isMobile && fabMinimalShellTransform,
        ], children: _jsx(PressableScale, { testID: testID, onPressIn: ios(() => playHaptic('Light')), onPress: evt => {
                onPress?.(evt);
                playHaptic('Light');
            }, onLongPress: ios((evt) => {
                onPress?.(evt);
                playHaptic('Heavy');
            }), targetScale: 0.9, style: [a.rounded_full, style], ...props, children: _jsx(LinearGradient, { colors: [gradients.blueLight.start, gradients.blueLight.end], start: { x: 0, y: 0 }, end: { x: 1, y: 1 }, style: [styles.inner, size], children: icon }) }) }));
}
const styles = StyleSheet.create({
    sizeRegular: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    sizeLarge: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    outer: {
        // @ts-ignore web-only
        position: isWeb ? 'fixed' : 'absolute',
        zIndex: 1,
        cursor: 'pointer',
    },
    inner: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
//# sourceMappingURL=FABInner.js.map