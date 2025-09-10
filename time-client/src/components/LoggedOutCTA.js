import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {} from '#/lib/statsig/gates';
import { useGate } from '#/lib/statsig/statsig';
import { isWeb } from '#/platform/detection';
import { useSession } from '#/state/session';
import { useLoggedOutViewControls } from '#/state/shell/logged-out';
import { Logo } from '#/view/icons/Logo';
import { atoms as a, useTheme } from '#/alf';
import { Button, ButtonText } from '#/components/Button';
import { Text } from '#/components/Typography';
export function LoggedOutCTA({ style, gateName }) {
    const { hasSession } = useSession();
    const { requestSwitchToAccount } = useLoggedOutViewControls();
    const gate = useGate();
    const t = useTheme();
    const { _ } = useLingui();
    // Only show for logged-out users on web
    if (hasSession || !isWeb) {
        return null;
    }
    // Check gate at the last possible moment to avoid counting users as exposed when they won't see the element
    if (!gate(gateName)) {
        return null;
    }
    return (_jsx(View, { style: [a.pb_md, style], children: _jsxs(View, { style: [
                a.flex_row,
                a.align_center,
                a.justify_between,
                a.px_lg,
                a.py_md,
                a.rounded_md,
                a.mb_xs,
                t.atoms.bg_contrast_25,
            ], children: [_jsxs(View, { style: [a.flex_row, a.align_center, a.flex_1, a.pr_md], children: [_jsx(Logo, { width: 30, style: [a.mr_md] }), _jsxs(View, { style: [a.flex_1], children: [_jsx(Text, { style: [a.text_lg, a.font_bold, a.leading_snug], children: _jsx(Trans, { children: "Join Bluesky" }) }), _jsx(Text, { style: [
                                        a.text_md,
                                        a.font_medium,
                                        a.leading_snug,
                                        t.atoms.text_contrast_medium,
                                    ], children: _jsx(Trans, { children: "The open social network." }) })] })] }), _jsx(Button, { onPress: () => {
                        requestSwitchToAccount({ requestedAccount: 'new' });
                    }, label: _(msg `Create account`), size: "small", variant: "solid", color: "primary", children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Create account" }) }) })] }) }));
}
//# sourceMappingURL=LoggedOutCTA.js.map