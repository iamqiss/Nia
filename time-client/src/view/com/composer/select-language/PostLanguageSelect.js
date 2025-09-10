import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { LANG_DROPDOWN_HITSLOP } from '#/lib/constants';
import { codeToLanguageName } from '#/locale/helpers';
import { toPostLanguages, useLanguagePrefs, useLanguagePrefsApi, } from '#/state/preferences/languages';
import { atoms as a, useTheme } from '#/alf';
import { Button } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { ChevronRight_Stroke2_Corner0_Rounded as ChevronRightIcon } from '#/components/icons/Chevron';
import { Globe_Stroke2_Corner0_Rounded as GlobeIcon } from '#/components/icons/Globe';
import * as Menu from '#/components/Menu';
import { Text } from '#/components/Typography';
import { PostLanguageSelectDialog } from './PostLanguageSelectDialog';
export function PostLanguageSelect() {
    const { _ } = useLingui();
    const langPrefs = useLanguagePrefs();
    const setLangPrefs = useLanguagePrefsApi();
    const languageDialogControl = Dialog.useDialogControl();
    const dedupedHistory = Array.from(new Set([...langPrefs.postLanguageHistory, langPrefs.postLanguage]));
    if (dedupedHistory.length === 1 &&
        dedupedHistory[0] === langPrefs.postLanguage) {
        return (_jsxs(_Fragment, { children: [_jsx(LanguageBtn, { onPress: languageDialogControl.open }), _jsx(PostLanguageSelectDialog, { control: languageDialogControl })] }));
    }
    return (_jsxs(_Fragment, { children: [_jsxs(Menu.Root, { children: [_jsx(Menu.Trigger, { label: _(msg `Select post language`), children: ({ props }) => _jsx(LanguageBtn, { ...props }) }), _jsxs(Menu.Outer, { children: [_jsx(Menu.Group, { children: dedupedHistory.map(historyItem => {
                                    const langCodes = historyItem.split(',');
                                    const langName = langCodes
                                        .map(code => codeToLanguageName(code, langPrefs.appLanguage))
                                        .join(' + ');
                                    return (_jsxs(Menu.Item, { label: _(msg `Select ${langName}`), onPress: () => setLangPrefs.setPostLanguage(historyItem), children: [_jsx(Menu.ItemText, { children: langName }), _jsx(Menu.ItemRadio, { selected: historyItem === langPrefs.postLanguage })] }, historyItem));
                                }) }), _jsx(Menu.Divider, {}), _jsxs(Menu.Item, { label: _(msg `More languages...`), onPress: languageDialogControl.open, children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "More languages..." }) }), _jsx(Menu.ItemIcon, { icon: ChevronRightIcon })] })] })] }), _jsx(PostLanguageSelectDialog, { control: languageDialogControl })] }));
}
function LanguageBtn(props) {
    const { _ } = useLingui();
    const langPrefs = useLanguagePrefs();
    const t = useTheme();
    const postLanguagesPref = toPostLanguages(langPrefs.postLanguage);
    return (_jsx(Button, { testID: "selectLangBtn", size: "small", hitSlop: LANG_DROPDOWN_HITSLOP, label: _(msg({
            message: `Post language selection`,
            comment: `Accessibility label for button that opens dialog to choose post language settings`,
        })), accessibilityHint: _(msg `Opens post language settings`), style: [a.mr_xs], ...props, children: ({ pressed, hovered }) => {
            const color = pressed || hovered ? t.palette.primary_300 : t.palette.primary_500;
            if (postLanguagesPref.length > 0) {
                return (_jsx(Text, { style: [
                        { color },
                        a.font_bold,
                        a.text_sm,
                        a.leading_snug,
                        { maxWidth: 100 },
                    ], numberOfLines: 1, children: postLanguagesPref
                        .map(lang => codeToLanguageName(lang, langPrefs.appLanguage))
                        .join(', ') }));
            }
            else {
                return _jsx(GlobeIcon, { size: "xs", style: { color } });
            }
        } }));
}
//# sourceMappingURL=PostLanguageSelect.js.map