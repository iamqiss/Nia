import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { ScrollView, View } from 'react-native';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { usePalette } from '#/lib/hooks/usePalette';
import {} from '#/lib/routes/types';
import { s } from '#/lib/styles';
import { ThemeProvider } from '#/lib/ThemeContext';
import { EmptyState } from '#/view/com/util/EmptyState';
import { ErrorMessage } from '#/view/com/util/error/ErrorMessage';
import { ErrorScreen } from '#/view/com/util/error/ErrorScreen';
import { Button } from '#/view/com/util/forms/Button';
import { ToggleButton } from '#/view/com/util/forms/ToggleButton';
import * as LoadingPlaceholder from '#/view/com/util/LoadingPlaceholder';
import { Text } from '#/view/com/util/text/Text';
import * as Toast from '#/view/com/util/Toast';
import { ViewHeader } from '#/view/com/util/ViewHeader';
import { ViewSelector } from '#/view/com/util/ViewSelector';
import * as Layout from '#/components/Layout';
const MAIN_VIEWS = ['Base', 'Controls', 'Error', 'Notifs'];
export const DebugScreen = ({}) => {
    const [colorScheme, setColorScheme] = React.useState('light');
    const onToggleColorScheme = () => {
        setColorScheme(colorScheme === 'light' ? 'dark' : 'light');
    };
    return (_jsx(ThemeProvider, { theme: colorScheme, children: _jsx(Layout.Screen, { children: _jsx(DebugInner, { colorScheme: colorScheme, onToggleColorScheme: onToggleColorScheme }) }) }));
};
function DebugInner({ colorScheme, onToggleColorScheme, }) {
    const [currentView, setCurrentView] = React.useState(0);
    const pal = usePalette('default');
    const { _ } = useLingui();
    const renderItem = (item) => {
        return (_jsxs(View, { children: [_jsx(View, { style: [s.pt10, s.pl10, s.pr10], children: _jsx(ToggleButton, { type: "default-light", onPress: onToggleColorScheme, isSelected: colorScheme === 'dark', label: _(msg `Dark mode`) }) }), item.currentView === 3 ? (_jsx(NotifsView, {})) : item.currentView === 2 ? (_jsx(ErrorView, {})) : item.currentView === 1 ? (_jsx(ControlsView, {})) : (_jsx(BaseView, {}))] }, `view-${item.currentView}`));
    };
    const items = [{ currentView }];
    return (_jsxs(View, { style: [s.hContentRegion, pal.view], children: [_jsx(ViewHeader, { title: _(msg `Debug panel`) }), _jsx(ViewSelector, { swipeEnabled: true, sections: MAIN_VIEWS, items: items, renderItem: renderItem, onSelectView: setCurrentView })] }));
}
function Heading({ label }) {
    const pal = usePalette('default');
    return (_jsx(View, { style: [s.pt10, s.pb5], children: _jsx(Text, { type: "title-lg", style: pal.text, children: label }) }));
}
function BaseView() {
    return (_jsxs(View, { style: [s.pl10, s.pr10], children: [_jsx(Heading, { label: "Typography" }), _jsx(TypographyView, {}), _jsx(Heading, { label: "Palettes" }), _jsx(PaletteView, { palette: "default" }), _jsx(PaletteView, { palette: "primary" }), _jsx(PaletteView, { palette: "secondary" }), _jsx(PaletteView, { palette: "inverted" }), _jsx(PaletteView, { palette: "error" }), _jsx(Heading, { label: "Empty state" }), _jsx(EmptyStateView, {}), _jsx(Heading, { label: "Loading placeholders" }), _jsx(LoadingPlaceholderView, {}), _jsx(View, { style: s.footerSpacer })] }));
}
function ControlsView() {
    return (_jsxs(ScrollView, { style: [s.pl10, s.pr10], children: [_jsx(Heading, { label: "Buttons" }), _jsx(ButtonsView, {}), _jsx(Heading, { label: "Toggle Buttons" }), _jsx(ToggleButtonsView, {}), _jsx(View, { style: s.footerSpacer })] }));
}
function ErrorView() {
    return (_jsxs(View, { style: s.p10, children: [_jsx(View, { style: s.mb5, children: _jsx(ErrorScreen, { title: "Error screen", message: "A major error occurred that led the entire screen to fail", details: "Here are some details", onPressTryAgain: () => { } }) }), _jsx(View, { style: s.mb5, children: _jsx(ErrorMessage, { message: "This is an error that occurred while things were being done" }) }), _jsx(View, { style: s.mb5, children: _jsx(ErrorMessage, { message: "This is an error that occurred while things were being done", numberOfLines: 1 }) }), _jsx(View, { style: s.mb5, children: _jsx(ErrorMessage, { message: "This is an error that occurred while things were being done", onPressTryAgain: () => { } }) }), _jsx(View, { style: s.mb5, children: _jsx(ErrorMessage, { message: "This is an error that occurred while things were being done", onPressTryAgain: () => { }, numberOfLines: 1 }) })] }));
}
function NotifsView() {
    const triggerPush = () => {
        // TODO: implement local notification for testing
    };
    const triggerToast = () => {
        Toast.show('The task has been completed');
    };
    const triggerToast2 = () => {
        Toast.show('The task has been completed successfully and with no problems');
    };
    return (_jsx(View, { style: s.p10, children: _jsxs(View, { style: s.flexRow, children: [_jsx(Button, { onPress: triggerPush, label: "Trigger Push" }), _jsx(Button, { onPress: triggerToast, label: "Trigger Toast" }), _jsx(Button, { onPress: triggerToast2, label: "Trigger Toast 2" })] }) }));
}
function PaletteView({ palette }) {
    const defaultPal = usePalette('default');
    const pal = usePalette(palette);
    return (_jsxs(View, { style: [pal.view, pal.border, s.p10, s.mb5, s.border1], children: [_jsxs(Text, { style: [pal.text], children: [palette, " colors"] }), _jsx(Text, { style: [pal.textLight], children: "Light text" }), _jsx(Text, { style: [pal.link], children: "Link text" }), palette !== 'default' && (_jsx(View, { style: [defaultPal.view], children: _jsx(Text, { style: [pal.textInverted], children: "Inverted text" }) }))] }));
}
function TypographyView() {
    const pal = usePalette('default');
    return (_jsxs(View, { style: [pal.view], children: [_jsx(Text, { type: "2xl-thin", style: [pal.text], children: "'2xl-thin' lorem ipsum dolor" }), _jsx(Text, { type: "2xl", style: [pal.text], children: "'2xl' lorem ipsum dolor" }), _jsx(Text, { type: "2xl-medium", style: [pal.text], children: "'2xl-medium' lorem ipsum dolor" }), _jsx(Text, { type: "2xl-bold", style: [pal.text], children: "'2xl-bold' lorem ipsum dolor" }), _jsx(Text, { type: "2xl-heavy", style: [pal.text], children: "'2xl-heavy' lorem ipsum dolor" }), _jsx(Text, { type: "xl-thin", style: [pal.text], children: "'xl-thin' lorem ipsum dolor" }), _jsx(Text, { type: "xl", style: [pal.text], children: "'xl' lorem ipsum dolor" }), _jsx(Text, { type: "xl-medium", style: [pal.text], children: "'xl-medium' lorem ipsum dolor" }), _jsx(Text, { type: "xl-bold", style: [pal.text], children: "'xl-bold' lorem ipsum dolor" }), _jsx(Text, { type: "xl-heavy", style: [pal.text], children: "'xl-heavy' lorem ipsum dolor" }), _jsx(Text, { type: "lg-thin", style: [pal.text], children: "'lg-thin' lorem ipsum dolor" }), _jsx(Text, { type: "lg", style: [pal.text], children: "'lg' lorem ipsum dolor" }), _jsx(Text, { type: "lg-medium", style: [pal.text], children: "'lg-medium' lorem ipsum dolor" }), _jsx(Text, { type: "lg-bold", style: [pal.text], children: "'lg-bold' lorem ipsum dolor" }), _jsx(Text, { type: "lg-heavy", style: [pal.text], children: "'lg-heavy' lorem ipsum dolor" }), _jsx(Text, { type: "md-thin", style: [pal.text], children: "'md-thin' lorem ipsum dolor" }), _jsx(Text, { type: "md", style: [pal.text], children: "'md' lorem ipsum dolor" }), _jsx(Text, { type: "md-medium", style: [pal.text], children: "'md-medium' lorem ipsum dolor" }), _jsx(Text, { type: "md-bold", style: [pal.text], children: "'md-bold' lorem ipsum dolor" }), _jsx(Text, { type: "md-heavy", style: [pal.text], children: "'md-heavy' lorem ipsum dolor" }), _jsx(Text, { type: "sm-thin", style: [pal.text], children: "'sm-thin' lorem ipsum dolor" }), _jsx(Text, { type: "sm", style: [pal.text], children: "'sm' lorem ipsum dolor" }), _jsx(Text, { type: "sm-medium", style: [pal.text], children: "'sm-medium' lorem ipsum dolor" }), _jsx(Text, { type: "sm-bold", style: [pal.text], children: "'sm-bold' lorem ipsum dolor" }), _jsx(Text, { type: "sm-heavy", style: [pal.text], children: "'sm-heavy' lorem ipsum dolor" }), _jsx(Text, { type: "xs-thin", style: [pal.text], children: "'xs-thin' lorem ipsum dolor" }), _jsx(Text, { type: "xs", style: [pal.text], children: "'xs' lorem ipsum dolor" }), _jsx(Text, { type: "xs-medium", style: [pal.text], children: "'xs-medium' lorem ipsum dolor" }), _jsx(Text, { type: "xs-bold", style: [pal.text], children: "'xs-bold' lorem ipsum dolor" }), _jsx(Text, { type: "xs-heavy", style: [pal.text], children: "'xs-heavy' lorem ipsum dolor" }), _jsx(Text, { type: "title-2xl", style: [pal.text], children: "'title-2xl' lorem ipsum dolor" }), _jsx(Text, { type: "title-xl", style: [pal.text], children: "'title-xl' lorem ipsum dolor" }), _jsx(Text, { type: "title-lg", style: [pal.text], children: "'title-lg' lorem ipsum dolor" }), _jsx(Text, { type: "title", style: [pal.text], children: "'title' lorem ipsum dolor" }), _jsx(Text, { type: "button", style: [pal.text], children: "Button" }), _jsx(Text, { type: "button-lg", style: [pal.text], children: "Button-lg" })] }));
}
function EmptyStateView() {
    return _jsx(EmptyState, { icon: "bars", message: "This is an empty state" });
}
function LoadingPlaceholderView() {
    return (_jsxs(_Fragment, { children: [_jsx(LoadingPlaceholder.PostLoadingPlaceholder, {}), _jsx(LoadingPlaceholder.NotificationLoadingPlaceholder, {})] }));
}
function ButtonsView() {
    const defaultPal = usePalette('default');
    const buttonStyles = { marginRight: 5 };
    return (_jsxs(View, { style: [defaultPal.view], children: [_jsxs(View, { style: [s.flexRow, s.mb5], children: [_jsx(Button, { type: "primary", label: "Primary solid", style: buttonStyles }), _jsx(Button, { type: "secondary", label: "Secondary solid", style: buttonStyles })] }), _jsxs(View, { style: [s.flexRow, s.mb5], children: [_jsx(Button, { type: "default", label: "Default solid", style: buttonStyles }), _jsx(Button, { type: "inverted", label: "Inverted solid", style: buttonStyles })] }), _jsxs(View, { style: s.flexRow, children: [_jsx(Button, { type: "primary-outline", label: "Primary outline", style: buttonStyles }), _jsx(Button, { type: "secondary-outline", label: "Secondary outline", style: buttonStyles })] }), _jsxs(View, { style: s.flexRow, children: [_jsx(Button, { type: "primary-light", label: "Primary light", style: buttonStyles }), _jsx(Button, { type: "secondary-light", label: "Secondary light", style: buttonStyles })] }), _jsx(View, { style: s.flexRow, children: _jsx(Button, { type: "default-light", label: "Default light", style: buttonStyles }) })] }));
}
function ToggleButtonsView() {
    const defaultPal = usePalette('default');
    const buttonStyles = s.mb5;
    const [isSelected, setIsSelected] = React.useState(false);
    const onToggle = () => setIsSelected(!isSelected);
    return (_jsxs(View, { style: [defaultPal.view], children: [_jsx(ToggleButton, { type: "primary", label: "Primary solid", style: buttonStyles, isSelected: isSelected, onPress: onToggle }), _jsx(ToggleButton, { type: "secondary", label: "Secondary solid", style: buttonStyles, isSelected: isSelected, onPress: onToggle }), _jsx(ToggleButton, { type: "inverted", label: "Inverted solid", style: buttonStyles, isSelected: isSelected, onPress: onToggle }), _jsx(ToggleButton, { type: "primary-outline", label: "Primary outline", style: buttonStyles, isSelected: isSelected, onPress: onToggle }), _jsx(ToggleButton, { type: "secondary-outline", label: "Secondary outline", style: buttonStyles, isSelected: isSelected, onPress: onToggle }), _jsx(ToggleButton, { type: "primary-light", label: "Primary light", style: buttonStyles, isSelected: isSelected, onPress: onToggle }), _jsx(ToggleButton, { type: "secondary-light", label: "Secondary light", style: buttonStyles, isSelected: isSelected, onPress: onToggle }), _jsx(ToggleButton, { type: "default-light", label: "Default light", style: buttonStyles, isSelected: isSelected, onPress: onToggle })] }));
}
//# sourceMappingURL=Debug.js.map