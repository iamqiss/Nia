import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Trans } from '@lingui/macro';
import { useAccountEmailState } from '#/components/dialogs/EmailDialog/data/useAccountEmailState';
import { Disable } from '#/components/dialogs/EmailDialog/screens/Manage2FA/Disable';
import { Enable } from '#/components/dialogs/EmailDialog/screens/Manage2FA/Enable';
import { ScreenID, } from '#/components/dialogs/EmailDialog/types';
export function Manage2FA({ showScreen }) {
    const { isEmailVerified, email2FAEnabled } = useAccountEmailState();
    const [requestedAction, setRequestedAction] = useState(null);
    useEffect(() => {
        if (!isEmailVerified) {
            showScreen({
                id: ScreenID.Verify,
                instructions: [
                    _jsx(Trans, { children: "You need to verify your email address before you can enable email 2FA." }, "2fa"),
                ],
                onVerify: () => {
                    showScreen({
                        id: ScreenID.Manage2FA,
                    });
                },
            });
        }
    }, [isEmailVerified, showScreen]);
    /*
     * Wacky state handling so that once 2FA settings change, we don't show the
     * wrong step of this form - esb
     */
    if (email2FAEnabled) {
        if (!requestedAction) {
            setRequestedAction('disable');
            return _jsx(Disable, {});
        }
        if (requestedAction === 'disable') {
            return _jsx(Disable, {});
        }
        if (requestedAction === 'enable') {
            return _jsx(Enable, {});
        }
    }
    else {
        if (!requestedAction) {
            setRequestedAction('enable');
            return _jsx(Enable, {});
        }
        if (requestedAction === 'disable') {
            return _jsx(Disable, {});
        }
        if (requestedAction === 'enable') {
            return _jsx(Enable, {});
        }
    }
    // should never happen
    return null;
}
//# sourceMappingURL=index.js.map