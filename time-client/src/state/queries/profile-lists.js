import { moderateUserList } from '@atproto/api';
import { useInfiniteQuery, } from '@tanstack/react-query';
import { useAgent } from '#/state/session';
import { useModerationOpts } from '../preferences/moderation-opts';
const PAGE_SIZE = 30;
export const RQKEY_ROOT = 'profile-lists';
export const RQKEY = (did) => [RQKEY_ROOT, did];
export function useProfileListsQuery(did, opts) {
    const moderationOpts = useModerationOpts();
    const enabled = opts?.enabled !== false && Boolean(moderationOpts);
    const agent = useAgent();
    return useInfiniteQuery({
        queryKey: RQKEY(did),
        async queryFn({ pageParam }) {
            const res = await agent.app.bsky.graph.getLists({
                actor: did,
                limit: PAGE_SIZE,
                cursor: pageParam,
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
                        lists: page.lists.filter(list => {
                            const decision = moderateUserList(list, moderationOpts);
                            return !decision.ui('contentList').filter;
                        }),
                    };
                }),
            };
        },
    });
}
//# sourceMappingURL=profile-lists.js.map