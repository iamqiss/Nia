import { type AppBskyActorDefs } from '@atproto/api';
import { type QueryClient } from '@tanstack/react-query';
export declare const RQKEY: (resolvedUri: string) => string[];
export declare function usePostRepostedByQuery(resolvedUri: string | undefined): any;
export declare function findAllProfilesInQueryData(queryClient: QueryClient, did: string): Generator<AppBskyActorDefs.ProfileView, void>;
//# sourceMappingURL=post-reposted-by.d.ts.map