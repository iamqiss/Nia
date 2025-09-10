import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useMemo, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { languageName } from '#/locale/helpers';
import { LANGUAGES, LANGUAGES_MAP_CODE2 } from '#/locale/languages';
import { isNative, isWeb } from '#/platform/detection';
import { useLanguagePrefs, useLanguagePrefsApi, } from '#/state/preferences/languages';
import { ErrorScreen } from '#/view/com/util/error/ErrorScreen';
import { ErrorBoundary } from '#/view/com/util/ErrorBoundary';
import { atoms as a, useTheme, web } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { SearchInput } from '#/components/forms/SearchInput';
import * as Toggle from '#/components/forms/Toggle';
import { TimesLarge_Stroke2_Corner0_Rounded as XIcon } from '#/components/icons/Times';
import { Text } from '#/components/Typography';
export function PostLanguageSelectDialog({ control, }) {
    const { height } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const renderErrorBoundary = useCallback((error) => _jsx(DialogError, { details: String(error) }), []);
    return (_jsxs(Dialog.Outer, { control: control, nativeOptions: { minHeight: height - insets.top }, children: [_jsx(Dialog.Handle, {}), _jsx(ErrorBoundary, { renderError: renderErrorBoundary, children: _jsx(DialogInner, {}) })] }));
}
export function DialogInner() {
    const control = Dialog.useDialogContext();
    const [headerHeight, setHeaderHeight] = useState(0);
    const allowedLanguages = useMemo(() => {
        const uniqueLanguagesMap = LANGUAGES.filter(lang => !!lang.code2).reduce((acc, lang) => {
            acc[lang.code2] = lang;
            return acc;
        }, {});
        return Object.values(uniqueLanguagesMap);
    }, []);
    const langPrefs = useLanguagePrefs();
    const [checkedLanguagesCode2, setCheckedLanguagesCode2] = useState(langPrefs.postLanguage.split(',') || [langPrefs.primaryLanguage]);
    const [search, setSearch] = useState('');
    const setLangPrefs = useLanguagePrefsApi();
    const t = useTheme();
    const { _ } = useLingui();
    const handleClose = () => {
        control.close(() => {
            let langsString = checkedLanguagesCode2.join(',');
            if (!langsString) {
                langsString = langPrefs.primaryLanguage;
            }
            setLangPrefs.setPostLanguage(langsString);
        });
    };
    // NOTE(@elijaharita): Displayed languages are split into 3 lists for
    // ordering.
    const displayedLanguages = useMemo(() => {
        function mapCode2List(code2List) {
            return code2List.map(code2 => LANGUAGES_MAP_CODE2[code2]).filter(Boolean);
        }
        // NOTE(@elijaharita): Get recent language codes and map them to language
        // objects. Both the user account's saved language history and the current
        // checked languages are displayed here.
        const recentLanguagesCode2 = Array.from(new Set([...checkedLanguagesCode2, ...langPrefs.postLanguageHistory])).slice(0, 5) || [];
        const recentLanguages = mapCode2List(recentLanguagesCode2);
        // NOTE(@elijaharita): helper functions
        const matchesSearch = (lang) => lang.name.toLowerCase().includes(search.toLowerCase());
        const isChecked = (lang) => checkedLanguagesCode2.includes(lang.code2);
        const isInRecents = (lang) => recentLanguagesCode2.includes(lang.code2);
        const checkedRecent = recentLanguages.filter(isChecked);
        if (search) {
            // NOTE(@elijaharita): if a search is active, we ALWAYS show checked
            // items, as well as any items that match the search.
            const uncheckedRecent = recentLanguages
                .filter(lang => !isChecked(lang))
                .filter(matchesSearch);
            const unchecked = allowedLanguages.filter(lang => !isChecked(lang));
            const all = unchecked
                .filter(matchesSearch)
                .filter(lang => !isInRecents(lang));
            return {
                all,
                checkedRecent,
                uncheckedRecent,
            };
        }
        else {
            // NOTE(@elijaharita): if no search is active, we show everything.
            const uncheckedRecent = recentLanguages.filter(lang => !isChecked(lang));
            const all = allowedLanguages
                .filter(lang => !recentLanguagesCode2.includes(lang.code2))
                .filter(lang => !isInRecents(lang));
            return {
                all,
                checkedRecent,
                uncheckedRecent,
            };
        }
    }, [
        allowedLanguages,
        search,
        langPrefs.postLanguageHistory,
        checkedLanguagesCode2,
    ]);
    const listHeader = (_jsxs(View, { style: [a.pb_xs, t.atoms.bg, isNative && a.pt_2xl], onLayout: evt => setHeaderHeight(evt.nativeEvent.layout.height), children: [_jsxs(View, { style: [a.flex_row, a.w_full, a.justify_between], children: [_jsxs(View, { children: [_jsx(Text, { nativeID: "dialog-title", style: [
                                    t.atoms.text,
                                    a.text_left,
                                    a.font_bold,
                                    a.text_xl,
                                    a.mb_sm,
                                ], children: _jsx(Trans, { children: "Choose Post Languages" }) }), _jsx(Text, { nativeID: "dialog-description", style: [
                                    t.atoms.text_contrast_medium,
                                    a.text_left,
                                    a.text_md,
                                    a.mb_lg,
                                ], children: _jsx(Trans, { children: "Select up to 3 languages used in this post" }) })] }), isWeb && (_jsx(Button, { variant: "ghost", size: "small", color: "secondary", shape: "round", label: _(msg `Close dialog`), onPress: handleClose, children: _jsx(ButtonIcon, { icon: XIcon }) }))] }), _jsx(View, { style: [a.w_full, a.flex_row, a.align_stretch, a.gap_xs, a.pb_0], children: _jsx(SearchInput, { value: search, onChangeText: setSearch, placeholder: _(msg `Search languages`), label: _(msg `Search languages`), maxLength: 50, onClearText: () => setSearch('') }) })] }));
    const isCheckedRecentEmpty = displayedLanguages.checkedRecent.length > 0 ||
        displayedLanguages.uncheckedRecent.length > 0;
    const isDisplayedLanguagesEmpty = displayedLanguages.all.length === 0;
    const flatListData = [
        ...(isCheckedRecentEmpty
            ? [{ type: 'header', label: _(msg `Recently used`) }]
            : []),
        ...displayedLanguages.checkedRecent.map(lang => ({ type: 'item', lang })),
        ...displayedLanguages.uncheckedRecent.map(lang => ({ type: 'item', lang })),
        ...(isDisplayedLanguagesEmpty
            ? []
            : [{ type: 'header', label: _(msg `All languages`) }]),
        ...displayedLanguages.all.map(lang => ({ type: 'item', lang })),
    ];
    return (_jsx(Toggle.Group, { values: checkedLanguagesCode2, onChange: setCheckedLanguagesCode2, type: "checkbox", maxSelections: 3, label: _(msg `Select languages`), style: web([a.contents]), children: _jsx(Dialog.InnerFlatList, { data: flatListData, ListHeaderComponent: listHeader, stickyHeaderIndices: [0], contentContainerStyle: [a.gap_0], style: [isNative && a.px_lg, web({ paddingBottom: 120 })], scrollIndicatorInsets: { top: headerHeight }, renderItem: ({ item, index }) => {
                if (item.type === 'header') {
                    return (_jsx(Text, { style: [
                            a.px_0,
                            a.py_md,
                            a.font_bold,
                            a.text_xs,
                            t.atoms.text_contrast_low,
                            a.pt_3xl,
                        ], children: item.label }, index));
                }
                const lang = item.lang;
                return (_jsxs(Toggle.Item, { name: lang.code2, label: languageName(lang, langPrefs.appLanguage), style: [
                        t.atoms.border_contrast_low,
                        a.border_b,
                        a.rounded_0,
                        a.px_0,
                        a.py_md,
                    ], children: [_jsx(Toggle.LabelText, { style: [a.flex_1], children: languageName(lang, langPrefs.appLanguage) }), _jsx(Toggle.Checkbox, {})] }, lang.code2));
            }, footer: _jsx(Dialog.FlatListFooter, { children: _jsx(Button, { label: _(msg `Close dialog`), onPress: handleClose, color: "primary", size: "large", children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Done" }) }) }) }) }) }));
}
function DialogError({ details }) {
    const { _ } = useLingui();
    const control = Dialog.useDialogContext();
    return (_jsxs(Dialog.ScrollableInner, { style: a.gap_md, label: _(msg `An error has occurred`), children: [_jsx(Dialog.Close, {}), _jsx(ErrorScreen, { title: _(msg `Oh no!`), message: _(msg `There was an unexpected issue in the application. Please let us know if this happened to you!`), details: details }), _jsx(Button, { label: _(msg `Close dialog`), onPress: () => control.close(), color: "primary", size: "large", children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Close" }) }) })] }));
}
//# sourceMappingURL=PostLanguageSelectDialog.js.map