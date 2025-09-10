import { type AppBskyActorDefs, AppBskyFeedDefs, type AppBskyFeedPost, type ModerationDecision } from '@atproto/api';
import { type QueryClient } from '@tanstack/react-query';
import { type FeedAPI, type ReasonFeedSource } from '#/lib/api/feed/types';
import { FeedTuner } from '#/lib/api/feed-manip';
type ActorDid = string;
export type AuthorFilter = 'posts_with_replies' | 'posts_no_replies' | 'posts_and_author_threads' | 'posts_with_media' | 'posts_with_video';
type FeedUri = string;
type ListUri = string;
type PostsUriList = string;
export type FeedDescriptor = 'following' | `author|${ActorDid}|${AuthorFilter}` | `feedgen|${FeedUri}` | `likes|${ActorDid}` | `list|${ListUri}` | `posts|${PostsUriList}` | 'demo';
export interface FeedParams {
    mergeFeedEnabled?: boolean;
    mergeFeedSources?: string[];
    feedCacheKey?: 'discover' | 'explore' | undefined;
}
export declare const RQKEY_ROOT = "post-feed";
export declare function RQKEY(feedDesc: FeedDescriptor, params?: FeedParams): (string | FeedParams)[];
export interface FeedPostSliceItem {
    _reactKey: string;
    uri: string;
    post: AppBskyFeedDefs.PostView;
    record: AppBskyFeedPost.Record;
    moderation: ModerationDecision;
    parentAuthor?: AppBskyActorDefs.ProfileViewBasic;
    isParentBlocked?: boolean;
    isParentNotFound?: boolean;
}
export interface FeedPostSlice {
    _isFeedPostSlice: boolean;
    _reactKey: string;
    items: FeedPostSliceItem[];
    isIncompleteThread: boolean;
    isFallbackMarker: boolean;
    feedContext: string | undefined;
    reqId: string | undefined;
    feedPostUri: string;
    reason?: AppBskyFeedDefs.ReasonRepost | AppBskyFeedDefs.ReasonPin | ReasonFeedSource | {
        [k: string]: unknown;
        $type: string;
    };
}
export interface FeedPageUnselected {
    api: FeedAPI;
    cursor: string | undefined;
    feed: AppBskyFeedDefs.FeedViewPost[];
    fetchedAt: number;
}
export interface FeedPage {
    api: FeedAPI;
    tuner: FeedTuner;
    cursor: string | undefined;
    slices: FeedPostSlice[];
    fetchedAt: number;
}
export declare function usePostFeedQuery(feedDesc: FeedDescriptor, params?: FeedParams, opts?: {
    enabled?: boolean;
    ignoreFilterFor?: string;
}): any;
export declare function pollLatest(page: FeedPage | undefined): Promise<boolean | undefined>;
export declare function findAllPostsInQueryData(queryClient: QueryClient, uri: string): Generator<AppBskyFeedDefs.PostView, undefined>;
export declare function findAllProfilesInQueryData(queryClient: QueryClient, did: string): Generator<AppBskyActorDefs.ProfileViewBasic, undefined>;
export declare function resetPostsFeedQueries(queryClient: QueryClient, timeout?: number): void;
export declare function resetProfilePostsQueries(queryClient: QueryClient, did: string, timeout?: number): void;
export declare function isFeedPostSlice(v: any): v is FeedPostSlice;
export {};
//# sourceMappingURL=post-feed.d.ts.map