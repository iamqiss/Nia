import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback } from 'react';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { logEvent } from '#/lib/statsig/statsig';
import { logger } from '#/logger';
import { useGetConvoForMembers } from '#/state/queries/messages/get-convo-for-members';
import * as Toast from '#/view/com/util/Toast';
import * as Dialog from '#/components/Dialog';
import { SearchablePeopleList } from '#/components/dialogs/SearchablePeopleList';
export function SendViaChatDialog({ control, onSelectChat, }) {
    return (_jsxs(Dialog.Outer, { control: control, testID: "sendViaChatChatDialog", children: [_jsx(Dialog.Handle, {}), _jsx(SendViaChatDialogInner, { control: control, onSelectChat: onSelectChat })] }));
}
function SendViaChatDialogInner({ control, onSelectChat, }) {
    const { _ } = useLingui();
    const { mutate: createChat } = useGetConvoForMembers({
        onSuccess: data => {
            onSelectChat(data.convo.id);
            if (!data.convo.lastMessage) {
                logEvent('chat:create', { logContext: 'SendViaChatDialog' });
            }
            logEvent('chat:open', { logContext: 'SendViaChatDialog' });
        },
        onError: error => {
            logger.error('Failed to share post to chat', { message: error });
            Toast.show(_(msg `An issue occurred while trying to open the chat`), 'xmark');
        },
    });
    const onCreateChat = useCallback((did) => {
        control.close(() => createChat([did]));
    }, [control, createChat]);
    return (_jsx(SearchablePeopleList, { title: _(msg `Send post to...`), onSelectChat: onCreateChat, showRecentConvos: true, sortByMessageDeclaration: true }));
}
//# sourceMappingURL=ShareViaChatDialog.js.map