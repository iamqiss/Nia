import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, forwardRef, useContext, useMemo } from 'react';
import { View } from 'react-native';
import { Select as RadixSelect } from 'radix-ui';
import { flatten, useTheme } from '#/alf';
import { atoms as a } from '#/alf';
import { useInteractionState } from '#/components/hooks/useInteractionState';
import { Check_Stroke2_Corner0_Rounded as CheckIcon } from '#/components/icons/Check';
import { ChevronBottom_Stroke2_Corner0_Rounded as ChevronDownIcon, ChevronTop_Stroke2_Corner0_Rounded as ChevronUpIcon, } from '#/components/icons/Chevron';
import { Text } from '#/components/Typography';
import {} from './types';
const SelectedValueContext = createContext(null);
SelectedValueContext.displayName = 'SelectSelectedValueContext';
export function Root(props) {
    return (_jsx(SelectedValueContext.Provider, { value: props.value, children: _jsx(RadixSelect.Root, { ...props }) }));
}
const RadixTriggerPassThrough = forwardRef((props, ref) => {
    // @ts-expect-error Radix provides no types of this stuff
    return props.children?.({ ...props, ref });
});
RadixTriggerPassThrough.displayName = 'RadixTriggerPassThrough';
export function Trigger({ children, label }) {
    const t = useTheme();
    const { state: hovered, onIn: onMouseEnter, onOut: onMouseLeave, } = useInteractionState();
    const { state: focused, onIn: onFocus, onOut: onBlur } = useInteractionState();
    if (typeof children === 'function') {
        return (_jsx(RadixSelect.Trigger, { asChild: true, children: _jsx(RadixTriggerPassThrough, { children: props => children({
                    isNative: false,
                    state: {
                        hovered,
                        focused,
                        pressed: false,
                    },
                    props: {
                        ...props,
                        onPress: props.onClick,
                        onFocus: onFocus,
                        onBlur: onBlur,
                        onMouseEnter,
                        onMouseLeave,
                        accessibilityLabel: label,
                    },
                }) }) }));
    }
    else {
        return (_jsx(RadixSelect.Trigger, { onFocus: onFocus, onBlur: onBlur, onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave, style: flatten([
                a.flex,
                a.relative,
                t.atoms.bg_contrast_25,
                a.rounded_sm,
                a.w_full,
                a.align_center,
                a.gap_sm,
                a.justify_between,
                a.py_sm,
                a.px_md,
                a.pointer,
                {
                    maxWidth: 400,
                    outline: 0,
                    borderWidth: 2,
                    borderStyle: 'solid',
                    borderColor: focused
                        ? t.palette.primary_500
                        : hovered
                            ? t.palette.contrast_100
                            : t.palette.contrast_25,
                },
            ]), children: children }));
    }
}
export function ValueText({ children: _, style, ...props }) {
    return (_jsx(Text, { style: style, children: _jsx(RadixSelect.Value, { ...props }) }));
}
export function Icon({ style }) {
    const t = useTheme();
    return (_jsx(RadixSelect.Icon, { children: _jsx(ChevronDownIcon, { style: [t.atoms.text, style], size: "xs" }) }));
}
export function Content({ items, renderItem }) {
    const t = useTheme();
    const selectedValue = useContext(SelectedValueContext);
    const scrollBtnStyles = [
        a.absolute,
        a.flex,
        a.align_center,
        a.justify_center,
        a.rounded_sm,
        a.z_10,
    ];
    const up = [
        ...scrollBtnStyles,
        a.pt_sm,
        a.pb_lg,
        {
            top: 0,
            left: 0,
            right: 0,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            background: `linear-gradient(to bottom, ${t.atoms.bg.backgroundColor} 0%, transparent 100%)`,
        },
    ];
    const down = [
        ...scrollBtnStyles,
        a.pt_lg,
        a.pb_sm,
        {
            bottom: 0,
            left: 0,
            right: 0,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            background: `linear-gradient(to top, ${t.atoms.bg.backgroundColor} 0%, transparent 100%)`,
        },
    ];
    return (_jsx(RadixSelect.Portal, { children: _jsx(RadixSelect.Content, { style: flatten([t.atoms.bg, a.rounded_sm, a.overflow_hidden]), position: "popper", sideOffset: 5, className: "radix-select-content", children: _jsxs(View, { style: [
                    a.flex_1,
                    a.border,
                    t.atoms.border_contrast_low,
                    a.rounded_sm,
                    a.overflow_hidden,
                ], children: [_jsx(RadixSelect.ScrollUpButton, { style: flatten(up), children: _jsx(ChevronUpIcon, { style: [t.atoms.text], size: "xs" }) }), _jsx(RadixSelect.Viewport, { style: flatten([a.p_xs]), children: items.map((item, index) => renderItem(item, index, selectedValue)) }), _jsx(RadixSelect.ScrollDownButton, { style: flatten(down), children: _jsx(ChevronDownIcon, { style: [t.atoms.text], size: "xs" }) })] }) }) }));
}
const ItemContext = createContext({
    hovered: false,
    focused: false,
    pressed: false,
    selected: false,
});
ItemContext.displayName = 'SelectItemContext';
export function useItemContext() {
    return useContext(ItemContext);
}
export function Item({ ref, value, style, children }) {
    const t = useTheme();
    const { state: hovered, onIn: onMouseEnter, onOut: onMouseLeave, } = useInteractionState();
    const selected = useContext(SelectedValueContext) === value;
    const { state: focused, onIn: onFocus, onOut: onBlur } = useInteractionState();
    const ctx = useMemo(() => ({ hovered, focused, pressed: false, selected }), [hovered, focused, selected]);
    return (_jsx(RadixSelect.Item, { ref: ref, value: value, onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave, onFocus: onFocus, onBlur: onBlur, style: flatten([
            t.atoms.text,
            a.relative,
            a.flex,
            { minHeight: 25, paddingLeft: 30, paddingRight: 35 },
            a.user_select_none,
            a.align_center,
            a.rounded_xs,
            a.py_2xs,
            a.text_sm,
            { outline: 0 },
            (hovered || focused) && { backgroundColor: t.palette.primary_50 },
            selected && [a.font_bold],
            a.transition_color,
            style,
        ]), children: _jsx(ItemContext.Provider, { value: ctx, children: children }) }));
}
export const ItemText = RadixSelect.ItemText;
export function ItemIndicator({ icon: Icon = CheckIcon }) {
    return (_jsx(RadixSelect.ItemIndicator, { style: flatten([
            a.absolute,
            { left: 0, width: 30 },
            a.flex,
            a.align_center,
            a.justify_center,
        ]), children: _jsx(Icon, { size: "sm" }) }));
}
//# sourceMappingURL=index.web.js.map