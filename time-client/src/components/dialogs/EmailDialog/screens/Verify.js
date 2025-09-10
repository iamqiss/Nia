import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useReducer } from 'react';
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { wait } from '#/lib/async/wait';
import { useCleanError } from '#/lib/hooks/useCleanError';
import { logger } from '#/logger';
import { useSession } from '#/state/session';
import { atoms as a, useTheme } from '#/alf';
import { Admonition } from '#/components/Admonition';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import { ResendEmailText } from '#/components/dialogs/EmailDialog/components/ResendEmailText';
import { isValidCode, TokenField, } from '#/components/dialogs/EmailDialog/components/TokenField';
import { useConfirmEmail } from '#/components/dialogs/EmailDialog/data/useConfirmEmail';
import { useRequestEmailVerification } from '#/components/dialogs/EmailDialog/data/useRequestEmailVerification';
import { useOnEmailVerified } from '#/components/dialogs/EmailDialog/events';
import { ScreenID, } from '#/components/dialogs/EmailDialog/types';
import { Divider } from '#/components/Divider';
import { CheckThick_Stroke2_Corner0_Rounded as Check } from '#/components/icons/Check';
import { Envelope_Stroke2_Corner0_Rounded as Envelope } from '#/components/icons/Envelope';
import { createStaticClick, InlineLinkText } from '#/components/Link';
import { Loader } from '#/components/Loader';
import { Span, Text } from '#/components/Typography';
function reducer(state, action) {
    switch (action.type) {
        case 'setStep': {
            return {
                ...state,
                error: '',
                mutationStatus: 'default',
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
        case 'setToken': {
            return {
                ...state,
                error: '',
                token: action.value,
            };
        }
    }
}
export function Verify({ config, showScreen }) {
    const t = useTheme();
    const { _ } = useLingui();
    const cleanError = useCleanError();
    const { currentAccount } = useSession();
    const [state, dispatch] = useReducer(reducer, {
        step: 'email',
        mutationStatus: 'default',
        error: '',
        token: '',
    });
    const { mutateAsync: requestEmailVerification } = useRequestEmailVerification();
    const { mutateAsync: confirmEmail } = useConfirmEmail();
    useOnEmailVerified(() => {
        if (config.onVerify) {
            config.onVerify();
        }
        else {
            dispatch({
                type: 'setStep',
                step: 'success',
            });
        }
    });
    const handleRequestEmailVerification = async () => {
        dispatch({
            type: 'setMutationStatus',
            status: 'pending',
        });
        try {
            await wait(1000, requestEmailVerification());
            dispatch({
                type: 'setMutationStatus',
                status: 'success',
            });
        }
        catch (e) {
            logger.error('EmailDialog: sending verification email failed', {
                safeMessage: e,
            });
            const { clean } = cleanError(e);
            dispatch({
                type: 'setError',
                error: clean || _(msg `Failed to send email, please try again.`),
            });
        }
    };
    const handleConfirmEmail = async () => {
        if (!isValidCode(state.token)) {
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
        try {
            await wait(1000, confirmEmail({ token: state.token }));
            dispatch({
                type: 'setStep',
                step: 'success',
            });
        }
        catch (e) {
            logger.error('EmailDialog: confirming email failed', {
                safeMessage: e,
            });
            const { clean } = cleanError(e);
            dispatch({
                type: 'setError',
                error: clean || _(msg `Failed to verify email, please try again.`),
            });
        }
    };
    if (state.step === 'success') {
        return (_jsx(View, { style: [a.gap_lg], children: _jsxs(View, { style: [a.gap_sm], children: [_jsxs(Text, { style: [a.text_xl, a.font_heavy], children: [_jsx(Span, { style: { top: 1 }, children: _jsx(Check, { size: "sm", fill: t.palette.positive_600 }) }), '  ', _jsx(Trans, { children: "Email verification complete!" })] }), _jsx(Text, { style: [a.text_sm, a.leading_snug, t.atoms.text_contrast_medium], children: _jsx(Trans, { children: "You have successfully verified your email address. You can close this dialog." }) })] }) }));
    }
    return (_jsxs(View, { style: [a.gap_lg], children: [_jsxs(View, { style: [a.gap_sm], children: [_jsx(Text, { style: [a.text_xl, a.font_heavy], children: state.step === 'email' ? (state.mutationStatus === 'success' ? (_jsxs(_Fragment, { children: [_jsx(Span, { style: { top: 1 }, children: _jsx(Check, { size: "sm", fill: t.palette.positive_600 }) }), '  ', _jsx(Trans, { children: "Email sent!" })] })) : (_jsx(Trans, { children: "Verify your email" }))) : (_jsx(Trans, { comment: "Dialog title when a user is verifying their email address by entering a code they have been sent", children: "Verify email code" })) }), state.step === 'email' && state.mutationStatus !== 'success' && (_jsx(_Fragment, { children: config.instructions?.map((int, i) => (_jsx(Text, { style: [
                                a.italic,
                                a.text_sm,
                                a.leading_snug,
                                t.atoms.text_contrast_medium,
                            ], children: int }, i))) })), _jsx(Text, { style: [a.text_sm, a.leading_snug, t.atoms.text_contrast_medium], children: state.step === 'email' ? (state.mutationStatus === 'success' ? (_jsxs(Trans, { children: ["We sent an email to", ' ', _jsx(Span, { style: [a.font_bold, t.atoms.text], children: currentAccount.email }), ' ', "containing a link. Please click on it to complete the email verification process."] })) : (_jsxs(Trans, { children: ["We'll send an email to", ' ', _jsx(Span, { style: [a.font_bold, t.atoms.text], children: currentAccount.email }), ' ', "containing a link. Please click on it to complete the email verification process."] }))) : (_jsxs(Trans, { children: ["Please enter the code we sent to", ' ', _jsx(Span, { style: [a.font_bold, t.atoms.text], children: currentAccount.email }), ' ', "below."] })) }), state.step === 'email' && state.mutationStatus !== 'success' && (_jsx(Text, { style: [a.text_sm, a.leading_snug, t.atoms.text_contrast_medium], children: _jsxs(Trans, { children: ["If you need to update your email,", ' ', _jsx(InlineLinkText, { label: _(msg `Click here to update your email`), ...createStaticClick(() => {
                                        showScreen({ id: ScreenID.Update });
                                    }), children: "click here" }), "."] }) })), state.step === 'email' && state.mutationStatus === 'success' && (_jsx(ResendEmailText, { onPress: requestEmailVerification }))] }), state.step === 'email' && state.mutationStatus !== 'success' ? (_jsxs(_Fragment, { children: [state.error && _jsx(Admonition, { type: "error", children: state.error }), _jsxs(Button, { label: _(msg `Send verification email`), size: "large", variant: "solid", color: "primary", onPress: handleRequestEmailVerification, disabled: state.mutationStatus === 'pending', children: [_jsx(ButtonText, { children: _jsx(Trans, { children: "Send email" }) }), _jsx(ButtonIcon, { icon: state.mutationStatus === 'pending' ? Loader : Envelope })] })] })) : null, state.step === 'email' && (_jsxs(_Fragment, { children: [_jsx(Divider, {}), _jsx(Text, { style: [a.text_sm, a.leading_snug, t.atoms.text_contrast_medium], children: _jsxs(Trans, { children: ["Have a code?", ' ', _jsx(InlineLinkText, { label: _(msg `Enter code`), ...createStaticClick(() => {
                                        dispatch({
                                            type: 'setStep',
                                            step: 'token',
                                        });
                                    }), children: "Click here." })] }) })] })), state.step === 'token' ? (_jsxs(_Fragment, { children: [_jsx(TokenField, { value: state.token, onChangeText: token => {
                            dispatch({
                                type: 'setToken',
                                value: token,
                            });
                        }, onSubmitEditing: handleConfirmEmail }), state.error && _jsx(Admonition, { type: "error", children: state.error }), _jsxs(Button, { label: _(msg({
                            message: `Verify code`,
                            context: `action`,
                            comment: `Button text and accessibility label for action to verify the user's email address using the code entered`,
                        })), size: "large", variant: "solid", color: "primary", onPress: handleConfirmEmail, disabled: !state.token ||
                            state.token.length !== 11 ||
                            state.mutationStatus === 'pending', children: [_jsx(ButtonText, { children: _jsx(Trans, { context: "action", comment: "Button text and accessibility label for action to verify the user's email address using the code entered", children: "Verify code" }) }), state.mutationStatus === 'pending' && _jsx(ButtonIcon, { icon: Loader })] }), _jsx(Divider, {}), _jsx(Text, { style: [a.text_sm, a.leading_snug, t.atoms.text_contrast_medium], children: _jsxs(Trans, { children: ["Don't have a code or need a new one?", ' ', _jsx(InlineLinkText, { label: _(msg `Click here to restart the verification process.`), ...createStaticClick(() => {
                                        dispatch({
                                            type: 'setStep',
                                            step: 'email',
                                        });
                                    }), children: "Click here." })] }) })] })) : null] }));
}
//# sourceMappingURL=Verify.js.map