import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { isNative } from '#/platform/detection';
import { useLoggedOutViewControls } from '#/state/shell/logged-out';
import { useCloseAllActiveElements } from '#/state/util';
import { Logo } from '#/view/icons/Logo';
import { Logotype } from '#/view/icons/Logotype';
import { atoms as a, useBreakpoints, useTheme } from '#/alf';
import { Button, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { useGlobalDialogsControlContext } from '#/components/dialogs/Context';
import { Text } from '#/components/Typography';
export function SigninDialog() {
    const { signinDialogControl: control } = useGlobalDialogsControlContext();
    return (_jsxs(Dialog.Outer, { control: control, children: [_jsx(Dialog.Handle, {}), _jsx(SigninDialogInner, { control: control })] }));
}
function SigninDialogInner({}) {
    const t = useTheme();
    const { _ } = useLingui();
    const { gtMobile } = useBreakpoints();
    const { requestSwitchToAccount } = useLoggedOutViewControls();
    const closeAllActiveElements = useCloseAllActiveElements();
    const showSignIn = React.useCallback(() => {
        closeAllActiveElements();
        requestSwitchToAccount({ requestedAccount: 'none' });
    }, [requestSwitchToAccount, closeAllActiveElements]);
    const showCreateAccount = React.useCallback(() => {
        closeAllActiveElements();
        requestSwitchToAccount({ requestedAccount: 'new' });
    }, [requestSwitchToAccount, closeAllActiveElements]);
    return (_jsxs(Dialog.ScrollableInner, { label: _(msg `Sign in to Bluesky or create a new account`), style: [gtMobile ? { width: 'auto', maxWidth: 420 } : a.w_full], children: [_jsxs(View, { style: [!isNative && a.p_2xl], children: [_jsxs(View, { style: [
                            a.flex_row,
                            a.align_center,
                            a.justify_center,
                            a.gap_sm,
                            a.pb_lg,
                        ], children: [_jsx(Logo, { width: 36 }), _jsx(View, { style: { paddingTop: 6 }, children: _jsx(Logotype, { width: 120, fill: t.atoms.text.color }) })] }), _jsx(Text, { style: [
                            a.text_lg,
                            a.text_center,
                            t.atoms.text,
                            a.pb_2xl,
                            a.leading_snug,
                            a.mx_auto,
                            {
                                maxWidth: 300,
                            },
                        ], children: _jsx(Trans, { children: "Sign in or create your account to join the conversation!" }) }), _jsxs(View, { style: [a.flex_col, a.gap_md], children: [_jsx(Button, { variant: "solid", color: "primary", size: "large", onPress: showCreateAccount, label: _(msg `Create an account`), children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Create an account" }) }) }), _jsx(Button, { variant: "solid", color: "secondary", size: "large", onPress: showSignIn, label: _(msg `Sign in`), children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Sign in" }) }) })] }), isNative && _jsx(View, { style: { height: 10 } })] }), _jsx(Dialog.Close, {})] }));
}
//# sourceMappingURL=Signin.js.map