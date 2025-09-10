import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { View } from 'react-native';
import { moderateProfile, RichText as RichTextApi, } from '@atproto/api';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useActorStatus } from '#/lib/actor-status';
import { getModerationCauseKey } from '#/lib/moderation';
import {} from '#/lib/statsig/statsig';
import { forceLTR } from '#/lib/strings/bidi';
import { NON_BREAKING_SPACE } from '#/lib/strings/constants';
import { sanitizeDisplayName } from '#/lib/strings/display-names';
import { sanitizeHandle } from '#/lib/strings/handles';
import { useProfileShadow } from '#/state/cache/profile-shadow';
import { useProfileFollowMutationQueue } from '#/state/queries/profile';
import { useSession } from '#/state/session';
import * as Toast from '#/view/com/util/Toast';
import { PreviewableUserAvatar, UserAvatar } from '#/view/com/util/UserAvatar';
import { atoms as a, platform, useTheme, } from '#/alf';
import { Button, ButtonIcon, ButtonText, } from '#/components/Button';
import { Check_Stroke2_Corner0_Rounded as Check } from '#/components/icons/Check';
import { PlusLarge_Stroke2_Corner0_Rounded as Plus } from '#/components/icons/Plus';
import { Link as InternalLink } from '#/components/Link';
import * as Pills from '#/components/Pills';
import { RichText } from '#/components/RichText';
import { Text } from '#/components/Typography';
import { useSimpleVerificationState } from '#/components/verification';
import { VerificationCheck } from '#/components/verification/VerificationCheck';
export function Default({ profile, moderationOpts, logContext = 'ProfileCard', testID, }) {
    return (_jsx(Link, { testID: testID, profile: profile, children: _jsx(Card, { profile: profile, moderationOpts: moderationOpts, logContext: logContext }) }));
}
export function Card({ profile, moderationOpts, logContext = 'ProfileCard', }) {
    return (_jsxs(Outer, { children: [_jsxs(Header, { children: [_jsx(Avatar, { profile: profile, moderationOpts: moderationOpts }), _jsx(NameAndHandle, { profile: profile, moderationOpts: moderationOpts }), _jsx(FollowButton, { profile: profile, moderationOpts: moderationOpts, logContext: logContext })] }), _jsx(Labels, { profile: profile, moderationOpts: moderationOpts }), _jsx(Description, { profile: profile })] }));
}
export function Outer({ children, }) {
    return _jsx(View, { style: [a.w_full, a.flex_1, a.gap_xs], children: children });
}
export function Header({ children, }) {
    return _jsx(View, { style: [a.flex_row, a.align_center, a.gap_sm], children: children });
}
export function Link({ profile, children, style, ...rest }) {
    const { _ } = useLingui();
    return (_jsx(InternalLink, { label: _(msg `View ${profile.displayName || sanitizeHandle(profile.handle)}'s profile`), to: {
            screen: 'Profile',
            params: { name: profile.did },
        }, style: [a.flex_col, style], ...rest, children: children }));
}
export function Avatar({ profile, moderationOpts, onPress, disabledPreview, liveOverride, size = 40, }) {
    const moderation = moderateProfile(profile, moderationOpts);
    const { isActive: live } = useActorStatus(profile);
    return disabledPreview ? (_jsx(UserAvatar, { size: size, avatar: profile.avatar, type: profile.associated?.labeler ? 'labeler' : 'user', moderation: moderation.ui('avatar'), live: liveOverride ?? live })) : (_jsx(PreviewableUserAvatar, { size: size, profile: profile, moderation: moderation.ui('avatar'), onBeforePress: onPress, live: liveOverride ?? live }));
}
export function AvatarPlaceholder({ size = 40 }) {
    const t = useTheme();
    return (_jsx(View, { style: [
            a.rounded_full,
            t.atoms.bg_contrast_25,
            {
                width: size,
                height: size,
            },
        ] }));
}
export function NameAndHandle({ profile, moderationOpts, inline = false, }) {
    if (inline) {
        return (_jsx(InlineNameAndHandle, { profile: profile, moderationOpts: moderationOpts }));
    }
    else {
        return (_jsxs(View, { style: [a.flex_1], children: [_jsx(Name, { profile: profile, moderationOpts: moderationOpts }), _jsx(Handle, { profile: profile })] }));
    }
}
function InlineNameAndHandle({ profile, moderationOpts, }) {
    const t = useTheme();
    const verification = useSimpleVerificationState({ profile });
    const moderation = moderateProfile(profile, moderationOpts);
    const name = sanitizeDisplayName(profile.displayName || sanitizeHandle(profile.handle), moderation.ui('displayName'));
    const handle = sanitizeHandle(profile.handle, '@');
    return (_jsxs(View, { style: [a.flex_row, a.align_end, a.flex_shrink], children: [_jsx(Text, { emoji: true, style: [
                    a.font_bold,
                    a.leading_tight,
                    a.flex_shrink_0,
                    { maxWidth: '70%' },
                ], numberOfLines: 1, children: forceLTR(name) }), verification.showBadge && (_jsx(View, { style: [
                    a.pl_2xs,
                    a.self_center,
                    { marginTop: platform({ default: 0, android: -1 }) },
                ], children: _jsx(VerificationCheck, { width: platform({ android: 13, default: 12 }), verifier: verification.role === 'verifier' }) })), _jsx(Text, { emoji: true, style: [
                    a.leading_tight,
                    t.atoms.text_contrast_medium,
                    { flexShrink: 10 },
                ], numberOfLines: 1, children: NON_BREAKING_SPACE + handle })] }));
}
export function Name({ profile, moderationOpts, }) {
    const moderation = moderateProfile(profile, moderationOpts);
    const name = sanitizeDisplayName(profile.displayName || sanitizeHandle(profile.handle), moderation.ui('displayName'));
    const verification = useSimpleVerificationState({ profile });
    return (_jsxs(View, { style: [a.flex_row, a.align_center, a.max_w_full], children: [_jsx(Text, { emoji: true, style: [
                    a.text_md,
                    a.font_bold,
                    a.leading_snug,
                    a.self_start,
                    a.flex_shrink,
                ], numberOfLines: 1, children: name }), verification.showBadge && (_jsx(View, { style: [a.pl_xs], children: _jsx(VerificationCheck, { width: 14, verifier: verification.role === 'verifier' }) }))] }));
}
export function Handle({ profile }) {
    const t = useTheme();
    const handle = sanitizeHandle(profile.handle, '@');
    return (_jsx(Text, { emoji: true, style: [a.leading_snug, t.atoms.text_contrast_medium], numberOfLines: 1, children: handle }));
}
export function NameAndHandlePlaceholder() {
    const t = useTheme();
    return (_jsxs(View, { style: [a.flex_1, a.gap_xs], children: [_jsx(View, { style: [
                    a.rounded_xs,
                    t.atoms.bg_contrast_25,
                    {
                        width: '60%',
                        height: 14,
                    },
                ] }), _jsx(View, { style: [
                    a.rounded_xs,
                    t.atoms.bg_contrast_25,
                    {
                        width: '40%',
                        height: 10,
                    },
                ] })] }));
}
export function NamePlaceholder({ style }) {
    const t = useTheme();
    return (_jsx(View, { style: [
            a.rounded_xs,
            t.atoms.bg_contrast_25,
            {
                width: '60%',
                height: 14,
            },
            style,
        ] }));
}
export function Description({ profile: profileUnshadowed, numberOfLines = 3, style, }) {
    const profile = useProfileShadow(profileUnshadowed);
    const rt = useMemo(() => {
        if (!('description' in profile))
            return;
        const rt = new RichTextApi({ text: profile.description || '' });
        rt.detectFacetsWithoutResolution();
        return rt;
    }, [profile]);
    if (!rt)
        return null;
    if (profile.viewer &&
        (profile.viewer.blockedBy ||
            profile.viewer.blocking ||
            profile.viewer.blockingByList))
        return null;
    return (_jsx(View, { style: [a.pt_xs], children: _jsx(RichText, { value: rt, style: [a.leading_snug, style], numberOfLines: numberOfLines, disableLinks: true }) }));
}
export function DescriptionPlaceholder({ numberOfLines = 3, }) {
    const t = useTheme();
    return (_jsx(View, { style: [a.pt_2xs, { gap: 6 }], children: Array(numberOfLines)
            .fill(0)
            .map((_, i) => (_jsx(View, { style: [
                a.rounded_xs,
                a.w_full,
                t.atoms.bg_contrast_25,
                { height: 12, width: i + 1 === numberOfLines ? '60%' : '100%' },
            ] }, i))) }));
}
export function FollowButton(props) {
    const { currentAccount, hasSession } = useSession();
    const isMe = props.profile.did === currentAccount?.did;
    return hasSession && !isMe ? _jsx(FollowButtonInner, { ...props }) : null;
}
export function FollowButtonInner({ profile: profileUnshadowed, moderationOpts, logContext, onPress: onPressProp, onFollow, colorInverted, withIcon = true, ...rest }) {
    const { _ } = useLingui();
    const profile = useProfileShadow(profileUnshadowed);
    const moderation = moderateProfile(profile, moderationOpts);
    const [queueFollow, queueUnfollow] = useProfileFollowMutationQueue(profile, logContext);
    const isRound = Boolean(rest.shape && rest.shape === 'round');
    const onPressFollow = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await queueFollow();
            Toast.show(_(msg `Following ${sanitizeDisplayName(profile.displayName || profile.handle, moderation.ui('displayName'))}`));
            onPressProp?.(e);
            onFollow?.();
        }
        catch (err) {
            if (err?.name !== 'AbortError') {
                Toast.show(_(msg `An issue occurred, please try again.`), 'xmark');
            }
        }
    };
    const onPressUnfollow = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await queueUnfollow();
            Toast.show(_(msg `No longer following ${sanitizeDisplayName(profile.displayName || profile.handle, moderation.ui('displayName'))}`));
            onPressProp?.(e);
        }
        catch (err) {
            if (err?.name !== 'AbortError') {
                Toast.show(_(msg `An issue occurred, please try again.`), 'xmark');
            }
        }
    };
    const unfollowLabel = _(msg({
        message: 'Following',
        comment: 'User is following this account, click to unfollow',
    }));
    const followLabel = profile.viewer?.followedBy
        ? _(msg({
            message: 'Follow back',
            comment: 'User is not following this account, click to follow back',
        }))
        : _(msg({
            message: 'Follow',
            comment: 'User is not following this account, click to follow',
        }));
    if (!profile.viewer)
        return null;
    if (profile.viewer.blockedBy ||
        profile.viewer.blocking ||
        profile.viewer.blockingByList)
        return null;
    return (_jsx(View, { children: profile.viewer.following ? (_jsxs(Button, { label: unfollowLabel, size: "small", variant: "solid", color: "secondary", ...rest, onPress: onPressUnfollow, children: [withIcon && (_jsx(ButtonIcon, { icon: Check, position: isRound ? undefined : 'left' })), isRound ? null : _jsx(ButtonText, { children: unfollowLabel })] })) : (_jsxs(Button, { label: followLabel, size: "small", variant: "solid", color: colorInverted ? 'secondary_inverted' : 'primary', ...rest, onPress: onPressFollow, children: [withIcon && (_jsx(ButtonIcon, { icon: Plus, position: isRound ? undefined : 'left' })), isRound ? null : _jsx(ButtonText, { children: followLabel })] })) }));
}
export function FollowButtonPlaceholder({ style }) {
    const t = useTheme();
    return (_jsx(View, { style: [
            a.rounded_sm,
            t.atoms.bg_contrast_25,
            a.w_full,
            {
                height: 33,
            },
            style,
        ] }));
}
export function Labels({ profile, moderationOpts, }) {
    const moderation = moderateProfile(profile, moderationOpts);
    const modui = moderation.ui('profileList');
    const followedBy = profile.viewer?.followedBy;
    if (!followedBy && !modui.inform && !modui.alert) {
        return null;
    }
    return (_jsxs(Pills.Row, { style: [a.pt_xs], children: [followedBy && _jsx(Pills.FollowsYou, {}), modui.alerts.map(alert => (_jsx(Pills.Label, { cause: alert }, getModerationCauseKey(alert)))), modui.informs.map(inform => (_jsx(Pills.Label, { cause: inform }, getModerationCauseKey(inform))))] }));
}
//# sourceMappingURL=ProfileCard.js.map