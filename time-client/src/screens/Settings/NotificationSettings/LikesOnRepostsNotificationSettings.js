import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View } from 'react-native';
import { Trans } from '@lingui/macro';
import {} from '#/lib/routes/types';
import { useNotificationSettingsQuery } from '#/state/queries/notifications/settings';
import { atoms as a } from '#/alf';
import { Admonition } from '#/components/Admonition';
import { LikeRepost_Stroke2_Corner2_Rounded as LikeRepostIcon } from '#/components/icons/Heart2';
import * as Layout from '#/components/Layout';
import * as SettingsList from '../components/SettingsList';
import { ItemTextWithSubtitle } from './components/ItemTextWithSubtitle';
import { PreferenceControls } from './components/PreferenceControls';
export function LikesOnRepostsNotificationSettingsScreen({}) {
    const { data: preferences, isError } = useNotificationSettingsQuery();
    return (_jsxs(Layout.Screen, { children: [_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, { children: _jsx(Layout.Header.TitleText, { children: _jsx(Trans, { children: "Notifications" }) }) }), _jsx(Layout.Header.Slot, {})] }), _jsx(Layout.Content, { children: _jsxs(SettingsList.Container, { children: [_jsxs(SettingsList.Item, { style: [a.align_start], children: [_jsx(SettingsList.ItemIcon, { icon: LikeRepostIcon }), _jsx(ItemTextWithSubtitle, { bold: true, titleText: _jsx(Trans, { children: "Likes of your reposts" }), subtitleText: _jsx(Trans, { children: "Get notifications when people like posts that you've reposted." }) })] }), isError ? (_jsx(View, { style: [a.px_lg, a.pt_md], children: _jsx(Admonition, { type: "error", children: _jsx(Trans, { children: "Failed to load notification settings." }) }) })) : (_jsx(PreferenceControls, { name: "likeViaRepost", preference: preferences?.likeViaRepost }))] }) })] }));
}
//# sourceMappingURL=LikesOnRepostsNotificationSettings.js.map