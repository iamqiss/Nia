import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import ReactNativeDeviceAttest from 'react-native-device-attest';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { nanoid } from 'nanoid/non-secure';
import { createFullHandle } from '#/lib/strings/handles';
import { logger } from '#/logger';
import { isAndroid, isIOS, isNative, isWeb } from '#/platform/detection';
import { ScreenTransition } from '#/screens/Login/ScreenTransition';
import { useSignupContext } from '#/screens/Signup/state';
import { CaptchaWebView } from '#/screens/Signup/StepCaptcha/CaptchaWebView';
import { atoms as a, useTheme } from '#/alf';
import { FormError } from '#/components/forms/FormError';
import { GCP_PROJECT_ID } from '#/env';
import { BackNextButtons } from '../BackNextButtons';
const CAPTCHA_PATH = isWeb || GCP_PROJECT_ID === 0 ? '/gate/signup' : '/gate/signup/attempt-attest';
export function StepCaptcha() {
    if (isWeb) {
        return _jsx(StepCaptchaInner, {});
    }
    else {
        return _jsx(StepCaptchaNative, {});
    }
}
export function StepCaptchaNative() {
    const [token, setToken] = useState();
    const [payload, setPayload] = useState();
    const [ready, setReady] = useState(false);
    useEffect(() => {
        ;
        (async () => {
            logger.debug('trying to generate attestation token...');
            try {
                if (isIOS) {
                    logger.debug('starting to generate devicecheck token...');
                    const token = await ReactNativeDeviceAttest.getDeviceCheckToken();
                    setToken(token);
                    logger.debug(`generated devicecheck token: ${token}`);
                }
                else {
                    const { token, payload } = await ReactNativeDeviceAttest.getIntegrityToken('signup');
                    setToken(token);
                    setPayload(base64UrlEncode(payload));
                }
            }
            catch (e) {
                logger.error(e);
            }
            finally {
                setReady(true);
            }
        })();
    }, []);
    if (!ready) {
        return _jsx(View, {});
    }
    return _jsx(StepCaptchaInner, { token: token, payload: payload });
}
function StepCaptchaInner({ token, payload, }) {
    const { _ } = useLingui();
    const theme = useTheme();
    const { state, dispatch } = useSignupContext();
    const [completed, setCompleted] = React.useState(false);
    const stateParam = React.useMemo(() => nanoid(15), []);
    const url = React.useMemo(() => {
        const newUrl = new URL(state.serviceUrl);
        newUrl.pathname = CAPTCHA_PATH;
        newUrl.searchParams.set('handle', createFullHandle(state.handle, state.userDomain));
        newUrl.searchParams.set('state', stateParam);
        newUrl.searchParams.set('colorScheme', theme.name);
        if (isNative && token) {
            newUrl.searchParams.set('platform', Platform.OS);
            newUrl.searchParams.set('token', token);
            if (isAndroid && payload) {
                newUrl.searchParams.set('payload', payload);
            }
        }
        return newUrl.href;
    }, [
        state.serviceUrl,
        state.handle,
        state.userDomain,
        stateParam,
        theme.name,
        token,
        payload,
    ]);
    const onSuccess = React.useCallback((code) => {
        setCompleted(true);
        logger.metric('signup:captchaSuccess', {}, { statsig: true });
        dispatch({
            type: 'submit',
            task: { verificationCode: code, mutableProcessed: false },
        });
    }, [dispatch]);
    const onError = React.useCallback((error) => {
        dispatch({
            type: 'setError',
            value: _(msg `Error receiving captcha response.`),
        });
        logger.metric('signup:captchaFailure', {}, { statsig: true });
        logger.error('Signup Flow Error', {
            registrationHandle: state.handle,
            error,
        });
    }, [_, dispatch, state.handle]);
    const onBackPress = React.useCallback(() => {
        logger.error('Signup Flow Error', {
            errorMessage: 'User went back from captcha step. Possibly encountered an error.',
            registrationHandle: state.handle,
        });
        dispatch({ type: 'prev' });
    }, [dispatch, state.handle]);
    return (_jsxs(ScreenTransition, { children: [_jsxs(View, { style: [a.gap_lg, a.pt_lg], children: [_jsx(View, { style: [
                            a.w_full,
                            a.overflow_hidden,
                            { minHeight: 510 },
                            completed && [a.align_center, a.justify_center],
                        ], children: !completed ? (_jsx(CaptchaWebView, { url: url, stateParam: stateParam, state: state, onSuccess: onSuccess, onError: onError })) : (_jsx(ActivityIndicator, { size: "large" })) }), _jsx(FormError, { error: state.error })] }), _jsx(BackNextButtons, { hideNext: true, isLoading: state.isLoading, onBackPress: onBackPress })] }));
}
function base64UrlEncode(data) {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(data);
    const binaryString = String.fromCharCode(...bytes);
    const base64 = btoa(binaryString);
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/[=]/g, '');
}
//# sourceMappingURL=index.js.map