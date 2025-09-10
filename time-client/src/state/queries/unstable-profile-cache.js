import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
const unstableProfileViewCacheQueryKeyRoot = 'unstableProfileViewCache';
export const unstableProfileViewCacheQueryKey = (didOrHandle) => [
    unstableProfileViewCacheQueryKeyRoot,
    didOrHandle,
];
/**
 * Used as a rough cache of profile views to make loading snappier. This method
 * accepts and stores any profile view type by both handle and DID.
 *
 * Access the cache via {@link useUnstableProfileViewCache}.
 */
export function unstableCacheProfileView(queryClient, profile) {
    queryClient.setQueryData(unstableProfileViewCacheQueryKey(profile.handle), profile);
    queryClient.setQueryData(unstableProfileViewCacheQueryKey(profile.did), profile);
}
/**
 * Hook to access the unstable profile view cache. This cache can return ANY
 * profile view type, so if the object shape is important, you need to use the
 * identity validators shipped in the atproto SDK e.g.
 * `AppBskyActorDefs.isValidProfileViewBasic` to confirm before using.
 *
 * To cache a profile, use {@link unstableCacheProfileView}.
 */
export function useUnstableProfileViewCache() {
    const qc = useQueryClient();
    const getUnstableProfile = useCallback((didOrHandle) => {
        return qc.getQueryData(unstableProfileViewCacheQueryKey(didOrHandle));
    }, [qc]);
    return { getUnstableProfile };
}
//# sourceMappingURL=unstable-profile-cache.js.map