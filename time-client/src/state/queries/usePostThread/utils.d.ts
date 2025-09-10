import { type AppBskyFeedDefs, AppBskyFeedPost, type AppBskyUnspeccedGetPostThreadV2 } from '@atproto/api';
import { type ApiThreadItem, type ThreadItem, type TraversalMetadata } from '#/state/queries/usePostThread/types';
export declare function getThreadgateRecord(view: AppBskyUnspeccedGetPostThreadV2.OutputSchema['threadgate']): any;
export declare function getRootPostAtUri(post: AppBskyFeedDefs.PostView): any;
export declare function getPostRecord(post: AppBskyFeedDefs.PostView): AppBskyFeedPost.Record;
export declare function getTraversalMetadata({ item, prevItem, nextItem, parentMetadata, }: {
    item: ApiThreadItem;
    prevItem?: ApiThreadItem;
    nextItem?: ApiThreadItem;
    parentMetadata?: TraversalMetadata;
}): TraversalMetadata;
export declare function storeTraversalMetadata(metadatas: Map<string, TraversalMetadata>, metadata: TraversalMetadata): void;
export declare function getThreadPostUI({ depth, repliesCount, prevItemDepth, isLastChild, skippedIndentIndices, repliesSeenCounter, repliesUnhydrated, precedesChildReadMore, followsReadMoreUp, }: TraversalMetadata): Extract<ThreadItem, {
    type: 'threadPost';
}>['ui'];
export declare function getThreadPostNoUnauthenticatedUI({ depth, prevItemDepth, }: {
    depth: number;
    prevItemDepth?: number;
    nextItemDepth?: number;
}): Extract<ThreadItem, {
    type: 'threadPostNoUnauthenticated';
}>['ui'];
//# sourceMappingURL=utils.d.ts.map