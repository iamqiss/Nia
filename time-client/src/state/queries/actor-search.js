import {} from '@atproto/api';
import { keepPreviousData, useInfiniteQuery, useQuery, } from '@tanstack/react-query';
import { STALE } from '#/state/queries';
import { useAgent } from '#/state/session';
const RQKEY_ROOT = 'actor-search';
export const RQKEY = (query) => [RQKEY_ROOT, query];
export const RQKEY_ROOT_PAGINATED = `${RQKEY_ROOT}_paginated`;
export const RQKEY_PAGINATED = (query, limit) => [
    RQKEY_ROOT_PAGINATED,
    query,
    limit,
];
export function useActorSearch({ query, enabled, }) {
    const agent = useAgent();
    return useQuery({
        staleTime: STALE.MINUTES.ONE,
        queryKey: RQKEY(query || ''),
        async queryFn() {
            const res = await agent.searchActors({
                q: query,
            });
            return res.data.actors;
        },
        enabled: enabled && !!query,
    });
}
export function useActorSearchPaginated({ query, enabled, maintainData, limit = 25, }) {
    const agent = useAgent();
    return useInfiniteQuery({
        staleTime: STALE.MINUTES.FIVE,
        queryKey: RQKEY_PAGINATED(query, limit),
        queryFn: async ({ pageParam }) => {
            const res = await agent.searchActors({
                q: query,
                limit,
                cursor: pageParam,
            });
            return res.data;
        },
        enabled: enabled && !!query,
        initialPageParam: undefined,
        getNextPageParam: lastPage => lastPage.cursor,
        placeholderData: maintainData ? keepPreviousData : undefined,
    });
}
export function* findAllProfilesInQueryData(queryClient, did) {
    const queryDatas = queryClient.getQueriesData({
        queryKey: [RQKEY_ROOT],
    });
    for (const [_queryKey, queryData] of queryDatas) {
        if (!queryData) {
            continue;
        }
        for (const actor of queryData) {
            if (actor.did === did) {
                yield actor;
            }
        }
    }
    const queryDatasPaginated = queryClient.getQueriesData({
        queryKey: [RQKEY_ROOT_PAGINATED],
    });
    for (const [_queryKey, queryData] of queryDatasPaginated) {
        if (!queryData) {
            continue;
        }
        for (const actor of queryData.pages.flatMap(page => page.actors)) {
            if (actor.did === did) {
                yield actor;
            }
        }
    }
}
//# sourceMappingURL=actor-search.js.map