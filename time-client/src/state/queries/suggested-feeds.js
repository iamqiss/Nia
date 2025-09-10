import {} from '@atproto/api';
import { useInfiniteQuery, } from '@tanstack/react-query';
import { STALE } from '#/state/queries';
import { useAgent } from '#/state/session';
const suggestedFeedsQueryKeyRoot = 'suggestedFeeds';
export const suggestedFeedsQueryKey = [suggestedFeedsQueryKeyRoot];
export function useSuggestedFeedsQuery() {
    const agent = useAgent();
    return useInfiniteQuery({
        staleTime: STALE.HOURS.ONE,
        queryKey: suggestedFeedsQueryKey,
        queryFn: async ({ pageParam }) => {
            const res = await agent.app.bsky.feed.getSuggestedFeeds({
                limit: 10,
                cursor: pageParam,
            });
            return res.data;
        },
        initialPageParam: undefined,
        getNextPageParam: lastPage => lastPage.cursor,
    });
}
//# sourceMappingURL=suggested-feeds.js.map