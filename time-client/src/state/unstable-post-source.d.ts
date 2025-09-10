import { type AppBskyFeedDefs } from '@atproto/api';
import { type FeedSourceInfo } from '#/state/queries/feed';
export type PostSource = {
    post: AppBskyFeedDefs.FeedViewPost;
    feedSourceInfo?: FeedSourceInfo;
};
/**
 * For stashing the feed that the user was browsing when they clicked on a post.
 *
 * Used for FeedFeedback and other ephemeral non-critical systems.
 */
export declare function setUnstablePostSource(key: string, source: PostSource): void;
/**
 * This hook is unstable and should only be used for FeedFeedback and other
 * ephemeral non-critical systems. Views that use this hook will continue to
 * return a reference to the same source until those views are dropped from
 * memory.
 */
export declare function useUnstablePostSource(key: string): any;
/**
 * Builds a post source key. This (atm) is a URI where the `host` is the post
 * author's handle, not DID.
 */
export declare function buildPostSourceKey(key: string, handle: string): any;
//# sourceMappingURL=unstable-post-source.d.ts.map