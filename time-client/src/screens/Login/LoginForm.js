import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Keyboard, LayoutAnimation, View, } from 'react-native';
import { ComAtprotoServerCreateSession, } from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useRequestNotificationsPermission } from '#/lib/notifications/notifications';
import { isNetworkError } from '#/lib/strings/errors';
import { cleanError } from '#/lib/strings/errors';
import { createFullHandle } from '#/lib/strings/handles';
import { logger } from '#/logger';
import { useSetHasCheckedForStarterPack } from '#/state/preferences/used-starter-packs';
import { useSessionApi } from '#/state/session';
import { useLoggedOutViewControls } from '#/state/shell/logged-out';
import { atoms as a, useTheme } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import { FormError } from '#/components/forms/FormError';
import { HostingProvider } from '#/components/forms/HostingProvider';
import * as TextField from '#/components/forms/TextField';
import { At_Stroke2_Corner0_Rounded as At } from '#/components/icons/At';
import { Lock_Stroke2_Corner0_Rounded as Lock } from '#/components/icons/Lock';
import { Ticket_Stroke2_Corner0_Rounded as Ticket } from '#/components/icons/Ticket';
import { Loader } from '#/components/Loader';
import { Text } from '#/components/Typography';
import { FormContainer } from './FormContainer';
export const LoginForm = ({ error, serviceUrl, serviceDescription, initialHandle, setError, setServiceUrl, onPressRetryConnect, onPressBack, onPressForgotPassword, onAttemptSuccess, onAttemptFailed, }) => {
    const t = useTheme();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isAuthFactorTokenNeeded, setIsAuthFactorTokenNeeded] = useState(false);
    const [isAuthFactorTokenValueEmpty, setIsAuthFactorTokenValueEmpty] = useState(true);
    const identifierValueRef = useRef(initialHandle || '');
    const passwordValueRef = useRef('');
    const authFactorTokenValueRef = useRef('');
    const passwordRef = useRef(null);
    const { _ } = useLingui();
    const { login } = useSessionApi();
    const requestNotificationsPermission = useRequestNotificationsPermission();
    const { setShowLoggedOut } = useLoggedOutViewControls();
    const setHasCheckedForStarterPack = useSetHasCheckedForStarterPack();
    const onPressSelectService = React.useCallback(() => {
        Keyboard.dismiss();
    }, []);
    const onPressNext = async () => {
        if (isProcessing)
            return;
        Keyboard.dismiss();
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setError('');
        const identifier = identifierValueRef.current.toLowerCase().trim();
        const password = passwordValueRef.current;
        const authFactorToken = authFactorTokenValueRef.current;
        if (!identifier) {
            setError(_(msg `Please enter your username`));
            return;
        }
        if (!password) {
            setError(_(msg `Please enter your password`));
            return;
        }
        setIsProcessing(true);
        try {
            // try to guess the handle if the user just gave their own username
            let fullIdent = identifier;
            if (!identifier.includes('@') && // not an email
                !identifier.includes('.') && // not a domain
                serviceDescription &&
                serviceDescription.availableUserDomains.length > 0) {
                let matched = false;
                for (const domain of serviceDescription.availableUserDomains) {
                    if (fullIdent.endsWith(domain)) {
                        matched = true;
                    }
                }
                if (!matched) {
                    fullIdent = createFullHandle(identifier, serviceDescription.availableUserDomains[0]);
                }
            }
            // TODO remove double login
            await login({
                service: serviceUrl,
                identifier: fullIdent,
                password,
                authFactorToken: authFactorToken.trim(),
            }, 'LoginForm');
            onAttemptSuccess();
            setShowLoggedOut(false);
            setHasCheckedForStarterPack(true);
            requestNotificationsPermission('Login');
        }
        catch (e) {
            const errMsg = e.toString();
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setIsProcessing(false);
            if (e instanceof ComAtprotoServerCreateSession.AuthFactorTokenRequiredError) {
                setIsAuthFactorTokenNeeded(true);
            }
            else {
                onAttemptFailed();
                if (errMsg.includes('Token is invalid')) {
                    logger.debug('Failed to login due to invalid 2fa token', {
                        error: errMsg,
                    });
                    setError(_(msg `Invalid 2FA confirmation code.`));
                }
                else if (errMsg.includes('Authentication Required') ||
                    errMsg.includes('Invalid identifier or password')) {
                    logger.debug('Failed to login due to invalid credentials', {
                        error: errMsg,
                    });
                    setError(_(msg `Incorrect username or password`));
                }
                else if (isNetworkError(e)) {
                    logger.warn('Failed to login due to network error', { error: errMsg });
                    setError(_(msg `Unable to contact your service. Please check your Internet connection.`));
                }
                else {
                    logger.warn('Failed to login', { error: errMsg });
                    setError(cleanError(errMsg));
                }
            }
        }
    };
    return (_jsxs(FormContainer, { testID: "loginForm", titleText: _jsx(Trans, { children: "Sign in" }), children: [_jsxs(View, { children: [_jsx(TextField.LabelText, { children: _jsx(Trans, { children: "Hosting provider" }) }), _jsx(HostingProvider, { serviceUrl: serviceUrl, onSelectServiceUrl: setServiceUrl, onOpenDialog: onPressSelectService })] }), _jsxs(View, { children: [_jsx(TextField.LabelText, { children: _jsx(Trans, { children: "Account" }) }), _jsxs(View, { style: [a.gap_sm], children: [_jsxs(TextField.Root, { children: [_jsx(TextField.Icon, { icon: At }), _jsx(TextField.Input, { testID: "loginUsernameInput", label: _(msg `Username or email address`), autoCapitalize: "none", autoFocus: true, autoCorrect: false, autoComplete: "username", returnKeyType: "next", textContentType: "username", defaultValue: initialHandle || '', onChangeText: v => {
                                            identifierValueRef.current = v;
                                        }, onSubmitEditing: () => {
                                            passwordRef.current?.focus();
                                        }, blurOnSubmit: false, editable: !isProcessing, accessibilityHint: _(msg `Enter the username or email address you used when you created your account`) })] }), _jsxs(TextField.Root, { children: [_jsx(TextField.Icon, { icon: Lock }), _jsx(TextField.Input, { testID: "loginPasswordInput", inputRef: passwordRef, label: _(msg `Password`), autoCapitalize: "none", autoCorrect: false, autoComplete: "password", returnKeyType: "done", enablesReturnKeyAutomatically: true, secureTextEntry: true, textContentType: "password", clearButtonMode: "while-editing", onChangeText: v => {
                                            passwordValueRef.current = v;
                                        }, onSubmitEditing: onPressNext, blurOnSubmit: false, editable: !isProcessing, accessibilityHint: _(msg `Enter your password`) }), _jsx(Button, { testID: "forgotPasswordButton", onPress: onPressForgotPassword, label: _(msg `Forgot password?`), accessibilityHint: _(msg `Opens password reset form`), variant: "solid", color: "secondary", style: [
                                            a.rounded_sm,
                                            // t.atoms.bg_contrast_100,
                                            { marginLeft: 'auto', left: 6, padding: 6 },
                                            a.z_10,
                                        ], children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Forgot?" }) }) })] })] })] }), isAuthFactorTokenNeeded && (_jsxs(View, { children: [_jsx(TextField.LabelText, { children: _jsx(Trans, { children: "2FA Confirmation" }) }), _jsxs(TextField.Root, { children: [_jsx(TextField.Icon, { icon: Ticket }), _jsx(TextField.Input, { testID: "loginAuthFactorTokenInput", label: _(msg `Confirmation code`), autoCapitalize: "none", autoFocus: true, autoCorrect: false, autoComplete: "one-time-code", returnKeyType: "done", textContentType: "username", blurOnSubmit: false, onChangeText: v => {
                                    setIsAuthFactorTokenValueEmpty(v === '');
                                    authFactorTokenValueRef.current = v;
                                }, onSubmitEditing: onPressNext, editable: !isProcessing, accessibilityHint: _(msg `Input the code which has been emailed to you`), style: [
                                    {
                                        textTransform: isAuthFactorTokenValueEmpty
                                            ? 'none'
                                            : 'uppercase',
                                    },
                                ] })] }), _jsx(Text, { style: [a.text_sm, t.atoms.text_contrast_medium, a.mt_sm], children: _jsx(Trans, { children: "Check your email for a sign in code and enter it here." }) })] })), _jsx(FormError, { error: error }), _jsxs(View, { style: [a.flex_row, a.align_center, a.pt_md], children: [_jsx(Button, { label: _(msg `Back`), variant: "solid", color: "secondary", size: "large", onPress: onPressBack, children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Back" }) }) }), _jsx(View, { style: a.flex_1 }), !serviceDescription && error ? (_jsx(Button, { testID: "loginRetryButton", label: _(msg `Retry`), accessibilityHint: _(msg `Retries signing in`), variant: "solid", color: "secondary", size: "large", onPress: onPressRetryConnect, children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Retry" }) }) })) : !serviceDescription ? (_jsxs(_Fragment, { children: [_jsx(ActivityIndicator, {}), _jsx(Text, { style: [t.atoms.text_contrast_high, a.pl_md], children: _jsx(Trans, { children: "Connecting..." }) })] })) : (_jsxs(Button, { testID: "loginNextButton", label: _(msg `Next`), accessibilityHint: _(msg `Navigates to the next screen`), variant: "solid", color: "primary", size: "large", onPress: onPressNext, children: [_jsx(ButtonText, { children: _jsx(Trans, { children: "Next" }) }), isProcessing && _jsx(ButtonIcon, { icon: Loader })] }))] })] }));
};
//# sourceMappingURL=LoginForm.js.map