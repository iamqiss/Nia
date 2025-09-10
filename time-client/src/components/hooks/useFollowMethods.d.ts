import { type LogEvents } from '#/lib/statsig/statsig';
import { type Shadow } from '#/state/cache/types';
import type * as bsky from '#/types/bsky';
export declare function useFollowMethods({ profile, logContext, }: {
    profile: Shadow<bsky.profile.AnyProfileView>;
    logContext: LogEvents['profile:follow']['logContext'] & LogEvents['profile:unfollow']['logContext'];
}): {
    follow: any;
    unfollow: any;
};
//# sourceMappingURL=useFollowMethods.d.ts.map