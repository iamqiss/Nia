import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect } from 'react';
import { Linking, View } from 'react-native';
import * as Notification from 'expo-notifications';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppState } from '#/lib/hooks/useAppState';
import {} from '#/lib/routes/types';
import { isAndroid, isIOS, isWeb } from '#/platform/detection';
import { useNotificationSettingsQuery } from '#/state/queries/notifications/settings';
import { atoms as a } from '#/alf';
import { Admonition } from '#/components/Admonition';
import { At_Stroke2_Corner2_Rounded as AtIcon } from '#/components/icons/At';
import { BellRinging_Stroke2_Corner0_Rounded as BellRingingIcon } from '#/components/icons/BellRinging';
import { Bubble_Stroke2_Corner2_Rounded as BubbleIcon } from '#/components/icons/Bubble';
import { Haptic_Stroke2_Corner2_Rounded as HapticIcon } from '#/components/icons/Haptic';
import { Heart2_Stroke2_Corner0_Rounded as HeartIcon, LikeRepost_Stroke2_Corner2_Rounded as LikeRepostIcon, } from '#/components/icons/Heart2';
import { PersonPlus_Stroke2_Corner2_Rounded as PersonPlusIcon } from '#/components/icons/Person';
import { CloseQuote_Stroke2_Corner0_Rounded as CloseQuoteIcon } from '#/components/icons/Quote';
import { Repost_Stroke2_Corner2_Rounded as RepostIcon, RepostRepost_Stroke2_Corner2_Rounded as RepostRepostIcon, } from '#/components/icons/Repost';
import { Shapes_Stroke2_Corner0_Rounded as ShapesIcon } from '#/components/icons/Shapes';
import * as Layout from '#/components/Layout';
import * as SettingsList from '../components/SettingsList';
import { ItemTextWithSubtitle } from './components/ItemTextWithSubtitle';
const RQKEY = ['notification-permissions'];
export function NotificationSettingsScreen({}) {
    const { _ } = useLingui();
    const queryClient = useQueryClient();
    const { data: settings, isError } = useNotificationSettingsQuery();
    const { data: permissions, refetch } = useQuery({
        queryKey: RQKEY,
        queryFn: async () => {
            if (isWeb)
                return null;
            return await Notification.getPermissionsAsync();
        },
    });
    const appState = useAppState();
    useEffect(() => {
        if (appState === 'active') {
            refetch();
        }
    }, [appState, refetch]);
    const onRequestPermissions = async () => {
        if (isWeb)
            return;
        if (permissions?.canAskAgain) {
            const response = await Notification.requestPermissionsAsync();
            queryClient.setQueryData(RQKEY, response);
        }
        else {
            if (isAndroid) {
                try {
                    await Linking.sendIntent('android.settings.APP_NOTIFICATION_SETTINGS', [
                        {
                            key: 'android.provider.extra.APP_PACKAGE',
                            value: 'xyz.blueskyweb.app',
                        },
                    ]);
                }
                catch {
                    Linking.openSettings();
                }
            }
            else if (isIOS) {
                Linking.openSettings();
            }
        }
    };
    return (_jsxs(Layout.Screen, { children: [_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, { children: _jsx(Layout.Header.TitleText, { children: _jsx(Trans, { children: "Notifications" }) }) }), _jsx(Layout.Header.Slot, {})] }), _jsx(Layout.Content, { children: _jsxs(SettingsList.Container, { children: [permissions && !permissions.granted && (_jsxs(_Fragment, { children: [_jsxs(SettingsList.PressableItem, { label: _(msg `Enable push notifications`), onPress: onRequestPermissions, children: [_jsx(SettingsList.ItemIcon, { icon: HapticIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Enable push notifications" }) })] }), _jsx(SettingsList.Divider, {})] })), isError && (_jsx(View, { style: [a.px_lg, a.pb_md], children: _jsx(Admonition, { type: "error", children: _jsx(Trans, { children: "Failed to load notification settings." }) }) })), _jsxs(View, { style: [a.gap_sm], children: [_jsxs(SettingsList.LinkItem, { label: _(msg `Settings for like notifications`), to: { screen: 'LikeNotificationSettings' }, contentContainerStyle: [a.align_start], children: [_jsx(SettingsList.ItemIcon, { icon: HeartIcon }), _jsx(ItemTextWithSubtitle, { titleText: _jsx(Trans, { children: "Likes" }), subtitleText: _jsx(SettingPreview, { preference: settings?.like }), showSkeleton: !settings })] }), _jsxs(SettingsList.LinkItem, { label: _(msg `Settings for new follower notifications`), to: { screen: 'NewFollowerNotificationSettings' }, contentContainerStyle: [a.align_start], children: [_jsx(SettingsList.ItemIcon, { icon: PersonPlusIcon }), _jsx(ItemTextWithSubtitle, { titleText: _jsx(Trans, { children: "New followers" }), subtitleText: _jsx(SettingPreview, { preference: settings?.follow }), showSkeleton: !settings })] }), _jsxs(SettingsList.LinkItem, { label: _(msg `Settings for reply notifications`), to: { screen: 'ReplyNotificationSettings' }, contentContainerStyle: [a.align_start], children: [_jsx(SettingsList.ItemIcon, { icon: BubbleIcon }), _jsx(ItemTextWithSubtitle, { titleText: _jsx(Trans, { children: "Replies" }), subtitleText: _jsx(SettingPreview, { preference: settings?.reply }), showSkeleton: !settings })] }), _jsxs(SettingsList.LinkItem, { label: _(msg `Settings for mention notifications`), to: { screen: 'MentionNotificationSettings' }, contentContainerStyle: [a.align_start], children: [_jsx(SettingsList.ItemIcon, { icon: AtIcon }), _jsx(ItemTextWithSubtitle, { titleText: _jsx(Trans, { children: "Mentions" }), subtitleText: _jsx(SettingPreview, { preference: settings?.mention }), showSkeleton: !settings })] }), _jsxs(SettingsList.LinkItem, { label: _(msg `Settings for quote notifications`), to: { screen: 'QuoteNotificationSettings' }, contentContainerStyle: [a.align_start], children: [_jsx(SettingsList.ItemIcon, { icon: CloseQuoteIcon }), _jsx(ItemTextWithSubtitle, { titleText: _jsx(Trans, { children: "Quotes" }), subtitleText: _jsx(SettingPreview, { preference: settings?.quote }), showSkeleton: !settings })] }), _jsxs(SettingsList.LinkItem, { label: _(msg `Settings for repost notifications`), to: { screen: 'RepostNotificationSettings' }, contentContainerStyle: [a.align_start], children: [_jsx(SettingsList.ItemIcon, { icon: RepostIcon }), _jsx(ItemTextWithSubtitle, { titleText: _jsx(Trans, { children: "Reposts" }), subtitleText: _jsx(SettingPreview, { preference: settings?.repost }), showSkeleton: !settings })] }), _jsxs(SettingsList.LinkItem, { label: _(msg `Settings for activity from others`), to: { screen: 'ActivityNotificationSettings' }, contentContainerStyle: [a.align_start], children: [_jsx(SettingsList.ItemIcon, { icon: BellRingingIcon }), _jsx(ItemTextWithSubtitle, { titleText: _jsx(Trans, { children: "Activity from others" }), subtitleText: _jsx(SettingPreview, { preference: settings?.subscribedPost }), showSkeleton: !settings })] }), _jsxs(SettingsList.LinkItem, { label: _(msg `Settings for notifications for likes of your reposts`), to: { screen: 'LikesOnRepostsNotificationSettings' }, contentContainerStyle: [a.align_start], children: [_jsx(SettingsList.ItemIcon, { icon: LikeRepostIcon }), _jsx(ItemTextWithSubtitle, { titleText: _jsx(Trans, { children: "Likes of your reposts" }), subtitleText: _jsx(SettingPreview, { preference: settings?.likeViaRepost }), showSkeleton: !settings })] }), _jsxs(SettingsList.LinkItem, { label: _(msg `Settings for notifications for reposts of your reposts`), to: { screen: 'RepostsOnRepostsNotificationSettings' }, contentContainerStyle: [a.align_start], children: [_jsx(SettingsList.ItemIcon, { icon: RepostRepostIcon }), _jsx(ItemTextWithSubtitle, { titleText: _jsx(Trans, { children: "Reposts of your reposts" }), subtitleText: _jsx(SettingPreview, { preference: settings?.repostViaRepost }), showSkeleton: !settings })] }), _jsxs(SettingsList.LinkItem, { label: _(msg `Settings for notifications for everything else`), to: { screen: 'MiscellaneousNotificationSettings' }, contentContainerStyle: [a.align_start], children: [_jsx(SettingsList.ItemIcon, { icon: ShapesIcon }), _jsx(ItemTextWithSubtitle, { titleText: _jsx(Trans, { children: "Everything else" }), 
                                            // technically a bundle of several settings, but since they're set together
                                            // and are most likely in sync we'll just show the state of one of them
                                            subtitleText: _jsx(SettingPreview, { preference: settings?.starterpackJoined }), showSkeleton: !settings })] })] })] }) })] }));
}
function SettingPreview({ preference, }) {
    const { _ } = useLingui();
    if (!preference) {
        return null;
    }
    else {
        if ('include' in preference) {
            if (preference.include === 'all') {
                if (preference.list && preference.push) {
                    return _(msg `In-app, Push, Everyone`);
                }
                else if (preference.list) {
                    return _(msg `In-app, Everyone`);
                }
                else if (preference.push) {
                    return _(msg `Push, Everyone`);
                }
            }
            else if (preference.include === 'follows') {
                if (preference.list && preference.push) {
                    return _(msg `In-app, Push, People you follow`);
                }
                else if (preference.list) {
                    return _(msg `In-app, People you follow`);
                }
                else if (preference.push) {
                    return _(msg `Push, People you follow`);
                }
            }
        }
        else {
            if (preference.list && preference.push) {
                return _(msg `In-app, Push`);
            }
            else if (preference.list) {
                return _(msg `In-app`);
            }
            else if (preference.push) {
                return _(msg `Push`);
            }
        }
    }
    return _(msg `Off`);
}
//# sourceMappingURL=index.js.map