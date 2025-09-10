import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment } from 'react';
import { View } from 'react-native';
import { Trans } from '@lingui/macro';
import {} from '#/lib/routes/types';
import { externalEmbedLabels, } from '#/lib/strings/embed-player';
import { useExternalEmbedsPrefs, useSetExternalEmbedPref, } from '#/state/preferences';
import { atoms as a, native } from '#/alf';
import { Admonition } from '#/components/Admonition';
import * as Toggle from '#/components/forms/Toggle';
import * as Layout from '#/components/Layout';
import * as SettingsList from './components/SettingsList';
export function ExternalMediaPreferencesScreen({}) {
    return (_jsxs(Layout.Screen, { testID: "externalMediaPreferencesScreen", children: [_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, { children: _jsx(Layout.Header.TitleText, { children: _jsx(Trans, { children: "External Media Preferences" }) }) }), _jsx(Layout.Header.Slot, {})] }), _jsx(Layout.Content, { children: _jsxs(SettingsList.Container, { children: [_jsx(SettingsList.Item, { children: _jsx(Admonition, { type: "info", style: [a.flex_1], children: _jsx(Trans, { children: "External media may allow websites to collect information about you and your device. No information is sent or requested until you press the \"play\" button." }) }) }), _jsxs(SettingsList.Group, { iconInset: false, children: [_jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Enable media players for" }) }), _jsxs(View, { style: [a.mt_sm, a.w_full], children: [native(_jsx(SettingsList.Divider, { style: [a.my_0] })), Object.entries(externalEmbedLabels)
                                            // TODO: Remove special case when we disable the old integration.
                                            .filter(([key]) => key !== 'tenor')
                                            .map(([key, label]) => (_jsxs(Fragment, { children: [_jsx(PrefSelector, { source: key, label: label }, key), native(_jsx(SettingsList.Divider, { style: [a.my_0] }))] }, key)))] })] })] }) })] }));
}
function PrefSelector({ source, label, }) {
    const setExternalEmbedPref = useSetExternalEmbedPref();
    const sources = useExternalEmbedsPrefs();
    return (_jsxs(Toggle.Item, { name: label, label: label, type: "checkbox", value: sources?.[source] === 'show', onChange: () => setExternalEmbedPref(source, sources?.[source] === 'show' ? 'hide' : 'show'), style: [
            a.flex_1,
            a.py_md,
            native([a.justify_between, a.flex_row_reverse]),
        ], children: [_jsx(Toggle.Platform, {}), _jsx(Toggle.LabelText, { style: [a.text_md], children: label })] }));
}
//# sourceMappingURL=ExternalMediaPreferences.js.map