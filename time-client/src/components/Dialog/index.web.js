import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useImperativeHandle } from 'react';
import { FlatList, TouchableWithoutFeedback, View, } from 'react-native';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { DismissableLayer, FocusGuards, FocusScope } from 'radix-ui/internal';
import { RemoveScrollBar } from 'react-remove-scroll-bar';
import { logger } from '#/logger';
import { useA11y } from '#/state/a11y';
import { useDialogStateControlContext } from '#/state/dialogs';
import { atoms as a, flatten, useBreakpoints, useTheme, web } from '#/alf';
import { Button, ButtonIcon } from '#/components/Button';
import { Context } from '#/components/Dialog/context';
import {} from '#/components/Dialog/types';
import { TimesLarge_Stroke2_Corner0_Rounded as X } from '#/components/icons/Times';
import { Portal } from '#/components/Portal';
export { useDialogContext, useDialogControl } from '#/components/Dialog/context';
export * from '#/components/Dialog/shared';
export * from '#/components/Dialog/types';
export * from '#/components/Dialog/utils';
export { Input } from '#/components/forms/TextField';
// 100 minus 10vh of paddingVertical
export const WEB_DIALOG_HEIGHT = '80vh';
const stopPropagation = (e) => e.stopPropagation();
const preventDefault = (e) => e.preventDefault();
export function Outer({ children, control, onClose, webOptions, }) {
    const { _ } = useLingui();
    const { gtMobile } = useBreakpoints();
    const [isOpen, setIsOpen] = React.useState(false);
    const { setDialogIsOpen } = useDialogStateControlContext();
    const open = React.useCallback(() => {
        setDialogIsOpen(control.id, true);
        setIsOpen(true);
    }, [setIsOpen, setDialogIsOpen, control.id]);
    const close = React.useCallback(cb => {
        setDialogIsOpen(control.id, false);
        setIsOpen(false);
        try {
            if (cb && typeof cb === 'function') {
                // This timeout ensures that the callback runs at the same time as it would on native. I.e.
                // console.log('Step 1') -> close(() => console.log('Step 3')) -> console.log('Step 2')
                // This should always output 'Step 1', 'Step 2', 'Step 3', but without the timeout it would output
                // 'Step 1', 'Step 3', 'Step 2'.
                setTimeout(cb);
            }
        }
        catch (e) {
            logger.error(`Dialog closeCallback failed`, {
                message: e.message,
            });
        }
        onClose?.();
    }, [control.id, onClose, setDialogIsOpen]);
    const handleBackgroundPress = React.useCallback(async (e) => {
        webOptions?.onBackgroundPress ? webOptions.onBackgroundPress(e) : close();
    }, [webOptions, close]);
    useImperativeHandle(control.ref, () => ({
        open,
        close,
    }), [close, open]);
    const context = React.useMemo(() => ({
        close,
        isNativeDialog: false,
        nativeSnapPoint: 0,
        disableDrag: false,
        setDisableDrag: () => { },
        isWithinDialog: true,
    }), [close]);
    return (_jsx(_Fragment, { children: isOpen && (_jsx(Portal, { children: _jsxs(Context.Provider, { value: context, children: [_jsx(RemoveScrollBar, {}), _jsx(TouchableWithoutFeedback, { accessibilityHint: undefined, accessibilityLabel: _(msg `Close active dialog`), onPress: handleBackgroundPress, children: _jsxs(View, { style: [
                                web(a.fixed),
                                a.inset_0,
                                a.z_10,
                                a.px_xl,
                                webOptions?.alignCenter ? a.justify_center : undefined,
                                a.align_center,
                                {
                                    overflowY: 'auto',
                                    paddingVertical: gtMobile ? '10vh' : a.pt_xl.paddingTop,
                                },
                            ], children: [_jsx(Backdrop, {}), _jsx(View, { style: [
                                        a.w_full,
                                        a.z_20,
                                        a.align_center,
                                        web({ minHeight: '60vh', position: 'static' }),
                                    ], children: children })] }) })] }) })) }));
}
export function Inner({ children, style, label, accessibilityLabelledBy, accessibilityDescribedBy, header, contentContainerStyle, }) {
    const t = useTheme();
    const { close } = React.useContext(Context);
    const { gtMobile } = useBreakpoints();
    const { reduceMotionEnabled } = useA11y();
    FocusGuards.useFocusGuards();
    return (_jsx(FocusScope.FocusScope, { loop: true, asChild: true, trapped: true, children: _jsx(View, { role: "dialog", "aria-role": "dialog", "aria-label": label, "aria-labelledby": accessibilityLabelledBy, "aria-describedby": accessibilityDescribedBy, 
            // @ts-expect-error web only -prf
            onClick: stopPropagation, onStartShouldSetResponder: _ => true, onTouchEnd: stopPropagation, style: flatten([
                a.relative,
                a.rounded_md,
                a.w_full,
                a.border,
                t.atoms.bg,
                {
                    maxWidth: 600,
                    borderColor: t.palette.contrast_200,
                    shadowColor: t.palette.black,
                    shadowOpacity: t.name === 'light' ? 0.1 : 0.4,
                    shadowRadius: 30,
                },
                !reduceMotionEnabled && a.zoom_fade_in,
                style,
            ]), children: _jsxs(DismissableLayer.DismissableLayer, { onInteractOutside: preventDefault, onFocusOutside: preventDefault, onDismiss: close, style: { height: '100%', display: 'flex', flexDirection: 'column' }, children: [header, _jsx(View, { style: [gtMobile ? a.p_2xl : a.p_xl, contentContainerStyle], children: children })] }) }) }));
}
export const ScrollableInner = Inner;
export const InnerFlatList = React.forwardRef(function InnerFlatList({ label, style, webInnerStyle, webInnerContentContainerStyle, footer, ...props }, ref) {
    const { gtMobile } = useBreakpoints();
    return (_jsxs(Inner, { label: label, style: [
            a.overflow_hidden,
            a.px_0,
            web({ maxHeight: WEB_DIALOG_HEIGHT }),
            webInnerStyle,
        ], contentContainerStyle: [a.h_full, a.px_0, webInnerContentContainerStyle], children: [_jsx(FlatList, { ref: ref, style: [a.h_full, gtMobile ? a.px_2xl : a.px_xl, flatten(style)], ...props }), footer] }));
});
export function FlatListFooter({ children }) {
    const t = useTheme();
    return (_jsx(View, { style: [
            a.absolute,
            a.bottom_0,
            a.w_full,
            a.z_10,
            t.atoms.bg,
            a.border_t,
            t.atoms.border_contrast_low,
            a.px_lg,
            a.py_md,
        ], children: children }));
}
export function Close() {
    const { _ } = useLingui();
    const { close } = React.useContext(Context);
    return (_jsx(View, { style: [
            a.absolute,
            a.z_10,
            {
                top: a.pt_md.paddingTop,
                right: a.pr_md.paddingRight,
            },
        ], children: _jsx(Button, { size: "small", variant: "ghost", color: "secondary", shape: "round", onPress: () => close(), label: _(msg `Close active dialog`), children: _jsx(ButtonIcon, { icon: X, size: "md" }) }) }));
}
export function Handle() {
    return null;
}
function Backdrop() {
    const t = useTheme();
    const { reduceMotionEnabled } = useA11y();
    return (_jsx(View, { style: { opacity: 0.8 }, children: _jsx(View, { style: [
                a.fixed,
                a.inset_0,
                { backgroundColor: t.palette.black },
                !reduceMotionEnabled && a.fade_in,
            ] }) }));
}
//# sourceMappingURL=index.web.js.map