import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useMemo } from 'react';
import { Text as RNText, View } from 'react-native';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { createSanitizedDisplayName } from '#/lib/moderation/create-sanitized-display-name';
import {} from '#/lib/routes/types';
import { cleanError } from '#/lib/strings/errors';
import { logger } from '#/logger';
import { useProfileShadow } from '#/state/cache/profile-shadow';
import { useModerationOpts } from '#/state/preferences/moderation-opts';
import { useActivitySubscriptionsQuery } from '#/state/queries/activity-subscriptions';
import { useNotificationSettingsQuery } from '#/state/queries/notifications/settings';
import { List } from '#/view/com/util/List';
import { atoms as a, useTheme } from '#/alf';
import { SubscribeProfileDialog } from '#/components/activity-notifications/SubscribeProfileDialog';
import * as Admonition from '#/components/Admonition';
import { Button, ButtonText } from '#/components/Button';
import { useDialogControl } from '#/components/Dialog';
import { BellRinging_Filled_Corner0_Rounded as BellRingingFilledIcon } from '#/components/icons/BellRinging';
import { BellRinging_Stroke2_Corner0_Rounded as BellRingingIcon } from '#/components/icons/BellRinging';
import * as Layout from '#/components/Layout';
import { InlineLinkText } from '#/components/Link';
import { ListFooter } from '#/components/Lists';
import { Loader } from '#/components/Loader';
import * as ProfileCard from '#/components/ProfileCard';
import { Text } from '#/components/Typography';
import * as SettingsList from '../components/SettingsList';
import { ItemTextWithSubtitle } from './components/ItemTextWithSubtitle';
import { PreferenceControls } from './components/PreferenceControls';
export function ActivityNotificationSettingsScreen({}) {
    const t = useTheme();
    const { _ } = useLingui();
    const { data: preferences, isError } = useNotificationSettingsQuery();
    const moderationOpts = useModerationOpts();
    const { data: subscriptions, isPending, error, isFetchingNextPage, fetchNextPage, hasNextPage, } = useActivitySubscriptionsQuery();
    const items = useMemo(() => {
        if (!subscriptions)
            return [];
        return subscriptions?.pages.flatMap(page => page.subscriptions);
    }, [subscriptions]);
    const renderItem = useCallback(({ item }) => {
        if (!moderationOpts)
            return null;
        return (_jsx(ActivitySubscriptionCard, { profile: item, moderationOpts: moderationOpts }));
    }, [moderationOpts]);
    const onEndReached = useCallback(async () => {
        if (isFetchingNextPage || !hasNextPage || isError)
            return;
        try {
            await fetchNextPage();
        }
        catch (err) {
            logger.error('Failed to load more likes', { message: err });
        }
    }, [isFetchingNextPage, hasNextPage, isError, fetchNextPage]);
    return (_jsxs(Layout.Screen, { children: [_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, { children: _jsx(Layout.Header.TitleText, { children: _jsx(Trans, { children: "Notifications" }) }) }), _jsx(Layout.Header.Slot, {})] }), _jsx(List, { ListHeaderComponent: _jsxs(SettingsList.Container, { children: [_jsxs(SettingsList.Item, { style: [a.align_start], children: [_jsx(SettingsList.ItemIcon, { icon: BellRingingIcon }), _jsx(ItemTextWithSubtitle, { bold: true, titleText: _jsx(Trans, { children: "Activity from others" }), subtitleText: _jsx(Trans, { children: "Get notified about posts and replies from accounts you choose." }) })] }), isError ? (_jsx(View, { style: [a.px_lg, a.pt_md], children: _jsx(Admonition.Admonition, { type: "error", children: _jsx(Trans, { children: "Failed to load notification settings." }) }) })) : (_jsx(PreferenceControls, { name: "subscribedPost", preference: preferences?.subscribedPost }))] }), data: items, keyExtractor: keyExtractor, renderItem: renderItem, onEndReached: onEndReached, onEndReachedThreshold: 4, ListEmptyComponent: error ? null : (_jsx(View, { style: [a.px_xl, a.py_md], children: !isPending ? (_jsx(Admonition.Outer, { type: "tip", children: _jsxs(Admonition.Row, { children: [_jsx(Admonition.Icon, {}), _jsxs(View, { style: [a.flex_1, a.gap_sm], children: [_jsx(Admonition.Text, { children: _jsxs(Trans, { children: ["Enable notifications for an account by visiting their profile and pressing the", ' ', _jsx(RNText, { style: [a.font_bold, t.atoms.text_contrast_high], children: "bell icon" }), ' ', _jsx(BellRingingFilledIcon, { size: "xs", style: t.atoms.text_contrast_high }), "."] }) }), _jsx(Admonition.Text, { children: _jsxs(Trans, { children: ["If you want to restrict who can receive notifications for your account's activity, you can change this in", ' ', _jsx(InlineLinkText, { label: _(msg `Privacy and Security settings`), to: { screen: 'ActivityPrivacySettings' }, style: [a.font_bold], children: "Settings \u2192 Privacy and Security" }), "."] }) })] })] }) })) : (_jsx(View, { style: [a.flex_1, a.align_center, a.pt_xl], children: _jsx(Loader, { size: "lg" }) })) })), ListFooterComponent: _jsx(ListFooter, { style: [items.length === 0 && a.border_transparent], isFetchingNextPage: isFetchingNextPage, error: cleanError(error), onRetry: fetchNextPage, hasNextPage: hasNextPage }), windowSize: 11 })] }));
}
function keyExtractor(item) {
    return item.did;
}
function ActivitySubscriptionCard({ profile: profileUnshadowed, moderationOpts, }) {
    const profile = useProfileShadow(profileUnshadowed);
    const control = useDialogControl();
    const { _ } = useLingui();
    const t = useTheme();
    const preview = useMemo(() => {
        const actSub = profile.viewer?.activitySubscription;
        if (actSub?.post && actSub?.reply) {
            return _(msg `Posts, Replies`);
        }
        else if (actSub?.post) {
            return _(msg `Posts`);
        }
        else if (actSub?.reply) {
            return _(msg `Replies`);
        }
        return _(msg `None`);
    }, [_, profile.viewer?.activitySubscription]);
    return (_jsxs(View, { style: [a.py_md, a.px_xl, a.border_t, t.atoms.border_contrast_low], children: [_jsx(ProfileCard.Outer, { children: _jsxs(ProfileCard.Header, { children: [_jsx(ProfileCard.Avatar, { profile: profile, moderationOpts: moderationOpts }), _jsxs(View, { style: [a.flex_1, a.gap_2xs], children: [_jsx(ProfileCard.NameAndHandle, { profile: profile, moderationOpts: moderationOpts, inline: true }), _jsx(Text, { style: [a.leading_snug, t.atoms.text_contrast_medium], children: preview })] }), _jsx(Button, { label: _(msg `Edit notifications from ${createSanitizedDisplayName(profile)}`), size: "small", color: "primary", variant: "solid", onPress: control.open, children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Edit" }) }) })] }) }), _jsx(SubscribeProfileDialog, { control: control, profile: profile, moderationOpts: moderationOpts, includeProfile: true })] }));
}
//# sourceMappingURL=ActivityNotificationSettings.js.map