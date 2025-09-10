import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Modal, ScrollView, View } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { msg, plural, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { logger } from '#/logger';
import { isIOS, isWeb } from '#/platform/detection';
import { isSignupQueued, useAgent, useSessionApi } from '#/state/session';
import { useOnboardingDispatch } from '#/state/shell';
import { Logo } from '#/view/icons/Logo';
import { atoms as a, native, useBreakpoints, useTheme, web } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import { Loader } from '#/components/Loader';
import { P, Text } from '#/components/Typography';
const COL_WIDTH = 400;
export function SignupQueued() {
    const { _ } = useLingui();
    const t = useTheme();
    const insets = useSafeAreaInsets();
    const { gtMobile } = useBreakpoints();
    const onboardingDispatch = useOnboardingDispatch();
    const { logoutCurrentAccount } = useSessionApi();
    const agent = useAgent();
    const [isProcessing, setProcessing] = React.useState(false);
    const [estimatedTime, setEstimatedTime] = React.useState(undefined);
    const [placeInQueue, setPlaceInQueue] = React.useState(undefined);
    const checkStatus = React.useCallback(async () => {
        setProcessing(true);
        try {
            const res = await agent.com.atproto.temp.checkSignupQueue();
            if (res.data.activated) {
                // ready to go, exchange the access token for a usable one and kick off onboarding
                await agent.sessionManager.refreshSession();
                if (!isSignupQueued(agent.session?.accessJwt)) {
                    onboardingDispatch({ type: 'start' });
                }
            }
            else {
                // not ready, update UI
                setEstimatedTime(msToString(res.data.estimatedTimeMs));
                if (typeof res.data.placeInQueue !== 'undefined') {
                    setPlaceInQueue(Math.max(res.data.placeInQueue, 1));
                }
            }
        }
        catch (e) {
            logger.error('Failed to check signup queue', { err: e.toString() });
        }
        finally {
            setProcessing(false);
        }
    }, [
        setProcessing,
        setEstimatedTime,
        setPlaceInQueue,
        onboardingDispatch,
        agent,
    ]);
    React.useEffect(() => {
        checkStatus();
        const interval = setInterval(checkStatus, 60e3);
        return () => clearInterval(interval);
    }, [checkStatus]);
    const checkBtn = (_jsxs(Button, { variant: "solid", color: "primary", size: "large", label: _(msg `Check my status`), onPress: checkStatus, disabled: isProcessing, children: [_jsx(ButtonText, { children: _jsx(Trans, { children: "Check my status" }) }), isProcessing && _jsx(ButtonIcon, { icon: Loader })] }));
    const logoutBtn = (_jsx(Button, { variant: "ghost", size: "large", color: "primary", label: _(msg `Sign out`), onPress: () => logoutCurrentAccount('SignupQueued'), children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Sign out" }) }) }));
    const webLayout = isWeb && gtMobile;
    return (_jsxs(Modal, { visible: true, animationType: native('slide'), presentationStyle: "formSheet", style: [web(a.util_screen_outer)], children: [isIOS && _jsx(SystemBars, { style: { statusBar: 'light' } }), _jsx(ScrollView, { style: [a.flex_1, t.atoms.bg], contentContainerStyle: { borderWidth: 0 }, bounces: false, children: _jsx(View, { style: [
                        a.flex_row,
                        a.justify_center,
                        gtMobile ? a.pt_4xl : [a.px_xl, a.pt_xl],
                    ], children: _jsxs(View, { style: [a.flex_1, { maxWidth: COL_WIDTH }], children: [_jsx(View, { style: [a.w_full, a.justify_center, a.align_center, a.my_4xl], children: _jsx(Logo, { width: 120 }) }), _jsx(Text, { style: [a.text_4xl, a.font_heavy, a.pb_sm], children: _jsx(Trans, { children: "You're in line" }) }), _jsx(P, { style: [t.atoms.text_contrast_medium], children: _jsx(Trans, { children: "There's been a rush of new users to Bluesky! We'll activate your account as soon as we can." }) }), _jsxs(View, { style: [
                                    a.rounded_sm,
                                    a.px_2xl,
                                    a.py_4xl,
                                    a.mt_2xl,
                                    a.mb_md,
                                    a.border,
                                    t.atoms.bg_contrast_25,
                                    t.atoms.border_contrast_medium,
                                ], children: [typeof placeInQueue === 'number' && (_jsx(Text, { style: [a.text_5xl, a.text_center, a.font_heavy, a.mb_2xl], children: placeInQueue })), _jsxs(P, { style: [a.text_center], children: [typeof placeInQueue === 'number' ? (_jsx(Trans, { children: "left to go." })) : (_jsx(Trans, { children: "You are in line." })), ' ', estimatedTime ? (_jsxs(Trans, { children: ["We estimate ", estimatedTime, " until your account is ready."] })) : (_jsx(Trans, { children: "We will let you know when your account is ready." }))] })] }), webLayout && (_jsxs(View, { style: [
                                    a.w_full,
                                    a.flex_row,
                                    a.justify_between,
                                    a.pt_5xl,
                                    { paddingBottom: 200 },
                                ], children: [logoutBtn, checkBtn] }))] }) }) }), !webLayout && (_jsx(View, { style: [
                    a.align_center,
                    t.atoms.bg,
                    gtMobile ? a.px_5xl : a.px_xl,
                    { paddingBottom: Math.max(insets.bottom, a.pb_5xl.paddingBottom) },
                ], children: _jsxs(View, { style: [a.w_full, a.gap_sm, { maxWidth: COL_WIDTH }], children: [checkBtn, logoutBtn] }) }))] }));
}
function msToString(ms) {
    if (ms && ms > 0) {
        const estimatedTimeMins = Math.ceil(ms / 60e3);
        if (estimatedTimeMins > 59) {
            const estimatedTimeHrs = Math.round(estimatedTimeMins / 60);
            if (estimatedTimeHrs > 6) {
                // dont even bother
                return undefined;
            }
            // hours
            return `${estimatedTimeHrs} ${plural(estimatedTimeHrs, {
                one: 'hour',
                other: 'hours',
            })}`;
        }
        // minutes
        return `${estimatedTimeMins} ${plural(estimatedTimeMins, {
            one: 'minute',
            other: 'minutes',
        })}`;
    }
    return undefined;
}
//# sourceMappingURL=SignupQueued.js.map