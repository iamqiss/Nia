import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {} from '@react-navigation/native-stack';
import {} from '#/lib/routes/types';
import { isNative } from '#/platform/detection';
import { useHapticsDisabled, useRequireAltTextEnabled, useSetHapticsDisabled, useSetRequireAltTextEnabled, } from '#/state/preferences';
import { useLargeAltBadgeEnabled, useSetLargeAltBadgeEnabled, } from '#/state/preferences/large-alt-badge';
import * as SettingsList from '#/screens/Settings/components/SettingsList';
import { atoms as a } from '#/alf';
import * as Toggle from '#/components/forms/Toggle';
import { Accessibility_Stroke2_Corner2_Rounded as AccessibilityIcon } from '#/components/icons/Accessibility';
import { Haptic_Stroke2_Corner2_Rounded as HapticIcon } from '#/components/icons/Haptic';
import * as Layout from '#/components/Layout';
export function AccessibilitySettingsScreen({}) {
    const { _ } = useLingui();
    const requireAltTextEnabled = useRequireAltTextEnabled();
    const setRequireAltTextEnabled = useSetRequireAltTextEnabled();
    const hapticsDisabled = useHapticsDisabled();
    const setHapticsDisabled = useSetHapticsDisabled();
    const largeAltBadgeEnabled = useLargeAltBadgeEnabled();
    const setLargeAltBadgeEnabled = useSetLargeAltBadgeEnabled();
    return (_jsxs(Layout.Screen, { children: [_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, { children: _jsx(Layout.Header.TitleText, { children: _jsx(Trans, { children: "Accessibility" }) }) }), _jsx(Layout.Header.Slot, {})] }), _jsx(Layout.Content, { children: _jsxs(SettingsList.Container, { children: [_jsxs(SettingsList.Group, { contentContainerStyle: [a.gap_sm], children: [_jsx(SettingsList.ItemIcon, { icon: AccessibilityIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Alt text" }) }), _jsxs(Toggle.Item, { name: "require_alt_text", label: _(msg `Require alt text before posting`), value: requireAltTextEnabled ?? false, onChange: value => setRequireAltTextEnabled(value), style: [a.w_full], children: [_jsx(Toggle.LabelText, { style: [a.flex_1], children: _jsx(Trans, { children: "Require alt text before posting" }) }), _jsx(Toggle.Platform, {})] }), _jsxs(Toggle.Item, { name: "large_alt_badge", label: _(msg `Display larger alt text badges`), value: !!largeAltBadgeEnabled, onChange: value => setLargeAltBadgeEnabled(value), style: [a.w_full], children: [_jsx(Toggle.LabelText, { style: [a.flex_1], children: _jsx(Trans, { children: "Display larger alt text badges" }) }), _jsx(Toggle.Platform, {})] })] }), isNative && (_jsxs(_Fragment, { children: [_jsx(SettingsList.Divider, {}), _jsxs(SettingsList.Group, { contentContainerStyle: [a.gap_sm], children: [_jsx(SettingsList.ItemIcon, { icon: HapticIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Haptics" }) }), _jsxs(Toggle.Item, { name: "haptics", label: _(msg `Disable haptic feedback`), value: hapticsDisabled ?? false, onChange: value => setHapticsDisabled(value), style: [a.w_full], children: [_jsx(Toggle.LabelText, { style: [a.flex_1], children: _jsx(Trans, { children: "Disable haptic feedback" }) }), _jsx(Toggle.Platform, {})] })] })] }))] }) })] }));
}
//# sourceMappingURL=AccessibilitySettings.js.map