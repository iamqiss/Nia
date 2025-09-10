import { type AppBskyActorDefs, type ModerationOpts } from '@atproto/api';
import { type LinkProps } from '#/components/Link';
import type * as bsky from '#/types/bsky';
/**
 * Shared logic to determine if `KnownFollowers` should be shown.
 *
 * Checks the # of actual returned users instead of the `count` value, because
 * `count` includes blocked users and `followers` does not.
 */
export declare function shouldShowKnownFollowers(knownFollowers?: AppBskyActorDefs.KnownFollowers): any;
export declare function KnownFollowers({ profile, moderationOpts, onLinkPress, minimal, showIfEmpty, }: {
    profile: bsky.profile.AnyProfileView;
    moderationOpts: ModerationOpts;
    onLinkPress?: LinkProps['onPress'];
    minimal?: boolean;
    showIfEmpty?: boolean;
}): any;
//# sourceMappingURL=KnownFollowers.d.ts.map