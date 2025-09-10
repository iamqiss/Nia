import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming, } from 'react-native-reanimated';
import { atoms as a, flatten, useTheme } from '#/alf';
import { useCommonSVGProps } from '#/components/icons/common';
import { Loader_Stroke2_Corner0_Rounded as Icon } from '#/components/icons/Loader';
export function Loader(props) {
    const t = useTheme();
    const common = useCommonSVGProps(props);
    const rotation = useSharedValue(0);
    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{ rotate: rotation.get() + 'deg' }],
    }));
    React.useEffect(() => {
        rotation.set(() => withRepeat(withTiming(360, { duration: 500, easing: Easing.linear }), -1));
    }, [rotation]);
    return (_jsx(Animated.View, { style: [
            a.relative,
            a.justify_center,
            a.align_center,
            { width: common.size, height: common.size },
            animatedStyles,
        ], children: _jsx(Icon, { ...props, style: [
                a.absolute,
                a.inset_0,
                t.atoms.text_contrast_high,
                flatten(props.style),
            ] }) }));
}
//# sourceMappingURL=Loader.js.map