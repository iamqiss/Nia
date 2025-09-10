import { type QueryClient } from '@tanstack/react-query';
import type * as bsky from '#/types/bsky';
export declare const unstableProfileViewCacheQueryKey: (didOrHandle: string) => string[];
/**
 * Used as a rough cache of profile views to make loading snappier. This method
 * accepts and stores any profile view type by both handle and DID.
 *
 * Access the cache via {@link useUnstableProfileViewCache}.
 */
export declare function unstableCacheProfileView(queryClient: QueryClient, profile: bsky.profile.AnyProfileView): void;
/**
 * Hook to access the unstable profile view cache. This cache can return ANY
 * profile view type, so if the object shape is important, you need to use the
 * identity validators shipped in the atproto SDK e.g.
 * `AppBskyActorDefs.isValidProfileViewBasic` to confirm before using.
 *
 * To cache a profile, use {@link unstableCacheProfileView}.
 */
export declare function useUnstableProfileViewCache(): {
    getUnstableProfile: any;
};
//# sourceMappingURL=unstable-profile-cache.d.ts.map