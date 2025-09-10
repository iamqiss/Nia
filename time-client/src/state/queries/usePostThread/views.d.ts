import { type $Typed, type AppBskyFeedDefs, type AppBskyUnspeccedDefs, type AppBskyUnspeccedGetPostThreadV2, type ModerationOpts } from '@atproto/api';
import { type ApiThreadItem, type ThreadItem, type TraversalMetadata } from '#/state/queries/usePostThread/types';
export declare function threadPostNoUnauthenticated({ uri, depth, value, }: ApiThreadItem): Extract<ThreadItem, {
    type: 'threadPostNoUnauthenticated';
}>;
export declare function threadPostNotFound({ uri, depth, value, }: ApiThreadItem): Extract<ThreadItem, {
    type: 'threadPostNotFound';
}>;
export declare function threadPostBlocked({ uri, depth, value, }: ApiThreadItem): Extract<ThreadItem, {
    type: 'threadPostBlocked';
}>;
export declare function threadPost({ uri, depth, value, moderationOpts, threadgateHiddenReplies, }: {
    uri: string;
    depth: number;
    value: $Typed<AppBskyUnspeccedDefs.ThreadItemPost>;
    moderationOpts: ModerationOpts;
    threadgateHiddenReplies: Set<string>;
}): Extract<ThreadItem, {
    type: 'threadPost';
}>;
export declare function readMore({ depth, repliesUnhydrated, skippedIndentIndices, postData, }: TraversalMetadata): Extract<ThreadItem, {
    type: 'readMore';
}>;
export declare function readMoreUp({ postData, }: TraversalMetadata): Extract<ThreadItem, {
    type: 'readMoreUp';
}>;
export declare function skeleton({ key, item, }: Omit<Extract<ThreadItem, {
    type: 'skeleton';
}>, 'type'>): Extract<ThreadItem, {
    type: 'skeleton';
}>;
export declare function postViewToThreadPlaceholder(post: AppBskyFeedDefs.PostView): $Typed<Omit<AppBskyUnspeccedGetPostThreadV2.ThreadItem, 'value'> & {
    value: $Typed<AppBskyUnspeccedDefs.ThreadItemPost>;
}>;
//# sourceMappingURL=views.d.ts.map