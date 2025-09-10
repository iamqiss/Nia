import {} from '@atproto/api';
import { useInfiniteQuery, } from '@tanstack/react-query';
import { useAgent } from '#/state/session';
const RQKEY_ROOT = 'my-blocked-accounts';
export const RQKEY = () => [RQKEY_ROOT];
export function useMyBlockedAccountsQuery() {
    const agent = useAgent();
    return useInfiniteQuery({
        queryKey: RQKEY(),
        async queryFn({ pageParam }) {
            const res = await agent.app.bsky.graph.getBlocks({
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
            for (const block of page.blocks) {
                if (block.did === did) {
                    yield block;
                }
            }
        }
    }
}
//# sourceMappingURL=my-blocked-accounts.js.map