import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, } from 'react-native';
import { atoms as a, useTheme } from '#/alf';
import { Text } from '#/components/Typography';
export function Header({ renderLeft, renderRight, children, style, onLayout, }) {
    const t = useTheme();
    return (_jsxs(View, { onLayout: onLayout, style: [
            a.sticky,
            a.top_0,
            a.relative,
            a.w_full,
            a.py_sm,
            a.flex_row,
            a.justify_center,
            a.align_center,
            { minHeight: 50 },
            a.border_b,
            t.atoms.border_contrast_medium,
            t.atoms.bg,
            { borderTopLeftRadius: a.rounded_md.borderRadius },
            { borderTopRightRadius: a.rounded_md.borderRadius },
            style,
        ], children: [renderLeft && (_jsx(View, { style: [a.absolute, { left: 6 }], children: renderLeft() })), children, renderRight && (_jsx(View, { style: [a.absolute, { right: 6 }], children: renderRight() }))] }));
}
export function HeaderText({ children, style, }) {
    return (_jsx(Text, { style: [a.text_lg, a.text_center, a.font_heavy, style], children: children }));
}
//# sourceMappingURL=shared.js.map