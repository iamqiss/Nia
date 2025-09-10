import { jsx as _jsx } from "react/jsx-runtime";
import { View } from 'react-native';
import {} from '@atproto/api';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { atoms as a } from '#/alf';
import { MessageContextMenu } from '#/components/dms/MessageContextMenu';
export function ActionsWrapper({ message, isFromSelf, children, }) {
    const { _ } = useLingui();
    return (_jsx(MessageContextMenu, { message: message, children: trigger => 
        // will always be true, since this file is platform split
        trigger.isNative && (_jsx(View, { style: [a.flex_1, a.relative], children: _jsx(View, { style: [
                    { maxWidth: '80%' },
                    isFromSelf
                        ? [a.self_end, a.align_end]
                        : [a.self_start, a.align_start],
                ], accessible: true, accessibilityActions: [
                    { name: 'activate', label: _(msg `Open message options`) },
                ], onAccessibilityAction: () => trigger.control.open('full'), children: children }) })) }));
}
//# sourceMappingURL=ActionsWrapper.js.map