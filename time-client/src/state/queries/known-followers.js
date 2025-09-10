import {} from '@atproto/api';
import { useInfiniteQuery, } from '@tanstack/react-query';
import { useAgent } from '#/state/session';
const PAGE_SIZE = 50;
const RQKEY_ROOT = 'profile-known-followers';
export const RQKEY = (did) => [RQKEY_ROOT, did];
export function useProfileKnownFollowersQuery(did) {
    const agent = useAgent();
    return useInfiniteQuery({
        queryKey: RQKEY(did || ''),
        async queryFn({ pageParam }) {
            const res = await agent.app.bsky.graph.getKnownFollowers({
                actor: did,
                limit: PAGE_SIZE,
                cursor: pageParam,
            });
            return res.data;
        },
        initialPageParam: undefined,
        getNextPageParam: lastPage => lastPage.cursor,
        enabled: !!did,
    });
}
export function* findAllProfilesInQueryData(queryClient, did) {
    const queryDatas = queryClient.getQueriesData({
        queryKey: [RQKEY_ROOT],
    });
    for (const [_queryKey, queryData] of queryDatas) {
        if (!queryData?.pages) {
            continue;
        }
        for (const page of queryData?.pages) {
            for (const follow of page.followers) {
                if (follow.did === did) {
                    yield follow;
                }
            }
        }
    }
}
//# sourceMappingURL=known-followers.js.map