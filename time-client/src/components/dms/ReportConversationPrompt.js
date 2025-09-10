import { jsx as _jsx } from "react/jsx-runtime";
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {} from '#/components/Dialog';
import * as Prompt from '#/components/Prompt';
export function ReportConversationPrompt({ control, }) {
    const { _ } = useLingui();
    return (_jsx(Prompt.Basic, { control: control, title: _(msg `Report conversation`), description: _(msg `To report a conversation, please report one of its messages via the conversation screen. This lets our moderators understand the context of your issue.`), confirmButtonCta: _(msg `I understand`), onConfirm: () => { }, showCancel: false }));
}
//# sourceMappingURL=ReportConversationPrompt.js.map