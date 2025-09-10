import { type AppBskyActorDefs } from '@atproto/api';
import { type QueryClient } from '@tanstack/react-query';
export declare const RQKEY: (did: string) => string[];
export declare function useProfileKnownFollowersQuery(did: string | undefined): any;
export declare function findAllProfilesInQueryData(queryClient: QueryClient, did: string): Generator<AppBskyActorDefs.ProfileView, void>;
//# sourceMappingURL=known-followers.d.ts.map