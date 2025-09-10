import { type AppBskyActorDefs, type AppBskyFeedDefs } from '@atproto/api';
import { type QueryClient } from '@tanstack/react-query';
export declare function useSearchPostsQuery({ query, sort, enabled, }: {
    query: string;
    sort?: 'top' | 'latest';
    enabled?: boolean;
}): any;
export declare function findAllPostsInQueryData(queryClient: QueryClient, uri: string): Generator<AppBskyFeedDefs.PostView, undefined>;
export declare function findAllProfilesInQueryData(queryClient: QueryClient, did: string): Generator<AppBskyActorDefs.ProfileViewBasic, undefined>;
//# sourceMappingURL=search-posts.d.ts.map