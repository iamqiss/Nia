import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { getLabelingServiceTitle } from '#/lib/moderation';
import {} from '#/lib/moderation/useReportOptions';
import { isAndroid } from '#/platform/detection';
import { useAgent } from '#/state/session';
import { CharProgress } from '#/view/com/composer/char-progress/CharProgress';
import * as Toast from '#/view/com/util/Toast';
import { atoms as a, native, useTheme } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import * as Toggle from '#/components/forms/Toggle';
import { Check_Stroke2_Corner0_Rounded as Check } from '#/components/icons/Check';
import { ChevronLeft_Stroke2_Corner0_Rounded as ChevronLeft } from '#/components/icons/Chevron';
import { PaperPlane_Stroke2_Corner0_Rounded as SendIcon } from '#/components/icons/PaperPlane';
import { Loader } from '#/components/Loader';
import { Text } from '#/components/Typography';
import {} from './types';
export function SubmitView({ params, labelers, selectedLabeler, selectedReportOption, goBack, onSubmitComplete, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const agent = useAgent();
    const [details, setDetails] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);
    const [selectedServices, setSelectedServices] = React.useState([
        selectedLabeler,
    ]);
    const [error, setError] = React.useState('');
    const submit = React.useCallback(async () => {
        setSubmitting(true);
        setError('');
        const $type = params.type === 'account'
            ? 'com.atproto.admin.defs#repoRef'
            : 'com.atproto.repo.strongRef';
        const report = {
            reasonType: selectedReportOption.reason,
            subject: {
                $type,
                ...params,
            },
            reason: details,
        };
        const results = await Promise.all(selectedServices.map(did => {
            return agent
                .createModerationReport(report, {
                encoding: 'application/json',
                headers: {
                    'atproto-proxy': `${did}#atproto_labeler`,
                },
            })
                .then(_ => true, _ => false);
        }));
        setSubmitting(false);
        if (results.includes(true)) {
            Toast.show(_(msg `Thank you. Your report has been sent.`));
            onSubmitComplete();
        }
        else {
            setError(_(msg `There was an issue sending your report. Please check your internet connection.`));
        }
    }, [
        _,
        params,
        details,
        selectedReportOption,
        selectedServices,
        onSubmitComplete,
        setError,
        agent,
    ]);
    return (_jsxs(View, { style: [a.gap_2xl], children: [_jsx(Button, { size: "small", variant: "solid", color: "secondary", shape: "round", label: _(msg `Go back to previous step`), onPress: goBack, children: _jsx(ButtonIcon, { icon: ChevronLeft }) }), _jsxs(View, { style: [
                    a.w_full,
                    a.flex_row,
                    a.align_center,
                    a.justify_between,
                    a.gap_lg,
                    a.p_md,
                    a.rounded_md,
                    a.border,
                    t.atoms.border_contrast_low,
                ], children: [_jsxs(View, { style: [a.flex_1, a.gap_xs], children: [_jsx(Text, { style: [a.text_md, a.font_bold], children: selectedReportOption.title }), _jsx(Text, { style: [a.leading_tight, { maxWidth: 400 }], children: selectedReportOption.description })] }), _jsx(Check, { size: "md", style: [a.pr_sm, t.atoms.text_contrast_low] })] }), _jsxs(View, { style: [a.gap_md], children: [_jsx(Text, { style: [t.atoms.text_contrast_medium], children: _jsx(Trans, { children: "Select the moderation service(s) to report to" }) }), _jsx(Toggle.Group, { label: "Select mod services", values: selectedServices, onChange: setSelectedServices, children: _jsx(View, { style: [a.flex_row, a.gap_md, a.flex_wrap], children: labelers.map(labeler => {
                                const title = getLabelingServiceTitle({
                                    displayName: labeler.creator.displayName,
                                    handle: labeler.creator.handle,
                                });
                                return (_jsx(Toggle.Item, { name: labeler.creator.did, label: title, children: _jsx(LabelerToggle, { title: title }) }, labeler.creator.did));
                            }) }) })] }), _jsxs(View, { style: [a.gap_md], children: [_jsx(Text, { style: [t.atoms.text_contrast_medium], children: _jsx(Trans, { children: "Optionally provide additional information below:" }) }), _jsxs(View, { style: [a.relative, a.w_full], children: [_jsx(Dialog.Input, { multiline: true, value: details, onChangeText: setDetails, label: "Text field", style: { paddingRight: 60 }, numberOfLines: 6 }), _jsx(View, { style: [
                                    a.absolute,
                                    a.flex_row,
                                    a.align_center,
                                    a.pr_md,
                                    a.pb_sm,
                                    {
                                        bottom: 0,
                                        right: 0,
                                    },
                                ], children: _jsx(CharProgress, { count: details?.length || 0 }) })] })] }), _jsxs(View, { style: [a.flex_row, a.align_center, a.justify_end, a.gap_lg], children: [!selectedServices.length ||
                        (error && (_jsx(Text, { style: [
                                a.flex_1,
                                a.italic,
                                a.leading_snug,
                                t.atoms.text_contrast_medium,
                            ], children: error ? (error) : (_jsx(Trans, { children: "You must select at least one labeler for a report" })) }))), _jsxs(Button, { testID: "sendReportBtn", size: "large", variant: "solid", color: "negative", label: _(msg `Send report`), onPress: submit, disabled: !selectedServices.length, children: [_jsx(ButtonText, { children: _jsx(Trans, { children: "Send report" }) }), _jsx(ButtonIcon, { icon: submitting ? Loader : SendIcon })] })] }), isAndroid ? _jsx(View, { style: { height: 300 } }) : null] }));
}
function LabelerToggle({ title }) {
    const t = useTheme();
    const ctx = Toggle.useItemContext();
    return (_jsxs(View, { style: [
            a.flex_row,
            a.align_center,
            a.gap_md,
            a.p_md,
            a.pr_lg,
            a.rounded_sm,
            a.overflow_hidden,
            t.atoms.bg_contrast_25,
            ctx.selected && [t.atoms.bg_contrast_50],
        ], children: [_jsx(Toggle.Checkbox, {}), _jsx(View, { style: [
                    a.flex_row,
                    a.align_center,
                    a.justify_between,
                    a.gap_lg,
                    a.z_10,
                ], children: _jsx(Text, { emoji: true, style: [
                        native({ marginTop: 2 }),
                        t.atoms.text_contrast_medium,
                        ctx.selected && t.atoms.text,
                    ], children: title }) })] }));
}
//# sourceMappingURL=SubmitView.js.map