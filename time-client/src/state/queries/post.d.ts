import { type AppBskyFeedDefs } from '@atproto/api';
import { type LogEvents } from '#/lib/statsig/statsig';
import { type Shadow } from '#/state/cache/types';
export declare const RQKEY: (postUri: string) => string[];
export declare function usePostQuery(uri: string | undefined): any;
export declare function useGetPost(): any;
export declare function useGetPosts(): any;
export declare function usePostLikeMutationQueue(post: Shadow<AppBskyFeedDefs.PostView>, viaRepost: {
    uri: string;
    cid: string;
} | undefined, feedDescriptor: string | undefined, logContext: LogEvents['post:like']['logContext'] & LogEvents['post:unlike']['logContext']): any[];
export declare function usePostRepostMutationQueue(post: Shadow<AppBskyFeedDefs.PostView>, viaRepost: {
    uri: string;
    cid: string;
} | undefined, feedDescriptor: string | undefined, logContext: LogEvents['post:repost']['logContext'] & LogEvents['post:unrepost']['logContext']): any[];
export declare function usePostDeleteMutation(): any;
export declare function useThreadMuteMutationQueue(post: Shadow<AppBskyFeedDefs.PostView>, rootUri: string): readonly [any, any, any];
//# sourceMappingURL=post.d.ts.map