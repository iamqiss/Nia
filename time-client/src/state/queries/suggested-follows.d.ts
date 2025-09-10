import { type AppBskyActorDefs } from '@atproto/api';
import { type QueryClient } from '@tanstack/react-query';
type SuggestedFollowsOptions = {
    limit?: number;
    subsequentPageLimit?: number;
};
export declare function useSuggestedFollowsQuery(options?: SuggestedFollowsOptions): any;
export declare function useSuggestedFollowsByActorQuery({ did, enabled, staleTime, }: {
    did: string;
    enabled?: boolean;
    staleTime?: number;
}): any;
export declare function findAllProfilesInQueryData(queryClient: QueryClient, did: string): Generator<AppBskyActorDefs.ProfileView, void>;
export {};
//# sourceMappingURL=suggested-follows.d.ts.map