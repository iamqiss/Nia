import {} from '@atproto/api';
import { useInfiniteQuery, } from '@tanstack/react-query';
import { useAgent } from '#/state/session';
export const bookmarksQueryKeyRoot = 'bookmarks';
export const createBookmarksQueryKey = () => [bookmarksQueryKeyRoot];
export function useBookmarksQuery() {
    const agent = useAgent();
    return useInfiniteQuery({
        queryKey: createBookmarksQueryKey(),
        async queryFn({ pageParam }) {
            const res = await agent.app.bsky.bookmark.getBookmarks({
                cursor: pageParam,
            });
            return res.data;
        },
        initialPageParam: undefined,
        getNextPageParam: lastPage => lastPage.cursor,
    });
}
export async function truncateAndInvalidate(qc) {
    qc.setQueriesData({ queryKey: [bookmarksQueryKeyRoot] }, data => {
        if (data) {
            return {
                pageParams: data.pageParams.slice(0, 1),
                pages: data.pages.slice(0, 1),
            };
        }
        return data;
    });
    return qc.invalidateQueries({ queryKey: [bookmarksQueryKeyRoot] });
}
export async function optimisticallySaveBookmark(qc, post) {
    qc.setQueriesData({
        queryKey: [bookmarksQueryKeyRoot],
    }, data => {
        if (!data)
            return data;
        return {
            ...data,
            pages: data.pages.map((page, index) => {
                if (index === 0) {
                    post.$type = 'app.bsky.feed.defs#postView';
                    return {
                        ...page,
                        bookmarks: [
                            {
                                createdAt: new Date().toISOString(),
                                subject: {
                                    uri: post.uri,
                                    cid: post.cid,
                                },
                                item: post,
                            },
                            ...page.bookmarks,
                        ],
                    };
                }
                return page;
            }),
        };
    });
}
export async function optimisticallyDeleteBookmark(qc, { uri }) {
    qc.setQueriesData({
        queryKey: [bookmarksQueryKeyRoot],
    }, data => {
        if (!data)
            return data;
        return {
            ...data,
            pages: data.pages.map(page => {
                return {
                    ...page,
                    bookmarks: page.bookmarks.filter(b => b.subject.uri !== uri),
                };
            }),
        };
    });
}
//# sourceMappingURL=useBookmarksQuery.js.map