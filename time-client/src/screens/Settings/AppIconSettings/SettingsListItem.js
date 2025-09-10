import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { AppIconImage } from '#/screens/Settings/AppIconSettings/AppIconImage';
import { useCurrentAppIcon } from '#/screens/Settings/AppIconSettings/useCurrentAppIcon';
import * as SettingsList from '#/screens/Settings/components/SettingsList';
import { atoms as a } from '#/alf';
import { Shapes_Stroke2_Corner0_Rounded as Shapes } from '#/components/icons/Shapes';
export function SettingsListItem() {
    const { _ } = useLingui();
    const icon = useCurrentAppIcon();
    return (_jsxs(SettingsList.LinkItem, { to: "/settings/app-icon", label: _(msg `App Icon`), contentContainerStyle: [a.align_start], children: [_jsx(SettingsList.ItemIcon, { icon: Shapes }), _jsxs(View, { style: [a.flex_1], children: [_jsx(SettingsList.ItemText, { style: [a.pt_xs, a.pb_md], children: _jsx(Trans, { children: "App Icon" }) }), _jsx(AppIconImage, { icon: icon, size: 60 })] })] }));
}
//# sourceMappingURL=SettingsListItem.js.map