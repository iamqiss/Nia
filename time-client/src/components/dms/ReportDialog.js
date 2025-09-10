import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useMemo, useState } from 'react';
import { View } from 'react-native';
import { RichText as RichTextAPI, } from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { StackActions, useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { BLUESKY_MOD_SERVICE_HEADERS } from '#/lib/constants';
import {} from '#/lib/moderation/useReportOptions';
import {} from '#/lib/routes/types';
import { isNative } from '#/platform/detection';
import { useProfileShadow } from '#/state/cache/profile-shadow';
import { useLeaveConvo } from '#/state/queries/messages/leave-conversation';
import { useProfileBlockMutationQueue, useProfileQuery, } from '#/state/queries/profile';
import { useAgent } from '#/state/session';
import { CharProgress } from '#/view/com/composer/char-progress/CharProgress';
import * as Toast from '#/view/com/util/Toast';
import { atoms as a, platform, useBreakpoints, useTheme, web } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { Divider } from '#/components/Divider';
import * as Toggle from '#/components/forms/Toggle';
import { ChevronLeft_Stroke2_Corner0_Rounded as Chevron } from '#/components/icons/Chevron';
import { PaperPlane_Stroke2_Corner0_Rounded as SendIcon } from '#/components/icons/PaperPlane';
import { Loader } from '#/components/Loader';
import { SelectReportOptionView } from '#/components/ReportDialog/SelectReportOptionView';
import { RichText } from '#/components/RichText';
import { Text } from '#/components/Typography';
import { MessageItemMetadata } from './MessageItem';
let ReportDialog = ({ control, params, currentScreen, }) => {
    const { _ } = useLingui();
    return (_jsxs(Dialog.Outer, { control: control, children: [_jsx(Dialog.Handle, {}), _jsxs(Dialog.ScrollableInner, { label: _(msg `Report this message`), children: [_jsx(DialogInner, { params: params, currentScreen: currentScreen }), _jsx(Dialog.Close, {})] })] }));
};
ReportDialog = memo(ReportDialog);
export { ReportDialog };
function DialogInner({ params, currentScreen, }) {
    const { data: profile, isError } = useProfileQuery({
        did: params.message.sender.did,
    });
    const [reportOption, setReportOption] = useState(null);
    const [done, setDone] = useState(false);
    const control = Dialog.useDialogContext();
    return done ? (profile ? (_jsx(DoneStep, { convoId: params.convoId, currentScreen: currentScreen, profile: profile })) : (_jsx(View, { style: [a.w_full, a.py_5xl, a.align_center], children: _jsx(Loader, {}) }))) : reportOption ? (_jsx(SubmitStep, { params: params, reportOption: reportOption, goBack: () => setReportOption(null), onComplete: () => {
            if (isError) {
                control.close();
            }
            else {
                setDone(true);
            }
        } })) : (_jsx(ReasonStep, { params: params, setReportOption: setReportOption }));
}
function ReasonStep({ setReportOption, }) {
    const control = Dialog.useDialogContext();
    return (_jsx(SelectReportOptionView, { labelers: [], goBack: control.close, params: {
            type: 'convoMessage',
        }, onSelectReportOption: setReportOption }));
}
function SubmitStep({ params, reportOption, goBack, onComplete, }) {
    const { _ } = useLingui();
    const { gtMobile } = useBreakpoints();
    const t = useTheme();
    const [details, setDetails] = useState('');
    const agent = useAgent();
    const { mutate: submit, error, isPending: submitting, } = useMutation({
        mutationFn: async () => {
            if (params.type === 'convoMessage') {
                const { convoId, message } = params;
                const subject = {
                    $type: 'chat.bsky.convo.defs#messageRef',
                    messageId: message.id,
                    convoId,
                    did: message.sender.did,
                };
                const report = {
                    reasonType: reportOption.reason,
                    subject,
                    reason: details,
                };
                await agent.createModerationReport(report, {
                    encoding: 'application/json',
                    headers: BLUESKY_MOD_SERVICE_HEADERS,
                });
            }
        },
        onSuccess: onComplete,
    });
    const copy = useMemo(() => {
        return {
            convoMessage: {
                title: _(msg `Report this message`),
            },
        }[params.type];
    }, [_, params]);
    return (_jsxs(View, { style: a.gap_lg, children: [_jsx(Button, { size: "small", variant: "solid", color: "secondary", shape: "round", label: _(msg `Go back to previous step`), onPress: goBack, children: _jsx(ButtonIcon, { icon: Chevron }) }), _jsxs(View, { style: [a.justify_center, gtMobile ? a.gap_sm : a.gap_xs], children: [_jsx(Text, { style: [a.text_2xl, a.font_bold], children: copy.title }), _jsx(Text, { style: [a.text_md, t.atoms.text_contrast_medium], children: _jsx(Trans, { children: "Your report will be sent to the Bluesky Moderation Service" }) })] }), params.type === 'convoMessage' && (_jsx(PreviewMessage, { message: params.message })), _jsxs(Text, { style: [a.text_md, t.atoms.text_contrast_medium], children: [_jsx(Text, { style: [a.font_bold, a.text_md, t.atoms.text_contrast_medium], children: _jsx(Trans, { children: "Reason:" }) }), ' ', _jsx(Text, { style: [a.font_bold, a.text_md], children: reportOption.title })] }), _jsx(Divider, {}), _jsxs(View, { style: [a.gap_md], children: [_jsx(Text, { style: [t.atoms.text_contrast_medium], children: _jsx(Trans, { children: "Optionally provide additional information below:" }) }), _jsxs(View, { style: [a.relative, a.w_full], children: [_jsx(Dialog.Input, { multiline: true, defaultValue: details, onChangeText: setDetails, label: _(msg `Text field`), style: { paddingRight: 60 }, numberOfLines: 5 }), _jsx(View, { style: [
                                    a.absolute,
                                    a.flex_row,
                                    a.align_center,
                                    a.pr_md,
                                    a.pb_sm,
                                    {
                                        bottom: 0,
                                        right: 0,
                                    },
                                ], children: _jsx(CharProgress, { count: details?.length || 0 }) })] })] }), _jsxs(View, { style: [a.flex_row, a.align_center, a.justify_end, a.gap_lg], children: [error && (_jsx(Text, { style: [
                            a.flex_1,
                            a.italic,
                            a.leading_snug,
                            t.atoms.text_contrast_medium,
                        ], children: _jsx(Trans, { children: "There was an issue sending your report. Please check your internet connection." }) })), _jsxs(Button, { testID: "sendReportBtn", size: "large", variant: "solid", color: "negative", label: _(msg `Send report`), onPress: () => submit(), children: [_jsx(ButtonText, { children: _jsx(Trans, { children: "Send report" }) }), _jsx(ButtonIcon, { icon: submitting ? Loader : SendIcon })] })] })] }));
}
function DoneStep({ convoId, currentScreen, profile, }) {
    const { _ } = useLingui();
    const navigation = useNavigation();
    const control = Dialog.useDialogContext();
    const { gtMobile } = useBreakpoints();
    const t = useTheme();
    const [actions, setActions] = useState(['block', 'leave']);
    const shadow = useProfileShadow(profile);
    const [queueBlock] = useProfileBlockMutationQueue(shadow);
    const { mutate: leaveConvo } = useLeaveConvo(convoId, {
        onMutate: () => {
            if (currentScreen === 'conversation') {
                navigation.dispatch(StackActions.replace('Messages', isNative ? { animation: 'pop' } : {}));
            }
        },
        onError: () => {
            Toast.show(_(msg `Could not leave chat`), 'xmark');
        },
    });
    let btnText = _(msg `Done`);
    let toastMsg;
    if (actions.includes('leave') && actions.includes('block')) {
        btnText = _(msg `Block and Delete`);
        toastMsg = _(msg({ message: 'Conversation deleted', context: 'toast' }));
    }
    else if (actions.includes('leave')) {
        btnText = _(msg `Delete Conversation`);
        toastMsg = _(msg({ message: 'Conversation deleted', context: 'toast' }));
    }
    else if (actions.includes('block')) {
        btnText = _(msg `Block User`);
        toastMsg = _(msg({ message: 'User blocked', context: 'toast' }));
    }
    const onPressPrimaryAction = () => {
        control.close(() => {
            if (actions.includes('block')) {
                queueBlock();
            }
            if (actions.includes('leave')) {
                leaveConvo();
            }
            if (toastMsg) {
                Toast.show(toastMsg, 'check');
            }
        });
    };
    return (_jsxs(View, { style: a.gap_2xl, children: [_jsxs(View, { style: [a.justify_center, gtMobile ? a.gap_sm : a.gap_xs], children: [_jsx(Text, { style: [a.text_2xl, a.font_bold], children: _jsx(Trans, { children: "Report submitted" }) }), _jsx(Text, { style: [a.text_md, t.atoms.text_contrast_medium], children: _jsx(Trans, { children: "Our moderation team has received your report." }) })] }), _jsx(Toggle.Group, { label: _(msg `Block and/or delete this conversation`), values: actions, onChange: setActions, children: _jsxs(View, { style: [a.gap_md], children: [_jsxs(Toggle.Item, { name: "block", label: _(msg `Block user`), children: [_jsx(Toggle.Checkbox, {}), _jsx(Toggle.LabelText, { style: [a.text_md], children: _jsx(Trans, { children: "Block user" }) })] }), _jsxs(Toggle.Item, { name: "leave", label: _(msg `Delete conversation`), children: [_jsx(Toggle.Checkbox, {}), _jsx(Toggle.LabelText, { style: [a.text_md], children: _jsx(Trans, { children: "Delete conversation" }) })] })] }) }), _jsxs(View, { style: [a.gap_md, web([a.flex_row_reverse])], children: [_jsx(Button, { label: btnText, onPress: onPressPrimaryAction, size: "large", variant: "solid", color: actions.length > 0 ? 'negative' : 'primary', children: _jsx(ButtonText, { children: btnText }) }), _jsx(Button, { label: _(msg `Close`), onPress: () => control.close(), size: platform({ native: 'small', web: 'large' }), variant: platform({
                            native: 'ghost',
                            web: 'solid',
                        }), color: "secondary", children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Close" }) }) })] })] }));
}
function PreviewMessage({ message }) {
    const t = useTheme();
    const rt = useMemo(() => {
        return new RichTextAPI({ text: message.text, facets: message.facets });
    }, [message.text, message.facets]);
    return (_jsxs(View, { style: a.align_start, children: [_jsx(View, { style: [
                    a.py_sm,
                    a.my_2xs,
                    a.rounded_md,
                    {
                        paddingLeft: 14,
                        paddingRight: 14,
                        backgroundColor: t.palette.contrast_50,
                        borderRadius: 17,
                    },
                    { borderBottomLeftRadius: 2 },
                ], children: _jsx(RichText, { value: rt, style: [a.text_md, a.leading_snug], interactiveStyle: a.underline, enableTags: true }) }), _jsx(MessageItemMetadata, { item: {
                    type: 'message',
                    message,
                    key: '',
                    nextMessage: null,
                    prevMessage: null,
                }, style: [a.text_left, a.mb_0] })] }));
}
//# sourceMappingURL=ReportDialog.js.map