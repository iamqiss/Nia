import {} from '@atproto/api';
import { useInfiniteQuery, } from '@tanstack/react-query';
import { useAgent } from '#/state/session';
const PAGE_SIZE = 30;
// TODO refactor invalidate on mutate?
const RQKEY_ROOT = 'post-reposted-by';
export const RQKEY = (resolvedUri) => [RQKEY_ROOT, resolvedUri];
export function usePostRepostedByQuery(resolvedUri) {
    const agent = useAgent();
    return useInfiniteQuery({
        queryKey: RQKEY(resolvedUri || ''),
        async queryFn({ pageParam }) {
            const res = await agent.getRepostedBy({
                uri: resolvedUri || '',
                limit: PAGE_SIZE,
                cursor: pageParam,
            });
            return res.data;
        },
        initialPageParam: undefined,
        getNextPageParam: lastPage => lastPage.cursor,
        enabled: !!resolvedUri,
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
            for (const repostedBy of page.repostedBy) {
                if (repostedBy.did === did) {
                    yield repostedBy;
                }
            }
        }
    }
}
//# sourceMappingURL=post-reposted-by.js.map