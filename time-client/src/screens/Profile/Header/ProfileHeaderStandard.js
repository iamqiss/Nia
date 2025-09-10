import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { moderateProfile, } from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useActorStatus } from '#/lib/actor-status';
import { sanitizeDisplayName } from '#/lib/strings/display-names';
import { sanitizeHandle } from '#/lib/strings/handles';
import { logger } from '#/logger';
import { isIOS } from '#/platform/detection';
import { useProfileShadow } from '#/state/cache/profile-shadow';
import { useProfileBlockMutationQueue, useProfileFollowMutationQueue, } from '#/state/queries/profile';
import { useRequireAuth, useSession } from '#/state/session';
import { ProfileMenu } from '#/view/com/profile/ProfileMenu';
import * as Toast from '#/view/com/util/Toast';
import { atoms as a, platform, useBreakpoints, useTheme } from '#/alf';
import { SubscribeProfileButton } from '#/components/activity-notifications/SubscribeProfileButton';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import { useDialogControl } from '#/components/Dialog';
import { MessageProfileButton } from '#/components/dms/MessageProfileButton';
import { PlusLarge_Stroke2_Corner0_Rounded as Plus } from '#/components/icons/Plus';
import { KnownFollowers, shouldShowKnownFollowers, } from '#/components/KnownFollowers';
import * as Prompt from '#/components/Prompt';
import { RichText } from '#/components/RichText';
import { Text } from '#/components/Typography';
import { VerificationCheckButton } from '#/components/verification/VerificationCheckButton';
import { EditProfileDialog } from './EditProfileDialog';
import { ProfileHeaderHandle } from './Handle';
import { ProfileHeaderMetrics } from './Metrics';
import { ProfileHeaderShell } from './Shell';
import { AnimatedProfileHeaderSuggestedFollows } from './SuggestedFollows';
let ProfileHeaderStandard = ({ profile: profileUnshadowed, descriptionRT, moderationOpts, hideBackButton = false, isPlaceholderProfile, }) => {
    const t = useTheme();
    const { gtMobile } = useBreakpoints();
    const profile = useProfileShadow(profileUnshadowed);
    const { currentAccount, hasSession } = useSession();
    const { _ } = useLingui();
    const moderation = useMemo(() => moderateProfile(profile, moderationOpts), [profile, moderationOpts]);
    const [queueFollow, queueUnfollow] = useProfileFollowMutationQueue(profile, 'ProfileHeader');
    const [_queueBlock, queueUnblock] = useProfileBlockMutationQueue(profile);
    const unblockPromptControl = Prompt.usePromptControl();
    const requireAuth = useRequireAuth();
    const [showSuggestedFollows, setShowSuggestedFollows] = useState(false);
    const isBlockedUser = profile.viewer?.blocking ||
        profile.viewer?.blockedBy ||
        profile.viewer?.blockingByList;
    const editProfileControl = useDialogControl();
    const onPressFollow = () => {
        setShowSuggestedFollows(true);
        requireAuth(async () => {
            try {
                await queueFollow();
                Toast.show(_(msg `Following ${sanitizeDisplayName(profile.displayName || profile.handle, moderation.ui('displayName'))}`));
            }
            catch (e) {
                if (e?.name !== 'AbortError') {
                    logger.error('Failed to follow', { message: String(e) });
                    Toast.show(_(msg `There was an issue! ${e.toString()}`), 'xmark');
                }
            }
        });
    };
    const onPressUnfollow = () => {
        setShowSuggestedFollows(false);
        requireAuth(async () => {
            try {
                await queueUnfollow();
                Toast.show(_(msg `No longer following ${sanitizeDisplayName(profile.displayName || profile.handle, moderation.ui('displayName'))}`));
            }
            catch (e) {
                if (e?.name !== 'AbortError') {
                    logger.error('Failed to unfollow', { message: String(e) });
                    Toast.show(_(msg `There was an issue! ${e.toString()}`), 'xmark');
                }
            }
        });
    };
    const unblockAccount = useCallback(async () => {
        try {
            await queueUnblock();
            Toast.show(_(msg({ message: 'Account unblocked', context: 'toast' })));
        }
        catch (e) {
            if (e?.name !== 'AbortError') {
                logger.error('Failed to unblock account', { message: e });
                Toast.show(_(msg `There was an issue! ${e.toString()}`), 'xmark');
            }
        }
    }, [_, queueUnblock]);
    const isMe = useMemo(() => currentAccount?.did === profile.did, [currentAccount, profile]);
    const { isActive: live } = useActorStatus(profile);
    const subscriptionsAllowed = useMemo(() => {
        switch (profile.associated?.activitySubscription?.allowSubscriptions) {
            case 'followers':
            case undefined:
                return !!profile.viewer?.following;
            case 'mutuals':
                return !!profile.viewer?.following && !!profile.viewer.followedBy;
            case 'none':
            default:
                return false;
        }
    }, [profile]);
    return (_jsxs(_Fragment, { children: [_jsxs(ProfileHeaderShell, { profile: profile, moderation: moderation, hideBackButton: hideBackButton, isPlaceholderProfile: isPlaceholderProfile, children: [_jsxs(View, { style: [a.px_lg, a.pt_md, a.pb_sm, a.overflow_hidden], pointerEvents: isIOS ? 'auto' : 'box-none', children: [_jsxs(View, { style: [
                                    { paddingLeft: 90 },
                                    a.flex_row,
                                    a.align_center,
                                    a.justify_end,
                                    a.gap_xs,
                                    a.pb_sm,
                                    a.flex_wrap,
                                ], pointerEvents: isIOS ? 'auto' : 'box-none', children: [isMe ? (_jsxs(_Fragment, { children: [_jsx(Button, { testID: "profileHeaderEditProfileButton", size: "small", color: "secondary", variant: "solid", onPress: editProfileControl.open, label: _(msg `Edit profile`), style: [a.rounded_full], children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Edit Profile" }) }) }), _jsx(EditProfileDialog, { profile: profile, control: editProfileControl })] })) : profile.viewer?.blocking ? (profile.viewer?.blockingByList ? null : (_jsx(Button, { testID: "unblockBtn", size: "small", color: "secondary", variant: "solid", label: _(msg `Unblock`), disabled: !hasSession, onPress: () => unblockPromptControl.open(), style: [a.rounded_full], children: _jsx(ButtonText, { children: _jsx(Trans, { context: "action", children: "Unblock" }) }) }))) : !profile.viewer?.blockedBy ? (_jsxs(_Fragment, { children: [hasSession && subscriptionsAllowed && (_jsx(SubscribeProfileButton, { profile: profile, moderationOpts: moderationOpts })), hasSession && _jsx(MessageProfileButton, { profile: profile }), _jsxs(Button, { testID: profile.viewer?.following ? 'unfollowBtn' : 'followBtn', size: "small", color: profile.viewer?.following ? 'secondary' : 'primary', variant: "solid", label: profile.viewer?.following
                                                    ? _(msg `Unfollow ${profile.handle}`)
                                                    : _(msg `Follow ${profile.handle}`), onPress: profile.viewer?.following ? onPressUnfollow : onPressFollow, style: [a.rounded_full], children: [!profile.viewer?.following && (_jsx(ButtonIcon, { position: "left", icon: Plus })), _jsx(ButtonText, { children: profile.viewer?.following ? (_jsx(Trans, { children: "Following" })) : profile.viewer?.followedBy ? (_jsx(Trans, { children: "Follow back" })) : (_jsx(Trans, { children: "Follow" })) })] })] })) : null, _jsx(ProfileMenu, { profile: profile })] }), _jsxs(View, { style: [a.flex_col, a.gap_xs, a.pb_sm, live ? a.pt_sm : a.pt_2xs], children: [_jsx(View, { style: [a.flex_row, a.align_center, a.gap_xs, a.flex_1], children: _jsxs(Text, { emoji: true, testID: "profileHeaderDisplayName", style: [
                                                t.atoms.text,
                                                gtMobile ? a.text_4xl : a.text_3xl,
                                                a.self_start,
                                                a.font_heavy,
                                                a.leading_tight,
                                            ], children: [sanitizeDisplayName(profile.displayName || sanitizeHandle(profile.handle), moderation.ui('displayName')), _jsx(View, { style: [
                                                        a.pl_xs,
                                                        {
                                                            marginTop: platform({ ios: 2 }),
                                                        },
                                                    ], children: _jsx(VerificationCheckButton, { profile: profile, size: "lg" }) })] }) }), _jsx(ProfileHeaderHandle, { profile: profile })] }), !isPlaceholderProfile && !isBlockedUser && (_jsxs(View, { style: a.gap_md, children: [_jsx(ProfileHeaderMetrics, { profile: profile }), descriptionRT && !moderation.ui('profileView').blur ? (_jsx(View, { pointerEvents: "auto", children: _jsx(RichText, { testID: "profileHeaderDescription", style: [a.text_md], numberOfLines: 15, value: descriptionRT, enableTags: true, authorHandle: profile.handle }) })) : undefined, !isMe &&
                                        !isBlockedUser &&
                                        shouldShowKnownFollowers(profile.viewer?.knownFollowers) && (_jsx(View, { style: [a.flex_row, a.align_center, a.gap_sm], children: _jsx(KnownFollowers, { profile: profile, moderationOpts: moderationOpts }) }))] }))] }), _jsx(Prompt.Basic, { control: unblockPromptControl, title: _(msg `Unblock Account?`), description: _(msg `The account will be able to interact with you after unblocking.`), onConfirm: unblockAccount, confirmButtonCta: profile.viewer?.blocking ? _(msg `Unblock`) : _(msg `Block`), confirmButtonColor: "negative" })] }), _jsx(AnimatedProfileHeaderSuggestedFollows, { isExpanded: showSuggestedFollows, actorDid: profile.did })] }));
};
ProfileHeaderStandard = memo(ProfileHeaderStandard);
export { ProfileHeaderStandard };
//# sourceMappingURL=ProfileHeaderStandard.js.map