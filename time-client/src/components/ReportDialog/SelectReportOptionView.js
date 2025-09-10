import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useReportOptions, } from '#/lib/moderation/useReportOptions';
import { Link } from '#/components/Link';
import { DMCA_LINK } from '#/components/ReportDialog/const';
export { useDialogControl as useReportDialogControl } from '#/components/Dialog';
import { atoms as a, useBreakpoints, useTheme } from '#/alf';
import { Button, ButtonIcon, ButtonText, useButtonContext, } from '#/components/Button';
import { Divider } from '#/components/Divider';
import { ChevronLeft_Stroke2_Corner0_Rounded as ChevronLeft, ChevronRight_Stroke2_Corner0_Rounded as ChevronRight, } from '#/components/icons/Chevron';
import { SquareArrowTopRight_Stroke2_Corner0_Rounded as SquareArrowTopRight } from '#/components/icons/SquareArrowTopRight';
import { Text } from '#/components/Typography';
import {} from './types';
export function SelectReportOptionView(props) {
    const t = useTheme();
    const { _ } = useLingui();
    const { gtMobile } = useBreakpoints();
    const allReportOptions = useReportOptions();
    const reportOptions = allReportOptions[props.params.type];
    const i18n = React.useMemo(() => {
        let title = _(msg `Report this content`);
        let description = _(msg `Why should this content be reviewed?`);
        if (props.params.type === 'account') {
            title = _(msg `Report this user`);
            description = _(msg `Why should this user be reviewed?`);
        }
        else if (props.params.type === 'post') {
            title = _(msg `Report this post`);
            description = _(msg `Why should this post be reviewed?`);
        }
        else if (props.params.type === 'list') {
            title = _(msg `Report this list`);
            description = _(msg `Why should this list be reviewed?`);
        }
        else if (props.params.type === 'feedgen') {
            title = _(msg `Report this feed`);
            description = _(msg `Why should this feed be reviewed?`);
        }
        else if (props.params.type === 'starterpack') {
            title = _(msg `Report this starter pack`);
            description = _(msg `Why should this starter pack be reviewed?`);
        }
        else if (props.params.type === 'convoMessage') {
            title = _(msg `Report this message`);
            description = _(msg `Why should this message be reviewed?`);
        }
        return {
            title,
            description,
        };
    }, [_, props.params.type]);
    return (_jsxs(View, { style: [a.gap_lg], children: [props.labelers?.length > 1 ? (_jsx(Button, { size: "small", variant: "solid", color: "secondary", shape: "round", label: _(msg `Go back to previous step`), onPress: props.goBack, children: _jsx(ButtonIcon, { icon: ChevronLeft }) })) : null, _jsxs(View, { style: [a.justify_center, gtMobile ? a.gap_sm : a.gap_xs], children: [_jsx(Text, { style: [a.text_2xl, a.font_bold], children: i18n.title }), _jsx(Text, { style: [a.text_md, t.atoms.text_contrast_medium], children: i18n.description })] }), _jsx(Divider, {}), _jsxs(View, { style: [a.gap_sm], children: [reportOptions.map(reportOption => {
                        return (_jsx(Button, { testID: reportOption.reason, label: _(msg `Create report for ${reportOption.title}`), onPress: () => props.onSelectReportOption(reportOption), children: _jsx(ReportOptionButton, { title: reportOption.title, description: reportOption.description }) }, reportOption.reason));
                    }), (props.params.type === 'post' || props.params.type === 'account') && (_jsxs(View, { style: [
                            a.flex_row,
                            a.align_center,
                            a.justify_between,
                            a.gap_lg,
                            a.p_md,
                            a.pl_lg,
                            a.rounded_md,
                            t.atoms.bg_contrast_900,
                        ], children: [_jsx(Text, { style: [
                                    a.flex_1,
                                    t.atoms.text_inverted,
                                    a.italic,
                                    a.leading_snug,
                                ], children: _jsx(Trans, { children: "Need to report a copyright violation?" }) }), _jsxs(Link, { to: DMCA_LINK, label: _(msg `View details for reporting a copyright violation`), size: "small", variant: "solid", color: "secondary", children: [_jsx(ButtonText, { children: _jsx(Trans, { children: "View details" }) }), _jsx(ButtonIcon, { position: "right", icon: SquareArrowTopRight })] })] }))] })] }));
}
function ReportOptionButton({ title, description, }) {
    const t = useTheme();
    const { hovered, pressed } = useButtonContext();
    const interacted = hovered || pressed;
    return (_jsxs(View, { style: [
            a.w_full,
            a.flex_row,
            a.align_center,
            a.justify_between,
            a.p_md,
            a.rounded_md,
            { paddingRight: 70 },
            t.atoms.bg_contrast_25,
            interacted && t.atoms.bg_contrast_50,
        ], children: [_jsxs(View, { style: [a.flex_1, a.gap_xs], children: [_jsx(Text, { style: [a.text_md, a.font_bold, t.atoms.text_contrast_medium], children: title }), _jsx(Text, { style: [a.leading_tight, { maxWidth: 400 }], children: description })] }), _jsx(View, { style: [
                    a.absolute,
                    a.inset_0,
                    a.justify_center,
                    a.pr_md,
                    { left: 'auto' },
                ], children: _jsx(ChevronRight, { size: "md", fill: t.atoms.text_contrast_low.color }) })] }));
}
//# sourceMappingURL=SelectReportOptionView.js.map