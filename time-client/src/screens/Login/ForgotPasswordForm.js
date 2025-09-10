import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { ActivityIndicator, Keyboard, View } from 'react-native';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import * as EmailValidator from 'email-validator';
import { isNetworkError } from '#/lib/strings/errors';
import { cleanError } from '#/lib/strings/errors';
import { logger } from '#/logger';
import { Agent } from '#/state/session/agent';
import { atoms as a, useTheme } from '#/alf';
import { Button, ButtonText } from '#/components/Button';
import { FormError } from '#/components/forms/FormError';
import { HostingProvider } from '#/components/forms/HostingProvider';
import * as TextField from '#/components/forms/TextField';
import { At_Stroke2_Corner0_Rounded as At } from '#/components/icons/At';
import { Text } from '#/components/Typography';
import { FormContainer } from './FormContainer';
export const ForgotPasswordForm = ({ error, serviceUrl, serviceDescription, setError, setServiceUrl, onPressBack, onEmailSent, }) => {
    const t = useTheme();
    const [isProcessing, setIsProcessing] = useState(false);
    const [email, setEmail] = useState('');
    const { _ } = useLingui();
    const onPressSelectService = React.useCallback(() => {
        Keyboard.dismiss();
    }, []);
    const onPressNext = async () => {
        if (!EmailValidator.validate(email)) {
            return setError(_(msg `Your email appears to be invalid.`));
        }
        setError('');
        setIsProcessing(true);
        try {
            const agent = new Agent(null, { service: serviceUrl });
            await agent.com.atproto.server.requestPasswordReset({ email });
            onEmailSent();
        }
        catch (e) {
            const errMsg = e.toString();
            logger.warn('Failed to request password reset', { error: e });
            setIsProcessing(false);
            if (isNetworkError(e)) {
                setError(_(msg `Unable to contact your service. Please check your Internet connection.`));
            }
            else {
                setError(cleanError(errMsg));
            }
        }
    };
    return (_jsxs(FormContainer, { testID: "forgotPasswordForm", titleText: _jsx(Trans, { children: "Reset password" }), children: [_jsxs(View, { children: [_jsx(TextField.LabelText, { children: _jsx(Trans, { children: "Hosting provider" }) }), _jsx(HostingProvider, { serviceUrl: serviceUrl, onSelectServiceUrl: setServiceUrl, onOpenDialog: onPressSelectService })] }), _jsxs(View, { children: [_jsx(TextField.LabelText, { children: _jsx(Trans, { children: "Email address" }) }), _jsxs(TextField.Root, { children: [_jsx(TextField.Icon, { icon: At }), _jsx(TextField.Input, { testID: "forgotPasswordEmail", label: _(msg `Enter your email address`), autoCapitalize: "none", autoFocus: true, autoCorrect: false, autoComplete: "email", value: email, onChangeText: setEmail, editable: !isProcessing, accessibilityHint: _(msg `Sets email for password reset`) })] })] }), _jsx(Text, { style: [t.atoms.text_contrast_high, a.leading_snug], children: _jsx(Trans, { children: "Enter the email you used to create your account. We'll send you a \"reset code\" so you can set a new password." }) }), _jsx(FormError, { error: error }), _jsxs(View, { style: [a.flex_row, a.align_center, a.pt_md], children: [_jsx(Button, { label: _(msg `Back`), variant: "solid", color: "secondary", size: "large", onPress: onPressBack, children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Back" }) }) }), _jsx(View, { style: a.flex_1 }), !serviceDescription || isProcessing ? (_jsx(ActivityIndicator, {})) : (_jsx(Button, { label: _(msg `Next`), variant: "solid", color: 'primary', size: "large", onPress: onPressNext, children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Next" }) }) })), !serviceDescription || isProcessing ? (_jsx(Text, { style: [t.atoms.text_contrast_high, a.pl_md], children: _jsx(Trans, { children: "Processing..." }) })) : undefined] }), _jsx(View, { style: [
                    t.atoms.border_contrast_medium,
                    a.border_t,
                    a.pt_2xl,
                    a.mt_md,
                    a.flex_row,
                    a.justify_center,
                ], children: _jsx(Button, { testID: "skipSendEmailButton", onPress: onEmailSent, label: _(msg `Go to next`), accessibilityHint: _(msg `Navigates to the next screen`), size: "large", variant: "ghost", color: "secondary", children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Already have a code?" }) }) }) })] }));
};
//# sourceMappingURL=ForgotPasswordForm.js.map