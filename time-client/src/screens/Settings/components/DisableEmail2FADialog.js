import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { cleanError } from '#/lib/strings/errors';
import { isNative } from '#/platform/detection';
import { useAgent, useSession } from '#/state/session';
import { ErrorMessage } from '#/view/com/util/error/ErrorMessage';
import * as Toast from '#/view/com/util/Toast';
import { atoms as a, useBreakpoints, useTheme } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import * as TextField from '#/components/forms/TextField';
import { Lock_Stroke2_Corner0_Rounded as Lock } from '#/components/icons/Lock';
import { Loader } from '#/components/Loader';
import { P, Text } from '#/components/Typography';
var Stages;
(function (Stages) {
    Stages[Stages["Email"] = 0] = "Email";
    Stages[Stages["ConfirmCode"] = 1] = "ConfirmCode";
})(Stages || (Stages = {}));
export function DisableEmail2FADialog({ control, }) {
    const { _ } = useLingui();
    const t = useTheme();
    const { gtMobile } = useBreakpoints();
    const { currentAccount } = useSession();
    const agent = useAgent();
    const [stage, setStage] = useState(Stages.Email);
    const [confirmationCode, setConfirmationCode] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const onSendEmail = async () => {
        setError('');
        setIsProcessing(true);
        try {
            await agent.com.atproto.server.requestEmailUpdate();
            setStage(Stages.ConfirmCode);
        }
        catch (e) {
            setError(cleanError(String(e)));
        }
        finally {
            setIsProcessing(false);
        }
    };
    const onConfirmDisable = async () => {
        setError('');
        setIsProcessing(true);
        try {
            if (currentAccount?.email) {
                await agent.com.atproto.server.updateEmail({
                    email: currentAccount.email,
                    token: confirmationCode.trim(),
                    emailAuthFactor: false,
                });
                await agent.resumeSession(agent.session);
                Toast.show(_(msg({ message: 'Email 2FA disabled', context: 'toast' })));
            }
            control.close();
        }
        catch (e) {
            const errMsg = String(e);
            if (errMsg.includes('Token is invalid')) {
                setError(_(msg `Invalid 2FA confirmation code.`));
            }
            else {
                setError(cleanError(errMsg));
            }
        }
        finally {
            setIsProcessing(false);
        }
    };
    return (_jsxs(Dialog.Outer, { control: control, children: [_jsx(Dialog.Handle, {}), _jsx(Dialog.ScrollableInner, { accessibilityDescribedBy: "dialog-description", accessibilityLabelledBy: "dialog-title", children: _jsxs(View, { style: [a.relative, a.gap_md, a.w_full], children: [_jsx(Text, { nativeID: "dialog-title", style: [a.text_2xl, a.font_bold, t.atoms.text], children: _jsx(Trans, { children: "Disable Email 2FA" }) }), _jsx(P, { nativeID: "dialog-description", children: stage === Stages.ConfirmCode ? (_jsxs(Trans, { children: ["An email has been sent to", ' ', currentAccount?.email || '(no email)', ". It includes a confirmation code which you can enter below."] })) : (_jsx(Trans, { children: "To disable the email 2FA method, please verify your access to the email address." })) }), error ? _jsx(ErrorMessage, { message: error }) : undefined, stage === Stages.Email ? (_jsxs(View, { style: [
                                a.gap_sm,
                                gtMobile && [a.flex_row, a.justify_end, a.gap_md],
                            ], children: [_jsxs(Button, { testID: "sendEmailButton", variant: "solid", color: "primary", size: gtMobile ? 'small' : 'large', onPress: onSendEmail, label: _(msg `Send verification email`), disabled: isProcessing, children: [_jsx(ButtonText, { children: _jsx(Trans, { children: "Send verification email" }) }), isProcessing && _jsx(ButtonIcon, { icon: Loader })] }), _jsx(Button, { testID: "haveCodeButton", variant: "ghost", color: "primary", size: gtMobile ? 'small' : 'large', onPress: () => setStage(Stages.ConfirmCode), label: _(msg `I have a code`), disabled: isProcessing, children: _jsx(ButtonText, { children: _jsx(Trans, { children: "I have a code" }) }) })] })) : stage === Stages.ConfirmCode ? (_jsxs(View, { children: [_jsxs(View, { style: [a.mb_md], children: [_jsx(TextField.LabelText, { children: _jsx(Trans, { children: "Confirmation code" }) }), _jsxs(TextField.Root, { children: [_jsx(TextField.Icon, { icon: Lock }), _jsx(Dialog.Input, { testID: "confirmationCode", label: _(msg `Confirmation code`), autoCapitalize: "none", autoFocus: true, autoCorrect: false, autoComplete: "off", value: confirmationCode, onChangeText: setConfirmationCode, onSubmitEditing: onConfirmDisable, editable: !isProcessing })] })] }), _jsxs(View, { style: [
                                        a.gap_sm,
                                        gtMobile && [a.flex_row, a.justify_end, a.gap_md],
                                    ], children: [_jsx(Button, { testID: "resendCodeBtn", variant: "ghost", color: "primary", size: gtMobile ? 'small' : 'large', onPress: onSendEmail, label: _(msg `Resend email`), disabled: isProcessing, children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Resend email" }) }) }), _jsxs(Button, { testID: "confirmBtn", variant: "solid", color: "primary", size: gtMobile ? 'small' : 'large', onPress: onConfirmDisable, label: _(msg `Confirm`), disabled: isProcessing, children: [_jsx(ButtonText, { children: _jsx(Trans, { children: "Confirm" }) }), isProcessing && _jsx(ButtonIcon, { icon: Loader })] })] })] })) : undefined, !gtMobile && isNative && _jsx(View, { style: { height: 40 } })] }) })] }));
}
//# sourceMappingURL=DisableEmail2FADialog.js.map