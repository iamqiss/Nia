import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { Pressable, View } from 'react-native';
import {} from 'react-native-gesture-handler';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { wait } from '#/lib/async/wait';
import { getLabelingServiceTitle } from '#/lib/moderation';
import { sanitizeHandle } from '#/lib/strings/handles';
import { Logger } from '#/logger';
import { isNative } from '#/platform/detection';
import { useMyLabelersQuery } from '#/state/queries/preferences';
import { CharProgress } from '#/view/com/composer/char-progress/CharProgress';
import { UserAvatar } from '#/view/com/util/UserAvatar';
import { atoms as a, useGutters, useTheme } from '#/alf';
import * as Admonition from '#/components/Admonition';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { useDelayedLoading } from '#/components/hooks/useDelayedLoading';
import { ArrowRotateCounterClockwise_Stroke2_Corner0_Rounded as Retry } from '#/components/icons/ArrowRotateCounterClockwise';
import { Check_Stroke2_Corner0_Rounded as CheckThin, CheckThick_Stroke2_Corner0_Rounded as Check, } from '#/components/icons/Check';
import { PaperPlane_Stroke2_Corner0_Rounded as PaperPlane } from '#/components/icons/PaperPlane';
import { SquareArrowTopRight_Stroke2_Corner0_Rounded as SquareArrowTopRight } from '#/components/icons/SquareArrowTopRight';
import { TimesLarge_Stroke2_Corner0_Rounded as X } from '#/components/icons/Times';
import { createStaticClick, InlineLinkText, Link } from '#/components/Link';
import { Loader } from '#/components/Loader';
import { Text } from '#/components/Typography';
import { useSubmitReportMutation } from './action';
import { SUPPORT_PAGE } from './const';
import { useCopyForSubject } from './copy';
import { initialState, reducer } from './state';
import {} from './types';
import { parseReportSubject } from './utils/parseReportSubject';
import { useReportOptions } from './utils/useReportOptions';
export { useDialogControl as useReportDialogControl } from '#/components/Dialog';
const logger = Logger.create(Logger.Context.ReportDialog);
export function ReportDialog(props) {
    const subject = React.useMemo(() => parseReportSubject(props.subject), [props.subject]);
    const onClose = React.useCallback(() => {
        logger.metric('reportDialog:close', {}, { statsig: false });
    }, []);
    return (_jsxs(Dialog.Outer, { control: props.control, onClose: onClose, children: [_jsx(Dialog.Handle, {}), subject ? _jsx(Inner, { ...props, subject: subject }) : _jsx(Invalid, {})] }));
}
/**
 * This should only be shown if the dialog is configured incorrectly by a
 * developer, but nevertheless we should have a graceful fallback.
 */
function Invalid() {
    const { _ } = useLingui();
    return (_jsxs(Dialog.ScrollableInner, { label: _(msg `Report dialog`), children: [_jsx(Text, { style: [a.font_heavy, a.text_xl, a.leading_snug, a.pb_xs], children: _jsx(Trans, { children: "Invalid report subject" }) }), _jsx(Text, { style: [a.text_md, a.leading_snug], children: _jsx(Trans, { children: "Something wasn't quite right with the data you're trying to report. Please contact support." }) }), _jsx(Dialog.Close, {})] }));
}
function Inner(props) {
    const t = useTheme();
    const { _ } = useLingui();
    const ref = React.useRef(null);
    const { data: allLabelers, isLoading: isLabelerLoading, error: labelersLoadError, refetch: refetchLabelers, } = useMyLabelersQuery({ excludeNonConfigurableLabelers: true });
    const isLoading = useDelayedLoading(500, isLabelerLoading);
    const copy = useCopyForSubject(props.subject);
    const reportOptions = useReportOptions();
    const [state, dispatch] = React.useReducer(reducer, initialState);
    /**
     * Submission handling
     */
    const { mutateAsync: submitReport } = useSubmitReportMutation();
    const [isPending, setPending] = React.useState(false);
    const [isSuccess, setSuccess] = React.useState(false);
    /**
     * Labelers that support this `subject` and its NSID collection
     */
    const supportedLabelers = React.useMemo(() => {
        if (!allLabelers)
            return [];
        return allLabelers
            .filter(l => {
            const subjectTypes = l.subjectTypes;
            if (subjectTypes === undefined)
                return true;
            if (props.subject.type === 'account') {
                return subjectTypes.includes('account');
            }
            else if (props.subject.type === 'chatMessage') {
                return subjectTypes.includes('chat');
            }
            else {
                return subjectTypes.includes('record');
            }
        })
            .filter(l => {
            const collections = l.subjectCollections;
            if (collections === undefined)
                return true;
            // all chat collections accepted, since only Bluesky handles chats
            if (props.subject.type === 'chatMessage')
                return true;
            return collections.includes(props.subject.nsid);
        })
            .filter(l => {
            if (!state.selectedOption)
                return true;
            const reasonTypes = l.reasonTypes;
            if (reasonTypes === undefined)
                return true;
            return reasonTypes.includes(state.selectedOption.reason);
        });
    }, [props, allLabelers, state.selectedOption]);
    const hasSupportedLabelers = !!supportedLabelers.length;
    const hasSingleSupportedLabeler = supportedLabelers.length === 1;
    const onSubmit = React.useCallback(async () => {
        dispatch({ type: 'clearError' });
        logger.info('submitting');
        try {
            setPending(true);
            // wait at least 1s, make it feel substantial
            await wait(1e3, submitReport({
                subject: props.subject,
                state,
            }));
            setSuccess(true);
            logger.metric('reportDialog:success', {
                reason: state.selectedOption?.reason,
                labeler: state.selectedLabeler?.creator.handle,
                details: !!state.details,
            }, { statsig: false });
            // give time for user feedback
            setTimeout(() => {
                props.control.close();
            }, 1e3);
        }
        catch (e) {
            logger.metric('reportDialog:failure', {}, { statsig: false });
            logger.error(e, {
                source: 'ReportDialog',
            });
            dispatch({
                type: 'setError',
                error: _(msg `Something went wrong. Please try again.`),
            });
        }
        finally {
            setPending(false);
        }
    }, [_, submitReport, state, dispatch, props, setPending, setSuccess]);
    React.useEffect(() => {
        logger.metric('reportDialog:open', {
            subjectType: props.subject.type,
        }, { statsig: false });
    }, [props.subject]);
    return (_jsxs(Dialog.ScrollableInner, { testID: "report:dialog", label: _(msg `Report dialog`), ref: ref, style: [a.w_full, { maxWidth: 500 }], children: [_jsxs(View, { style: [a.gap_2xl, isNative && a.pt_md], children: [_jsxs(StepOuter, { children: [_jsx(StepTitle, { index: 1, title: copy.subtitle, activeIndex1: state.activeStepIndex1 }), isLoading ? (_jsxs(View, { style: [a.gap_sm], children: [_jsx(OptionCardSkeleton, {}), _jsx(OptionCardSkeleton, {}), _jsx(OptionCardSkeleton, {}), _jsx(OptionCardSkeleton, {}), _jsx(OptionCardSkeleton, {}), _jsx(Pressable, { accessible: false })] })) : labelersLoadError || !allLabelers ? (_jsx(Admonition.Outer, { type: "error", children: _jsxs(Admonition.Row, { children: [_jsx(Admonition.Icon, {}), _jsx(Admonition.Text, { children: _jsx(Trans, { children: "Something went wrong, please try again" }) }), _jsxs(Admonition.Button, { label: _(msg `Retry loading report options`), onPress: () => refetchLabelers(), children: [_jsx(ButtonText, { children: _jsx(Trans, { children: "Retry" }) }), _jsx(ButtonIcon, { icon: Retry })] })] }) })) : (_jsx(_Fragment, { children: state.selectedOption ? (_jsxs(View, { style: [a.flex_row, a.align_center, a.gap_md], children: [_jsx(View, { style: [a.flex_1], children: _jsx(OptionCard, { option: state.selectedOption }) }), _jsx(Button, { testID: "report:clearOption", label: _(msg `Change report reason`), size: "tiny", variant: "solid", color: "secondary", shape: "round", onPress: () => {
                                                dispatch({ type: 'clearOption' });
                                            }, children: _jsx(ButtonIcon, { icon: X }) })] })) : (_jsxs(View, { style: [a.gap_sm], children: [reportOptions[props.subject.type].map(o => (_jsx(OptionCard, { option: o, onSelect: () => {
                                                dispatch({ type: 'selectOption', option: o });
                                            } }, o.reason))), ['post', 'account'].includes(props.subject.type) && (_jsx(Link, { to: SUPPORT_PAGE, label: _(msg `Need to report a copyright violation, legal request, or regulatory compliance issue?`), children: ({ hovered, pressed }) => (_jsxs(View, { style: [
                                                    a.flex_row,
                                                    a.align_center,
                                                    a.w_full,
                                                    a.px_md,
                                                    a.py_sm,
                                                    a.rounded_sm,
                                                    a.border,
                                                    hovered || pressed
                                                        ? [t.atoms.border_contrast_high]
                                                        : [t.atoms.border_contrast_low],
                                                ], children: [_jsx(Text, { style: [a.flex_1, a.italic, a.leading_snug], children: _jsx(Trans, { children: "Need to report a copyright violation, legal request, or regulatory compliance issue?" }) }), _jsx(SquareArrowTopRight, { size: "sm", fill: t.atoms.text.color })] })) }))] })) }))] }), _jsxs(StepOuter, { children: [_jsx(StepTitle, { index: 2, title: _(msg `Select moderation service`), activeIndex1: state.activeStepIndex1 }), state.activeStepIndex1 >= 2 && (_jsx(_Fragment, { children: state.selectedLabeler ? (_jsx(_Fragment, { children: hasSingleSupportedLabeler ? (_jsx(LabelerCard, { labeler: state.selectedLabeler })) : (_jsxs(View, { style: [a.flex_row, a.align_center, a.gap_md], children: [_jsx(View, { style: [a.flex_1], children: _jsx(LabelerCard, { labeler: state.selectedLabeler }) }), _jsx(Button, { label: _(msg `Change moderation service`), size: "tiny", variant: "solid", color: "secondary", shape: "round", onPress: () => {
                                                    dispatch({ type: 'clearLabeler' });
                                                }, children: _jsx(ButtonIcon, { icon: X }) })] })) })) : (_jsx(_Fragment, { children: hasSupportedLabelers ? (_jsx(View, { style: [a.gap_sm], children: hasSingleSupportedLabeler ? (_jsxs(_Fragment, { children: [_jsx(LabelerCard, { labeler: supportedLabelers[0] }), _jsx(ActionOnce, { check: () => !state.selectedLabeler, callback: () => {
                                                        dispatch({
                                                            type: 'selectLabeler',
                                                            labeler: supportedLabelers[0],
                                                        });
                                                    } })] })) : (_jsx(_Fragment, { children: supportedLabelers.map(l => (_jsx(LabelerCard, { labeler: l, onSelect: () => {
                                                    dispatch({ type: 'selectLabeler', labeler: l });
                                                } }, l.creator.did))) })) })) : (
                                    // should never happen in our app
                                    _jsx(Admonition.Admonition, { type: "warning", children: _jsx(Trans, { children: "Unfortunately, none of your subscribed labelers supports this report type." }) })) })) }))] }), _jsxs(StepOuter, { children: [_jsx(StepTitle, { index: 3, title: _(msg `Submit report`), activeIndex1: state.activeStepIndex1 }), state.activeStepIndex1 === 3 && (_jsxs(_Fragment, { children: [_jsxs(View, { style: [a.pb_xs, a.gap_xs], children: [_jsxs(Text, { style: [a.leading_snug, a.pb_xs], children: [_jsxs(Trans, { children: ["Your report will be sent to", ' ', _jsx(Text, { style: [a.font_bold, a.leading_snug], children: state.selectedLabeler?.creator.displayName }), "."] }), ' ', !state.detailsOpen ? (_jsx(InlineLinkText, { label: _(msg `Add more details (optional)`), ...createStaticClick(() => {
                                                            dispatch({ type: 'showDetails' });
                                                        }), children: _jsx(Trans, { children: "Add more details (optional)" }) })) : null] }), state.detailsOpen && (_jsxs(View, { children: [_jsx(Dialog.Input, { testID: "report:details", multiline: true, value: state.details, onChangeText: details => {
                                                            dispatch({ type: 'setDetails', details });
                                                        }, label: _(msg `Additional details (limit 300 characters)`), style: { paddingRight: 60 }, numberOfLines: 4 }), _jsx(View, { style: [
                                                            a.absolute,
                                                            a.flex_row,
                                                            a.align_center,
                                                            a.pr_md,
                                                            a.pb_sm,
                                                            {
                                                                bottom: 0,
                                                                right: 0,
                                                            },
                                                        ], children: _jsx(CharProgress, { count: state.details?.length || 0 }) })] }))] }), _jsxs(Button, { testID: "report:submit", label: _(msg `Submit report`), size: "large", variant: "solid", color: "primary", disabled: isPending || isSuccess, onPress: onSubmit, children: [_jsx(ButtonText, { children: _jsx(Trans, { children: "Submit report" }) }), _jsx(ButtonIcon, { icon: isSuccess ? CheckThin : isPending ? Loader : PaperPlane })] }), state.error && (_jsx(Admonition.Admonition, { type: "error", children: state.error }))] }))] })] }), _jsx(Dialog.Close, {})] }));
}
function ActionOnce({ check, callback, }) {
    React.useEffect(() => {
        if (check()) {
            callback();
        }
    }, [check, callback]);
    return null;
}
function StepOuter({ children }) {
    return _jsx(View, { style: [a.gap_md, a.w_full], children: children });
}
function StepTitle({ index, title, activeIndex1, }) {
    const t = useTheme();
    const active = activeIndex1 === index;
    const completed = activeIndex1 > index;
    return (_jsxs(View, { style: [a.flex_row, a.gap_sm, a.pr_3xl], children: [_jsx(View, { style: [
                    a.justify_center,
                    a.align_center,
                    a.rounded_full,
                    a.border,
                    {
                        width: 24,
                        height: 24,
                        backgroundColor: active
                            ? t.palette.primary_500
                            : completed
                                ? t.palette.primary_100
                                : t.atoms.bg_contrast_25.backgroundColor,
                        borderColor: active
                            ? t.palette.primary_500
                            : completed
                                ? t.palette.primary_400
                                : t.atoms.border_contrast_low.borderColor,
                    },
                ], children: completed ? (_jsx(Check, { width: 12 })) : (_jsx(Text, { style: [
                        a.font_heavy,
                        a.text_center,
                        t.atoms.text,
                        {
                            color: active
                                ? 'white'
                                : completed
                                    ? t.palette.primary_700
                                    : t.atoms.text_contrast_medium.color,
                            fontVariant: ['tabular-nums'],
                            width: 24,
                            height: 24,
                            lineHeight: 24,
                        },
                    ], children: index })) }), _jsx(Text, { style: [
                    a.flex_1,
                    a.font_heavy,
                    a.text_lg,
                    a.leading_snug,
                    active ? t.atoms.text : t.atoms.text_contrast_medium,
                    {
                        top: 1,
                    },
                ], children: title })] }));
}
function OptionCard({ option, onSelect, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const gutters = useGutters(['compact']);
    const onPress = React.useCallback(() => {
        onSelect?.(option);
    }, [onSelect, option]);
    return (_jsx(Button, { testID: `report:option:${option.reason}`, label: _(msg `Create report for ${option.title}`), onPress: onPress, disabled: !onSelect, children: ({ hovered, pressed }) => (_jsxs(View, { style: [
                a.w_full,
                gutters,
                a.py_sm,
                a.rounded_sm,
                a.border,
                t.atoms.bg_contrast_25,
                hovered || pressed
                    ? [t.atoms.border_contrast_high]
                    : [t.atoms.border_contrast_low],
            ], children: [_jsx(Text, { style: [a.text_md, a.font_bold, a.leading_snug], children: option.title }), _jsx(Text, { style: [a.text_sm, , a.leading_snug, t.atoms.text_contrast_medium], children: option.description })] })) }));
}
function OptionCardSkeleton() {
    const t = useTheme();
    return (_jsx(View, { style: [
            a.w_full,
            a.rounded_sm,
            a.border,
            t.atoms.bg_contrast_25,
            t.atoms.border_contrast_low,
            { height: 55 }, // magic, based on web
        ] }));
}
function LabelerCard({ labeler, onSelect, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const onPress = React.useCallback(() => {
        onSelect?.(labeler);
    }, [onSelect, labeler]);
    const title = getLabelingServiceTitle({
        displayName: labeler.creator.displayName,
        handle: labeler.creator.handle,
    });
    return (_jsx(Button, { testID: `report:labeler:${labeler.creator.handle}`, label: _(msg `Send report to ${title}`), onPress: onPress, disabled: !onSelect, children: ({ hovered, pressed }) => (_jsxs(View, { style: [
                a.w_full,
                a.p_sm,
                a.flex_row,
                a.align_center,
                a.gap_sm,
                a.rounded_md,
                a.border,
                t.atoms.bg_contrast_25,
                hovered || pressed
                    ? [t.atoms.border_contrast_high]
                    : [t.atoms.border_contrast_low],
            ], children: [_jsx(UserAvatar, { type: "labeler", size: 36, avatar: labeler.creator.avatar }), _jsxs(View, { style: [a.flex_1], children: [_jsx(Text, { style: [a.text_md, a.font_bold, a.leading_snug], children: title }), _jsx(Text, { style: [
                                a.text_sm,
                                ,
                                a.leading_snug,
                                t.atoms.text_contrast_medium,
                            ], children: _jsxs(Trans, { children: ["By ", sanitizeHandle(labeler.creator.handle, '@')] }) })] })] })) }));
}
//# sourceMappingURL=index.js.map