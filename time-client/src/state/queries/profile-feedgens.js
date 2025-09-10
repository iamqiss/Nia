import { moderateFeedGenerator, } from '@atproto/api';
import { useInfiniteQuery, } from '@tanstack/react-query';
import { useAgent } from '#/state/session';
import { useModerationOpts } from '../preferences/moderation-opts';
const PAGE_SIZE = 50;
// TODO refactor invalidate on mutate?
export const RQKEY_ROOT = 'profile-feedgens';
export const RQKEY = (did) => [RQKEY_ROOT, did];
export function useProfileFeedgensQuery(did, opts) {
    const moderationOpts = useModerationOpts();
    const enabled = opts?.enabled !== false && Boolean(moderationOpts);
    const agent = useAgent();
    return useInfiniteQuery({
        queryKey: RQKEY(did),
        async queryFn({ pageParam }) {
            const res = await agent.app.bsky.feed.getActorFeeds({
                actor: did,
                limit: PAGE_SIZE,
                cursor: pageParam,
            });
            res.data.feeds.sort((a, b) => {
                return (b.likeCount || 0) - (a.likeCount || 0);
            });
            return res.data;
        },
        initialPageParam: undefined,
        getNextPageParam: lastPage => lastPage.cursor,
        enabled,
        select(data) {
            return {
                ...data,
                pages: data.pages.map(page => {
                    return {
                        ...page,
                        feeds: page.feeds
                            // filter by labels
                            .filter(list => {
                            const decision = moderateFeedGenerator(list, moderationOpts);
                            return !decision.ui('contentList').filter;
                        }),
                    };
                }),
            };
        },
    });
}
//# sourceMappingURL=profile-feedgens.js.map