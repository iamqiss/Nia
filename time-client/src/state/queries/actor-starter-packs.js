import {} from '@atproto/api';
import { useInfiniteQuery, } from '@tanstack/react-query';
import { useAgent } from '#/state/session';
export const RQKEY_ROOT = 'actor-starter-packs';
export const RQKEY_WITH_MEMBERSHIP_ROOT = 'actor-starter-packs-with-membership';
export const RQKEY = (did) => [RQKEY_ROOT, did];
export const RQKEY_WITH_MEMBERSHIP = (did) => [
    RQKEY_WITH_MEMBERSHIP_ROOT,
    did,
];
export function useActorStarterPacksQuery({ did, enabled = true, }) {
    const agent = useAgent();
    return useInfiniteQuery({
        queryKey: RQKEY(did),
        queryFn: async ({ pageParam }) => {
            const res = await agent.app.bsky.graph.getActorStarterPacks({
                actor: did,
                limit: 10,
                cursor: pageParam,
            });
            return res.data;
        },
        enabled: Boolean(did) && enabled,
        initialPageParam: undefined,
        getNextPageParam: lastPage => lastPage.cursor,
    });
}
export function useActorStarterPacksWithMembershipsQuery({ did, enabled = true, }) {
    const agent = useAgent();
    return useInfiniteQuery({
        queryKey: RQKEY_WITH_MEMBERSHIP(did),
        queryFn: async ({ pageParam }) => {
            const res = await agent.app.bsky.graph.getStarterPacksWithMembership({
                actor: did,
                limit: 10,
                cursor: pageParam,
            });
            return res.data;
        },
        enabled: Boolean(did) && enabled,
        initialPageParam: undefined,
        getNextPageParam: lastPage => lastPage.cursor,
    });
}
export async function invalidateActorStarterPacksQuery({ queryClient, did, }) {
    await queryClient.invalidateQueries({ queryKey: RQKEY(did) });
}
export async function invalidateActorStarterPacksWithMembershipQuery({ queryClient, did, }) {
    await queryClient.invalidateQueries({ queryKey: RQKEY_WITH_MEMBERSHIP(did) });
}
//# sourceMappingURL=actor-starter-packs.js.map