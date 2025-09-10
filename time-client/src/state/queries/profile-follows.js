import {} from '@atproto/api';
import { useInfiniteQuery, } from '@tanstack/react-query';
import { STALE } from '#/state/queries';
import { useAgent } from '#/state/session';
const PAGE_SIZE = 30;
// TODO refactor invalidate on mutate?
const RQKEY_ROOT = 'profile-follows';
export const RQKEY = (did) => [RQKEY_ROOT, did];
export function useProfileFollowsQuery(did, { limit, } = {
    limit: PAGE_SIZE,
}) {
    const agent = useAgent();
    return useInfiniteQuery({
        staleTime: STALE.MINUTES.ONE,
        queryKey: RQKEY(did || ''),
        async queryFn({ pageParam }) {
            const res = await agent.app.bsky.graph.getFollows({
                actor: did || '',
                limit: limit || PAGE_SIZE,
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
            for (const follow of page.follows) {
                if (follow.did === did) {
                    yield follow;
                }
            }
        }
    }
}
//# sourceMappingURL=profile-follows.js.map