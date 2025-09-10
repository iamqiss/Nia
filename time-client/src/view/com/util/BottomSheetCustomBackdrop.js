import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedStyle, } from 'react-native-reanimated';
import {} from '@discord/bottom-sheet/src';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
export function createCustomBackdrop(onClose) {
    const CustomBackdrop = ({ animatedIndex, style }) => {
        const { _ } = useLingui();
        // animated variables
        const opacity = useAnimatedStyle(() => ({
            opacity: interpolate(animatedIndex.get(), // current snap index
            [-1, 0], // input range
            [0, 0.5], // output range
            Extrapolation.CLAMP),
        }));
        const containerStyle = useMemo(() => [style, { backgroundColor: '#000' }, opacity], [style, opacity]);
        return (_jsx(TouchableWithoutFeedback, { onPress: onClose, accessibilityLabel: _(msg `Close bottom drawer`), accessibilityHint: "", onAccessibilityEscape: () => {
                if (onClose !== undefined) {
                    onClose();
                }
            }, children: _jsx(Animated.View, { style: containerStyle }) }));
    };
    return CustomBackdrop;
}
//# sourceMappingURL=BottomSheetCustomBackdrop.js.map