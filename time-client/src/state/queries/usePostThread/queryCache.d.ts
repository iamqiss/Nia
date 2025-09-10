import { type $Typed, type AppBskyActorDefs, type AppBskyFeedDefs, AppBskyUnspeccedDefs, type AppBskyUnspeccedGetPostThreadV2 } from '@atproto/api';
import { type QueryClient } from '@tanstack/react-query';
import { type createPostThreadOtherQueryKey, type createPostThreadQueryKey, type PostThreadParams } from '#/state/queries/usePostThread/types';
export declare function createCacheMutator({ queryClient, postThreadQueryKey, postThreadOtherQueryKey, params, }: {
    queryClient: QueryClient;
    postThreadQueryKey: ReturnType<typeof createPostThreadQueryKey>;
    postThreadOtherQueryKey: ReturnType<typeof createPostThreadOtherQueryKey>;
    params: Pick<PostThreadParams, 'view'> & {
        below: number;
    };
}): {
    insertReplies(parentUri: string, replies: AppBskyUnspeccedGetPostThreadV2.ThreadItem[]): void;
    /**
     * Unused atm, post shadow does the trick, but it would be nice to clean up
     * the whole sub-tree on deletes.
     */
    deletePost(post: AppBskyUnspeccedGetPostThreadV2.ThreadItem): void;
};
export declare function getThreadPlaceholder(queryClient: QueryClient, uri: string): $Typed<AppBskyUnspeccedGetPostThreadV2.ThreadItem> | void;
export declare function getThreadPlaceholderCandidates(queryClient: QueryClient, uri: string): Generator<$Typed<Omit<AppBskyUnspeccedGetPostThreadV2.ThreadItem, 'value'> & {
    value: $Typed<AppBskyUnspeccedDefs.ThreadItemPost>;
}>, void>;
export declare function findAllPostsInQueryData(queryClient: QueryClient, uri: string): Generator<AppBskyFeedDefs.PostView, void>;
export declare function findAllProfilesInQueryData(queryClient: QueryClient, did: string): Generator<AppBskyActorDefs.ProfileViewBasic, void>;
//# sourceMappingURL=queryCache.d.ts.map