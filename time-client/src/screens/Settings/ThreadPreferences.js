import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {} from '#/lib/routes/types';
import { normalizeSort, normalizeView, useThreadPreferences, } from '#/state/queries/preferences/useThreadPreferences';
import { atoms as a, useTheme } from '#/alf';
import * as Toggle from '#/components/forms/Toggle';
import { Bubbles_Stroke2_Corner2_Rounded as BubblesIcon } from '#/components/icons/Bubble';
import { PersonGroup_Stroke2_Corner2_Rounded as PersonGroupIcon } from '#/components/icons/Person';
import { Tree_Stroke2_Corner0_Rounded as TreeIcon } from '#/components/icons/Tree';
import * as Layout from '#/components/Layout';
import { Text } from '#/components/Typography';
import * as SettingsList from './components/SettingsList';
export function ThreadPreferencesScreen({}) {
    const t = useTheme();
    const { _ } = useLingui();
    const { sort, setSort, view, setView, prioritizeFollowedUsers, setPrioritizeFollowedUsers, } = useThreadPreferences({ save: true });
    return (_jsxs(Layout.Screen, { testID: "threadPreferencesScreen", children: [_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, { children: _jsx(Layout.Header.TitleText, { children: _jsx(Trans, { children: "Thread Preferences" }) }) }), _jsx(Layout.Header.Slot, {})] }), _jsx(Layout.Content, { children: _jsxs(SettingsList.Container, { children: [_jsxs(SettingsList.Group, { children: [_jsx(SettingsList.ItemIcon, { icon: BubblesIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Sort replies" }) }), _jsxs(View, { style: [a.w_full, a.gap_md], children: [_jsx(Text, { style: [a.flex_1, t.atoms.text_contrast_medium], children: _jsx(Trans, { children: "Sort replies to the same post by:" }) }), _jsx(Toggle.Group, { label: _(msg `Sort replies by`), type: "radio", values: sort ? [sort] : [], onChange: values => setSort(normalizeSort(values[0])), children: _jsxs(View, { style: [a.gap_sm, a.flex_1], children: [_jsxs(Toggle.Item, { name: "top", label: _(msg `Top replies first`), children: [_jsx(Toggle.Radio, {}), _jsx(Toggle.LabelText, { children: _jsx(Trans, { children: "Top replies first" }) })] }), _jsxs(Toggle.Item, { name: "oldest", label: _(msg `Oldest replies first`), children: [_jsx(Toggle.Radio, {}), _jsx(Toggle.LabelText, { children: _jsx(Trans, { children: "Oldest replies first" }) })] }), _jsxs(Toggle.Item, { name: "newest", label: _(msg `Newest replies first`), children: [_jsx(Toggle.Radio, {}), _jsx(Toggle.LabelText, { children: _jsx(Trans, { children: "Newest replies first" }) })] })] }) })] })] }), _jsxs(SettingsList.Group, { contentContainerStyle: { minHeight: 0 }, children: [_jsx(SettingsList.ItemIcon, { icon: PersonGroupIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Prioritize your Follows" }) }), _jsxs(Toggle.Item, { type: "checkbox", name: "prioritize-follows", label: _(msg `Prioritize your Follows`), value: prioritizeFollowedUsers, onChange: value => setPrioritizeFollowedUsers(value), style: [a.w_full, a.gap_md], children: [_jsx(Toggle.LabelText, { style: [a.flex_1], children: _jsx(Trans, { children: "Show replies by people you follow before all other replies" }) }), _jsx(Toggle.Platform, {})] })] }), _jsxs(SettingsList.Group, { children: [_jsx(SettingsList.ItemIcon, { icon: TreeIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Tree view" }) }), _jsxs(Toggle.Item, { type: "checkbox", name: "threaded-mode", label: _(msg `Tree view`), value: view === 'tree', onChange: value => setView(normalizeView({ treeViewEnabled: value })), style: [a.w_full, a.gap_md], children: [_jsx(Toggle.LabelText, { style: [a.flex_1], children: _jsx(Trans, { children: "Show post replies in a threaded tree view" }) }), _jsx(Toggle.Platform, {})] })] })] }) })] }));
}
//# sourceMappingURL=ThreadPreferences.js.map