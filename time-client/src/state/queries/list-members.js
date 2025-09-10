import {} from '@atproto/api';
import { useInfiniteQuery, useQuery, } from '@tanstack/react-query';
import { STALE } from '#/state/queries';
import { useAgent } from '#/state/session';
const PAGE_SIZE = 30;
const RQKEY_ROOT = 'list-members';
const RQKEY_ROOT_ALL = 'list-members-all';
export const RQKEY = (uri) => [RQKEY_ROOT, uri];
export const RQKEY_ALL = (uri) => [RQKEY_ROOT_ALL, uri];
export function useListMembersQuery(uri, limit = PAGE_SIZE) {
    const agent = useAgent();
    return useInfiniteQuery({
        staleTime: STALE.MINUTES.ONE,
        queryKey: RQKEY(uri ?? ''),
        async queryFn({ pageParam }) {
            const res = await agent.app.bsky.graph.getList({
                list: uri, // the enabled flag will prevent this from running until uri is set
                limit,
                cursor: pageParam,
            });
            return res.data;
        },
        initialPageParam: undefined,
        getNextPageParam: lastPage => lastPage.cursor,
        enabled: Boolean(uri),
    });
}
export function useAllListMembersQuery(uri) {
    const agent = useAgent();
    return useQuery({
        staleTime: STALE.MINUTES.ONE,
        queryKey: RQKEY_ALL(uri ?? ''),
        queryFn: async () => {
            return getAllListMembers(agent, uri);
        },
        enabled: Boolean(uri),
    });
}
export async function getAllListMembers(agent, uri) {
    let hasMore = true;
    let cursor;
    const listItems = [];
    // We want to cap this at 6 pages, just for anything weird happening with the api
    let i = 0;
    while (hasMore && i < 6) {
        const res = await agent.app.bsky.graph.getList({
            list: uri,
            limit: 50,
            cursor,
        });
        listItems.push(...res.data.items);
        hasMore = Boolean(res.data.cursor);
        cursor = res.data.cursor;
        i++;
    }
    return listItems;
}
export async function invalidateListMembersQuery({ queryClient, uri, }) {
    await queryClient.invalidateQueries({ queryKey: RQKEY(uri) });
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
            if (page.list.creator.did === did) {
                yield page.list.creator;
            }
            for (const item of page.items) {
                if (item.subject.did === did) {
                    yield item.subject;
                }
            }
        }
    }
    const allQueryData = queryClient.getQueriesData({
        queryKey: [RQKEY_ROOT_ALL],
    });
    for (const [_queryKey, queryData] of allQueryData) {
        if (!queryData) {
            continue;
        }
        for (const item of queryData) {
            if (item.subject.did === did) {
                yield item.subject;
            }
        }
    }
}
//# sourceMappingURL=list-members.js.map