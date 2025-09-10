import { type AppBskyActorDefs, type AppBskyFeedDefs } from '@atproto/api';
import { type QueryClient } from '@tanstack/react-query';
export declare const RQKEY: (resolvedUri: string) => string[];
export declare function usePostQuotesQuery(resolvedUri: string | undefined): any;
export declare function findAllProfilesInQueryData(queryClient: QueryClient, did: string): Generator<AppBskyActorDefs.ProfileViewBasic, void>;
export declare function findAllPostsInQueryData(queryClient: QueryClient, uri: string): Generator<AppBskyFeedDefs.PostView, undefined>;
//# sourceMappingURL=post-quotes.d.ts.map