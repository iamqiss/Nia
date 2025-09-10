import { AppBskyEmbedRecord, AtUri, } from '@atproto/api';
import { useInfiniteQuery, } from '@tanstack/react-query';
import { useAgent } from '#/state/session';
import { didOrHandleUriMatches, embedViewRecordToPostView, getEmbeddedPost, } from './util';
const PAGE_SIZE = 30;
const RQKEY_ROOT = 'post-quotes';
export const RQKEY = (resolvedUri) => [RQKEY_ROOT, resolvedUri];
export function usePostQuotesQuery(resolvedUri) {
    const agent = useAgent();
    return useInfiniteQuery({
        queryKey: RQKEY(resolvedUri || ''),
        async queryFn({ pageParam }) {
            const res = await agent.api.app.bsky.feed.getQuotes({
                uri: resolvedUri || '',
                limit: PAGE_SIZE,
                cursor: pageParam,
            });
            return res.data;
        },
        initialPageParam: undefined,
        getNextPageParam: lastPage => lastPage.cursor,
        enabled: !!resolvedUri,
        select: data => {
            return {
                ...data,
                pages: data.pages.map(page => {
                    return {
                        ...page,
                        posts: page.posts.filter(post => {
                            if (post.embed && AppBskyEmbedRecord.isView(post.embed)) {
                                if (AppBskyEmbedRecord.isViewDetached(post.embed.record)) {
                                    return false;
                                }
                            }
                            return true;
                        }),
                    };
                }),
            };
        },
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
            for (const item of page.posts) {
                if (item.author.did === did) {
                    yield item.author;
                }
                const quotedPost = getEmbeddedPost(item.embed);
                if (quotedPost?.author.did === did) {
                    yield quotedPost.author;
                }
            }
        }
    }
}
export function* findAllPostsInQueryData(queryClient, uri) {
    const queryDatas = queryClient.getQueriesData({
        queryKey: [RQKEY_ROOT],
    });
    const atUri = new AtUri(uri);
    for (const [_queryKey, queryData] of queryDatas) {
        if (!queryData?.pages) {
            continue;
        }
        for (const page of queryData?.pages) {
            for (const post of page.posts) {
                if (didOrHandleUriMatches(atUri, post)) {
                    yield post;
                }
                const quotedPost = getEmbeddedPost(post.embed);
                if (quotedPost && didOrHandleUriMatches(atUri, quotedPost)) {
                    yield embedViewRecordToPostView(quotedPost);
                }
            }
        }
    }
}
//# sourceMappingURL=post-quotes.js.map