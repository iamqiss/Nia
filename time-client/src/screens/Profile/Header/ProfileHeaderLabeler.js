import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React, { memo, useMemo } from 'react';
import { View } from 'react-native';
import { moderateProfile, } from '@atproto/api';
import { msg, Plural, plural, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MAX_LABELERS } from '#/lib/constants';
import { useHaptics } from '#/lib/haptics';
import { isAppLabeler } from '#/lib/moderation';
import { logger } from '#/logger';
import { isIOS } from '#/platform/detection';
import { useProfileShadow } from '#/state/cache/profile-shadow';
import {} from '#/state/cache/types';
import { useLabelerSubscriptionMutation } from '#/state/queries/labeler';
import { useLikeMutation, useUnlikeMutation } from '#/state/queries/like';
import { usePreferencesQuery } from '#/state/queries/preferences';
import { useRequireAuth, useSession } from '#/state/session';
import { ProfileMenu } from '#/view/com/profile/ProfileMenu';
import * as Toast from '#/view/com/util/Toast';
import { atoms as a, tokens, useTheme } from '#/alf';
import { Button, ButtonText } from '#/components/Button';
import { useDialogControl } from '#/components/Dialog';
import { Heart2_Filled_Stroke2_Corner0_Rounded as HeartFilled, Heart2_Stroke2_Corner0_Rounded as Heart, } from '#/components/icons/Heart2';
import { Link } from '#/components/Link';
import * as Prompt from '#/components/Prompt';
import { RichText } from '#/components/RichText';
import { Text } from '#/components/Typography';
import { ProfileHeaderDisplayName } from './DisplayName';
import { EditProfileDialog } from './EditProfileDialog';
import { ProfileHeaderHandle } from './Handle';
import { ProfileHeaderMetrics } from './Metrics';
import { ProfileHeaderShell } from './Shell';
let ProfileHeaderLabeler = ({ profile: profileUnshadowed, labeler, descriptionRT, moderationOpts, hideBackButton = false, isPlaceholderProfile, }) => {
    const profile = useProfileShadow(profileUnshadowed);
    const t = useTheme();
    const { _ } = useLingui();
    const { currentAccount, hasSession } = useSession();
    const requireAuth = useRequireAuth();
    const playHaptic = useHaptics();
    const cantSubscribePrompt = Prompt.usePromptControl();
    const isSelf = currentAccount?.did === profile.did;
    const moderation = useMemo(() => moderateProfile(profile, moderationOpts), [profile, moderationOpts]);
    const { data: preferences } = usePreferencesQuery();
    const { mutateAsync: toggleSubscription, variables, reset, } = useLabelerSubscriptionMutation();
    const isSubscribed = variables?.subscribe ??
        preferences?.moderationPrefs.labelers.find(l => l.did === profile.did);
    const { mutateAsync: likeMod, isPending: isLikePending } = useLikeMutation();
    const { mutateAsync: unlikeMod, isPending: isUnlikePending } = useUnlikeMutation();
    const [likeUri, setLikeUri] = React.useState(labeler.viewer?.like || '');
    const [likeCount, setLikeCount] = React.useState(labeler.likeCount || 0);
    const onToggleLiked = React.useCallback(async () => {
        if (!labeler) {
            return;
        }
        try {
            playHaptic();
            if (likeUri) {
                await unlikeMod({ uri: likeUri });
                setLikeCount(c => c - 1);
                setLikeUri('');
            }
            else {
                const res = await likeMod({ uri: labeler.uri, cid: labeler.cid });
                setLikeCount(c => c + 1);
                setLikeUri(res.uri);
            }
        }
        catch (e) {
            Toast.show(_(msg `There was an issue contacting the server, please check your internet connection and try again.`), 'xmark');
            logger.error(`Failed to toggle labeler like`, { message: e.message });
        }
    }, [labeler, playHaptic, likeUri, unlikeMod, likeMod, _]);
    const editProfileControl = useDialogControl();
    const onPressSubscribe = React.useCallback(() => requireAuth(async () => {
        const subscribe = !isSubscribed;
        try {
            await toggleSubscription({
                did: profile.did,
                subscribe,
            });
            logger.metric(subscribe
                ? 'moderation:subscribedToLabeler'
                : 'moderation:unsubscribedFromLabeler', {}, { statsig: true });
        }
        catch (e) {
            reset();
            if (e.message === 'MAX_LABELERS') {
                cantSubscribePrompt.open();
                return;
            }
            logger.error(`Failed to subscribe to labeler`, { message: e.message });
        }
    }), [
        requireAuth,
        toggleSubscription,
        isSubscribed,
        profile,
        cantSubscribePrompt,
        reset,
    ]);
    const isMe = React.useMemo(() => currentAccount?.did === profile.did, [currentAccount, profile]);
    return (_jsxs(ProfileHeaderShell, { profile: profile, moderation: moderation, hideBackButton: hideBackButton, isPlaceholderProfile: isPlaceholderProfile, children: [_jsxs(View, { style: [a.px_lg, a.pt_md, a.pb_sm], pointerEvents: isIOS ? 'auto' : 'box-none', children: [_jsxs(View, { style: [a.flex_row, a.justify_end, a.align_center, a.gap_xs, a.pb_lg], pointerEvents: isIOS ? 'auto' : 'box-none', children: [isMe ? (_jsxs(_Fragment, { children: [_jsx(Button, { testID: "profileHeaderEditProfileButton", size: "small", color: "secondary", variant: "solid", onPress: editProfileControl.open, label: _(msg `Edit profile`), style: a.rounded_full, children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Edit Profile" }) }) }), _jsx(EditProfileDialog, { profile: profile, control: editProfileControl })] })) : !isAppLabeler(profile.did) ? (_jsx(_Fragment, { children: _jsx(Button, { testID: "toggleSubscribeBtn", label: isSubscribed
                                        ? _(msg `Unsubscribe from this labeler`)
                                        : _(msg `Subscribe to this labeler`), onPress: onPressSubscribe, children: state => (_jsx(View, { style: [
                                            {
                                                paddingVertical: 9,
                                                paddingHorizontal: 12,
                                                borderRadius: 6,
                                                gap: 6,
                                                backgroundColor: isSubscribed
                                                    ? state.hovered || state.pressed
                                                        ? t.palette.contrast_50
                                                        : t.palette.contrast_25
                                                    : state.hovered || state.pressed
                                                        ? tokens.color.temp_purple_dark
                                                        : tokens.color.temp_purple,
                                            },
                                        ], children: _jsx(Text, { style: [
                                                {
                                                    color: isSubscribed
                                                        ? t.palette.contrast_700
                                                        : t.palette.white,
                                                },
                                                a.font_bold,
                                                a.text_center,
                                                a.leading_tight,
                                            ], children: isSubscribed ? (_jsx(Trans, { children: "Unsubscribe" })) : (_jsx(Trans, { children: "Subscribe to Labeler" })) }) })) }) })) : null, _jsx(ProfileMenu, { profile: profile })] }), _jsxs(View, { style: [a.flex_col, a.gap_2xs, a.pt_2xs, a.pb_md], children: [_jsx(ProfileHeaderDisplayName, { profile: profile, moderation: moderation }), _jsx(ProfileHeaderHandle, { profile: profile })] }), !isPlaceholderProfile && (_jsxs(_Fragment, { children: [isSelf && _jsx(ProfileHeaderMetrics, { profile: profile }), descriptionRT && !moderation.ui('profileView').blur ? (_jsx(View, { pointerEvents: "auto", children: _jsx(RichText, { testID: "profileHeaderDescription", style: [a.text_md], numberOfLines: 15, value: descriptionRT, enableTags: true, authorHandle: profile.handle }) })) : undefined, !isAppLabeler(profile.did) && (_jsxs(View, { style: [a.flex_row, a.gap_xs, a.align_center, a.pt_lg], children: [_jsx(Button, { testID: "toggleLikeBtn", size: "small", color: "secondary", variant: "solid", shape: "round", label: _(msg `Like this labeler`), disabled: !hasSession || isLikePending || isUnlikePending, onPress: onToggleLiked, children: likeUri ? (_jsx(HeartFilled, { fill: t.palette.negative_400 })) : (_jsx(Heart, { fill: t.atoms.text_contrast_medium.color })) }), typeof likeCount === 'number' && (_jsx(Link, { to: {
                                            screen: 'ProfileLabelerLikedBy',
                                            params: {
                                                name: labeler.creator.handle || labeler.creator.did,
                                            },
                                        }, size: "tiny", label: _(msg `Liked by ${plural(likeCount, {
                                            one: '# user',
                                            other: '# users',
                                        })}`), children: ({ hovered, focused, pressed }) => (_jsx(Text, { style: [
                                                a.font_bold,
                                                a.text_sm,
                                                t.atoms.text_contrast_medium,
                                                (hovered || focused || pressed) &&
                                                    t.atoms.text_contrast_high,
                                            ], children: _jsxs(Trans, { children: ["Liked by", ' ', _jsx(Plural, { value: likeCount, one: "# user", other: "# users" })] }) })) }))] }))] }))] }), _jsx(CantSubscribePrompt, { control: cantSubscribePrompt })] }));
};
ProfileHeaderLabeler = memo(ProfileHeaderLabeler);
export { ProfileHeaderLabeler };
/**
 * Keep this in sync with the value of {@link MAX_LABELERS}
 */
function CantSubscribePrompt({ control, }) {
    const { _ } = useLingui();
    return (_jsxs(Prompt.Outer, { control: control, children: [_jsx(Prompt.TitleText, { children: "Unable to subscribe" }), _jsx(Prompt.DescriptionText, { children: _jsx(Trans, { children: "We're sorry! You can only subscribe to twenty labelers, and you've reached your limit of twenty." }) }), _jsx(Prompt.Actions, { children: _jsx(Prompt.Action, { onPress: () => control.close(), cta: _(msg `OK`) }) })] }));
}
//# sourceMappingURL=ProfileHeaderLabeler.js.map