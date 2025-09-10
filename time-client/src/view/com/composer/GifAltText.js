import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { msg, Plural, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { HITSLOP_10, MAX_ALT_TEXT } from '#/lib/constants';
import { parseAltFromGIFDescription } from '#/lib/gif-alt-text';
import { parseEmbedPlayerFromUrl, } from '#/lib/strings/embed-player';
import { isAndroid } from '#/platform/detection';
import { useResolveGifQuery } from '#/state/queries/resolve-link';
import {} from '#/state/queries/tenor';
import { AltTextCounterWrapper } from '#/view/com/composer/AltTextCounterWrapper';
import { atoms as a, useTheme } from '#/alf';
import { Button, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import {} from '#/components/Dialog';
import * as TextField from '#/components/forms/TextField';
import { Check_Stroke2_Corner0_Rounded as Check } from '#/components/icons/Check';
import { CircleInfo_Stroke2_Corner0_Rounded as CircleInfo } from '#/components/icons/CircleInfo';
import { PlusSmall_Stroke2_Corner0_Rounded as Plus } from '#/components/icons/Plus';
import { GifEmbed } from '#/components/Post/Embed/ExternalEmbed/Gif';
import { Text } from '#/components/Typography';
import { AltTextReminder } from './photos/Gallery';
export function GifAltTextDialog({ gif, altText, onSubmit, }) {
    const { data } = useResolveGifQuery(gif);
    const vendorAltText = parseAltFromGIFDescription(data?.description ?? '').alt;
    const params = data ? parseEmbedPlayerFromUrl(data.uri) : undefined;
    if (!data || !params) {
        return null;
    }
    return (_jsx(GifAltTextDialogLoaded, { altText: altText, vendorAltText: vendorAltText, thumb: data.thumb?.source.path, params: params, onSubmit: onSubmit }));
}
export function GifAltTextDialogLoaded({ vendorAltText, altText, onSubmit, params, thumb, }) {
    const control = Dialog.useDialogControl();
    const { _ } = useLingui();
    const t = useTheme();
    const [altTextDraft, setAltTextDraft] = useState(altText || vendorAltText);
    return (_jsxs(_Fragment, { children: [_jsxs(TouchableOpacity, { testID: "altTextButton", accessibilityRole: "button", accessibilityLabel: _(msg `Add alt text`), accessibilityHint: "", hitSlop: HITSLOP_10, onPress: control.open, style: [
                    a.absolute,
                    { top: 8, left: 8 },
                    { borderRadius: 6 },
                    a.pl_xs,
                    a.pr_sm,
                    a.py_2xs,
                    a.flex_row,
                    a.gap_xs,
                    a.align_center,
                    { backgroundColor: 'rgba(0, 0, 0, 0.75)' },
                ], children: [altText ? (_jsx(Check, { size: "xs", fill: t.palette.white, style: a.ml_xs })) : (_jsx(Plus, { size: "sm", fill: t.palette.white })), _jsx(Text, { style: [a.font_bold, { color: t.palette.white }], accessible: false, children: _jsx(Trans, { children: "ALT" }) })] }), _jsx(AltTextReminder, {}), _jsxs(Dialog.Outer, { control: control, onClose: () => {
                    onSubmit(altTextDraft);
                }, children: [_jsx(Dialog.Handle, {}), _jsx(AltTextInner, { vendorAltText: vendorAltText, altText: altTextDraft, onChange: setAltTextDraft, thumb: thumb, control: control, params: params })] })] }));
}
function AltTextInner({ vendorAltText, altText, onChange, control, params, thumb, }) {
    const t = useTheme();
    const { _, i18n } = useLingui();
    return (_jsxs(Dialog.ScrollableInner, { label: _(msg `Add alt text`), children: [_jsxs(View, { style: a.flex_col_reverse, children: [_jsxs(View, { style: [a.mt_md, a.gap_md], children: [_jsxs(View, { style: [a.gap_sm], children: [_jsxs(View, { style: [a.relative], children: [_jsx(TextField.LabelText, { children: _jsx(Trans, { children: "Descriptive alt text" }) }), _jsx(TextField.Root, { children: _jsx(Dialog.Input, { label: _(msg `Alt text`), placeholder: vendorAltText, onChangeText: onChange, defaultValue: altText, multiline: true, numberOfLines: 3, autoFocus: true, onKeyPress: ({ nativeEvent }) => {
                                                        if (nativeEvent.key === 'Escape') {
                                                            control.close();
                                                        }
                                                    } }) })] }), altText.length > MAX_ALT_TEXT && (_jsxs(View, { style: [a.pb_sm, a.flex_row, a.gap_xs], children: [_jsx(CircleInfo, { fill: t.palette.negative_500 }), _jsx(Text, { style: [
                                                    a.italic,
                                                    a.leading_snug,
                                                    t.atoms.text_contrast_medium,
                                                ], children: _jsxs(Trans, { children: ["Alt text will be truncated.", ' ', _jsx(Plural, { value: MAX_ALT_TEXT, other: `Limit: ${i18n.number(MAX_ALT_TEXT)} characters.` })] }) })] }))] }), _jsx(AltTextCounterWrapper, { altText: altText, children: _jsx(Button, { label: _(msg `Save`), size: "large", color: "primary", variant: "solid", onPress: () => {
                                        control.close();
                                    }, style: [a.flex_grow], children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Save" }) }) }) })] }), _jsxs(View, { children: [_jsx(Text, { style: [a.text_2xl, a.font_bold, a.leading_tight, a.pb_sm], children: _jsx(Trans, { children: "Add alt text" }) }), _jsx(View, { style: [a.align_center], children: _jsx(GifEmbed, { thumb: thumb, altText: altText, isPreferredAltText: true, params: params, hideAlt: true, style: [{ height: 225 }] }) })] })] }), _jsx(Dialog.Close, {}), isAndroid ? _jsx(View, { style: { height: 300 } }) : null] }));
}
//# sourceMappingURL=GifAltText.js.map