import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { View, } from 'react-native';
import { atoms as a, native, useTheme } from '#/alf';
import * as Toggle from '#/components/forms/Toggle';
import { Text } from '#/components/Typography';
export function Group({ children, multiple, ...props }) {
    const t = useTheme();
    return (_jsx(Toggle.Group, { type: multiple ? 'checkbox' : 'radio', ...props, children: _jsx(View, { style: [
                a.w_full,
                a.flex_row,
                a.rounded_sm,
                a.overflow_hidden,
                t.atoms.border_contrast_low,
                { borderWidth: 1 },
            ], children: children }) }));
}
export function Button({ children, ...props }) {
    return (_jsx(Toggle.Item, { ...props, style: [a.flex_grow, a.flex_1], children: _jsx(ButtonInner, { children: children }) }));
}
function ButtonInner({ children }) {
    const t = useTheme();
    const state = Toggle.useItemContext();
    const { baseStyles, hoverStyles, activeStyles } = React.useMemo(() => {
        const base = [];
        const hover = [];
        const active = [];
        hover.push(t.name === 'light' ? t.atoms.bg_contrast_100 : t.atoms.bg_contrast_25);
        if (state.selected) {
            active.push({
                backgroundColor: t.palette.contrast_800,
            });
            hover.push({
                backgroundColor: t.palette.contrast_800,
            });
            if (state.disabled) {
                active.push({
                    backgroundColor: t.palette.contrast_500,
                });
            }
        }
        if (state.disabled) {
            base.push({
                backgroundColor: t.palette.contrast_100,
            });
        }
        return {
            baseStyles: base,
            hoverStyles: hover,
            activeStyles: active,
        };
    }, [t, state]);
    return (_jsx(View, { style: [
            {
                borderLeftWidth: 1,
                marginLeft: -1,
            },
            a.flex_grow,
            a.py_md,
            native({
                paddingBottom: 10,
            }),
            a.px_md,
            t.atoms.bg,
            t.atoms.border_contrast_low,
            baseStyles,
            activeStyles,
            (state.hovered || state.pressed) && hoverStyles,
        ], children: children }));
}
export function ButtonText({ children }) {
    const t = useTheme();
    const state = Toggle.useItemContext();
    const textStyles = React.useMemo(() => {
        const text = [];
        if (state.selected) {
            text.push(t.atoms.text_inverted);
        }
        if (state.disabled) {
            text.push({
                opacity: 0.5,
            });
        }
        return text;
    }, [t, state]);
    return (_jsx(Text, { style: [
            a.text_center,
            a.font_bold,
            t.atoms.text_contrast_medium,
            textStyles,
        ], children: children }));
}
//# sourceMappingURL=ToggleButton.js.map