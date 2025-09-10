import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {} from '#/lib/routes/types';
import { useSetThemePrefs } from '#/state/shell';
import { ListContained } from '#/view/screens/Storybook/ListContained';
import { atoms as a, ThemeProvider } from '#/alf';
import { Button, ButtonText } from '#/components/Button';
import * as Layout from '#/components/Layout';
import { Admonitions } from './Admonitions';
import { Breakpoints } from './Breakpoints';
import { Buttons } from './Buttons';
import { Dialogs } from './Dialogs';
import { Forms } from './Forms';
import { Icons } from './Icons';
import { Links } from './Links';
import { Menus } from './Menus';
import { Settings } from './Settings';
import { Shadows } from './Shadows';
import { Spacing } from './Spacing';
import { Theming } from './Theming';
import { Toasts } from './Toasts';
import { Typography } from './Typography';
export function Storybook() {
    return (_jsxs(Layout.Screen, { children: [_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, { children: _jsx(Layout.Header.TitleText, { children: "Storybook" }) }), _jsx(Layout.Header.Slot, {})] }), _jsx(Layout.Content, { keyboardShouldPersistTaps: "handled", children: _jsx(StorybookInner, {}) })] }));
}
function StorybookInner() {
    const { setColorMode, setDarkTheme } = useSetThemePrefs();
    const [showContainedList, setShowContainedList] = React.useState(false);
    const navigation = useNavigation();
    return (_jsx(_Fragment, { children: _jsx(View, { style: [a.p_xl, a.gap_5xl, { paddingBottom: 100 }], children: !showContainedList ? (_jsxs(_Fragment, { children: [_jsxs(View, { style: [a.flex_row, a.align_start, a.gap_md], children: [_jsx(Button, { color: "primary", size: "small", label: 'Set theme to "system"', onPress: () => setColorMode('system'), children: _jsx(ButtonText, { children: "System" }) }), _jsx(Button, { color: "secondary", size: "small", label: 'Set theme to "light"', onPress: () => setColorMode('light'), children: _jsx(ButtonText, { children: "Light" }) }), _jsx(Button, { color: "secondary", size: "small", label: 'Set theme to "dim"', onPress: () => {
                                    setColorMode('dark');
                                    setDarkTheme('dim');
                                }, children: _jsx(ButtonText, { children: "Dim" }) }), _jsx(Button, { color: "secondary", size: "small", label: 'Set theme to "dark"', onPress: () => {
                                    setColorMode('dark');
                                    setDarkTheme('dark');
                                }, children: _jsx(ButtonText, { children: "Dark" }) })] }), _jsx(Button, { color: "primary", size: "small", onPress: () => navigation.navigate('SharedPreferencesTester'), label: "two", testID: "sharedPrefsTestOpenBtn", children: _jsx(ButtonText, { children: "Open Shared Prefs Tester" }) }), _jsx(ThemeProvider, { theme: "light", children: _jsx(Theming, {}) }), _jsx(ThemeProvider, { theme: "dim", children: _jsx(Theming, {}) }), _jsx(ThemeProvider, { theme: "dark", children: _jsx(Theming, {}) }), _jsx(Toasts, {}), _jsx(Buttons, {}), _jsx(Forms, {}), _jsx(Typography, {}), _jsx(Spacing, {}), _jsx(Shadows, {}), _jsx(Icons, {}), _jsx(Links, {}), _jsx(Dialogs, {}), _jsx(Menus, {}), _jsx(Breakpoints, {}), _jsx(Dialogs, {}), _jsx(Admonitions, {}), _jsx(Settings, {}), _jsx(Button, { color: "primary", size: "large", label: "Switch to Contained List", onPress: () => setShowContainedList(true), children: _jsx(ButtonText, { children: "Switch to Contained List" }) })] })) : (_jsxs(_Fragment, { children: [_jsx(Button, { color: "primary", size: "large", label: "Switch to Storybook", onPress: () => setShowContainedList(false), children: _jsx(ButtonText, { children: "Switch to Storybook" }) }), _jsx(ListContained, {})] })) }) }));
}
//# sourceMappingURL=index.js.map