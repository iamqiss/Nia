import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Keyboard, View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ADULT_CONTENT_LABELS, OTHER_SELF_LABELS, } from '#/lib/moderation';
import { isWeb } from '#/platform/detection';
import { atoms as a, native, useTheme, web } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import * as Toggle from '#/components/forms/Toggle';
import { Check_Stroke2_Corner0_Rounded as Check } from '#/components/icons/Check';
import { Shield_Stroke2_Corner0_Rounded } from '#/components/icons/Shield';
import { Text } from '#/components/Typography';
export function LabelsBtn({ labels, onChange, }) {
    const control = Dialog.useDialogControl();
    const { _ } = useLingui();
    const hasLabel = labels.length > 0;
    const updateAdultLabels = (newLabels) => {
        const newLabel = newLabels[newLabels.length - 1];
        const filtered = labels.filter(l => !ADULT_CONTENT_LABELS.includes(l));
        onChange([
            ...new Set([...filtered, newLabel].filter(Boolean)),
        ]);
    };
    const updateOtherLabels = (newLabels) => {
        const newLabel = newLabels[newLabels.length - 1];
        const filtered = labels.filter(l => !OTHER_SELF_LABELS.includes(l));
        onChange([
            ...new Set([...filtered, newLabel].filter(Boolean)),
        ]);
    };
    return (_jsxs(_Fragment, { children: [_jsxs(Button, { variant: "solid", color: "secondary", size: "small", testID: "labelsBtn", onPress: () => {
                    Keyboard.dismiss();
                    control.open();
                }, label: _(msg `Content warnings`), accessibilityHint: _(msg `Opens a dialog to add a content warning to your post`), style: [
                    native({
                        paddingHorizontal: 8,
                        paddingVertical: 6,
                    }),
                ], children: [_jsx(ButtonIcon, { icon: hasLabel ? Check : Shield_Stroke2_Corner0_Rounded }), _jsx(ButtonText, { numberOfLines: 1, children: labels.length > 0 ? (_jsx(Trans, { children: "Labels added" })) : (_jsx(Trans, { children: "Labels" })) })] }), _jsxs(Dialog.Outer, { control: control, nativeOptions: { preventExpansion: true }, children: [_jsx(Dialog.Handle, {}), _jsx(DialogInner, { labels: labels, updateAdultLabels: updateAdultLabels, updateOtherLabels: updateOtherLabels })] })] }));
}
function DialogInner({ labels, updateAdultLabels, updateOtherLabels, }) {
    const { _ } = useLingui();
    const control = Dialog.useDialogContext();
    const t = useTheme();
    return (_jsxs(Dialog.ScrollableInner, { label: _(msg `Add a content warning`), style: [{ maxWidth: 500 }, a.w_full], children: [_jsxs(View, { style: [a.flex_1], children: [_jsxs(View, { style: [a.gap_sm], children: [_jsx(Text, { style: [a.text_2xl, a.font_bold], children: _jsx(Trans, { children: "Add a content warning" }) }), _jsx(Text, { style: [t.atoms.text_contrast_medium, a.leading_snug], children: _jsx(Trans, { children: "Please add any content warning labels that are applicable for the media you are posting." }) })] }), _jsxs(View, { style: [a.my_md, a.gap_lg], children: [_jsxs(View, { children: [_jsx(View, { style: [a.flex_row, a.align_center, a.justify_between, a.pb_sm], children: _jsx(Text, { style: [a.font_bold, a.text_lg], children: _jsx(Trans, { children: "Adult Content" }) }) }), _jsxs(View, { style: [
                                            a.p_md,
                                            a.rounded_sm,
                                            a.border,
                                            t.atoms.border_contrast_medium,
                                        ], children: [_jsx(Toggle.Group, { label: _(msg `Adult Content labels`), values: labels, onChange: values => {
                                                    updateAdultLabels(values);
                                                }, children: _jsxs(View, { style: [a.gap_sm], children: [_jsxs(Toggle.Item, { name: "sexual", label: _(msg `Suggestive`), children: [_jsx(Toggle.Checkbox, {}), _jsx(Toggle.LabelText, { children: _jsx(Trans, { children: "Suggestive" }) })] }), _jsxs(Toggle.Item, { name: "nudity", label: _(msg `Nudity`), children: [_jsx(Toggle.Checkbox, {}), _jsx(Toggle.LabelText, { children: _jsx(Trans, { children: "Nudity" }) })] }), _jsxs(Toggle.Item, { name: "porn", label: _(msg `Porn`), children: [_jsx(Toggle.Checkbox, {}), _jsx(Toggle.LabelText, { children: _jsx(Trans, { children: "Adult" }) })] })] }) }), labels.includes('sexual') ||
                                                labels.includes('nudity') ||
                                                labels.includes('porn') ? (_jsx(Text, { style: [a.mt_sm, t.atoms.text_contrast_medium], children: labels.includes('sexual') ? (_jsx(Trans, { children: "Pictures meant for adults." })) : labels.includes('nudity') ? (_jsx(Trans, { children: "Artistic or non-erotic nudity." })) : labels.includes('porn') ? (_jsx(Trans, { children: "Sexual activity or erotic nudity." })) : ('') })) : null] })] }), _jsxs(View, { children: [_jsx(View, { style: [a.flex_row, a.align_center, a.justify_between, a.pb_sm], children: _jsx(Text, { style: [a.font_bold, a.text_lg], children: _jsx(Trans, { children: "Other" }) }) }), _jsxs(View, { style: [
                                            a.p_md,
                                            a.rounded_sm,
                                            a.border,
                                            t.atoms.border_contrast_medium,
                                        ], children: [_jsx(Toggle.Group, { label: _(msg `Adult Content labels`), values: labels, onChange: values => {
                                                    updateOtherLabels(values);
                                                }, children: _jsxs(Toggle.Item, { name: "graphic-media", label: _(msg `Graphic Media`), children: [_jsx(Toggle.Checkbox, {}), _jsx(Toggle.LabelText, { children: _jsx(Trans, { children: "Graphic Media" }) })] }) }), labels.includes('graphic-media') ? (_jsx(Text, { style: [a.mt_sm, t.atoms.text_contrast_medium], children: _jsx(Trans, { children: "Media that may be disturbing or inappropriate for some audiences." }) })) : null] })] })] })] }), _jsx(View, { style: [a.mt_sm, web([a.flex_row, a.ml_auto])], children: _jsx(Button, { label: _(msg `Done`), onPress: () => control.close(), color: "primary", size: isWeb ? 'small' : 'large', variant: "solid", testID: "confirmBtn", children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Done" }) }) }) })] }));
}
//# sourceMappingURL=LabelsBtn.js.map