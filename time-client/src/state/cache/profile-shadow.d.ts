import { type AppBskyActorDefs, type AppBskyNotificationDefs } from '@atproto/api';
import { type QueryClient } from '@tanstack/react-query';
import type * as bsky from '#/types/bsky';
import { type Shadow } from './types';
export type { Shadow } from './types';
export interface ProfileShadow {
    followingUri: string | undefined;
    muted: boolean | undefined;
    blockingUri: string | undefined;
    verification: AppBskyActorDefs.VerificationState;
    status: AppBskyActorDefs.StatusView | undefined;
    activitySubscription: AppBskyNotificationDefs.ActivitySubscription | undefined;
}
export declare function useProfileShadow<TProfileView extends bsky.profile.AnyProfileView>(profile: TProfileView): Shadow<TProfileView>;
/**
 * Same as useProfileShadow, but allows for the profile to be undefined.
 * This is useful for when the profile is not guaranteed to be loaded yet.
 */
export declare function useMaybeProfileShadow<TProfileView extends bsky.profile.AnyProfileView>(profile?: TProfileView): Shadow<TProfileView> | undefined;
export declare function updateProfileShadow(queryClient: QueryClient, did: string, value: Partial<ProfileShadow>): void;
//# sourceMappingURL=profile-shadow.d.ts.map