import { jsx as _jsx } from "react/jsx-runtime";
import {} from 'react';
import { View } from 'react-native';
import { atoms as a, flatten, useAlf, useTheme, } from '#/alf';
import { normalizeTextStyles } from '#/alf/typography';
export function Text({ blend, style }) {
    const { fonts, flags, theme: t } = useAlf();
    const { width, ...flattened } = flatten(style);
    const { lineHeight = 14, ...rest } = normalizeTextStyles([a.text_sm, a.leading_snug, flattened], {
        fontScale: fonts.scaleMultiplier,
        fontFamily: fonts.family,
        flags,
    });
    return (_jsx(View, { style: [a.flex_1, { maxWidth: width, paddingVertical: lineHeight * 0.15 }], children: _jsx(View, { style: [
                a.rounded_md,
                t.atoms.bg_contrast_25,
                {
                    height: lineHeight * 0.7,
                    opacity: blend ? 0.6 : 1,
                },
                rest,
            ] }) }));
}
export function Circle({ children, size, blend, style, }) {
    const t = useTheme();
    return (_jsx(View, { style: [
            a.justify_center,
            a.align_center,
            a.rounded_full,
            t.atoms.bg_contrast_25,
            {
                width: size,
                height: size,
                opacity: blend ? 0.6 : 1,
            },
            style,
        ], children: children }));
}
export function Pill({ size, blend, style, }) {
    const t = useTheme();
    return (_jsx(View, { style: [
            a.rounded_full,
            t.atoms.bg_contrast_25,
            {
                width: size * 1.618,
                height: size,
                opacity: blend ? 0.6 : 1,
            },
            style,
        ] }));
}
export function Col({ children, style, }) {
    return _jsx(View, { style: [a.flex_1, style], children: children });
}
export function Row({ children, style, }) {
    return _jsx(View, { style: [a.flex_row, style], children: children });
}
//# sourceMappingURL=Skeleton.js.map