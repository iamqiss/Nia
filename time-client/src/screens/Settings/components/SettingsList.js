import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useMemo } from 'react';
import { View, } from 'react-native';
import { HITSLOP_10 } from '#/lib/constants';
import { atoms as a, useTheme } from '#/alf';
import * as Button from '#/components/Button';
import { ChevronRight_Stroke2_Corner0_Rounded as ChevronRightIcon } from '#/components/icons/Chevron';
import { Link } from '#/components/Link';
import { createPortalGroup } from '#/components/Portal';
import { Text } from '#/components/Typography';
const ItemContext = createContext({
    destructive: false,
    withinGroup: false,
});
ItemContext.displayName = 'SettingsListItemContext';
const Portal = createPortalGroup();
export function Container({ children }) {
    return _jsx(View, { style: [a.flex_1, a.py_md], children: children });
}
/**
 * This uses `Portal` magic ✨ to render the icons and title correctly. ItemIcon and ItemText components
 * get teleported to the top row, leaving the rest of the children in the bottom row.
 */
export function Group({ children, destructive = false, iconInset = true, style, contentContainerStyle, }) {
    const context = useMemo(() => ({ destructive, withinGroup: true }), [destructive]);
    return (_jsx(View, { style: [a.w_full, style], children: _jsx(Portal.Provider, { children: _jsxs(ItemContext.Provider, { value: context, children: [_jsx(Item, { style: [a.pb_2xs, { minHeight: 42 }], children: _jsx(Portal.Outlet, {}) }), _jsx(Item, { style: [
                            a.flex_col,
                            a.pt_2xs,
                            a.align_start,
                            a.gap_0,
                            contentContainerStyle,
                        ], iconInset: iconInset, children: children })] }) }) }));
}
export function Item({ children, destructive, iconInset = false, style, }) {
    const context = useContext(ItemContext);
    const childContext = useMemo(() => {
        if (typeof destructive !== 'boolean')
            return context;
        return { ...context, destructive };
    }, [context, destructive]);
    return (_jsx(View, { style: [
            a.px_xl,
            a.py_sm,
            a.align_center,
            a.gap_sm,
            a.w_full,
            a.flex_row,
            { minHeight: 48 },
            iconInset && {
                paddingLeft: 
                // existing padding
                a.pl_xl.paddingLeft +
                    // icon
                    24 +
                    // gap
                    a.gap_sm.gap,
            },
            style,
        ], children: _jsx(ItemContext.Provider, { value: childContext, children: children }) }));
}
export function LinkItem({ children, destructive = false, contentContainerStyle, chevronColor, ...props }) {
    const t = useTheme();
    return (_jsx(Link, { ...props, children: args => (_jsxs(Item, { destructive: destructive, style: [
                (args.hovered || args.pressed) && [t.atoms.bg_contrast_25],
                contentContainerStyle,
            ], children: [typeof children === 'function' ? children(args) : children, _jsx(Chevron, { color: chevronColor })] })) }));
}
export function PressableItem({ children, destructive = false, contentContainerStyle, hoverStyle, ...props }) {
    const t = useTheme();
    return (_jsx(Button.Button, { ...props, children: args => (_jsx(Item, { destructive: destructive, style: [
                (args.hovered || args.pressed) && [
                    t.atoms.bg_contrast_25,
                    hoverStyle,
                ],
                contentContainerStyle,
            ], children: typeof children === 'function' ? children(args) : children })) }));
}
export function ItemIcon({ icon: Comp, size = 'lg', color: colorProp, }) {
    const t = useTheme();
    const { destructive, withinGroup } = useContext(ItemContext);
    /*
     * Copied here from icons/common.tsx so we can tweak if we need to, but
     * also so that we can calculate transforms.
     */
    const iconSize = {
        xs: 12,
        sm: 16,
        md: 20,
        lg: 24,
        xl: 28,
        '2xl': 32,
    }[size];
    const color = colorProp ?? (destructive ? t.palette.negative_500 : t.atoms.text.color);
    const content = (_jsx(View, { style: [a.z_20, { width: iconSize, height: iconSize }], children: _jsx(Comp, { width: iconSize, style: [{ color }] }) }));
    if (withinGroup) {
        return _jsx(Portal.Portal, { children: content });
    }
    else {
        return content;
    }
}
export function ItemText({ style, ...props }) {
    const t = useTheme();
    const { destructive, withinGroup } = useContext(ItemContext);
    const content = (_jsx(Button.ButtonText, { style: [
            a.text_md,
            a.font_normal,
            a.text_left,
            a.flex_1,
            destructive ? { color: t.palette.negative_500 } : t.atoms.text,
            style,
        ], ...props }));
    if (withinGroup) {
        return _jsx(Portal.Portal, { children: content });
    }
    else {
        return content;
    }
}
export function Divider({ style }) {
    const t = useTheme();
    return (_jsx(View, { style: [
            a.border_t,
            t.atoms.border_contrast_medium,
            a.w_full,
            a.my_sm,
            style,
        ] }));
}
export function Chevron({ color: colorProp }) {
    const { destructive } = useContext(ItemContext);
    const t = useTheme();
    const color = colorProp ?? (destructive ? t.palette.negative_500 : t.palette.contrast_500);
    return _jsx(ItemIcon, { icon: ChevronRightIcon, size: "md", color: color });
}
export function BadgeText({ children, style, }) {
    const t = useTheme();
    return (_jsx(Text, { style: [
            t.atoms.text_contrast_low,
            a.text_md,
            a.text_right,
            a.leading_snug,
            style,
        ], numberOfLines: 1, children: children }));
}
export function BadgeButton({ label, onPress, }) {
    const t = useTheme();
    return (_jsx(Button.Button, { label: label, onPress: onPress, hitSlop: HITSLOP_10, children: ({ pressed }) => (_jsx(Button.ButtonText, { style: [
                a.text_md,
                a.font_normal,
                a.text_right,
                { color: pressed ? t.palette.contrast_300 : t.palette.primary_500 },
            ], children: label })) }));
}
//# sourceMappingURL=SettingsList.js.map