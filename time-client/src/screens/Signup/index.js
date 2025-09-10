import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useReducer, useState } from 'react';
import { AppState, View } from 'react-native';
import ReactNativeDeviceAttest from 'react-native-device-attest';
import Animated, { FadeIn, LayoutAnimationConfig } from 'react-native-reanimated';
import { AppBskyGraphStarterpack } from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { FEEDBACK_FORM_URL } from '#/lib/constants';
import { logger } from '#/logger';
import { isAndroid } from '#/platform/detection';
import { useServiceQuery } from '#/state/queries/service';
import { useStarterPackQuery } from '#/state/queries/starter-packs';
import { useActiveStarterPack } from '#/state/shell/starter-pack';
import { LoggedOutLayout } from '#/view/com/util/layouts/LoggedOutLayout';
import { initialState, reducer, SignupContext, SignupStep, useSubmitSignup, } from '#/screens/Signup/state';
import { StepCaptcha } from '#/screens/Signup/StepCaptcha';
import { StepHandle } from '#/screens/Signup/StepHandle';
import { StepInfo } from '#/screens/Signup/StepInfo';
import { atoms as a, useBreakpoints, useTheme } from '#/alf';
import { AppLanguageDropdown } from '#/components/AppLanguageDropdown';
import { Divider } from '#/components/Divider';
import { LinearGradientBackground } from '#/components/LinearGradientBackground';
import { InlineLinkText } from '#/components/Link';
import { Text } from '#/components/Typography';
import { GCP_PROJECT_ID } from '#/env';
import * as bsky from '#/types/bsky';
export function Signup({ onPressBack }) {
    const { _ } = useLingui();
    const t = useTheme();
    const [state, dispatch] = useReducer(reducer, initialState);
    const { gtMobile } = useBreakpoints();
    const submit = useSubmitSignup();
    const activeStarterPack = useActiveStarterPack();
    const { data: starterPack, isFetching: isFetchingStarterPack, isError: isErrorStarterPack, } = useStarterPackQuery({
        uri: activeStarterPack?.uri,
    });
    const [isFetchedAtMount] = useState(starterPack != null);
    const showStarterPackCard = activeStarterPack?.uri && !isFetchingStarterPack && starterPack;
    const { data: serviceInfo, isFetching, isError, refetch, } = useServiceQuery(state.serviceUrl);
    useEffect(() => {
        if (isFetching) {
            dispatch({ type: 'setIsLoading', value: true });
        }
        else if (!isFetching) {
            dispatch({ type: 'setIsLoading', value: false });
        }
    }, [isFetching]);
    useEffect(() => {
        if (isError) {
            dispatch({ type: 'setServiceDescription', value: undefined });
            dispatch({
                type: 'setError',
                value: _(msg `Unable to contact your service. Please check your Internet connection.`),
            });
        }
        else if (serviceInfo) {
            dispatch({ type: 'setServiceDescription', value: serviceInfo });
            dispatch({ type: 'setError', value: '' });
        }
    }, [_, serviceInfo, isError]);
    useEffect(() => {
        if (state.pendingSubmit) {
            if (!state.pendingSubmit.mutableProcessed) {
                state.pendingSubmit.mutableProcessed = true;
                submit(state, dispatch);
            }
        }
    }, [state, dispatch, submit]);
    // Track app backgrounding during signup
    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (nextAppState === 'background') {
                dispatch({ type: 'incrementBackgroundCount' });
            }
        });
        return () => subscription.remove();
    }, []);
    // On Android, warmup the Play Integrity API on the signup screen so it is ready by the time we get to the gate screen.
    useEffect(() => {
        if (!isAndroid) {
            return;
        }
        ReactNativeDeviceAttest.warmupIntegrity(GCP_PROJECT_ID).catch(err => logger.error(err));
    }, []);
    return (_jsx(SignupContext.Provider, { value: { state, dispatch }, children: _jsx(LoggedOutLayout, { leadin: "", title: _(msg `Create Account`), description: _(msg `We're so excited to have you join us!`), scrollable: true, children: _jsxs(View, { testID: "createAccount", style: a.flex_1, children: [showStarterPackCard &&
                        bsky.dangerousIsType(starterPack.record, AppBskyGraphStarterpack.isRecord) ? (_jsx(Animated.View, { entering: !isFetchedAtMount ? FadeIn : undefined, children: _jsxs(LinearGradientBackground, { style: [a.mx_lg, a.p_lg, a.gap_sm, a.rounded_sm], children: [_jsx(Text, { style: [a.font_bold, a.text_xl, { color: 'white' }], children: starterPack.record.name }), _jsx(Text, { style: [{ color: 'white' }], children: starterPack.feeds?.length ? (_jsx(Trans, { children: "You'll follow the suggested users and feeds once you finish creating your account!" })) : (_jsx(Trans, { children: "You'll follow the suggested users once you finish creating your account!" })) })] }) })) : null, _jsxs(View, { style: [
                            a.flex_1,
                            a.px_xl,
                            a.pt_2xl,
                            !gtMobile && { paddingBottom: 100 },
                        ], children: [_jsxs(View, { style: [a.gap_sm, a.pb_sm], children: [_jsx(Text, { style: [a.text_sm, a.font_bold, t.atoms.text_contrast_medium], children: _jsxs(Trans, { children: ["Step ", state.activeStep + 1, " of", ' ', state.serviceDescription &&
                                                    !state.serviceDescription.phoneVerificationRequired
                                                    ? '2'
                                                    : '3'] }) }), _jsx(Text, { style: [a.text_3xl, a.font_heavy], children: state.activeStep === SignupStep.INFO ? (_jsx(Trans, { children: "Your account" })) : state.activeStep === SignupStep.HANDLE ? (_jsx(Trans, { children: "Choose your username" })) : (_jsx(Trans, { children: "Complete the challenge" })) })] }), _jsx(LayoutAnimationConfig, { skipEntering: true, skipExiting: true, children: state.activeStep === SignupStep.INFO ? (_jsx(StepInfo, { onPressBack: onPressBack, isLoadingStarterPack: isFetchingStarterPack && !isErrorStarterPack, isServerError: isError, refetchServer: refetch })) : state.activeStep === SignupStep.HANDLE ? (_jsx(StepHandle, {})) : (_jsx(StepCaptcha, {})) }), _jsx(Divider, {}), _jsxs(View, { style: [a.w_full, a.py_lg, a.flex_row, a.gap_md, a.align_center], children: [_jsx(AppLanguageDropdown, {}), _jsxs(Text, { style: [
                                            a.flex_1,
                                            t.atoms.text_contrast_medium,
                                            !gtMobile && a.text_md,
                                        ], children: [_jsx(Trans, { children: "Having trouble?" }), ' ', _jsx(InlineLinkText, { label: _(msg `Contact support`), to: FEEDBACK_FORM_URL({ email: state.email }), style: [!gtMobile && a.text_md], children: _jsx(Trans, { children: "Contact support" }) })] })] })] })] }) }) }));
}
//# sourceMappingURL=index.js.map