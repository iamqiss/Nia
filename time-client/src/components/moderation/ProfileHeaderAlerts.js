import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import {} from 'react-native';
import {} from '@atproto/api';
import { getModerationCauseKey, unique } from '#/lib/moderation';
import * as Pills from '#/components/Pills';
export function ProfileHeaderAlerts({ moderation, }) {
    const modui = moderation.ui('profileView');
    if (!modui.alert && !modui.inform) {
        return null;
    }
    return (_jsxs(Pills.Row, { size: "lg", children: [modui.alerts.filter(unique).map(cause => (_jsx(Pills.Label, { size: "lg", cause: cause }, getModerationCauseKey(cause)))), modui.informs.filter(unique).map(cause => (_jsx(Pills.Label, { size: "lg", cause: cause }, getModerationCauseKey(cause))))] }));
}
//# sourceMappingURL=ProfileHeaderAlerts.js.map