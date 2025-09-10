import { type ModerationOpts } from '@atproto/api';
import { type LogEvents } from '#/lib/statsig/statsig';
import { type TextStyleProp, type ViewStyleProp } from '#/alf';
import { type ButtonProps } from '#/components/Button';
import { type LinkProps } from '#/components/Link';
import type * as bsky from '#/types/bsky';
export declare function Default({ profile, moderationOpts, logContext, testID, }: {
    profile: bsky.profile.AnyProfileView;
    moderationOpts: ModerationOpts;
    logContext?: 'ProfileCard' | 'StarterPackProfilesList';
    testID?: string;
}): any;
export declare function Card({ profile, moderationOpts, logContext, }: {
    profile: bsky.profile.AnyProfileView;
    moderationOpts: ModerationOpts;
    logContext?: 'ProfileCard' | 'StarterPackProfilesList';
}): any;
export declare function Outer({ children, }: {
    children: React.ReactNode | React.ReactNode[];
}): any;
export declare function Header({ children, }: {
    children: React.ReactNode | React.ReactNode[];
}): any;
export declare function Link({ profile, children, style, ...rest }: {
    profile: bsky.profile.AnyProfileView;
} & Omit<LinkProps, 'to' | 'label'>): any;
export declare function Avatar({ profile, moderationOpts, onPress, disabledPreview, liveOverride, size, }: {
    profile: bsky.profile.AnyProfileView;
    moderationOpts: ModerationOpts;
    onPress?: () => void;
    disabledPreview?: boolean;
    liveOverride?: boolean;
    size?: number;
}): any;
export declare function AvatarPlaceholder({ size }: {
    size?: number;
}): any;
export declare function NameAndHandle({ profile, moderationOpts, inline, }: {
    profile: bsky.profile.AnyProfileView;
    moderationOpts: ModerationOpts;
    inline?: boolean;
}): any;
export declare function Name({ profile, moderationOpts, }: {
    profile: bsky.profile.AnyProfileView;
    moderationOpts: ModerationOpts;
}): any;
export declare function Handle({ profile }: {
    profile: bsky.profile.AnyProfileView;
}): any;
export declare function NameAndHandlePlaceholder(): any;
export declare function NamePlaceholder({ style }: ViewStyleProp): any;
export declare function Description({ profile: profileUnshadowed, numberOfLines, style, }: {
    profile: bsky.profile.AnyProfileView;
    numberOfLines?: number;
} & TextStyleProp): any;
export declare function DescriptionPlaceholder({ numberOfLines, }: {
    numberOfLines?: number;
}): any;
export type FollowButtonProps = {
    profile: bsky.profile.AnyProfileView;
    moderationOpts: ModerationOpts;
    logContext: LogEvents['profile:follow']['logContext'] & LogEvents['profile:unfollow']['logContext'];
    colorInverted?: boolean;
    onFollow?: () => void;
    withIcon?: boolean;
} & Partial<ButtonProps>;
export declare function FollowButton(props: FollowButtonProps): any;
export declare function FollowButtonInner({ profile: profileUnshadowed, moderationOpts, logContext, onPress: onPressProp, onFollow, colorInverted, withIcon, ...rest }: FollowButtonProps): any;
export declare function FollowButtonPlaceholder({ style }: ViewStyleProp): any;
export declare function Labels({ profile, moderationOpts, }: {
    profile: bsky.profile.AnyProfileView;
    moderationOpts: ModerationOpts;
}): any;
//# sourceMappingURL=ProfileCard.d.ts.map