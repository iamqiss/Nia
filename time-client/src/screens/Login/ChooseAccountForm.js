import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { logEvent } from '#/lib/statsig/statsig';
import { logger } from '#/logger';
import { useSession, useSessionApi } from '#/state/session';
import { useLoggedOutViewControls } from '#/state/shell/logged-out';
import * as Toast from '#/view/com/util/Toast';
import { atoms as a } from '#/alf';
import { AccountList } from '#/components/AccountList';
import { Button, ButtonText } from '#/components/Button';
import * as TextField from '#/components/forms/TextField';
import { FormContainer } from './FormContainer';
export const ChooseAccountForm = ({ onSelectAccount, onPressBack, }) => {
    const [pendingDid, setPendingDid] = React.useState(null);
    const { _ } = useLingui();
    const { currentAccount } = useSession();
    const { resumeSession } = useSessionApi();
    const { setShowLoggedOut } = useLoggedOutViewControls();
    const onSelect = React.useCallback(async (account) => {
        if (pendingDid) {
            // The session API isn't resilient to race conditions so let's just ignore this.
            return;
        }
        if (!account.accessJwt) {
            // Move to login form.
            onSelectAccount(account);
            return;
        }
        if (account.did === currentAccount?.did) {
            setShowLoggedOut(false);
            Toast.show(_(msg `Already signed in as @${account.handle}`));
            return;
        }
        try {
            setPendingDid(account.did);
            await resumeSession(account);
            logEvent('account:loggedIn', {
                logContext: 'ChooseAccountForm',
                withPassword: false,
            });
            Toast.show(_(msg `Signed in as @${account.handle}`));
        }
        catch (e) {
            logger.error('choose account: initSession failed', {
                message: e.message,
            });
            // Move to login form.
            onSelectAccount(account);
        }
        finally {
            setPendingDid(null);
        }
    }, [
        currentAccount,
        resumeSession,
        pendingDid,
        onSelectAccount,
        setShowLoggedOut,
        _,
    ]);
    return (_jsxs(FormContainer, { testID: "chooseAccountForm", titleText: _jsx(Trans, { children: "Select account" }), children: [_jsxs(View, { children: [_jsx(TextField.LabelText, { children: _jsx(Trans, { children: "Sign in as..." }) }), _jsx(AccountList, { onSelectAccount: onSelect, onSelectOther: () => onSelectAccount(), pendingDid: pendingDid })] }), _jsxs(View, { style: [a.flex_row], children: [_jsx(Button, { label: _(msg `Back`), variant: "solid", color: "secondary", size: "large", onPress: onPressBack, children: _jsx(ButtonText, { children: _(msg `Back`) }) }), _jsx(View, { style: [a.flex_1] })] })] }));
};
//# sourceMappingURL=ChooseAccountForm.js.map