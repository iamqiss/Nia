import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useReducer } from 'react';
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { validate as validateEmail } from 'email-validator';
import { wait } from '#/lib/async/wait';
import { useCleanError } from '#/lib/hooks/useCleanError';
import { logger } from '#/logger';
import { useSession } from '#/state/session';
import { atoms as a, useTheme } from '#/alf';
import { Admonition } from '#/components/Admonition';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import { ResendEmailText } from '#/components/dialogs/EmailDialog/components/ResendEmailText';
import { isValidCode, TokenField, } from '#/components/dialogs/EmailDialog/components/TokenField';
import { useRequestEmailUpdate } from '#/components/dialogs/EmailDialog/data/useRequestEmailUpdate';
import { useRequestEmailVerification } from '#/components/dialogs/EmailDialog/data/useRequestEmailVerification';
import { useUpdateEmail } from '#/components/dialogs/EmailDialog/data/useUpdateEmail';
import {} from '#/components/dialogs/EmailDialog/types';
import { Divider } from '#/components/Divider';
import * as TextField from '#/components/forms/TextField';
import { CheckThick_Stroke2_Corner0_Rounded as Check } from '#/components/icons/Check';
import { Envelope_Stroke2_Corner0_Rounded as Envelope } from '#/components/icons/Envelope';
import { Loader } from '#/components/Loader';
import { Text } from '#/components/Typography';
function reducer(state, action) {
    switch (action.type) {
        case 'setStep': {
            return {
                ...state,
                step: action.step,
            };
        }
        case 'setError': {
            return {
                ...state,
                error: action.error,
                mutationStatus: 'error',
            };
        }
        case 'setMutationStatus': {
            return {
                ...state,
                error: '',
                mutationStatus: action.status,
            };
        }
        case 'setEmail': {
            const emailValid = validateEmail(action.value);
            return {
                ...state,
                step: 'email',
                token: '',
                email: action.value,
                emailValid,
            };
        }
        case 'setToken': {
            return {
                ...state,
                error: '',
                token: action.value,
            };
        }
    }
}
export function Update(_props) {
    const t = useTheme();
    const { _ } = useLingui();
    const cleanError = useCleanError();
    const { currentAccount } = useSession();
    const [state, dispatch] = useReducer(reducer, {
        step: 'email',
        mutationStatus: 'default',
        error: '',
        email: '',
        emailValid: true,
        token: '',
    });
    const { mutateAsync: updateEmail } = useUpdateEmail();
    const { mutateAsync: requestEmailUpdate } = useRequestEmailUpdate();
    const { mutateAsync: requestEmailVerification } = useRequestEmailVerification();
    const handleEmailChange = (email) => {
        dispatch({
            type: 'setEmail',
            value: email,
        });
    };
    const handleUpdateEmail = async () => {
        if (state.step === 'token' && !isValidCode(state.token)) {
            dispatch({
                type: 'setError',
                error: _(msg `Please enter a valid code.`),
            });
            return;
        }
        dispatch({
            type: 'setMutationStatus',
            status: 'pending',
        });
        if (state.emailValid === false) {
            dispatch({
                type: 'setError',
                error: _(msg `Please enter a valid email address.`),
            });
            return;
        }
        if (state.email === currentAccount.email) {
            dispatch({
                type: 'setError',
                error: _(msg `This email is already associated with your account.`),
            });
            return;
        }
        try {
            const { status } = await wait(1000, updateEmail({
                email: state.email,
                token: state.token,
            }));
            if (status === 'tokenRequired') {
                dispatch({
                    type: 'setStep',
                    step: 'token',
                });
                dispatch({
                    type: 'setMutationStatus',
                    status: 'default',
                });
            }
            else if (status === 'success') {
                dispatch({
                    type: 'setMutationStatus',
                    status: 'success',
                });
                try {
                    // fire off a confirmation email immediately
                    await requestEmailVerification();
                }
                catch { }
            }
        }
        catch (e) {
            logger.error('EmailDialog: update email failed', { safeMessage: e });
            const { clean } = cleanError(e);
            dispatch({
                type: 'setError',
                error: clean || _(msg `Failed to update email, please try again.`),
            });
        }
    };
    return (_jsxs(View, { style: [a.gap_lg], children: [_jsx(Text, { style: [a.text_xl, a.font_heavy], children: _jsx(Trans, { children: "Update your email" }) }), currentAccount?.emailAuthFactor && (_jsx(Admonition, { type: "warning", children: _jsx(Trans, { children: "If you update your email address, email 2FA will be disabled." }) })), _jsxs(View, { style: [a.gap_md], children: [_jsxs(View, { children: [_jsx(Text, { style: [a.pb_sm, a.leading_snug, t.atoms.text_contrast_medium], children: _jsx(Trans, { children: "Please enter your new email address." }) }), _jsxs(TextField.Root, { children: [_jsx(TextField.Icon, { icon: Envelope }), _jsx(TextField.Input, { label: _(msg `New email address`), placeholder: _(msg `alice@example.com`), defaultValue: state.email, onChangeText: state.mutationStatus === 'success'
                                            ? undefined
                                            : handleEmailChange, keyboardType: "email-address", autoComplete: "email", autoCapitalize: "none", onSubmitEditing: handleUpdateEmail })] })] }), state.step === 'token' && (_jsxs(_Fragment, { children: [_jsx(Divider, {}), _jsxs(View, { children: [_jsx(Text, { style: [a.text_md, a.pb_sm, a.font_bold], children: _jsx(Trans, { children: "Security step required" }) }), _jsx(Text, { style: [a.pb_sm, a.leading_snug, t.atoms.text_contrast_medium], children: _jsx(Trans, { children: "Please enter the security code we sent to your previous email address." }) }), _jsx(TokenField, { value: state.token, onChangeText: state.mutationStatus === 'success'
                                            ? undefined
                                            : token => {
                                                dispatch({
                                                    type: 'setToken',
                                                    value: token,
                                                });
                                            }, onSubmitEditing: handleUpdateEmail }), state.mutationStatus !== 'success' && (_jsx(ResendEmailText, { onPress: requestEmailUpdate, style: [a.pt_sm] }))] })] })), state.error && _jsx(Admonition, { type: "error", children: state.error })] }), state.mutationStatus === 'success' ? (_jsxs(_Fragment, { children: [_jsx(Divider, {}), _jsxs(View, { style: [a.gap_sm], children: [_jsxs(View, { style: [a.flex_row, a.gap_sm, a.align_center], children: [_jsx(Check, { fill: t.palette.positive_600, size: "xs" }), _jsx(Text, { style: [a.text_md, a.font_heavy], children: _jsx(Trans, { children: "Success!" }) })] }), _jsx(Text, { style: [a.leading_snug], children: _jsx(Trans, { children: "Please click on the link in the email we just sent you to verify your new email address. This is an important step to allow you to continue enjoying all the features of Bluesky." }) })] })] })) : (_jsxs(Button, { label: _(msg `Update email`), size: "large", variant: "solid", color: "primary", onPress: handleUpdateEmail, disabled: !state.email ||
                    (state.step === 'token' &&
                        (!state.token || state.token.length !== 11)) ||
                    state.mutationStatus === 'pending', children: [_jsx(ButtonText, { children: _jsx(Trans, { children: "Update email" }) }), state.mutationStatus === 'pending' && _jsx(ButtonIcon, { icon: Loader })] }))] }));
}
//# sourceMappingURL=Update.js.map