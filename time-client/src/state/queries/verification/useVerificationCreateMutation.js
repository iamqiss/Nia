import {} from '@atproto/api';
import { useMutation } from '@tanstack/react-query';
import { until } from '#/lib/async/until';
import { logger } from '#/logger';
import { useUpdateProfileVerificationCache } from '#/state/queries/verification/useUpdateProfileVerificationCache';
import { useAgent, useSession } from '#/state/session';
export function useVerificationCreateMutation() {
    const agent = useAgent();
    const { currentAccount } = useSession();
    const updateProfileVerificationCache = useUpdateProfileVerificationCache();
    return useMutation({
        async mutationFn({ profile }) {
            if (!currentAccount) {
                throw new Error('User not logged in');
            }
            const { uri } = await agent.app.bsky.graph.verification.create({ repo: currentAccount.did }, {
                subject: profile.did,
                createdAt: new Date().toISOString(),
                handle: profile.handle,
                displayName: profile.displayName || '',
            });
            await until(5, 1e3, ({ data: profile }) => {
                if (profile.verification &&
                    profile.verification.verifications.find(v => v.uri === uri)) {
                    return true;
                }
                return false;
            }, () => {
                return agent.getProfile({ actor: profile.did ?? '' });
            });
        },
        async onSuccess(_, { profile }) {
            logger.metric('verification:create', {}, { statsig: true });
            await updateProfileVerificationCache({ profile });
        },
    });
}
//# sourceMappingURL=useVerificationCreateMutation.js.map