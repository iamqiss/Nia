import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { atoms as a, useBreakpoints, useTheme, web, } from '#/alf';
import { Button, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { Text } from '#/components/Typography';
import {} from '../../modules/bottom-sheet';
export { useDialogControl as usePromptControl, } from '#/components/Dialog';
const Context = React.createContext({
    titleId: '',
    descriptionId: '',
});
Context.displayName = 'PromptContext';
export function Outer({ children, control, testID, nativeOptions, }) {
    const titleId = React.useId();
    const descriptionId = React.useId();
    const context = React.useMemo(() => ({ titleId, descriptionId }), [titleId, descriptionId]);
    return (_jsxs(Dialog.Outer, { control: control, testID: testID, webOptions: { alignCenter: true }, nativeOptions: { preventExpansion: true, ...nativeOptions }, children: [_jsx(Dialog.Handle, {}), _jsx(Context.Provider, { value: context, children: _jsx(Dialog.ScrollableInner, { accessibilityLabelledBy: titleId, accessibilityDescribedBy: descriptionId, style: web({ maxWidth: 400 }), children: children }) })] }));
}
export function TitleText({ children, style, }) {
    const { titleId } = React.useContext(Context);
    return (_jsx(Text, { nativeID: titleId, style: [
            a.flex_1,
            a.text_2xl,
            a.font_bold,
            a.pb_sm,
            a.leading_snug,
            style,
        ], children: children }));
}
export function DescriptionText({ children, selectable, }) {
    const t = useTheme();
    const { descriptionId } = React.useContext(Context);
    return (_jsx(Text, { nativeID: descriptionId, selectable: selectable, style: [a.text_md, a.leading_snug, t.atoms.text_contrast_high, a.pb_lg], children: children }));
}
export function Actions({ children }) {
    const { gtMobile } = useBreakpoints();
    return (_jsx(View, { style: [
            a.w_full,
            a.gap_md,
            a.justify_end,
            gtMobile
                ? [a.flex_row, a.flex_row_reverse, a.justify_start]
                : [a.flex_col],
        ], children: children }));
}
export function Cancel({ cta, }) {
    const { _ } = useLingui();
    const { gtMobile } = useBreakpoints();
    const { close } = Dialog.useDialogContext();
    const onPress = React.useCallback(() => {
        close();
    }, [close]);
    return (_jsx(Button, { variant: "solid", color: "secondary", size: gtMobile ? 'small' : 'large', label: cta || _(msg `Cancel`), onPress: onPress, children: _jsx(ButtonText, { children: cta || _(msg `Cancel`) }) }));
}
export function Action({ onPress, color = 'primary', cta, testID, }) {
    const { _ } = useLingui();
    const { gtMobile } = useBreakpoints();
    const { close } = Dialog.useDialogContext();
    const handleOnPress = React.useCallback((e) => {
        close(() => onPress?.(e));
    }, [close, onPress]);
    return (_jsx(Button, { variant: "solid", color: color, size: gtMobile ? 'small' : 'large', label: cta || _(msg `Confirm`), onPress: handleOnPress, testID: testID, children: _jsx(ButtonText, { children: cta || _(msg `Confirm`) }) }));
}
export function Basic({ control, title, description, cancelButtonCta, confirmButtonCta, onConfirm, confirmButtonColor, showCancel = true, }) {
    return (_jsxs(Outer, { control: control, testID: "confirmModal", children: [_jsx(TitleText, { children: title }), description && _jsx(DescriptionText, { children: description }), _jsxs(Actions, { children: [_jsx(Action, { cta: confirmButtonCta, onPress: onConfirm, color: confirmButtonColor, testID: "confirmBtn" }), showCancel && _jsx(Cancel, { cta: cancelButtonCta })] })] }));
}
//# sourceMappingURL=Prompt.js.map