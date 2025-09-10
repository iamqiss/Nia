import {} from '@atproto/api';
import { useMutation, useQuery, useQueryClient, } from '@tanstack/react-query';
import { DM_SERVICE_HEADERS } from '#/lib/constants';
import { STALE } from '#/state/queries';
import { useOnMarkAsRead } from '#/state/queries/messages/list-conversations';
import { useAgent } from '#/state/session';
import { getConvoFromQueryData, RQKEY_ROOT as LIST_CONVOS_KEY, } from './list-conversations';
const RQKEY_ROOT = 'convo';
export const RQKEY = (convoId) => [RQKEY_ROOT, convoId];
export function useConvoQuery(convo) {
    const agent = useAgent();
    return useQuery({
        queryKey: RQKEY(convo.id),
        queryFn: async () => {
            const { data } = await agent.chat.bsky.convo.getConvo({ convoId: convo.id }, { headers: DM_SERVICE_HEADERS });
            return data.convo;
        },
        initialData: convo,
        staleTime: STALE.INFINITY,
    });
}
export function precacheConvoQuery(queryClient, convo) {
    queryClient.setQueryData(RQKEY(convo.id), convo);
}
export function useMarkAsReadMutation() {
    const optimisticUpdate = useOnMarkAsRead();
    const queryClient = useQueryClient();
    const agent = useAgent();
    return useMutation({
        mutationFn: async ({ convoId, messageId, }) => {
            if (!convoId)
                throw new Error('No convoId provided');
            await agent.api.chat.bsky.convo.updateRead({
                convoId,
                messageId,
            }, {
                encoding: 'application/json',
                headers: DM_SERVICE_HEADERS,
            });
        },
        onMutate({ convoId }) {
            if (!convoId)
                throw new Error('No convoId provided');
            optimisticUpdate(convoId);
        },
        onSuccess(_, { convoId }) {
            if (!convoId)
                return;
            queryClient.setQueriesData({ queryKey: [LIST_CONVOS_KEY] }, (old) => {
                if (!old)
                    return old;
                const existingConvo = getConvoFromQueryData(convoId, old);
                if (existingConvo) {
                    return {
                        ...old,
                        pages: old.pages.map(page => {
                            return {
                                ...page,
                                convos: page.convos.map(convo => {
                                    if (convo.id === convoId) {
                                        return {
                                            ...convo,
                                            unreadCount: 0,
                                        };
                                    }
                                    return convo;
                                }),
                            };
                        }),
                    };
                }
                else {
                    // If we somehow marked a convo as read that doesn't exist in the
                    // list, then we don't need to do anything.
                }
            });
        },
    });
}
//# sourceMappingURL=conversation.js.map