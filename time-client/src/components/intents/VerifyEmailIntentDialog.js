import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { isNative } from '#/platform/detection';
import { useAgent, useSession } from '#/state/session';
import { atoms as a, useBreakpoints, useTheme } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import {} from '#/components/Dialog';
import { Divider } from '#/components/Divider';
import { ArrowRotateCounterClockwise_Stroke2_Corner0_Rounded as Resend } from '#/components/icons/ArrowRotateCounterClockwise';
import { useIntentDialogs } from '#/components/intents/IntentDialogs';
import { Loader } from '#/components/Loader';
import { Text } from '#/components/Typography';
export function VerifyEmailIntentDialog() {
    const { verifyEmailDialogControl: control } = useIntentDialogs();
    return (_jsxs(Dialog.Outer, { control: control, children: [_jsx(Dialog.Handle, {}), _jsx(Inner, { control: control })] }));
}
function Inner({}) {
    const t = useTheme();
    const { gtMobile } = useBreakpoints();
    const { _ } = useLingui();
    const { verifyEmailState: state } = useIntentDialogs();
    const [status, setStatus] = React.useState('loading');
    const [sending, setSending] = React.useState(false);
    const agent = useAgent();
    const { currentAccount } = useSession();
    React.useEffect(() => {
        ;
        (async () => {
            if (!state?.code) {
                return;
            }
            try {
                await agent.com.atproto.server.confirmEmail({
                    email: (currentAccount?.email || '').trim(),
                    token: state.code.trim(),
                });
                setStatus('success');
            }
            catch (e) {
                setStatus('failure');
            }
        })();
    }, [agent.com.atproto.server, currentAccount?.email, state?.code]);
    const onPressResendEmail = async () => {
        setSending(true);
        await agent.com.atproto.server.requestEmailConfirmation();
        setSending(false);
        setStatus('resent');
    };
    return (_jsxs(Dialog.ScrollableInner, { label: _(msg `Verify email dialog`), style: [
            gtMobile ? { width: 'auto', maxWidth: 400, minWidth: 200 } : a.w_full,
        ], children: [_jsxs(View, { style: [a.gap_xl], children: [status === 'loading' ? (_jsx(View, { style: [a.py_2xl, a.align_center, a.justify_center], children: _jsx(Loader, { size: "xl", fill: t.atoms.text_contrast_low.color }) })) : status === 'success' ? (_jsxs(View, { style: [a.gap_sm, isNative && a.pb_xl], children: [_jsx(Text, { style: [a.font_heavy, a.text_2xl], children: _jsx(Trans, { children: "Email Verified" }) }), _jsx(Text, { style: [a.text_md, a.leading_snug], children: _jsx(Trans, { children: "Thanks, you have successfully verified your email address. You can close this dialog." }) })] })) : status === 'failure' ? (_jsxs(View, { style: [a.gap_sm], children: [_jsx(Text, { style: [a.font_heavy, a.text_2xl], children: _jsx(Trans, { children: "Invalid Verification Code" }) }), _jsx(Text, { style: [a.text_md, a.leading_snug], children: _jsx(Trans, { children: "The verification code you have provided is invalid. Please make sure that you have used the correct verification link or request a new one." }) })] })) : (_jsxs(View, { style: [a.gap_sm, isNative && a.pb_xl], children: [_jsx(Text, { style: [a.font_heavy, a.text_2xl], children: _jsx(Trans, { children: "Email Resent" }) }), _jsx(Text, { style: [a.text_md, a.leading_snug], children: _jsxs(Trans, { children: ["We have sent another verification email to", ' ', _jsx(Text, { style: [a.text_md, a.font_bold], children: currentAccount?.email }), "."] }) })] })), status === 'failure' && (_jsxs(_Fragment, { children: [_jsx(Divider, {}), _jsxs(Button, { label: _(msg `Resend Verification Email`), onPress: onPressResendEmail, variant: "solid", color: "secondary_inverted", size: "large", disabled: sending, children: [_jsx(ButtonIcon, { icon: sending ? Loader : Resend, position: "left" }), _jsx(ButtonText, { children: _jsx(Trans, { children: "Resend Email" }) })] })] }))] }), _jsx(Dialog.Close, {})] }));
}
//# sourceMappingURL=VerifyEmailIntentDialog.js.map