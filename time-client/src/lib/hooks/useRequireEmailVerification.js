import { useCallback } from 'react';
import { Keyboard } from 'react-native';
import { useEmail } from '#/state/email-verification';
import { useRequireAuth, useSession } from '#/state/session';
import { useCloseAllActiveElements } from '#/state/util';
import { EmailDialogScreenID, useEmailDialogControl, } from '#/components/dialogs/EmailDialog';
export function useRequireEmailVerification() {
    const { currentAccount } = useSession();
    const { needsEmailVerification } = useEmail();
    const requireAuth = useRequireAuth();
    const emailDialogControl = useEmailDialogControl();
    const closeAll = useCloseAllActiveElements();
    return useCallback((cb, config = {}) => {
        return (...args) => {
            if (!currentAccount) {
                return requireAuth(() => cb(...args));
            }
            if (needsEmailVerification) {
                Keyboard.dismiss();
                closeAll();
                emailDialogControl.open({
                    id: EmailDialogScreenID.Verify,
                    ...config,
                });
                return undefined;
            }
            else {
                return cb(...args);
            }
        };
    }, [
        needsEmailVerification,
        currentAccount,
        emailDialogControl,
        closeAll,
        requireAuth,
    ]);
}
//# sourceMappingURL=useRequireEmailVerification.js.map