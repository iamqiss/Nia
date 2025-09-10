import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View } from 'react-native';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {} from '#/lib/routes/types';
import { useNotificationDeclarationMutation, useNotificationDeclarationQuery, } from '#/state/queries/activity-subscriptions';
import { atoms as a, useTheme } from '#/alf';
import { Admonition } from '#/components/Admonition';
import * as Toggle from '#/components/forms/Toggle';
import { BellRinging_Stroke2_Corner0_Rounded as BellRingingIcon } from '#/components/icons/BellRinging';
import * as Layout from '#/components/Layout';
import { Loader } from '#/components/Loader';
import * as SettingsList from './components/SettingsList';
import { ItemTextWithSubtitle } from './NotificationSettings/components/ItemTextWithSubtitle';
export function ActivityPrivacySettingsScreen({}) {
    const { data: notificationDeclaration, isPending, isError, } = useNotificationDeclarationQuery();
    return (_jsxs(Layout.Screen, { children: [_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, { children: _jsx(Layout.Header.TitleText, { children: _jsx(Trans, { children: "Privacy and Security" }) }) }), _jsx(Layout.Header.Slot, {})] }), _jsx(Layout.Content, { children: _jsxs(SettingsList.Container, { children: [_jsxs(SettingsList.Item, { style: [a.align_start], children: [_jsx(SettingsList.ItemIcon, { icon: BellRingingIcon }), _jsx(ItemTextWithSubtitle, { bold: true, titleText: _jsx(Trans, { children: "Allow others to be notified of your posts" }), subtitleText: _jsx(Trans, { children: "This feature allows users to receive notifications for your new posts and replies. Who do you want to enable this for?" }) })] }), _jsx(View, { style: [a.px_xl, a.pt_md], children: isError ? (_jsx(Admonition, { type: "error", children: _jsx(Trans, { children: "Failed to load preference." }) })) : isPending ? (_jsx(View, { style: [a.w_full, a.pt_5xl, a.align_center], children: _jsx(Loader, { size: "xl" }) })) : (_jsx(Inner, { notificationDeclaration: notificationDeclaration })) })] }) })] }));
}
export function Inner({ notificationDeclaration, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const { mutate } = useNotificationDeclarationMutation();
    const onChangeFilter = ([declaration]) => {
        mutate({
            $type: 'app.bsky.notification.declaration',
            allowSubscriptions: declaration,
        });
    };
    return (_jsx(Toggle.Group, { type: "radio", label: _(msg `Filter who can opt to receive notifications for your activity`), values: [notificationDeclaration.value.allowSubscriptions], onChange: onChangeFilter, children: _jsxs(View, { style: [a.gap_sm], children: [_jsxs(Toggle.Item, { label: _(msg `Anyone who follows me`), name: "followers", style: [a.flex_row, a.py_xs, a.gap_sm], children: [_jsx(Toggle.Radio, {}), _jsx(Toggle.LabelText, { style: [t.atoms.text, a.font_normal, a.text_md], children: _jsx(Trans, { children: "Anyone who follows me" }) })] }), _jsxs(Toggle.Item, { label: _(msg `Only followers who I follow`), name: "mutuals", style: [a.flex_row, a.py_xs, a.gap_sm], children: [_jsx(Toggle.Radio, {}), _jsx(Toggle.LabelText, { style: [t.atoms.text, a.font_normal, a.text_md], children: _jsx(Trans, { children: "Only followers who I follow" }) })] }), _jsxs(Toggle.Item, { label: _(msg `No one`), name: "none", style: [a.flex_row, a.py_xs, a.gap_sm], children: [_jsx(Toggle.Radio, {}), _jsx(Toggle.LabelText, { style: [t.atoms.text, a.font_normal, a.text_md], children: _jsx(Trans, { children: "No one" }) })] })] }) }));
}
//# sourceMappingURL=ActivityPrivacySettings.js.map