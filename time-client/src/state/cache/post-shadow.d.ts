import { AppBskyEmbedRecord, AppBskyEmbedRecordWithMedia, type AppBskyFeedDefs } from '@atproto/api';
import { type QueryClient } from '@tanstack/react-query';
import { type Shadow } from './types';
export type { Shadow } from './types';
export interface PostShadow {
    likeUri: string | undefined;
    repostUri: string | undefined;
    isDeleted: boolean;
    embed: AppBskyEmbedRecord.View | AppBskyEmbedRecordWithMedia.View | undefined;
    pinned: boolean;
    optimisticReplyCount: number | undefined;
    bookmarked: boolean | undefined;
}
export declare const POST_TOMBSTONE: unique symbol;
/**
 * Use with caution! This function returns the raw shadow data for a post.
 * Prefer using `usePostShadow`.
 */
export declare function dangerousGetPostShadow(post: AppBskyFeedDefs.PostView): Partial<PostShadow> | undefined;
export declare function usePostShadow(post: AppBskyFeedDefs.PostView): Shadow<AppBskyFeedDefs.PostView> | typeof POST_TOMBSTONE;
export declare function updatePostShadow(queryClient: QueryClient, uri: string, value: Partial<PostShadow>): void;
//# sourceMappingURL=post-shadow.d.ts.map