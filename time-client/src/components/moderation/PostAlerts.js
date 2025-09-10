import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import {} from 'react-native';
import {} from '@atproto/api';
import { getModerationCauseKey, unique } from '#/lib/moderation';
import * as Pills from '#/components/Pills';
export function PostAlerts({ modui, size = 'sm', style, additionalCauses, }) {
    if (!modui.alert && !modui.inform && !additionalCauses?.length) {
        return null;
    }
    return (_jsxs(Pills.Row, { size: size, style: [size === 'sm' && { marginLeft: -3 }, style], children: [modui.alerts.filter(unique).map(cause => (_jsx(Pills.Label, { cause: cause, size: size, noBg: size === 'sm' }, getModerationCauseKey(cause)))), modui.informs.filter(unique).map(cause => (_jsx(Pills.Label, { cause: cause, size: size, noBg: size === 'sm' }, getModerationCauseKey(cause)))), additionalCauses?.map(cause => (_jsx(Pills.Label, { cause: cause, size: size, noBg: size === 'sm' }, getModerationCauseKey(cause))))] }));
}
//# sourceMappingURL=PostAlerts.js.map