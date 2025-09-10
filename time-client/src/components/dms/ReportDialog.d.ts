import { type ChatBskyConvoDefs } from '@atproto/api';
import type React from 'react';
import * as Dialog from '#/components/Dialog';
type ReportDialogParams = {
    type: 'convoMessage';
    convoId: string;
    message: ChatBskyConvoDefs.MessageView;
};
declare let ReportDialog: ({ control, params, currentScreen, }: {
    control: Dialog.DialogControlProps;
    params: ReportDialogParams;
    currentScreen: "list" | "conversation";
}) => React.ReactNode;
export { ReportDialog };
//# sourceMappingURL=ReportDialog.d.ts.map