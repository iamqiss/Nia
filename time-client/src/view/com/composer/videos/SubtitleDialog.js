import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useState } from 'react';
import { Keyboard, View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { MAX_ALT_TEXT } from '#/lib/constants';
import { useEnforceMaxGraphemeCount } from '#/lib/strings/helpers';
import { LANGUAGES } from '#/locale/languages';
import { isWeb } from '#/platform/detection';
import { useLanguagePrefs } from '#/state/preferences';
import { atoms as a, useTheme, web } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import * as TextField from '#/components/forms/TextField';
import { CC_Stroke2_Corner0_Rounded as CCIcon } from '#/components/icons/CC';
import { PageText_Stroke2_Corner0_Rounded as PageTextIcon } from '#/components/icons/PageText';
import { TimesLarge_Stroke2_Corner0_Rounded as X } from '#/components/icons/Times';
import { Warning_Stroke2_Corner0_Rounded as WarningIcon } from '#/components/icons/Warning';
import { Text } from '#/components/Typography';
import { SubtitleFilePicker } from './SubtitleFilePicker';
const MAX_NUM_CAPTIONS = 1;
export function SubtitleDialogBtn(props) {
    const control = Dialog.useDialogControl();
    const { _ } = useLingui();
    return (_jsxs(View, { style: [a.flex_row, a.my_xs], children: [_jsxs(Button, { label: isWeb ? _(msg `Captions & alt text`) : _(msg `Alt text`), accessibilityHint: isWeb
                    ? _(msg `Opens captions and alt text dialog`)
                    : _(msg `Opens alt text dialog`), size: "small", color: "secondary", variant: "ghost", onPress: () => {
                    if (Keyboard.isVisible())
                        Keyboard.dismiss();
                    control.open();
                }, children: [_jsx(ButtonIcon, { icon: CCIcon }), _jsx(ButtonText, { children: isWeb ? _jsx(Trans, { children: "Captions & alt text" }) : _jsx(Trans, { children: "Alt text" }) })] }), _jsxs(Dialog.Outer, { control: control, children: [_jsx(Dialog.Handle, {}), _jsx(SubtitleDialogInner, { ...props })] })] }));
}
function SubtitleDialogInner({ defaultAltText, saveAltText, captions, setCaptions, }) {
    const control = Dialog.useDialogContext();
    const { _ } = useLingui();
    const t = useTheme();
    const enforceLen = useEnforceMaxGraphemeCount();
    const { primaryLanguage } = useLanguagePrefs();
    const [altText, setAltText] = useState(defaultAltText);
    const handleSelectFile = useCallback((file) => {
        setCaptions(subs => [
            ...subs,
            {
                lang: subs.some(s => s.lang === primaryLanguage)
                    ? ''
                    : primaryLanguage,
                file,
            },
        ]);
    }, [setCaptions, primaryLanguage]);
    const subtitleMissingLanguage = captions.some(sub => sub.lang === '');
    return (_jsxs(Dialog.ScrollableInner, { label: _(msg `Video settings`), children: [_jsxs(View, { style: a.gap_md, children: [_jsx(Text, { style: [a.text_xl, a.font_bold, a.leading_tight], children: _jsx(Trans, { children: "Alt text" }) }), _jsx(TextField.Root, { children: _jsx(Dialog.Input, { label: _(msg `Alt text`), placeholder: _(msg `Add alt text (optional)`), value: altText, onChangeText: evt => setAltText(enforceLen(evt, MAX_ALT_TEXT)), maxLength: MAX_ALT_TEXT * 10, multiline: true, style: { maxHeight: 300 }, numberOfLines: 3, onKeyPress: ({ nativeEvent }) => {
                                if (nativeEvent.key === 'Escape') {
                                    control.close();
                                }
                            } }) }), isWeb && (_jsxs(_Fragment, { children: [_jsx(View, { style: [
                                    a.border_t,
                                    a.w_full,
                                    t.atoms.border_contrast_medium,
                                    a.my_md,
                                ] }), _jsx(Text, { style: [a.text_xl, a.font_bold, a.leading_tight], children: _jsx(Trans, { children: "Captions (.vtt)" }) }), _jsx(SubtitleFilePicker, { onSelectFile: handleSelectFile, disabled: subtitleMissingLanguage || captions.length >= MAX_NUM_CAPTIONS }), _jsx(View, { children: captions.map((subtitle, i) => (_jsx(SubtitleFileRow, { language: subtitle.lang, file: subtitle.file, setCaptions: setCaptions, otherLanguages: LANGUAGES.filter(lang => langCode(lang) === subtitle.lang ||
                                        !captions.some(s => s.lang === langCode(lang))), style: [i % 2 === 0 && t.atoms.bg_contrast_25] }, subtitle.lang))) }), subtitleMissingLanguage && (_jsx(Text, { style: [a.text_sm, t.atoms.text_contrast_medium], children: _jsx(Trans, { children: "Ensure you have selected a language for each subtitle file." }) }))] })), _jsx(View, { style: web([a.flex_row, a.justify_end]), children: _jsx(Button, { label: _(msg `Done`), size: isWeb ? 'small' : 'large', color: "primary", variant: "solid", onPress: () => {
                                saveAltText(altText);
                                control.close();
                            }, style: a.mt_lg, children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Done" }) }) }) })] }), _jsx(Dialog.Close, {})] }));
}
function SubtitleFileRow({ language, file, otherLanguages, setCaptions, style, }) {
    const { _ } = useLingui();
    const t = useTheme();
    const handleValueChange = useCallback((lang) => {
        if (lang) {
            setCaptions(subs => subs.map(s => (s.lang === language ? { lang, file: s.file } : s)));
        }
    }, [setCaptions, language]);
    return (_jsxs(View, { style: [
            a.flex_row,
            a.justify_between,
            a.py_md,
            a.px_lg,
            a.rounded_md,
            a.gap_md,
            style,
        ], children: [_jsx(View, { style: [a.flex_1, a.gap_xs, a.justify_center], children: _jsxs(View, { style: [a.flex_row, a.align_center, a.gap_sm], children: [language === '' ? (_jsx(WarningIcon, { style: a.flex_shrink_0, fill: t.palette.negative_500, size: "sm" })) : (_jsx(PageTextIcon, { style: [t.atoms.text, a.flex_shrink_0], size: "sm" })), _jsx(Text, { style: [a.flex_1, a.leading_snug, a.font_bold, a.mb_2xs], numberOfLines: 1, children: file.name }), _jsxs("select", { value: language, onChange: evt => handleValueChange(evt.target.value), style: { maxWidth: 200, flex: 1 }, children: [_jsx("option", { value: "", disabled: true, selected: true, hidden: true, children: _jsx(Trans, { children: "Select language..." }) }), otherLanguages.map(lang => (_jsx("option", { value: langCode(lang), children: `${lang.name} (${langCode(lang)})` }, langCode(lang))))] })] }) }), _jsx(Button, { label: _(msg `Remove subtitle file`), size: "tiny", shape: "round", variant: "outline", color: "secondary", onPress: () => setCaptions(subs => subs.filter(s => s.lang !== language)), style: [a.ml_sm], children: _jsx(ButtonIcon, { icon: X }) })] }));
}
function langCode(lang) {
    return lang.code2 || lang.code3;
}
//# sourceMappingURL=SubtitleDialog.js.map