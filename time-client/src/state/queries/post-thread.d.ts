import { type AppBskyActorDefs, AppBskyFeedDefs, AppBskyFeedPost, type ModerationDecision, type ModerationOpts } from '@atproto/api';
import { type QueryClient } from '@tanstack/react-query';
import { type UsePreferencesQueryResponse } from '#/state/queries/preferences/types';
export declare const RQKEY_ROOT = "post-thread";
export declare const RQKEY: (uri: string) => string[];
export interface ThreadCtx {
    depth: number;
    isHighlightedPost?: boolean;
    hasMore?: boolean;
    isParentLoading?: boolean;
    isChildLoading?: boolean;
    isSelfThread?: boolean;
    hasMoreSelfThread?: boolean;
}
export type ThreadPost = {
    type: 'post';
    _reactKey: string;
    uri: string;
    post: AppBskyFeedDefs.PostView;
    record: AppBskyFeedPost.Record;
    parent: ThreadNode | undefined;
    replies: ThreadNode[] | undefined;
    hasOPLike: boolean | undefined;
    ctx: ThreadCtx;
};
export type ThreadNotFound = {
    type: 'not-found';
    _reactKey: string;
    uri: string;
    ctx: ThreadCtx;
};
export type ThreadBlocked = {
    type: 'blocked';
    _reactKey: string;
    uri: string;
    ctx: ThreadCtx;
};
export type ThreadUnknown = {
    type: 'unknown';
    uri: string;
};
export type ThreadNode = ThreadPost | ThreadNotFound | ThreadBlocked | ThreadUnknown;
export type ThreadModerationCache = WeakMap<ThreadNode, ModerationDecision>;
export type PostThreadQueryData = {
    thread: ThreadNode;
    threadgate?: AppBskyFeedDefs.ThreadgateView;
};
export declare function usePostThreadQuery(uri: string | undefined): any;
export declare function fillThreadModerationCache(cache: ThreadModerationCache, node: ThreadNode, moderationOpts: ModerationOpts): void;
export declare function sortThread(node: ThreadNode, opts: UsePreferencesQueryResponse['threadViewPrefs'], modCache: ThreadModerationCache, currentDid: string | undefined, justPostedUris: Set<string>, threadgateRecordHiddenReplies: Set<string>, fetchedAtCache: Map<string, number>, fetchedAt: number, randomCache: Map<string, number>): ThreadNode;
export declare function findAllPostsInQueryData(queryClient: QueryClient, uri: string): Generator<ThreadNode, void>;
export declare function findAllProfilesInQueryData(queryClient: QueryClient, did: string): Generator<AppBskyActorDefs.ProfileViewBasic, void>;
//# sourceMappingURL=post-thread.d.ts.map