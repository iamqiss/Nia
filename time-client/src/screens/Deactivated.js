import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useFocusEffect } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useAccountSwitcher } from '#/lib/hooks/useAccountSwitcher';
import { logger } from '#/logger';
import { isWeb } from '#/platform/detection';
import { useAgent, useSession, useSessionApi, } from '#/state/session';
import { useSetMinimalShellMode } from '#/state/shell';
import { useLoggedOutViewControls } from '#/state/shell/logged-out';
import { Logo } from '#/view/icons/Logo';
import { atoms as a, useTheme } from '#/alf';
import { AccountList } from '#/components/AccountList';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import { Divider } from '#/components/Divider';
import { CircleInfo_Stroke2_Corner0_Rounded as CircleInfo } from '#/components/icons/CircleInfo';
import * as Layout from '#/components/Layout';
import { Loader } from '#/components/Loader';
import { Text } from '#/components/Typography';
const COL_WIDTH = 400;
export function Deactivated() {
    const { _ } = useLingui();
    const t = useTheme();
    const insets = useSafeAreaInsets();
    const { currentAccount, accounts } = useSession();
    const { onPressSwitchAccount, pendingDid } = useAccountSwitcher();
    const { setShowLoggedOut } = useLoggedOutViewControls();
    const hasOtherAccounts = accounts.length > 1;
    const setMinimalShellMode = useSetMinimalShellMode();
    const { logoutCurrentAccount } = useSessionApi();
    const agent = useAgent();
    const [pending, setPending] = React.useState(false);
    const [error, setError] = React.useState();
    const queryClient = useQueryClient();
    useFocusEffect(React.useCallback(() => {
        setMinimalShellMode(true);
    }, [setMinimalShellMode]));
    const onSelectAccount = React.useCallback((account) => {
        if (account.did !== currentAccount?.did) {
            onPressSwitchAccount(account, 'SwitchAccount');
        }
    }, [currentAccount, onPressSwitchAccount]);
    const onPressAddAccount = React.useCallback(() => {
        setShowLoggedOut(true);
    }, [setShowLoggedOut]);
    const onPressLogout = React.useCallback(() => {
        if (isWeb) {
            // We're switching accounts, which remounts the entire app.
            // On mobile, this gets us Home, but on the web we also need reset the URL.
            // We can't change the URL via a navigate() call because the navigator
            // itself is about to unmount, and it calls pushState() too late.
            // So we change the URL ourselves. The navigator will pick it up on remount.
            history.pushState(null, '', '/');
        }
        logoutCurrentAccount('Deactivated');
    }, [logoutCurrentAccount]);
    const handleActivate = React.useCallback(async () => {
        try {
            setPending(true);
            await agent.com.atproto.server.activateAccount();
            await queryClient.resetQueries();
            await agent.resumeSession(agent.session);
        }
        catch (e) {
            switch (e.message) {
                case 'Bad token scope':
                    setError(_(msg `You're signed in with an App Password. Please sign in with your main password to continue deactivating your account.`));
                    break;
                default:
                    setError(_(msg `Something went wrong, please try again`));
                    break;
            }
            logger.error(e, {
                message: 'Failed to activate account',
            });
        }
        finally {
            setPending(false);
        }
    }, [_, agent, setPending, setError, queryClient]);
    return (_jsx(View, { style: [a.util_screen_outer, a.flex_1], children: _jsx(Layout.Content, { ignoreTabletLayoutOffset: true, contentContainerStyle: [
                a.px_2xl,
                {
                    paddingTop: isWeb ? 64 : insets.top + 16,
                    paddingBottom: isWeb ? 64 : insets.bottom,
                },
            ], children: _jsxs(View, { style: [a.w_full, { marginHorizontal: 'auto', maxWidth: COL_WIDTH }], children: [_jsx(View, { style: [a.w_full, a.justify_center, a.align_center, a.pb_5xl], children: _jsx(Logo, { width: 40 }) }), _jsxs(View, { style: [a.gap_xs, a.pb_3xl], children: [_jsx(Text, { style: [a.text_xl, a.font_bold, a.leading_snug], children: _jsx(Trans, { children: "Welcome back!" }) }), _jsx(Text, { style: [a.text_sm, a.leading_snug], children: _jsxs(Trans, { children: ["You previously deactivated @", currentAccount?.handle, "."] }) }), _jsx(Text, { style: [a.text_sm, a.leading_snug, a.pb_md], children: _jsx(Trans, { children: "You can reactivate your account to continue logging in. Your profile and posts will be visible to other users." }) }), _jsxs(View, { style: [a.gap_sm], children: [_jsxs(Button, { label: _(msg `Reactivate your account`), size: "large", variant: "solid", color: "primary", onPress: handleActivate, children: [_jsx(ButtonText, { children: _jsx(Trans, { children: "Yes, reactivate my account" }) }), pending && _jsx(ButtonIcon, { icon: Loader, position: "right" })] }), _jsx(Button, { label: _(msg `Cancel reactivation and sign out`), size: "large", variant: "solid", color: "secondary", onPress: onPressLogout, children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Cancel" }) }) })] }), error && (_jsxs(View, { style: [
                                    a.flex_row,
                                    a.gap_sm,
                                    a.mt_md,
                                    a.p_md,
                                    a.rounded_sm,
                                    t.atoms.bg_contrast_25,
                                ], children: [_jsx(CircleInfo, { size: "md", fill: t.palette.negative_400 }), _jsx(Text, { style: [a.flex_1, a.leading_snug], children: error })] }))] }), _jsx(View, { style: [a.pb_3xl], children: _jsx(Divider, {}) }), hasOtherAccounts ? (_jsxs(_Fragment, { children: [_jsx(Text, { style: [t.atoms.text_contrast_medium, a.pb_md, a.leading_snug], children: _jsx(Trans, { children: "Or, sign in to one of your other accounts." }) }), _jsx(AccountList, { onSelectAccount: onSelectAccount, onSelectOther: onPressAddAccount, otherLabel: _(msg `Add account`), pendingDid: pendingDid })] })) : (_jsxs(_Fragment, { children: [_jsx(Text, { style: [t.atoms.text_contrast_medium, a.pb_md, a.leading_snug], children: _jsx(Trans, { children: "Or, continue with another account." }) }), _jsx(Button, { label: _(msg `Sign in or create an account`), size: "large", variant: "solid", color: "secondary", onPress: () => setShowLoggedOut(true), children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Sign in or create an account" }) }) })] }))] }) }) }));
}
//# sourceMappingURL=Deactivated.js.map