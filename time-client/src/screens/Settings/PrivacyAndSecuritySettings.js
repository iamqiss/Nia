import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View } from 'react-native';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {} from '@react-navigation/native-stack';
import {} from '#/lib/routes/types';
import { useNotificationDeclarationQuery } from '#/state/queries/activity-subscriptions';
import { useAppPasswordsQuery } from '#/state/queries/app-passwords';
import { useSession } from '#/state/session';
import * as SettingsList from '#/screens/Settings/components/SettingsList';
import { atoms as a, useTheme } from '#/alf';
import * as Admonition from '#/components/Admonition';
import { BellRinging_Stroke2_Corner0_Rounded as BellRingingIcon } from '#/components/icons/BellRinging';
import { EyeSlash_Stroke2_Corner0_Rounded as EyeSlashIcon } from '#/components/icons/EyeSlash';
import { Key_Stroke2_Corner2_Rounded as KeyIcon } from '#/components/icons/Key';
import { ShieldCheck_Stroke2_Corner0_Rounded as ShieldIcon } from '#/components/icons/Shield';
import * as Layout from '#/components/Layout';
import { InlineLinkText } from '#/components/Link';
import { Email2FAToggle } from './components/Email2FAToggle';
import { PwiOptOut } from './components/PwiOptOut';
import { ItemTextWithSubtitle } from './NotificationSettings/components/ItemTextWithSubtitle';
export function PrivacyAndSecuritySettingsScreen({}) {
    const { _ } = useLingui();
    const t = useTheme();
    const { data: appPasswords } = useAppPasswordsQuery();
    const { currentAccount } = useSession();
    const { data: notificationDeclaration, isPending, isError, } = useNotificationDeclarationQuery();
    return (_jsxs(Layout.Screen, { children: [_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, { children: _jsx(Layout.Header.TitleText, { children: _jsx(Trans, { children: "Privacy and Security" }) }) }), _jsx(Layout.Header.Slot, {})] }), _jsx(Layout.Content, { children: _jsxs(SettingsList.Container, { children: [_jsxs(SettingsList.Item, { children: [_jsx(SettingsList.ItemIcon, { icon: ShieldIcon, color: currentAccount?.emailAuthFactor
                                        ? t.palette.primary_500
                                        : undefined }), _jsx(SettingsList.ItemText, { children: currentAccount?.emailAuthFactor ? (_jsx(Trans, { children: "Email 2FA enabled" })) : (_jsx(Trans, { children: "Two-factor authentication (2FA)" })) }), _jsx(Email2FAToggle, {})] }), _jsxs(SettingsList.LinkItem, { to: "/settings/app-passwords", label: _(msg `App passwords`), children: [_jsx(SettingsList.ItemIcon, { icon: KeyIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "App passwords" }) }), appPasswords && appPasswords.length > 0 && (_jsx(SettingsList.BadgeText, { children: appPasswords.length }))] }), _jsxs(SettingsList.LinkItem, { label: _(msg `Settings for allowing others to be notified of your posts`), to: { screen: 'ActivityPrivacySettings' }, contentContainerStyle: [a.align_start], children: [_jsx(SettingsList.ItemIcon, { icon: BellRingingIcon }), _jsx(ItemTextWithSubtitle, { titleText: _jsx(Trans, { children: "Allow others to be notified of your posts" }), subtitleText: _jsx(NotificationDeclaration, { data: notificationDeclaration, isError: isError }), showSkeleton: isPending })] }), _jsx(SettingsList.Divider, {}), _jsxs(SettingsList.Group, { children: [_jsx(SettingsList.ItemIcon, { icon: EyeSlashIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Logged-out visibility" }) }), _jsx(PwiOptOut, {})] }), _jsx(SettingsList.Item, { children: _jsx(Admonition.Outer, { type: "tip", style: [a.flex_1], children: _jsxs(Admonition.Row, { children: [_jsx(Admonition.Icon, {}), _jsxs(View, { style: [a.flex_1, a.gap_sm], children: [_jsx(Admonition.Text, { children: _jsx(Trans, { children: "Note: Bluesky is an open and public network. This setting only limits the visibility of your content on the Bluesky app and website, and other apps may not respect this setting. Your content may still be shown to logged-out users by other apps and websites." }) }), _jsx(Admonition.Text, { children: _jsx(InlineLinkText, { label: _(msg `Learn more about what is public on Bluesky.`), to: "https://blueskyweb.zendesk.com/hc/en-us/articles/15835264007693-Data-Privacy", children: _jsx(Trans, { children: "Learn more about what is public on Bluesky." }) }) })] })] }) }) })] }) })] }));
}
function NotificationDeclaration({ data, isError, }) {
    if (isError) {
        return _jsx(Trans, { children: "Error loading preference" });
    }
    switch (data?.value?.allowSubscriptions) {
        case 'mutuals':
            return _jsx(Trans, { children: "Only followers who I follow" });
        case 'none':
            return _jsx(Trans, { children: "No one" });
        case 'followers':
        default:
            return _jsx(Trans, { children: "Anyone who follows me" });
    }
}
//# sourceMappingURL=PrivacyAndSecuritySettings.js.map