import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext } from 'react';
import { View } from 'react-native';
import { atoms as a, useBreakpoints, useTheme } from '#/alf';
import { Button as BaseButton } from '#/components/Button';
import { CircleInfo_Stroke2_Corner0_Rounded as ErrorIcon } from '#/components/icons/CircleInfo';
import { Eye_Stroke2_Corner0_Rounded as InfoIcon } from '#/components/icons/Eye';
import { Leaf_Stroke2_Corner0_Rounded as TipIcon } from '#/components/icons/Leaf';
import { Warning_Stroke2_Corner0_Rounded as WarningIcon } from '#/components/icons/Warning';
import { Text as BaseText } from '#/components/Typography';
export const colors = {
    warning: {
        light: '#DFBC00',
        dark: '#BFAF1F',
    },
};
const Context = createContext({
    type: 'info',
});
Context.displayName = 'AdmonitionContext';
export function Icon() {
    const t = useTheme();
    const { type } = useContext(Context);
    const Icon = {
        info: InfoIcon,
        tip: TipIcon,
        warning: WarningIcon,
        error: ErrorIcon,
    }[type];
    const fill = {
        info: t.atoms.text_contrast_medium.color,
        tip: t.palette.primary_500,
        warning: colors.warning.light,
        error: t.palette.negative_500,
    }[type];
    return _jsx(Icon, { fill: fill, size: "md" });
}
export function Text({ children, style, ...rest }) {
    return (_jsx(BaseText, { ...rest, style: [a.flex_1, a.text_sm, a.leading_snug, a.pr_md, style], children: children }));
}
export function Button({ children, ...props }) {
    return (_jsx(BaseButton, { size: "tiny", variant: "outline", color: "secondary", ...props, children: children }));
}
export function Row({ children }) {
    return (_jsx(View, { style: [a.flex_1, a.flex_row, a.align_center, a.gap_sm], children: children }));
}
export function Outer({ children, type = 'info', style, }) {
    const t = useTheme();
    const { gtMobile } = useBreakpoints();
    const borderColor = {
        info: t.atoms.border_contrast_low.borderColor,
        tip: t.atoms.border_contrast_low.borderColor,
        warning: t.atoms.border_contrast_low.borderColor,
        error: t.atoms.border_contrast_low.borderColor,
    }[type];
    return (_jsx(Context.Provider, { value: { type }, children: _jsx(View, { style: [
                gtMobile ? a.p_md : a.p_sm,
                a.rounded_sm,
                a.border,
                t.atoms.bg_contrast_25,
                { borderColor },
                style,
            ], children: children }) }));
}
export function Admonition({ children, type, style, }) {
    return (_jsx(Outer, { type: type, style: style, children: _jsxs(Row, { children: [_jsx(Icon, {}), _jsx(Text, { children: children })] }) }));
}
//# sourceMappingURL=Admonition.js.map