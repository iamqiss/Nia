import { jsx as _jsx } from "react/jsx-runtime";
import { View } from 'react-native';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isWeb } from '#/platform/detection';
import { atoms as a, useTheme } from '#/alf';
export function KeyboardAccessory({ children }) {
    const t = useTheme();
    const { bottom } = useSafeAreaInsets();
    const style = [
        a.flex_row,
        a.py_xs,
        a.pl_sm,
        a.pr_xl,
        a.align_center,
        a.border_t,
        t.atoms.border_contrast_medium,
        t.atoms.bg,
    ];
    // todo: when iPad support is added, it should also not use the KeyboardStickyView
    if (isWeb) {
        return _jsx(View, { style: style, children: children });
    }
    return (_jsx(KeyboardStickyView, { offset: { closed: -bottom }, style: style, children: children }));
}
//# sourceMappingURL=KeyboardAccessory.js.map