import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback } from 'react';
import { View } from 'react-native';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {} from '#/state/messages/convo';
import { useModerationOpts } from '#/state/preferences/moderation-opts';
import { useSession } from '#/state/session';
import { atoms as a, useTheme } from '#/alf';
import { LeaveConvoPrompt } from '#/components/dms/LeaveConvoPrompt';
import { KnownFollowers } from '#/components/KnownFollowers';
import { usePromptControl } from '#/components/Prompt';
import { AcceptChatButton, DeleteChatButton, RejectMenu } from './RequestButtons';
export function ChatStatusInfo({ convoState }) {
    const t = useTheme();
    const { _ } = useLingui();
    const moderationOpts = useModerationOpts();
    const { currentAccount } = useSession();
    const leaveConvoControl = usePromptControl();
    const onAcceptChat = useCallback(() => {
        convoState.markConvoAccepted();
    }, [convoState]);
    const otherUser = convoState.recipients.find(user => user.did !== currentAccount?.did);
    if (!moderationOpts) {
        return null;
    }
    return (_jsxs(View, { style: [t.atoms.bg, a.p_lg, a.gap_md, a.align_center], children: [otherUser && (_jsx(KnownFollowers, { profile: otherUser, moderationOpts: moderationOpts, showIfEmpty: true })), _jsxs(View, { style: [a.flex_row, a.gap_md, a.w_full, otherUser && a.pt_sm], children: [otherUser && (_jsx(RejectMenu, { label: _(msg `Block or report`), convo: convoState.convo, profile: otherUser, color: "negative", size: "small", currentScreen: "conversation" })), _jsx(DeleteChatButton, { label: _(msg `Delete`), convo: convoState.convo, color: "secondary", size: "small", currentScreen: "conversation", onPress: leaveConvoControl.open }), _jsx(LeaveConvoPrompt, { convoId: convoState.convo.id, control: leaveConvoControl, currentScreen: "conversation", hasMessages: false })] }), _jsx(View, { style: [a.w_full, a.flex_row], children: _jsx(AcceptChatButton, { onAcceptConvo: onAcceptChat, convo: convoState.convo, color: "primary", variant: "outline", size: "small", currentScreen: "conversation" }) })] }));
}
//# sourceMappingURL=ChatStatusInfo.js.map