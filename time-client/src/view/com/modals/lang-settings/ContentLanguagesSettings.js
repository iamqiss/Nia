import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Trans } from '@lingui/macro';
import { usePalette } from '#/lib/hooks/usePalette';
import { useWebMediaQueries } from '#/lib/hooks/useWebMediaQueries';
import { deviceLanguageCodes } from '#/locale/deviceLocales';
import { languageName } from '#/locale/helpers';
import { useModalControls } from '#/state/modals';
import { useLanguagePrefs, useLanguagePrefsApi, } from '#/state/preferences/languages';
import { LANGUAGES, LANGUAGES_MAP_CODE2 } from '../../../../locale/languages';
import { Text } from '../../util/text/Text';
import { ScrollView } from '../util';
import { ConfirmLanguagesButton } from './ConfirmLanguagesButton';
import { LanguageToggle } from './LanguageToggle';
export const snapPoints = ['100%'];
export function Component({}) {
    const { closeModal } = useModalControls();
    const langPrefs = useLanguagePrefs();
    const setLangPrefs = useLanguagePrefsApi();
    const pal = usePalette('default');
    const { isMobile } = useWebMediaQueries();
    const onPressDone = React.useCallback(() => {
        closeModal();
    }, [closeModal]);
    const languages = React.useMemo(() => {
        const langs = LANGUAGES.filter(lang => !!lang.code2.trim() &&
            LANGUAGES_MAP_CODE2[lang.code2].code3 === lang.code3);
        // sort so that device & selected languages are on top, then alphabetically
        langs.sort((a, b) => {
            const hasA = langPrefs.contentLanguages.includes(a.code2) ||
                deviceLanguageCodes.includes(a.code2);
            const hasB = langPrefs.contentLanguages.includes(b.code2) ||
                deviceLanguageCodes.includes(b.code2);
            if (hasA === hasB)
                return a.name.localeCompare(b.name);
            if (hasA)
                return -1;
            return 1;
        });
        return langs;
    }, [langPrefs]);
    const onPress = React.useCallback((code2) => {
        setLangPrefs.toggleContentLanguage(code2);
    }, [setLangPrefs]);
    return (_jsxs(View, { testID: "contentLanguagesModal", style: [
            pal.view,
            styles.container,
            // @ts-ignore vh is web only
            isMobile
                ? {
                    paddingTop: 20,
                }
                : {
                    maxHeight: '90vh',
                },
        ], children: [_jsx(Text, { style: [pal.text, styles.title], children: _jsx(Trans, { children: "Content Languages" }) }), _jsx(Text, { style: [pal.text, styles.description], children: _jsx(Trans, { children: "Which languages would you like to see in your algorithmic feeds?" }) }), _jsx(Text, { style: [pal.textLight, styles.description], children: _jsx(Trans, { children: "Leave them all unselected to see any language." }) }), _jsxs(ScrollView, { style: styles.scrollContainer, children: [languages.map(lang => (_jsx(LanguageToggle, { code2: lang.code2, langType: "contentLanguages", name: languageName(lang, langPrefs.appLanguage), onPress: () => {
                            onPress(lang.code2);
                        } }, lang.code2))), _jsx(View, { style: {
                            height: isMobile ? 60 : 0,
                        } })] }), _jsx(ConfirmLanguagesButton, { onPress: onPressDone })] }));
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 24,
        marginBottom: 12,
    },
    description: {
        textAlign: 'center',
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 10,
    },
});
//# sourceMappingURL=ContentLanguagesSettings.js.map