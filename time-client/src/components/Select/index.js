import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState, } from 'react';
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useTheme } from '#/alf';
import { atoms as a } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { useInteractionState } from '#/components/hooks/useInteractionState';
import { Check_Stroke2_Corner0_Rounded as CheckIcon } from '#/components/icons/Check';
import { ChevronTopBottom_Stroke2_Corner0_Rounded as ChevronUpDownIcon } from '#/components/icons/Chevron';
import { Text } from '#/components/Typography';
import {} from './types';
const Context = createContext(null);
Context.displayName = 'SelectContext';
const ValueTextContext = createContext([undefined, () => { }]);
ValueTextContext.displayName = 'ValueTextContext';
function useSelectContext() {
    const ctx = useContext(Context);
    if (!ctx) {
        throw new Error('Select components must must be used within a Select.Root');
    }
    return ctx;
}
export function Root({ children, value, onValueChange, disabled }) {
    const control = Dialog.useDialogControl();
    const valueTextCtx = useState();
    const ctx = useMemo(() => ({
        control,
        value,
        onValueChange,
        disabled,
    }), [control, value, onValueChange, disabled]);
    return (_jsx(Context.Provider, { value: ctx, children: _jsx(ValueTextContext.Provider, { value: valueTextCtx, children: children }) }));
}
export function Trigger({ children, label }) {
    const { control } = useSelectContext();
    const { state: focused, onIn: onFocus, onOut: onBlur } = useInteractionState();
    const { state: pressed, onIn: onPressIn, onOut: onPressOut, } = useInteractionState();
    if (typeof children === 'function') {
        return children({
            isNative: true,
            control,
            state: {
                hovered: false,
                focused,
                pressed,
            },
            props: {
                onPress: control.open,
                onFocus,
                onBlur,
                onPressIn,
                onPressOut,
                accessibilityLabel: label,
            },
        });
    }
    else {
        return (_jsx(Button, { label: label, onPress: control.open, style: [a.flex_1, a.justify_between], color: "secondary", size: "small", variant: "solid", children: _jsx(_Fragment, { children: children }) }));
    }
}
export function ValueText({ placeholder, children = value => value.label, style, }) {
    const [value] = useContext(ValueTextContext);
    const t = useTheme();
    let text = value && children(value);
    if (typeof text !== 'string')
        text = placeholder;
    return (_jsx(ButtonText, { style: [t.atoms.text, a.font_normal, style], children: text }));
}
export function Icon({}) {
    return _jsx(ButtonIcon, { icon: ChevronUpDownIcon });
}
export function Content({ items, valueExtractor = defaultItemValueExtractor, ...props }) {
    const { control, ...context } = useSelectContext();
    const [, setValue] = useContext(ValueTextContext);
    useLayoutEffect(() => {
        const item = items.find(item => valueExtractor(item) === context.value);
        if (item) {
            setValue(item);
        }
    }, [items, context.value, valueExtractor, setValue]);
    return (_jsx(Dialog.Outer, { control: control, children: _jsx(ContentInner, { control: control, items: items, valueExtractor: valueExtractor, ...props, ...context }) }));
}
function ContentInner({ items, renderItem, valueExtractor, ...context }) {
    const control = Dialog.useDialogContext();
    const { _ } = useLingui();
    const [headerHeight, setHeaderHeight] = useState(50);
    const render = useCallback(({ item, index }) => {
        return renderItem(item, index, context.value);
    }, [renderItem, context.value]);
    const doneButton = useCallback(() => (_jsx(Button, { label: _(msg `Done`), onPress: () => control.close(), size: "small", color: "primary", variant: "ghost", style: [a.rounded_full], children: _jsx(ButtonText, { style: [a.text_md], children: _jsx(Trans, { children: "Done" }) }) })), [control, _]);
    return (_jsxs(Context.Provider, { value: context, children: [_jsx(Dialog.Header, { renderRight: doneButton, onLayout: evt => setHeaderHeight(evt.nativeEvent.layout.height), style: [a.absolute, a.top_0, a.left_0, a.right_0, a.z_10], children: _jsx(Dialog.HeaderText, { children: _jsx(Trans, { children: "Select an option" }) }) }), _jsx(Dialog.InnerFlatList, { headerOffset: headerHeight, data: items, renderItem: render, keyExtractor: valueExtractor })] }));
}
function defaultItemValueExtractor(item) {
    return item.value;
}
const ItemContext = createContext({
    selected: false,
    hovered: false,
    focused: false,
    pressed: false,
});
ItemContext.displayName = 'SelectItemContext';
export function useItemContext() {
    return useContext(ItemContext);
}
export function Item({ children, value, label, style }) {
    const t = useTheme();
    const control = Dialog.useDialogContext();
    const { value: selected, onValueChange } = useSelectContext();
    return (_jsx(Button, { role: "listitem", label: label, style: [a.flex_1], onPress: () => {
            control.close(() => {
                onValueChange?.(value);
            });
        }, children: ({ hovered, focused, pressed }) => (_jsx(ItemContext.Provider, { value: { selected: value === selected, hovered, focused, pressed }, children: _jsx(View, { style: [
                    a.flex_1,
                    a.pl_md,
                    (focused || pressed) && t.atoms.bg_contrast_25,
                    a.flex_row,
                    a.align_center,
                    a.gap_sm,
                    style,
                ], children: children }) })) }));
}
export function ItemText({ children }) {
    const { selected } = useItemContext();
    const t = useTheme();
    // eslint-disable-next-line bsky-internal/avoid-unwrapped-text
    return (_jsx(View, { style: [a.flex_1, a.py_md, a.border_b, t.atoms.border_contrast_low], children: _jsx(Text, { style: [a.text_md, selected && a.font_bold], children: children }) }));
}
export function ItemIndicator({ icon: Icon = CheckIcon }) {
    const { selected } = useItemContext();
    return _jsx(View, { style: { width: 24 }, children: selected && _jsx(Icon, { size: "md" }) });
}
//# sourceMappingURL=index.js.map