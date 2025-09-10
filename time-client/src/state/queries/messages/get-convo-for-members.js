import {} from '@atproto/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DM_SERVICE_HEADERS } from '#/lib/constants';
import { logger } from '#/logger';
import { useAgent } from '#/state/session';
import { precacheConvoQuery } from './conversation';
export function useGetConvoForMembers({ onSuccess, onError, }) {
    const queryClient = useQueryClient();
    const agent = useAgent();
    return useMutation({
        mutationFn: async (members) => {
            const { data } = await agent.chat.bsky.convo.getConvoForMembers({ members: members }, { headers: DM_SERVICE_HEADERS });
            return data;
        },
        onSuccess: data => {
            precacheConvoQuery(queryClient, data.convo);
            onSuccess?.(data);
        },
        onError: error => {
            logger.error(error);
            onError?.(error);
        },
    });
}
//# sourceMappingURL=get-convo-for-members.js.map