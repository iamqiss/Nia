import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useRef } from 'react';
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import * as EmailValidator from 'email-validator';
import { isEmailMaybeInvalid } from '#/lib/strings/email';
import { logger } from '#/logger';
import { ScreenTransition } from '#/screens/Login/ScreenTransition';
import { is13, is18, useSignupContext } from '#/screens/Signup/state';
import { Policies } from '#/screens/Signup/StepInfo/Policies';
import { atoms as a, native } from '#/alf';
import * as DateField from '#/components/forms/DateField';
import {} from '#/components/forms/DateField/types';
import { FormError } from '#/components/forms/FormError';
import { HostingProvider } from '#/components/forms/HostingProvider';
import * as TextField from '#/components/forms/TextField';
import { Envelope_Stroke2_Corner0_Rounded as Envelope } from '#/components/icons/Envelope';
import { Lock_Stroke2_Corner0_Rounded as Lock } from '#/components/icons/Lock';
import { Ticket_Stroke2_Corner0_Rounded as Ticket } from '#/components/icons/Ticket';
import { Loader } from '#/components/Loader';
import { usePreemptivelyCompleteActivePolicyUpdate } from '#/components/PolicyUpdateOverlay/usePreemptivelyCompleteActivePolicyUpdate';
import { BackNextButtons } from '../BackNextButtons';
function sanitizeDate(date) {
    if (!date || date.toString() === 'Invalid Date') {
        logger.error(`Create account: handled invalid date for birthDate`, {
            hasDate: !!date,
        });
        return new Date();
    }
    return date;
}
export function StepInfo({ onPressBack, isServerError, refetchServer, isLoadingStarterPack, }) {
    const { _ } = useLingui();
    const { state, dispatch } = useSignupContext();
    const preemptivelyCompleteActivePolicyUpdate = usePreemptivelyCompleteActivePolicyUpdate();
    const inviteCodeValueRef = useRef(state.inviteCode);
    const emailValueRef = useRef(state.email);
    const prevEmailValueRef = useRef(state.email);
    const passwordValueRef = useRef(state.password);
    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const birthdateInputRef = useRef(null);
    const [hasWarnedEmail, setHasWarnedEmail] = React.useState(false);
    const tldtsRef = React.useRef(undefined);
    React.useEffect(() => {
        // @ts-expect-error - valid path
        import('tldts/dist/index.cjs.min.js').then(tldts => {
            tldtsRef.current = tldts;
        });
        // This will get used in the avatar creator a few steps later, so lets preload it now
        // @ts-expect-error - valid path
        import('react-native-view-shot/src/index');
    }, []);
    const onNextPress = () => {
        const inviteCode = inviteCodeValueRef.current;
        const email = emailValueRef.current;
        const emailChanged = prevEmailValueRef.current !== email;
        const password = passwordValueRef.current;
        if (!is13(state.dateOfBirth)) {
            return;
        }
        if (state.serviceDescription?.inviteCodeRequired && !inviteCode) {
            return dispatch({
                type: 'setError',
                value: _(msg `Please enter your invite code.`),
                field: 'invite-code',
            });
        }
        if (!email) {
            return dispatch({
                type: 'setError',
                value: _(msg `Please enter your email.`),
                field: 'email',
            });
        }
        if (!EmailValidator.validate(email)) {
            return dispatch({
                type: 'setError',
                value: _(msg `Your email appears to be invalid.`),
                field: 'email',
            });
        }
        if (emailChanged && tldtsRef.current) {
            if (isEmailMaybeInvalid(email, tldtsRef.current)) {
                prevEmailValueRef.current = email;
                setHasWarnedEmail(true);
                return dispatch({
                    type: 'setError',
                    value: _(msg `Please double-check that you have entered your email address correctly.`),
                });
            }
        }
        else if (hasWarnedEmail) {
            setHasWarnedEmail(false);
        }
        prevEmailValueRef.current = email;
        if (!password) {
            return dispatch({
                type: 'setError',
                value: _(msg `Please choose your password.`),
                field: 'password',
            });
        }
        if (password.length < 8) {
            return dispatch({
                type: 'setError',
                value: _(msg `Your password must be at least 8 characters long.`),
                field: 'password',
            });
        }
        preemptivelyCompleteActivePolicyUpdate();
        dispatch({ type: 'setInviteCode', value: inviteCode });
        dispatch({ type: 'setEmail', value: email });
        dispatch({ type: 'setPassword', value: password });
        dispatch({ type: 'next' });
        logger.metric('signup:nextPressed', {
            activeStep: state.activeStep,
        }, { statsig: true });
    };
    return (_jsxs(ScreenTransition, { children: [_jsxs(View, { style: [a.gap_md, a.pt_lg], children: [_jsx(FormError, { error: state.error }), _jsx(HostingProvider, { minimal: true, serviceUrl: state.serviceUrl, onSelectServiceUrl: v => dispatch({ type: 'setServiceUrl', value: v }) }), state.isLoading || isLoadingStarterPack ? (_jsx(View, { style: [a.align_center], children: _jsx(Loader, { size: "xl" }) })) : state.serviceDescription ? (_jsxs(_Fragment, { children: [state.serviceDescription.inviteCodeRequired && (_jsxs(View, { children: [_jsx(TextField.LabelText, { children: _jsx(Trans, { children: "Invite code" }) }), _jsxs(TextField.Root, { isInvalid: state.errorField === 'invite-code', children: [_jsx(TextField.Icon, { icon: Ticket }), _jsx(TextField.Input, { onChangeText: value => {
                                                    inviteCodeValueRef.current = value.trim();
                                                    if (state.errorField === 'invite-code' &&
                                                        value.trim().length > 0) {
                                                        dispatch({ type: 'clearError' });
                                                    }
                                                }, label: _(msg `Required for this provider`), defaultValue: state.inviteCode, autoCapitalize: "none", autoComplete: "email", keyboardType: "email-address", returnKeyType: "next", submitBehavior: native('submit'), onSubmitEditing: native(() => emailInputRef.current?.focus()) })] })] })), _jsxs(View, { children: [_jsx(TextField.LabelText, { children: _jsx(Trans, { children: "Email" }) }), _jsxs(TextField.Root, { isInvalid: state.errorField === 'email', children: [_jsx(TextField.Icon, { icon: Envelope }), _jsx(TextField.Input, { testID: "emailInput", inputRef: emailInputRef, onChangeText: value => {
                                                    emailValueRef.current = value.trim();
                                                    if (hasWarnedEmail) {
                                                        setHasWarnedEmail(false);
                                                    }
                                                    if (state.errorField === 'email' &&
                                                        value.trim().length > 0 &&
                                                        EmailValidator.validate(value.trim())) {
                                                        dispatch({ type: 'clearError' });
                                                    }
                                                }, label: _(msg `Enter your email address`), defaultValue: state.email, autoCapitalize: "none", autoComplete: "email", keyboardType: "email-address", returnKeyType: "next", submitBehavior: native('submit'), onSubmitEditing: native(() => passwordInputRef.current?.focus()) })] })] }), _jsxs(View, { children: [_jsx(TextField.LabelText, { children: _jsx(Trans, { children: "Password" }) }), _jsxs(TextField.Root, { isInvalid: state.errorField === 'password', children: [_jsx(TextField.Icon, { icon: Lock }), _jsx(TextField.Input, { testID: "passwordInput", inputRef: passwordInputRef, onChangeText: value => {
                                                    passwordValueRef.current = value;
                                                    if (state.errorField === 'password' && value.length >= 8) {
                                                        dispatch({ type: 'clearError' });
                                                    }
                                                }, label: _(msg `Choose your password`), defaultValue: state.password, secureTextEntry: true, autoComplete: "new-password", autoCapitalize: "none", returnKeyType: "next", submitBehavior: native('blurAndSubmit'), onSubmitEditing: native(() => birthdateInputRef.current?.focus()), passwordRules: "minlength: 8;" })] })] }), _jsxs(View, { children: [_jsx(DateField.LabelText, { children: _jsx(Trans, { children: "Your birth date" }) }), _jsx(DateField.DateField, { testID: "date", inputRef: birthdateInputRef, value: state.dateOfBirth, onChangeDate: date => {
                                            dispatch({
                                                type: 'setDateOfBirth',
                                                value: sanitizeDate(new Date(date)),
                                            });
                                        }, label: _(msg `Date of birth`), accessibilityHint: _(msg `Select your date of birth`), maximumDate: new Date() })] }), _jsx(Policies, { serviceDescription: state.serviceDescription, needsGuardian: !is18(state.dateOfBirth), under13: !is13(state.dateOfBirth) })] })) : undefined] }), _jsx(BackNextButtons, { hideNext: !is13(state.dateOfBirth), showRetry: isServerError, isLoading: state.isLoading, onBackPress: onPressBack, onNextPress: onNextPress, onRetryPress: refetchServer, overrideNextText: hasWarnedEmail ? _(msg `It's correct`) : undefined })] }));
}
//# sourceMappingURL=index.js.map