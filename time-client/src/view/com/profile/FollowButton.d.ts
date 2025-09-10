import { type StyleProp, type TextStyle } from 'react-native';
import { type Shadow } from '#/state/cache/types';
import type * as bsky from '#/types/bsky';
import { type ButtonType } from '../util/forms/Button';
export declare function FollowButton({ unfollowedType, followedType, profile, labelStyle, logContext, onFollow, }: {
    unfollowedType?: ButtonType;
    followedType?: ButtonType;
    profile: Shadow<bsky.profile.AnyProfileView>;
    labelStyle?: StyleProp<TextStyle>;
    logContext: 'ProfileCard' | 'StarterPackProfilesList';
    onFollow?: () => void;
}): any;
//# sourceMappingURL=FollowButton.d.ts.map