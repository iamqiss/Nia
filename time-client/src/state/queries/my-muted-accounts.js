import {} from '@atproto/api';
import { useInfiniteQuery, } from '@tanstack/react-query';
import { useAgent } from '#/state/session';
const RQKEY_ROOT = 'my-muted-accounts';
export const RQKEY = () => [RQKEY_ROOT];
export function useMyMutedAccountsQuery() {
    const agent = useAgent();
    return useInfiniteQuery({
        queryKey: RQKEY(),
        async queryFn({ pageParam }) {
            const res = await agent.app.bsky.graph.getMutes({
                limit: 30,
                cursor: pageParam,
            });
            return res.data;
        },
        initialPageParam: undefined,
        getNextPageParam: lastPage => lastPage.cursor,
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
            for (const mute of page.mutes) {
                if (mute.did === did) {
                    yield mute;
                }
            }
        }
    }
}
//# sourceMappingURL=my-muted-accounts.js.map