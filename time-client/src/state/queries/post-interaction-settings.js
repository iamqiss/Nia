import {} from '@atproto/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { preferencesQueryKey } from '#/state/queries/preferences';
import { useAgent } from '#/state/session';
export function usePostInteractionSettingsMutation() {
    const qc = useQueryClient();
    const agent = useAgent();
    return useMutation({
        async mutationFn(props) {
            await agent.setPostInteractionSettings(props);
        },
        async onSuccess() {
            await qc.invalidateQueries({
                queryKey: preferencesQueryKey,
            });
        },
    });
}
//# sourceMappingURL=post-interaction-settings.js.map