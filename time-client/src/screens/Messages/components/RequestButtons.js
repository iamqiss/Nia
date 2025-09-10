import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback } from 'react';
import { ChatBskyConvoDefs } from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { StackActions, useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import {} from '#/lib/routes/types';
import { useProfileShadow } from '#/state/cache/profile-shadow';
import { useEmail } from '#/state/email-verification';
import { useAcceptConversation } from '#/state/queries/messages/accept-conversation';
import { precacheConvoQuery } from '#/state/queries/messages/conversation';
import { useLeaveConvo } from '#/state/queries/messages/leave-conversation';
import { useProfileBlockMutationQueue } from '#/state/queries/profile';
import * as Toast from '#/view/com/util/Toast';
import { atoms as a } from '#/alf';
import { Button, ButtonIcon, ButtonText, } from '#/components/Button';
import { useDialogControl } from '#/components/Dialog';
import { EmailDialogScreenID, useEmailDialogControl, } from '#/components/dialogs/EmailDialog';
import { ReportDialog } from '#/components/dms/ReportDialog';
import { CircleX_Stroke2_Corner0_Rounded } from '#/components/icons/CircleX';
import { Flag_Stroke2_Corner0_Rounded as FlagIcon } from '#/components/icons/Flag';
import { PersonX_Stroke2_Corner0_Rounded as PersonXIcon } from '#/components/icons/Person';
import { Loader } from '#/components/Loader';
import * as Menu from '#/components/Menu';
export function RejectMenu({ convo, profile, size = 'tiny', variant = 'outline', color = 'secondary', label, showDeleteConvo, currentScreen, ...props }) {
    const { _ } = useLingui();
    const shadowedProfile = useProfileShadow(profile);
    const navigation = useNavigation();
    const { mutate: leaveConvo } = useLeaveConvo(convo.id, {
        onMutate: () => {
            if (currentScreen === 'conversation') {
                navigation.dispatch(StackActions.pop());
            }
        },
        onError: () => {
            Toast.show(_(msg({
                context: 'toast',
                message: 'Failed to delete chat',
            })), 'xmark');
        },
    });
    const [queueBlock] = useProfileBlockMutationQueue(shadowedProfile);
    const onPressDelete = useCallback(() => {
        Toast.show(_(msg({
            context: 'toast',
            message: 'Chat deleted',
        })), 'check');
        leaveConvo();
    }, [leaveConvo, _]);
    const onPressBlock = useCallback(() => {
        Toast.show(_(msg({
            context: 'toast',
            message: 'Account blocked',
        })), 'check');
        // block and also delete convo
        queueBlock();
        leaveConvo();
    }, [queueBlock, leaveConvo, _]);
    const reportControl = useDialogControl();
    const lastMessage = ChatBskyConvoDefs.isMessageView(convo.lastMessage)
        ? convo.lastMessage
        : null;
    return (_jsxs(_Fragment, { children: [_jsxs(Menu.Root, { children: [_jsx(Menu.Trigger, { label: _(msg `Reject chat request`), children: ({ props: triggerProps }) => (_jsx(Button, { ...triggerProps, ...props, label: triggerProps.accessibilityLabel, style: [a.flex_1], color: color, variant: variant, size: size, children: _jsx(ButtonText, { children: label || (_jsx(Trans, { comment: "Reject a chat request, this opens a menu with options", children: "Reject" })) }) })) }), _jsx(Menu.Outer, { children: _jsxs(Menu.Group, { children: [showDeleteConvo && (_jsxs(Menu.Item, { label: _(msg `Delete conversation`), onPress: onPressDelete, children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Delete conversation" }) }), _jsx(Menu.ItemIcon, { icon: CircleX_Stroke2_Corner0_Rounded })] })), _jsxs(Menu.Item, { label: _(msg `Block account`), onPress: onPressBlock, children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Block account" }) }), _jsx(Menu.ItemIcon, { icon: PersonXIcon })] }), lastMessage && (_jsxs(Menu.Item, { label: _(msg `Report conversation`), onPress: reportControl.open, children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Report conversation" }) }), _jsx(Menu.ItemIcon, { icon: FlagIcon })] }))] }) })] }), lastMessage && (_jsx(ReportDialog, { currentScreen: currentScreen, params: {
                    type: 'convoMessage',
                    convoId: convo.id,
                    message: lastMessage,
                }, control: reportControl }))] }));
}
export function AcceptChatButton({ convo, size = 'tiny', variant = 'solid', color = 'secondary_inverted', label, currentScreen, onAcceptConvo, ...props }) {
    const { _ } = useLingui();
    const queryClient = useQueryClient();
    const navigation = useNavigation();
    const { needsEmailVerification } = useEmail();
    const emailDialogControl = useEmailDialogControl();
    const { mutate: acceptConvo, isPending } = useAcceptConversation(convo.id, {
        onMutate: () => {
            onAcceptConvo?.();
            if (currentScreen === 'list') {
                precacheConvoQuery(queryClient, { ...convo, status: 'accepted' });
                navigation.navigate('MessagesConversation', {
                    conversation: convo.id,
                    accept: true,
                });
            }
        },
        onError: () => {
            // Should we show a toast here? They'll be on the convo screen, and it'll make
            // no difference if the request failed - when they send a message, the convo will be accepted
            // automatically. The only difference is that when they back out of the convo (without sending a message), the conversation will be rejected.
            // the list will still have this chat in it -sfn
            Toast.show(_(msg({
                context: 'toast',
                message: 'Failed to accept chat',
            })), 'xmark');
        },
    });
    const onPressAccept = useCallback(() => {
        if (needsEmailVerification) {
            emailDialogControl.open({
                id: EmailDialogScreenID.Verify,
                instructions: [
                    _jsx(Trans, { children: "Before you can accept this chat request, you must first verify your email." }, "request-btn"),
                ],
            });
        }
        else {
            acceptConvo();
        }
    }, [acceptConvo, needsEmailVerification, emailDialogControl]);
    return (_jsx(Button, { ...props, label: label || _(msg `Accept chat request`), size: size, variant: variant, color: color, style: a.flex_1, onPress: onPressAccept, children: isPending ? (_jsx(ButtonIcon, { icon: Loader })) : (_jsx(ButtonText, { children: label || _jsx(Trans, { comment: "Accept a chat request", children: "Accept" }) })) }));
}
export function DeleteChatButton({ convo, size = 'tiny', variant = 'outline', color = 'secondary', label, currentScreen, ...props }) {
    const { _ } = useLingui();
    const navigation = useNavigation();
    const { mutate: leaveConvo } = useLeaveConvo(convo.id, {
        onMutate: () => {
            if (currentScreen === 'conversation') {
                navigation.dispatch(StackActions.pop());
            }
        },
        onError: () => {
            Toast.show(_(msg({
                context: 'toast',
                message: 'Failed to delete chat',
            })), 'xmark');
        },
    });
    const onPressDelete = useCallback(() => {
        Toast.show(_(msg({
            context: 'toast',
            message: 'Chat deleted',
        })), 'check');
        leaveConvo();
    }, [leaveConvo, _]);
    return (_jsx(Button, { label: label || _(msg `Delete chat`), size: size, variant: variant, color: color, style: a.flex_1, onPress: onPressDelete, ...props, children: _jsx(ButtonText, { children: label || _jsx(Trans, { children: "Delete chat" }) }) }));
}
//# sourceMappingURL=RequestButtons.js.map