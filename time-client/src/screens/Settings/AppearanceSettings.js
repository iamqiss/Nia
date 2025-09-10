import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback } from 'react';
import Animated, { FadeInUp, FadeOutUp, LayoutAnimationConfig, LinearTransition, } from 'react-native-reanimated';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {} from '#/lib/routes/types';
import { isNative } from '#/platform/detection';
import { useSetThemePrefs, useThemePrefs } from '#/state/shell';
import { SettingsListItem as AppIconSettingsListItem } from '#/screens/Settings/AppIconSettings/SettingsListItem';
import { atoms as a, native, useAlf, useTheme } from '#/alf';
import * as ToggleButton from '#/components/forms/ToggleButton';
import {} from '#/components/icons/common';
import { Moon_Stroke2_Corner0_Rounded as MoonIcon } from '#/components/icons/Moon';
import { Phone_Stroke2_Corner0_Rounded as PhoneIcon } from '#/components/icons/Phone';
import { TextSize_Stroke2_Corner0_Rounded as TextSize } from '#/components/icons/TextSize';
import { TitleCase_Stroke2_Corner0_Rounded as Aa } from '#/components/icons/TitleCase';
import * as Layout from '#/components/Layout';
import { Text } from '#/components/Typography';
import { IS_INTERNAL } from '#/env';
import * as SettingsList from './components/SettingsList';
export function AppearanceSettingsScreen({}) {
    const { _ } = useLingui();
    const { fonts } = useAlf();
    const { colorMode, darkTheme } = useThemePrefs();
    const { setColorMode, setDarkTheme } = useSetThemePrefs();
    const onChangeAppearance = useCallback((keys) => {
        const appearance = keys.find(key => key !== colorMode);
        if (!appearance)
            return;
        setColorMode(appearance);
    }, [setColorMode, colorMode]);
    const onChangeDarkTheme = useCallback((keys) => {
        const theme = keys.find(key => key !== darkTheme);
        if (!theme)
            return;
        setDarkTheme(theme);
    }, [setDarkTheme, darkTheme]);
    const onChangeFontFamily = useCallback((values) => {
        const next = values[0] === 'system' ? 'system' : 'theme';
        fonts.setFontFamily(next);
    }, [fonts]);
    const onChangeFontScale = useCallback((values) => {
        const next = values[0] || '0';
        fonts.setFontScale(next);
    }, [fonts]);
    return (_jsx(LayoutAnimationConfig, { skipExiting: true, skipEntering: true, children: _jsxs(Layout.Screen, { testID: "preferencesThreadsScreen", children: [_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, { children: _jsx(Layout.Header.TitleText, { children: _jsx(Trans, { children: "Appearance" }) }) }), _jsx(Layout.Header.Slot, {})] }), _jsx(Layout.Content, { children: _jsxs(SettingsList.Container, { children: [_jsx(AppearanceToggleButtonGroup, { title: _(msg `Color mode`), icon: PhoneIcon, items: [
                                    {
                                        label: _(msg `System`),
                                        name: 'system',
                                    },
                                    {
                                        label: _(msg `Light`),
                                        name: 'light',
                                    },
                                    {
                                        label: _(msg `Dark`),
                                        name: 'dark',
                                    },
                                ], values: [colorMode], onChange: onChangeAppearance }), colorMode !== 'light' && (_jsx(Animated.View, { entering: native(FadeInUp), exiting: native(FadeOutUp), children: _jsx(AppearanceToggleButtonGroup, { title: _(msg `Dark theme`), icon: MoonIcon, items: [
                                        {
                                            label: _(msg `Dim`),
                                            name: 'dim',
                                        },
                                        {
                                            label: _(msg `Dark`),
                                            name: 'dark',
                                        },
                                    ], values: [darkTheme ?? 'dim'], onChange: onChangeDarkTheme }) })), _jsxs(Animated.View, { layout: native(LinearTransition), children: [_jsx(SettingsList.Divider, {}), _jsx(AppearanceToggleButtonGroup, { title: _(msg `Font`), description: _(msg `For the best experience, we recommend using the theme font.`), icon: Aa, items: [
                                            {
                                                label: _(msg `System`),
                                                name: 'system',
                                            },
                                            {
                                                label: _(msg `Theme`),
                                                name: 'theme',
                                            },
                                        ], values: [fonts.family], onChange: onChangeFontFamily }), _jsx(AppearanceToggleButtonGroup, { title: _(msg `Font size`), icon: TextSize, items: [
                                            {
                                                label: _(msg `Smaller`),
                                                name: '-1',
                                            },
                                            {
                                                label: _(msg `Default`),
                                                name: '0',
                                            },
                                            {
                                                label: _(msg `Larger`),
                                                name: '1',
                                            },
                                        ], values: [fonts.scale], onChange: onChangeFontScale }), isNative && IS_INTERNAL && (_jsxs(_Fragment, { children: [_jsx(SettingsList.Divider, {}), _jsx(AppIconSettingsListItem, {})] }))] })] }) })] }) }));
}
export function AppearanceToggleButtonGroup({ title, description, icon: Icon, items, values, onChange, }) {
    const t = useTheme();
    return (_jsx(_Fragment, { children: _jsxs(SettingsList.Group, { contentContainerStyle: [a.gap_sm], iconInset: false, children: [_jsx(SettingsList.ItemIcon, { icon: Icon }), _jsx(SettingsList.ItemText, { children: title }), description && (_jsx(Text, { style: [
                        a.text_sm,
                        a.leading_snug,
                        t.atoms.text_contrast_medium,
                        a.w_full,
                    ], children: description })), _jsx(ToggleButton.Group, { label: title, values: values, onChange: onChange, children: items.map(item => (_jsx(ToggleButton.Button, { label: item.label, name: item.name, children: _jsx(ToggleButton.ButtonText, { children: item.label }) }, item.name))) })] }) }));
}
//# sourceMappingURL=AppearanceSettings.js.map