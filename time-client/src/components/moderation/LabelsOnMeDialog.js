import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { ComAtprotoModerationDefs } from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useMutation } from '@tanstack/react-query';
import { useGetTimeAgo } from '#/lib/hooks/useTimeAgo';
import { useLabelSubject } from '#/lib/moderation';
import { useLabelInfo } from '#/lib/moderation/useLabelInfo';
import { makeProfileLink } from '#/lib/routes/links';
import { sanitizeHandle } from '#/lib/strings/handles';
import { logger } from '#/logger';
import { isAndroid } from '#/platform/detection';
import { useAgent, useSession } from '#/state/session';
import * as Toast from '#/view/com/util/Toast';
import { atoms as a, useBreakpoints, useTheme } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { InlineLinkText } from '#/components/Link';
import { Text } from '#/components/Typography';
import { Divider } from '../Divider';
import { Loader } from '../Loader';
export { useDialogControl as useLabelsOnMeDialogControl } from '#/components/Dialog';
export function LabelsOnMeDialog(props) {
    return (_jsxs(Dialog.Outer, { control: props.control, children: [_jsx(Dialog.Handle, {}), _jsx(LabelsOnMeDialogInner, { ...props })] }));
}
function LabelsOnMeDialogInner(props) {
    const { _ } = useLingui();
    const { currentAccount } = useSession();
    const [appealingLabel, setAppealingLabel] = React.useState(undefined);
    const { labels } = props;
    const isAccount = props.type === 'account';
    const containsSelfLabel = React.useMemo(() => labels.some(l => l.src === currentAccount?.did), [currentAccount?.did, labels]);
    return (_jsxs(Dialog.ScrollableInner, { label: isAccount
            ? _(msg `The following labels were applied to your account.`)
            : _(msg `The following labels were applied to your content.`), children: [appealingLabel ? (_jsx(AppealForm, { label: appealingLabel, control: props.control, onPressBack: () => setAppealingLabel(undefined) })) : (_jsxs(_Fragment, { children: [_jsx(Text, { style: [a.text_2xl, a.font_heavy, a.pb_xs, a.leading_tight], children: isAccount ? (_jsx(Trans, { children: "Labels on your account" })) : (_jsx(Trans, { children: "Labels on your content" })) }), _jsx(Text, { style: [a.text_md, a.leading_snug], children: containsSelfLabel ? (_jsx(Trans, { children: "You may appeal non-self labels if you feel they were placed in error." })) : (_jsx(Trans, { children: "You may appeal these labels if you feel they were placed in error." })) }), _jsx(View, { style: [a.py_lg, a.gap_md], children: labels.map(label => (_jsx(Label, { label: label, isSelfLabel: label.src === currentAccount?.did, control: props.control, onPressAppeal: setAppealingLabel }, `${label.val}-${label.src}`))) })] })), _jsx(Dialog.Close, {})] }));
}
function Label({ label, isSelfLabel, control, onPressAppeal, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const { labeler, strings } = useLabelInfo(label);
    const sourceName = labeler
        ? sanitizeHandle(labeler.creator.handle, '@')
        : label.src;
    const timeDiff = useGetTimeAgo({ future: true });
    return (_jsxs(View, { style: [
            a.border,
            t.atoms.border_contrast_low,
            a.rounded_sm,
            a.overflow_hidden,
        ], children: [_jsxs(View, { style: [a.p_md, a.gap_sm, a.flex_row], children: [_jsxs(View, { style: [a.flex_1, a.gap_xs], children: [_jsx(Text, { emoji: true, style: [a.font_bold, a.text_md], children: strings.name }), _jsx(Text, { emoji: true, style: [t.atoms.text_contrast_medium, a.leading_snug], children: strings.description })] }), !isSelfLabel && (_jsx(View, { children: _jsx(Button, { variant: "solid", color: "secondary", size: "small", label: _(msg `Appeal`), onPress: () => onPressAppeal(label), children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Appeal" }) }) }) }))] }), _jsx(Divider, {}), _jsx(View, { style: [a.px_md, a.py_sm, t.atoms.bg_contrast_25], children: isSelfLabel ? (_jsx(Text, { style: [t.atoms.text_contrast_medium], children: _jsx(Trans, { children: "This label was applied by you." }) })) : (_jsxs(View, { style: [
                        a.flex_row,
                        a.justify_between,
                        a.gap_xl,
                        { paddingBottom: 1 },
                    ], children: [_jsx(Text, { style: [a.flex_1, a.leading_snug, t.atoms.text_contrast_medium], numberOfLines: 1, children: _jsxs(Trans, { children: ["Source:", ' ', _jsx(InlineLinkText, { label: sourceName, to: makeProfileLink(labeler ? labeler.creator : { did: label.src, handle: '' }), onPress: () => control.close(), children: sourceName })] }) }), label.exp && (_jsx(View, { children: _jsx(Text, { style: [
                                    a.leading_snug,
                                    a.text_sm,
                                    a.italic,
                                    t.atoms.text_contrast_medium,
                                ], children: _jsxs(Trans, { children: ["Expires in ", timeDiff(Date.now(), label.exp)] }) }) }))] })) })] }));
}
function AppealForm({ label, control, onPressBack, }) {
    const { _ } = useLingui();
    const { labeler, strings } = useLabelInfo(label);
    const { gtMobile } = useBreakpoints();
    const [details, setDetails] = React.useState('');
    const { subject } = useLabelSubject({ label });
    const isAccountReport = 'did' in subject;
    const agent = useAgent();
    const sourceName = labeler
        ? sanitizeHandle(labeler.creator.handle, '@')
        : label.src;
    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            const $type = !isAccountReport
                ? 'com.atproto.repo.strongRef'
                : 'com.atproto.admin.defs#repoRef';
            await agent.createModerationReport({
                reasonType: ComAtprotoModerationDefs.REASONAPPEAL,
                subject: {
                    $type,
                    ...subject,
                },
                reason: details,
            }, {
                encoding: 'application/json',
                headers: {
                    'atproto-proxy': `${label.src}#atproto_labeler`,
                },
            });
        },
        onError: err => {
            logger.error('Failed to submit label appeal', { message: err });
            Toast.show(_(msg `Failed to submit appeal, please try again.`), 'xmark');
        },
        onSuccess: () => {
            control.close();
            Toast.show(_(msg({ message: 'Appeal submitted', context: 'toast' })));
        },
    });
    const onSubmit = React.useCallback(() => mutate(), [mutate]);
    return (_jsxs(_Fragment, { children: [_jsxs(View, { children: [_jsx(Text, { style: [a.text_2xl, a.font_bold, a.pb_xs, a.leading_tight], children: _jsxs(Trans, { children: ["Appeal \"", strings.name, "\" label"] }) }), _jsx(Text, { style: [a.text_md, a.leading_snug], children: _jsxs(Trans, { children: ["This appeal will be sent to", ' ', _jsx(InlineLinkText, { label: sourceName, to: makeProfileLink(labeler ? labeler.creator : { did: label.src, handle: '' }), onPress: () => control.close(), style: [a.text_md, a.leading_snug], children: sourceName }), "."] }) })] }), _jsx(View, { style: [a.my_md], children: _jsx(Dialog.Input, { label: _(msg `Text input field`), placeholder: _(msg `Please explain why you think this label was incorrectly applied by ${labeler ? sanitizeHandle(labeler.creator.handle, '@') : label.src}`), value: details, onChangeText: setDetails, autoFocus: true, numberOfLines: 3, multiline: true, maxLength: 300 }) }), _jsxs(View, { style: gtMobile
                    ? [a.flex_row, a.justify_between]
                    : [{ flexDirection: 'column-reverse' }, a.gap_sm], children: [_jsx(Button, { testID: "backBtn", variant: "solid", color: "secondary", size: "large", onPress: onPressBack, label: _(msg `Back`), children: _jsx(ButtonText, { children: _(msg `Back`) }) }), _jsxs(Button, { testID: "submitBtn", variant: "solid", color: "primary", size: "large", onPress: onSubmit, label: _(msg `Submit`), children: [_jsx(ButtonText, { children: _(msg `Submit`) }), isPending && _jsx(ButtonIcon, { icon: Loader })] })] }), isAndroid && _jsx(View, { style: { height: 300 } })] }));
}
//# sourceMappingURL=LabelsOnMeDialog.js.map