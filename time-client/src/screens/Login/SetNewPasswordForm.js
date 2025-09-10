import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { logEvent } from '#/lib/statsig/statsig';
import { isNetworkError } from '#/lib/strings/errors';
import { cleanError } from '#/lib/strings/errors';
import { checkAndFormatResetCode } from '#/lib/strings/password';
import { logger } from '#/logger';
import { Agent } from '#/state/session/agent';
import { atoms as a, useTheme } from '#/alf';
import { Button, ButtonText } from '#/components/Button';
import { FormError } from '#/components/forms/FormError';
import * as TextField from '#/components/forms/TextField';
import { Lock_Stroke2_Corner0_Rounded as Lock } from '#/components/icons/Lock';
import { Ticket_Stroke2_Corner0_Rounded as Ticket } from '#/components/icons/Ticket';
import { Text } from '#/components/Typography';
import { FormContainer } from './FormContainer';
export const SetNewPasswordForm = ({ error, serviceUrl, setError, onPressBack, onPasswordSet, }) => {
    const { _ } = useLingui();
    const t = useTheme();
    const [isProcessing, setIsProcessing] = useState(false);
    const [resetCode, setResetCode] = useState('');
    const [password, setPassword] = useState('');
    const onPressNext = async () => {
        // Check that the code is correct. We do this again just incase the user enters the code after their pw and we
        // don't get to call onBlur first
        const formattedCode = checkAndFormatResetCode(resetCode);
        if (!formattedCode) {
            setError(_(msg `You have entered an invalid code. It should look like XXXXX-XXXXX.`));
            logEvent('signin:passwordResetFailure', {});
            return;
        }
        // TODO Better password strength check
        if (!password) {
            setError(_(msg `Please enter a password.`));
            return;
        }
        setError('');
        setIsProcessing(true);
        try {
            const agent = new Agent(null, { service: serviceUrl });
            await agent.com.atproto.server.resetPassword({
                token: formattedCode,
                password,
            });
            onPasswordSet();
            logEvent('signin:passwordResetSuccess', {});
        }
        catch (e) {
            const errMsg = e.toString();
            logger.warn('Failed to set new password', { error: e });
            logEvent('signin:passwordResetFailure', {});
            setIsProcessing(false);
            if (isNetworkError(e)) {
                setError(_(msg `Unable to contact your service. Please check your Internet connection.`));
            }
            else {
                setError(cleanError(errMsg));
            }
        }
    };
    const onBlur = () => {
        const formattedCode = checkAndFormatResetCode(resetCode);
        if (!formattedCode) {
            setError(_(msg `You have entered an invalid code. It should look like XXXXX-XXXXX.`));
            return;
        }
        setResetCode(formattedCode);
    };
    return (_jsxs(FormContainer, { testID: "setNewPasswordForm", titleText: _jsx(Trans, { children: "Set new password" }), children: [_jsx(Text, { style: [a.leading_snug, a.mb_sm], children: _jsx(Trans, { children: "You will receive an email with a \"reset code.\" Enter that code here, then enter your new password." }) }), _jsxs(View, { children: [_jsx(TextField.LabelText, { children: _jsx(Trans, { children: "Reset code" }) }), _jsxs(TextField.Root, { children: [_jsx(TextField.Icon, { icon: Ticket }), _jsx(TextField.Input, { testID: "resetCodeInput", label: _(msg `Looks like XXXXX-XXXXX`), autoCapitalize: "none", autoFocus: true, autoCorrect: false, autoComplete: "off", value: resetCode, onChangeText: setResetCode, onFocus: () => setError(''), onBlur: onBlur, editable: !isProcessing, accessibilityHint: _(msg `Input code sent to your email for password reset`) })] })] }), _jsxs(View, { children: [_jsx(TextField.LabelText, { children: _jsx(Trans, { children: "New password" }) }), _jsxs(TextField.Root, { children: [_jsx(TextField.Icon, { icon: Lock }), _jsx(TextField.Input, { testID: "newPasswordInput", label: _(msg `Enter a password`), autoCapitalize: "none", autoCorrect: false, autoComplete: "password", returnKeyType: "done", secureTextEntry: true, textContentType: "password", clearButtonMode: "while-editing", value: password, onChangeText: setPassword, onSubmitEditing: onPressNext, editable: !isProcessing, accessibilityHint: _(msg `Input new password`) })] })] }), _jsx(FormError, { error: error }), _jsxs(View, { style: [a.flex_row, a.align_center, a.pt_lg], children: [_jsx(Button, { label: _(msg `Back`), variant: "solid", color: "secondary", size: "large", onPress: onPressBack, children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Back" }) }) }), _jsx(View, { style: a.flex_1 }), isProcessing ? (_jsx(ActivityIndicator, {})) : (_jsx(Button, { label: _(msg `Next`), variant: "solid", color: "primary", size: "large", onPress: onPressNext, children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Next" }) }) })), isProcessing ? (_jsx(Text, { style: [t.atoms.text_contrast_high, a.pl_md], children: _jsx(Trans, { children: "Updating..." }) })) : undefined] })] }));
};
//# sourceMappingURL=SetNewPasswordForm.js.map