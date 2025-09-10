import { useMutation } from '@tanstack/react-query';
import { useAgent, useSession } from '#/state/session';
export function useManageEmail2FA() {
    const agent = useAgent();
    const { currentAccount } = useSession();
    return useMutation({
        mutationFn: async ({ enabled, token, }) => {
            if (!currentAccount?.email) {
                throw new Error('No email found for the current account');
            }
            await agent.com.atproto.server.updateEmail({
                email: currentAccount.email,
                emailAuthFactor: enabled,
                token,
            });
            // will update session state at root of app
            await agent.resumeSession(agent.session);
        },
    });
}
//# sourceMappingURL=useManageEmail2FA.js.map