import { jsx as _jsx } from "react/jsx-runtime";
import { Pressable } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { t } from '@lingui/macro';
import { DISCOVER_DEBUG_DIDS } from '#/lib/constants';
import { useGate } from '#/lib/statsig/statsig';
import { useSession } from '#/state/session';
import * as Toast from '#/view/com/util/Toast';
import { atoms as a, useBreakpoints, useTheme } from '#/alf';
import { Text } from '#/components/Typography';
import { IS_INTERNAL } from '#/env';
export function DiscoverDebug({ feedContext, }) {
    const { currentAccount } = useSession();
    const { gtMobile } = useBreakpoints();
    const gate = useGate();
    const isDiscoverDebugUser = IS_INTERNAL ||
        DISCOVER_DEBUG_DIDS[currentAccount?.did || ''] ||
        gate('debug_show_feedcontext');
    const theme = useTheme();
    return (isDiscoverDebugUser &&
        feedContext && (_jsx(Pressable, { accessible: false, hitSlop: 10, style: [
            a.absolute,
            { zIndex: 1000, maxWidth: 65, bottom: -4 },
            gtMobile ? a.right_0 : a.left_0,
        ], onPress: e => {
            e.stopPropagation();
            Clipboard.setStringAsync(feedContext);
            Toast.show(t `Copied to clipboard`, 'clipboard-check');
        }, children: _jsx(Text, { numberOfLines: 1, style: {
                color: theme.palette.contrast_400,
                fontSize: 7,
            }, children: feedContext }) })));
}
//# sourceMappingURL=DiscoverDebug.js.map