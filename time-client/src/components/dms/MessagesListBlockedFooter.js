import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useProfileShadow } from '#/state/cache/profile-shadow';
import { useProfileBlockMutationQueue } from '#/state/queries/profile';
import { atoms as a, useBreakpoints, useTheme } from '#/alf';
import { Button, ButtonText } from '#/components/Button';
import { useDialogControl } from '#/components/Dialog';
import { Divider } from '#/components/Divider';
import { BlockedByListDialog } from '#/components/dms/BlockedByListDialog';
import { LeaveConvoPrompt } from '#/components/dms/LeaveConvoPrompt';
import { ReportConversationPrompt } from '#/components/dms/ReportConversationPrompt';
import { Text } from '#/components/Typography';
export function MessagesListBlockedFooter({ recipient: initialRecipient, convoId, hasMessages, moderation, }) {
    const t = useTheme();
    const { gtMobile } = useBreakpoints();
    const { _ } = useLingui();
    const recipient = useProfileShadow(initialRecipient);
    const [__, queueUnblock] = useProfileBlockMutationQueue(recipient);
    const leaveConvoControl = useDialogControl();
    const reportControl = useDialogControl();
    const blockedByListControl = useDialogControl();
    const { listBlocks, userBlock } = React.useMemo(() => {
        const modui = moderation.ui('profileView');
        const blocks = modui.alerts.filter(alert => alert.type === 'blocking');
        const listBlocks = blocks.filter(alert => alert.source.type === 'list');
        const userBlock = blocks.find(alert => alert.source.type === 'user');
        return {
            listBlocks,
            userBlock,
        };
    }, [moderation]);
    const isBlocking = !!userBlock || !!listBlocks.length;
    const onUnblockPress = React.useCallback(() => {
        if (listBlocks.length) {
            blockedByListControl.open();
        }
        else {
            queueUnblock();
        }
    }, [blockedByListControl, listBlocks, queueUnblock]);
    return (_jsxs(View, { style: [hasMessages && a.pt_md, a.pb_xl, a.gap_lg], children: [_jsx(Divider, {}), _jsx(Text, { style: [a.text_md, a.font_bold, a.text_center], children: isBlocking ? (_jsx(Trans, { children: "You have blocked this user" })) : (_jsx(Trans, { children: "This user has blocked you" })) }), _jsxs(View, { style: [a.flex_row, a.justify_between, a.gap_lg, a.px_md], children: [_jsx(Button, { label: _(msg `Leave chat`), color: "secondary", variant: "solid", size: "small", style: [a.flex_1], onPress: leaveConvoControl.open, children: _jsx(ButtonText, { style: { color: t.palette.negative_500 }, children: _jsx(Trans, { children: "Leave chat" }) }) }), _jsx(Button, { label: _(msg `Report`), color: "secondary", variant: "solid", size: "small", style: [a.flex_1], onPress: reportControl.open, children: _jsx(ButtonText, { style: { color: t.palette.negative_500 }, children: _jsx(Trans, { children: "Report" }) }) }), isBlocking && gtMobile && (_jsx(Button, { label: _(msg `Unblock`), color: "secondary", variant: "solid", size: "small", style: [a.flex_1], onPress: onUnblockPress, children: _jsx(ButtonText, { style: { color: t.palette.primary_500 }, children: _jsx(Trans, { children: "Unblock" }) }) }))] }), isBlocking && !gtMobile && (_jsx(View, { style: [a.flex_row, a.justify_center, a.px_md], children: _jsx(Button, { label: _(msg `Unblock`), color: "secondary", variant: "solid", size: "small", style: [a.flex_1], onPress: onUnblockPress, children: _jsx(ButtonText, { style: { color: t.palette.primary_500 }, children: _jsx(Trans, { children: "Unblock" }) }) }) })), _jsx(LeaveConvoPrompt, { control: leaveConvoControl, currentScreen: "conversation", convoId: convoId }), _jsx(ReportConversationPrompt, { control: reportControl }), _jsx(BlockedByListDialog, { control: blockedByListControl, listBlocks: listBlocks })] }));
}
//# sourceMappingURL=MessagesListBlockedFooter.js.map