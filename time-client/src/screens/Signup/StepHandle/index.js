import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut, LayoutAnimationConfig, LinearTransition, } from 'react-native-reanimated';
import { msg, Plural, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { createFullHandle, MAX_SERVICE_HANDLE_LENGTH, validateServiceHandle, } from '#/lib/strings/handles';
import { logger } from '#/logger';
import { checkHandleAvailability, useHandleAvailabilityQuery, } from '#/state/queries/handle-availability';
import { ScreenTransition } from '#/screens/Login/ScreenTransition';
import { useSignupContext } from '#/screens/Signup/state';
import { atoms as a, native, useTheme } from '#/alf';
import * as TextField from '#/components/forms/TextField';
import { useThrottledValue } from '#/components/hooks/useThrottledValue';
import { At_Stroke2_Corner0_Rounded as AtIcon } from '#/components/icons/At';
import { Check_Stroke2_Corner0_Rounded as CheckIcon } from '#/components/icons/Check';
import { Text } from '#/components/Typography';
import { BackNextButtons } from '../BackNextButtons';
import { HandleSuggestions } from './HandleSuggestions';
export function StepHandle() {
    const { _ } = useLingui();
    const t = useTheme();
    const { state, dispatch } = useSignupContext();
    const [draftValue, setDraftValue] = useState(state.handle);
    const isNextLoading = useThrottledValue(state.isLoading, 500);
    const validCheck = validateServiceHandle(draftValue, state.userDomain);
    const { debouncedUsername: debouncedDraftValue, enabled: queryEnabled, query: { data: isHandleAvailable, isPending }, } = useHandleAvailabilityQuery({
        username: draftValue,
        serviceDid: state.serviceDescription?.did ?? 'UNKNOWN',
        serviceDomain: state.userDomain,
        birthDate: state.dateOfBirth.toISOString(),
        email: state.email,
        enabled: validCheck.overall,
    });
    const onNextPress = async () => {
        const handle = draftValue.trim();
        dispatch({
            type: 'setHandle',
            value: handle,
        });
        if (!validCheck.overall) {
            return;
        }
        dispatch({ type: 'setIsLoading', value: true });
        try {
            const { available: handleAvailable } = await checkHandleAvailability(createFullHandle(handle, state.userDomain), state.serviceDescription?.did ?? 'UNKNOWN', { typeahead: false });
            if (!handleAvailable) {
                dispatch({
                    type: 'setError',
                    value: _(msg `That username is already taken`),
                    field: 'handle',
                });
                return;
            }
        }
        catch (error) {
            logger.error('Failed to check handle availability on next press', {
                safeMessage: error,
            });
            // do nothing on error, let them pass
        }
        finally {
            dispatch({ type: 'setIsLoading', value: false });
        }
        logger.metric('signup:nextPressed', {
            activeStep: state.activeStep,
            phoneVerificationRequired: state.serviceDescription?.phoneVerificationRequired,
        }, { statsig: true });
        // phoneVerificationRequired is actually whether a captcha is required
        if (!state.serviceDescription?.phoneVerificationRequired) {
            dispatch({
                type: 'submit',
                task: { verificationCode: undefined, mutableProcessed: false },
            });
            return;
        }
        dispatch({ type: 'next' });
    };
    const onBackPress = () => {
        const handle = draftValue.trim();
        dispatch({
            type: 'setHandle',
            value: handle,
        });
        dispatch({ type: 'prev' });
        logger.metric('signup:backPressed', { activeStep: state.activeStep }, { statsig: true });
    };
    const hasDebounceSettled = draftValue === debouncedDraftValue;
    const isHandleTaken = !isPending &&
        queryEnabled &&
        isHandleAvailable &&
        !isHandleAvailable.available;
    const isNotReady = isPending || !hasDebounceSettled;
    const isNextDisabled = !validCheck.overall || !!state.error || isNotReady ? true : isHandleTaken;
    const textFieldInvalid = isHandleTaken ||
        !validCheck.frontLengthNotTooLong ||
        !validCheck.handleChars ||
        !validCheck.hyphenStartOrEnd ||
        !validCheck.totalLength;
    return (_jsxs(ScreenTransition, { children: [_jsxs(View, { style: [a.gap_sm, a.pt_lg, a.z_10], children: [_jsx(View, { children: _jsxs(TextField.Root, { isInvalid: textFieldInvalid, children: [_jsx(TextField.Icon, { icon: AtIcon }), _jsx(TextField.Input, { testID: "handleInput", onChangeText: val => {
                                        if (state.error) {
                                            dispatch({ type: 'setError', value: '' });
                                        }
                                        setDraftValue(val.toLocaleLowerCase());
                                    }, label: state.userDomain, value: draftValue, keyboardType: "ascii-capable" // fix for iOS replacing -- with —
                                    , autoCapitalize: "none", autoCorrect: false, autoFocus: true, autoComplete: "off" }), draftValue.length > 0 && (_jsx(TextField.GhostText, { value: state.userDomain, children: draftValue })), isHandleAvailable?.available && (_jsx(CheckIcon, { testID: "handleAvailableCheck", style: [{ color: t.palette.positive_600 }, a.z_20] }))] }) }), _jsx(LayoutAnimationConfig, { skipEntering: true, skipExiting: true, children: _jsxs(View, { style: [a.gap_xs], children: [state.error && (_jsx(Requirement, { children: _jsx(RequirementText, { children: state.error }) })), isHandleTaken && validCheck.overall && (_jsxs(_Fragment, { children: [_jsx(Requirement, { children: _jsx(RequirementText, { children: _jsxs(Trans, { children: [createFullHandle(draftValue, state.userDomain), " is not available"] }) }) }), isHandleAvailable.suggestions &&
                                            isHandleAvailable.suggestions.length > 0 && (_jsx(HandleSuggestions, { suggestions: isHandleAvailable.suggestions, onSelect: suggestion => {
                                                setDraftValue(suggestion.handle.slice(0, state.userDomain.length * -1));
                                                logger.metric('signup:handleSuggestionSelected', {
                                                    method: suggestion.method,
                                                });
                                            } }))] })), (!validCheck.handleChars || !validCheck.hyphenStartOrEnd) && (_jsx(Requirement, { children: !validCheck.hyphenStartOrEnd ? (_jsx(RequirementText, { children: _jsx(Trans, { children: "Username cannot begin or end with a hyphen" }) })) : (_jsx(RequirementText, { children: _jsx(Trans, { children: "Username must only contain letters (a-z), numbers, and hyphens" }) })) })), _jsx(Requirement, { children: (!validCheck.frontLengthNotTooLong ||
                                        !validCheck.totalLength) && (_jsx(RequirementText, { children: _jsxs(Trans, { children: ["Username cannot be longer than", ' ', _jsx(Plural, { value: MAX_SERVICE_HANDLE_LENGTH, other: "# characters" })] }) })) })] }) })] }), _jsx(Animated.View, { layout: native(LinearTransition), children: _jsx(BackNextButtons, { isLoading: isNextLoading, isNextDisabled: isNextDisabled, onBackPress: onBackPress, onNextPress: onNextPress }) })] }));
}
function Requirement({ children }) {
    return (_jsx(Animated.View, { style: [a.w_full], layout: native(LinearTransition), entering: native(FadeIn), exiting: native(FadeOut), children: children }));
}
function RequirementText({ children }) {
    const t = useTheme();
    return (_jsx(Text, { style: [a.text_sm, a.flex_1, { color: t.palette.negative_500 }], children: children }));
}
//# sourceMappingURL=index.js.map