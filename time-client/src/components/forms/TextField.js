import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useMemo, useRef } from 'react';
import { StyleSheet, TextInput, View, } from 'react-native';
import { HITSLOP_20 } from '#/lib/constants';
import { mergeRefs } from '#/lib/merge-refs';
import { android, applyFonts, atoms as a, ios, platform, tokens, useAlf, useTheme, web, } from '#/alf';
import { useInteractionState } from '#/components/hooks/useInteractionState';
import {} from '#/components/icons/common';
import { Text } from '#/components/Typography';
const Context = createContext({
    inputRef: null,
    isInvalid: false,
    hovered: false,
    onHoverIn: () => { },
    onHoverOut: () => { },
    focused: false,
    onFocus: () => { },
    onBlur: () => { },
});
Context.displayName = 'TextFieldContext';
export function Root({ children, isInvalid = false, style }) {
    const inputRef = useRef(null);
    const { state: hovered, onIn: onHoverIn, onOut: onHoverOut, } = useInteractionState();
    const { state: focused, onIn: onFocus, onOut: onBlur } = useInteractionState();
    const context = useMemo(() => ({
        inputRef,
        hovered,
        onHoverIn,
        onHoverOut,
        focused,
        onFocus,
        onBlur,
        isInvalid,
    }), [
        inputRef,
        hovered,
        onHoverIn,
        onHoverOut,
        focused,
        onFocus,
        onBlur,
        isInvalid,
    ]);
    return (_jsx(Context.Provider, { value: context, children: _jsx(View, { style: [
                a.flex_row,
                a.align_center,
                a.relative,
                a.w_full,
                a.px_md,
                style,
            ], ...web({
                onClick: () => inputRef.current?.focus(),
                onMouseOver: onHoverIn,
                onMouseOut: onHoverOut,
            }), children: children }) }));
}
export function useSharedInputStyles() {
    const t = useTheme();
    return useMemo(() => {
        const hover = [
            {
                borderColor: t.palette.contrast_100,
            },
        ];
        const focus = [
            {
                backgroundColor: t.palette.contrast_50,
                borderColor: t.palette.primary_500,
            },
        ];
        const error = [
            {
                backgroundColor: t.palette.negative_25,
                borderColor: t.palette.negative_300,
            },
        ];
        const errorHover = [
            {
                backgroundColor: t.palette.negative_25,
                borderColor: t.palette.negative_500,
            },
        ];
        return {
            chromeHover: StyleSheet.flatten(hover),
            chromeFocus: StyleSheet.flatten(focus),
            chromeError: StyleSheet.flatten(error),
            chromeErrorHover: StyleSheet.flatten(errorHover),
        };
    }, [t]);
}
export function createInput(Component) {
    return function Input({ label, placeholder, value, onChangeText, onFocus, onBlur, isInvalid, inputRef, style, ...rest }) {
        const t = useTheme();
        const { fonts } = useAlf();
        const ctx = useContext(Context);
        const withinRoot = Boolean(ctx.inputRef);
        const { chromeHover, chromeFocus, chromeError, chromeErrorHover } = useSharedInputStyles();
        if (!withinRoot) {
            return (_jsx(Root, { isInvalid: isInvalid, children: _jsx(Input, { label: label, placeholder: placeholder, value: value, onChangeText: onChangeText, isInvalid: isInvalid, ...rest }) }));
        }
        const refs = mergeRefs([ctx.inputRef, inputRef].filter(Boolean));
        const flattened = StyleSheet.flatten([
            a.relative,
            a.z_20,
            a.flex_1,
            a.text_md,
            t.atoms.text,
            a.px_xs,
            {
                // paddingVertical doesn't work w/multiline - esb
                lineHeight: a.text_md.fontSize * 1.1875,
                textAlignVertical: rest.multiline ? 'top' : undefined,
                minHeight: rest.multiline ? 80 : undefined,
                minWidth: 0,
            },
            ios({ paddingTop: 12, paddingBottom: 13 }),
            // Needs to be sm on Paper, md on Fabric for some godforsaken reason -sfn
            android(a.py_sm),
            // fix for autofill styles covering border
            web({
                paddingTop: 10,
                paddingBottom: 11,
                marginTop: 2,
                marginBottom: 2,
            }),
            style,
        ]);
        applyFonts(flattened, fonts.family);
        // should always be defined on `typography`
        // @ts-ignore
        if (flattened.fontSize) {
            // @ts-ignore
            flattened.fontSize = Math.round(
            // @ts-ignore
            flattened.fontSize * fonts.scaleMultiplier);
        }
        return (_jsxs(_Fragment, { children: [_jsx(Component, { accessibilityHint: undefined, hitSlop: HITSLOP_20, ...rest, accessibilityLabel: label, ref: refs, value: value, onChangeText: onChangeText, onFocus: e => {
                        ctx.onFocus();
                        onFocus?.(e);
                    }, onBlur: e => {
                        ctx.onBlur();
                        onBlur?.(e);
                    }, placeholder: placeholder || label, placeholderTextColor: t.palette.contrast_500, keyboardAppearance: t.name === 'light' ? 'light' : 'dark', style: flattened }), _jsx(View, { style: [
                        a.z_10,
                        a.absolute,
                        a.inset_0,
                        a.rounded_sm,
                        t.atoms.bg_contrast_25,
                        { borderColor: 'transparent', borderWidth: 2 },
                        ctx.hovered ? chromeHover : {},
                        ctx.focused ? chromeFocus : {},
                        ctx.isInvalid || isInvalid ? chromeError : {},
                        (ctx.isInvalid || isInvalid) && (ctx.hovered || ctx.focused)
                            ? chromeErrorHover
                            : {},
                    ] })] }));
    };
}
export const Input = createInput(TextInput);
export function LabelText({ nativeID, children, }) {
    const t = useTheme();
    return (_jsx(Text, { nativeID: nativeID, style: [a.text_sm, a.font_bold, t.atoms.text_contrast_medium, a.mb_sm], children: children }));
}
export function Icon({ icon: Comp }) {
    const t = useTheme();
    const ctx = useContext(Context);
    const { hover, focus, errorHover, errorFocus } = useMemo(() => {
        const hover = [
            {
                color: t.palette.contrast_800,
            },
        ];
        const focus = [
            {
                color: t.palette.primary_500,
            },
        ];
        const errorHover = [
            {
                color: t.palette.negative_500,
            },
        ];
        const errorFocus = [
            {
                color: t.palette.negative_500,
            },
        ];
        return {
            hover,
            focus,
            errorHover,
            errorFocus,
        };
    }, [t]);
    return (_jsx(View, { style: [a.z_20, a.pr_xs], children: _jsx(Comp, { size: "md", style: [
                { color: t.palette.contrast_500, pointerEvents: 'none', flexShrink: 0 },
                ctx.hovered ? hover : {},
                ctx.focused ? focus : {},
                ctx.isInvalid && ctx.hovered ? errorHover : {},
                ctx.isInvalid && ctx.focused ? errorFocus : {},
            ] }) }));
}
export function SuffixText({ children, label, accessibilityHint, style, }) {
    const t = useTheme();
    const ctx = useContext(Context);
    return (_jsx(Text, { accessibilityLabel: label, accessibilityHint: accessibilityHint, numberOfLines: 1, style: [
            a.z_20,
            a.pr_sm,
            a.text_md,
            t.atoms.text_contrast_medium,
            a.pointer_events_none,
            web([{ marginTop: -2 }, a.leading_snug]),
            (ctx.hovered || ctx.focused) && { color: t.palette.contrast_800 },
            style,
        ], children: children }));
}
export function GhostText({ children, value, }) {
    const t = useTheme();
    // eslint-disable-next-line bsky-internal/avoid-unwrapped-text
    return (_jsx(View, { style: [
            a.pointer_events_none,
            a.absolute,
            a.z_10,
            {
                paddingLeft: platform({
                    native: 
                    // input padding
                    tokens.space.md +
                        // icon
                        tokens.space.xl +
                        // icon padding
                        tokens.space.xs +
                        // text input padding
                        tokens.space.xs,
                    web: 
                    // icon
                    tokens.space.xl +
                        // icon padding
                        tokens.space.xs +
                        // text input padding
                        tokens.space.xs,
                }),
            },
            web(a.pr_md),
            a.overflow_hidden,
            a.max_w_full,
        ], "aria-hidden": true, accessibilityElementsHidden: true, importantForAccessibility: "no-hide-descendants", children: _jsxs(Text, { style: [
                { color: 'transparent' },
                a.text_md,
                { lineHeight: a.text_md.fontSize * 1.1875 },
                a.w_full,
            ], numberOfLines: 1, children: [children, _jsx(Text, { style: [
                        t.atoms.text_contrast_low,
                        a.text_md,
                        { lineHeight: a.text_md.fontSize * 1.1875 },
                    ], children: value })] }) }));
}
//# sourceMappingURL=TextField.js.map