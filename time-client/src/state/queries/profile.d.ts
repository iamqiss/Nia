import { type AppBskyActorDefs } from '@atproto/api';
import { type QueryClient } from '@tanstack/react-query';
import { type LogEvents } from '#/lib/statsig/statsig';
import { type Shadow } from '#/state/cache/types';
import type * as bsky from '#/types/bsky';
export * from '#/state/queries/unstable-profile-cache';
/**
 * @deprecated use {@link unstableCacheProfileView} instead
 */
export declare const precacheProfile: any;
export declare const RQKEY: (did: string) => string[];
export declare const profilesQueryKeyRoot = "profiles";
export declare const profilesQueryKey: (handles: string[]) => (string | string[])[];
export declare function useProfileQuery({ did, staleTime, }: {
    did: string | undefined;
    staleTime?: number;
}): any;
export declare function useProfilesQuery({ handles, maintainData, }: {
    handles: string[];
    maintainData?: boolean;
}): any;
export declare function usePrefetchProfileQuery(): any;
export declare function useProfileUpdateMutation(): any;
export declare function useProfileFollowMutationQueue(profile: Shadow<bsky.profile.AnyProfileView>, logContext: LogEvents['profile:follow']['logContext'] & LogEvents['profile:follow']['logContext']): any[];
export declare function useProfileMuteMutationQueue(profile: Shadow<bsky.profile.AnyProfileView>): any[];
export declare function useProfileBlockMutationQueue(profile: Shadow<bsky.profile.AnyProfileView>): any[];
export declare function findAllProfilesInQueryData(queryClient: QueryClient, did: string): Generator<AppBskyActorDefs.ProfileViewDetailed, void>;
export declare function findProfileQueryData(queryClient: QueryClient, did: string): AppBskyActorDefs.ProfileViewDetailed | undefined;
//# sourceMappingURL=profile.d.ts.map