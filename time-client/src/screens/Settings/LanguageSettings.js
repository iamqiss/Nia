import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { APP_LANGUAGES, LANGUAGES } from '#/lib/../locale/languages';
import {} from '#/lib/routes/types';
import { languageName, sanitizeAppLanguageSetting } from '#/locale/helpers';
import { useModalControls } from '#/state/modals';
import { useLanguagePrefs, useLanguagePrefsApi } from '#/state/preferences';
import { atoms as a, useTheme, web } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import { Check_Stroke2_Corner0_Rounded as CheckIcon } from '#/components/icons/Check';
import { PlusLarge_Stroke2_Corner0_Rounded as PlusIcon } from '#/components/icons/Plus';
import * as Layout from '#/components/Layout';
import * as Select from '#/components/Select';
import { Text } from '#/components/Typography';
import * as SettingsList from './components/SettingsList';
const DEDUPED_LANGUAGES = LANGUAGES.filter((lang, i, arr) => lang.code2 && arr.findIndex(l => l.code2 === lang.code2) === i);
export function LanguageSettingsScreen({}) {
    const { _ } = useLingui();
    const langPrefs = useLanguagePrefs();
    const setLangPrefs = useLanguagePrefsApi();
    const t = useTheme();
    const { openModal } = useModalControls();
    const onPressContentLanguages = useCallback(() => {
        openModal({ name: 'content-languages-settings' });
    }, [openModal]);
    const onChangePrimaryLanguage = useCallback((value) => {
        if (!value)
            return;
        if (langPrefs.primaryLanguage !== value) {
            setLangPrefs.setPrimaryLanguage(value);
        }
    }, [langPrefs, setLangPrefs]);
    const onChangeAppLanguage = useCallback((value) => {
        if (!value)
            return;
        if (langPrefs.appLanguage !== value) {
            setLangPrefs.setAppLanguage(sanitizeAppLanguageSetting(value));
        }
    }, [langPrefs, setLangPrefs]);
    const myLanguages = useMemo(() => {
        return (langPrefs.contentLanguages
            .map(lang => LANGUAGES.find(l => l.code2 === lang))
            .filter(Boolean)
            // @ts-ignore
            .map(l => languageName(l, langPrefs.appLanguage))
            .join(', '));
    }, [langPrefs.appLanguage, langPrefs.contentLanguages]);
    return (_jsxs(Layout.Screen, { testID: "PreferencesLanguagesScreen", children: [_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, { children: _jsx(Layout.Header.TitleText, { children: _jsx(Trans, { children: "Languages" }) }) }), _jsx(Layout.Header.Slot, {})] }), _jsx(Layout.Content, { children: _jsxs(SettingsList.Container, { children: [_jsxs(SettingsList.Group, { iconInset: false, children: [_jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "App Language" }) }), _jsxs(View, { style: [a.gap_md, a.w_full], children: [_jsx(Text, { style: [a.leading_snug], children: _jsx(Trans, { children: "Select which language to use for the app's user interface." }) }), _jsxs(Select.Root, { value: sanitizeAppLanguageSetting(langPrefs.appLanguage), onValueChange: onChangeAppLanguage, children: [_jsxs(Select.Trigger, { label: _(msg `Select app language`), children: [_jsx(Select.ValueText, {}), _jsx(Select.Icon, {})] }), _jsx(Select.Content, { renderItem: ({ label, value }) => (_jsxs(Select.Item, { value: value, label: label, children: [_jsx(Select.ItemIndicator, {}), _jsx(Select.ItemText, { children: label })] })), items: APP_LANGUAGES.map(l => ({
                                                        label: l.name,
                                                        value: l.code2,
                                                    })) })] })] })] }), _jsx(SettingsList.Divider, {}), _jsxs(SettingsList.Group, { iconInset: false, children: [_jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Primary Language" }) }), _jsxs(View, { style: [a.gap_md, a.w_full], children: [_jsx(Text, { style: [a.leading_snug], children: _jsx(Trans, { children: "Select your preferred language for translations in your feed." }) }), _jsxs(Select.Root, { value: langPrefs.primaryLanguage, onValueChange: onChangePrimaryLanguage, children: [_jsxs(Select.Trigger, { label: _(msg `Select primary language`), children: [_jsx(Select.ValueText, {}), _jsx(Select.Icon, {})] }), _jsx(Select.Content, { renderItem: ({ label, value }) => (_jsxs(Select.Item, { value: value, label: label, children: [_jsx(Select.ItemIndicator, {}), _jsx(Select.ItemText, { children: label })] })), items: DEDUPED_LANGUAGES.map(l => ({
                                                        label: languageName(l, langPrefs.appLanguage),
                                                        value: l.code2,
                                                    })) })] })] })] }), _jsx(SettingsList.Divider, {}), _jsxs(SettingsList.Group, { iconInset: false, children: [_jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Content Languages" }) }), _jsxs(View, { style: [a.gap_md], children: [_jsx(Text, { style: [a.leading_snug], children: _jsx(Trans, { children: "Select which languages you want your subscribed feeds to include. If none are selected, all languages will be shown." }) }), _jsxs(Button, { label: _(msg `Select content languages`), size: "small", color: "secondary", variant: "solid", onPress: onPressContentLanguages, style: [a.justify_start, web({ maxWidth: 400 })], children: [_jsx(ButtonIcon, { icon: myLanguages.length > 0 ? CheckIcon : PlusIcon }), _jsx(ButtonText, { style: [t.atoms.text, a.text_md, a.flex_1, a.text_left], numberOfLines: 1, children: myLanguages.length > 0
                                                        ? myLanguages
                                                        : _(msg `Select languages`) })] })] })] })] }) })] }));
}
//# sourceMappingURL=LanguageSettings.js.map