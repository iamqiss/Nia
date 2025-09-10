import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useMemo } from 'react';
import { BSKY_SERVICE } from '#/lib/constants';
import { getHostnameFromUrl } from '#/lib/strings/url-helpers';
import { STALE } from '#/state/queries';
import { useProfileQuery } from '#/state/queries/profile';
import { useCheckEmailConfirmed } from '#/state/service-config';
import { useSession } from '#/state/session';
const EmailVerificationContext = createContext(null);
EmailVerificationContext.displayName = 'EmailVerificationContext';
export function Provider({ children }) {
    const { currentAccount } = useSession();
    const { data: profile } = useProfileQuery({
        did: currentAccount?.did,
        staleTime: STALE.INFINITY,
    });
    const checkEmailConfirmed = useCheckEmailConfirmed();
    // Date set for 11 AM PST on the 18th of November
    const isNewEnough = !!profile?.createdAt &&
        Date.parse(profile.createdAt) >= Date.parse('2024-11-18T19:00:00.000Z');
    const isSelfHost = currentAccount &&
        getHostnameFromUrl(currentAccount.service) !==
            getHostnameFromUrl(BSKY_SERVICE);
    const needsEmailVerification = !isSelfHost &&
        checkEmailConfirmed &&
        !currentAccount?.emailConfirmed &&
        isNewEnough;
    const value = useMemo(() => ({ needsEmailVerification }), [needsEmailVerification]);
    return (_jsx(EmailVerificationContext.Provider, { value: value, children: children }));
}
Provider.displayName = 'EmailVerificationProvider';
export function useEmail() {
    const ctx = useContext(EmailVerificationContext);
    if (!ctx) {
        throw new Error('useEmail must be used within a EmailVerificationProvider');
    }
    return ctx;
}
//# sourceMappingURL=email-verification.js.map