import { jsx as _jsx } from "react/jsx-runtime";
import {} from 'react-native-svg';
import { PressableWithHover } from '#/view/com/util/PressableWithHover';
import { atoms as a, useTheme, web } from '#/alf';
export function ControlButton({ active, activeLabel, inactiveLabel, activeIcon: ActiveIcon, inactiveIcon: InactiveIcon, onPress, }) {
    const t = useTheme();
    return (_jsx(PressableWithHover, { accessibilityRole: "button", accessibilityLabel: active ? activeLabel : inactiveLabel, accessibilityHint: "", onPress: onPress, style: [
            a.p_xs,
            a.rounded_full,
            web({ transition: 'background-color 0.1s' }),
        ], hoverStyle: { backgroundColor: 'rgba(255, 255, 255, 0.2)' }, children: active ? (_jsx(ActiveIcon, { fill: t.palette.white, width: 20, "aria-hidden": true })) : (_jsx(InactiveIcon, { fill: t.palette.white, width: 20, "aria-hidden": true })) }));
}
//# sourceMappingURL=ControlButton.js.map