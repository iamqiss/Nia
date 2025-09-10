import { type AppBskyActorDefs } from '@atproto/api';
import { type QueryClient } from '@tanstack/react-query';
export declare const RQKEY: (did: string) => string[];
export declare function useProfileFollowsQuery(did: string | undefined, { limit, }?: {
    limit?: number;
}): any;
export declare function findAllProfilesInQueryData(queryClient: QueryClient, did: string): Generator<AppBskyActorDefs.ProfileView, void>;
//# sourceMappingURL=profile-follows.d.ts.map