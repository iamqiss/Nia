import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Children, createContext, useContext, useMemo } from 'react';
import { View } from 'react-native';
import { Popover } from 'radix-ui';
import { atoms as a, flatten, select, useTheme } from '#/alf';
import { transparentifyColor } from '#/alf/util/colorGeneration';
import { ARROW_SIZE, BUBBLE_MAX_WIDTH, MIN_EDGE_SPACE, } from '#/components/Tooltip/const';
import { Text } from '#/components/Typography';
const TooltipContext = createContext({
    position: 'bottom',
    onVisibleChange: () => { },
});
TooltipContext.displayName = 'TooltipContext';
export function Outer({ children, position = 'bottom', visible, onVisibleChange, }) {
    const ctx = useMemo(() => ({ position, onVisibleChange }), [position, onVisibleChange]);
    return (_jsx(Popover.Root, { open: visible, onOpenChange: onVisibleChange, children: _jsx(TooltipContext.Provider, { value: ctx, children: children }) }));
}
export function Target({ children }) {
    return (_jsx(Popover.Trigger, { asChild: true, children: _jsx(View, { collapsable: false, children: children }) }));
}
export function Content({ children, label, }) {
    const t = useTheme();
    const { position, onVisibleChange } = useContext(TooltipContext);
    return (_jsx(Popover.Portal, { children: _jsxs(Popover.Content, { className: "radix-popover-content", "aria-label": label, side: position, sideOffset: 4, collisionPadding: MIN_EDGE_SPACE, onInteractOutside: () => onVisibleChange(false), style: flatten([
                a.rounded_sm,
                select(t.name, {
                    light: t.atoms.bg,
                    dark: t.atoms.bg_contrast_100,
                    dim: t.atoms.bg_contrast_100,
                }),
                {
                    minWidth: 'max-content',
                    boxShadow: select(t.name, {
                        light: `0 0 24px ${transparentifyColor(t.palette.black, 0.2)}`,
                        dark: `0 0 24px ${transparentifyColor(t.palette.black, 0.2)}`,
                        dim: `0 0 24px ${transparentifyColor(t.palette.black, 0.2)}`,
                    }),
                },
            ]), children: [_jsx(Popover.Arrow, { width: ARROW_SIZE, height: ARROW_SIZE / 2, fill: select(t.name, {
                        light: t.atoms.bg.backgroundColor,
                        dark: t.atoms.bg_contrast_100.backgroundColor,
                        dim: t.atoms.bg_contrast_100.backgroundColor,
                    }) }), _jsx(View, { style: [a.px_md, a.py_sm, { maxWidth: BUBBLE_MAX_WIDTH }], children: children })] }) }));
}
export function TextBubble({ children }) {
    const c = Children.toArray(children);
    return (_jsx(Content, { label: c.join(' '), children: _jsx(View, { style: [a.gap_xs], children: c.map((child, i) => (_jsx(Text, { style: [a.text_sm, a.leading_snug], children: child }, i))) }) }));
}
//# sourceMappingURL=index.web.js.map