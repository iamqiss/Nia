import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { logger } from '#/logger';
import { useAgent, useSessionApi } from '#/state/session';
import { atoms as a, useBreakpoints, useTheme } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import {} from '#/components/Dialog';
import { Divider } from '#/components/Divider';
import { CircleInfo_Stroke2_Corner0_Rounded as CircleInfo } from '#/components/icons/CircleInfo';
import { Loader } from '#/components/Loader';
import * as Prompt from '#/components/Prompt';
import { Text } from '#/components/Typography';
export function DeactivateAccountDialog({ control, }) {
    return (_jsx(Prompt.Outer, { control: control, children: _jsx(DeactivateAccountDialogInner, { control: control }) }));
}
function DeactivateAccountDialogInner({ control, }) {
    const t = useTheme();
    const { gtMobile } = useBreakpoints();
    const { _ } = useLingui();
    const agent = useAgent();
    const { logoutCurrentAccount } = useSessionApi();
    const [pending, setPending] = React.useState(false);
    const [error, setError] = React.useState();
    const handleDeactivate = React.useCallback(async () => {
        try {
            setPending(true);
            await agent.com.atproto.server.deactivateAccount({});
            control.close(() => {
                logoutCurrentAccount('Deactivated');
            });
        }
        catch (e) {
            switch (e.message) {
                case 'Bad token scope':
                    setError(_(msg `You're signed in with an App Password. Please sign in with your main password to continue deactivating your account.`));
                    break;
                default:
                    setError(_(msg `Something went wrong, please try again`));
                    break;
            }
            logger.error(e, {
                message: 'Failed to deactivate account',
            });
        }
        finally {
            setPending(false);
        }
    }, [agent, control, logoutCurrentAccount, _, setPending]);
    return (_jsxs(_Fragment, { children: [_jsx(Prompt.TitleText, { children: _(msg `Deactivate account`) }), _jsx(Prompt.DescriptionText, { children: _jsx(Trans, { children: "Your profile, posts, feeds, and lists will no longer be visible to other Bluesky users. You can reactivate your account at any time by logging in." }) }), _jsxs(View, { style: [a.pb_xl], children: [_jsx(Divider, {}), _jsxs(View, { style: [a.gap_sm, a.pt_lg, a.pb_xl], children: [_jsx(Text, { style: [t.atoms.text_contrast_medium, a.leading_snug], children: _jsx(Trans, { children: "There is no time limit for account deactivation, come back any time." }) }), _jsx(Text, { style: [t.atoms.text_contrast_medium, a.leading_snug], children: _jsx(Trans, { children: "If you're trying to change your handle or email, do so before you deactivate." }) })] }), _jsx(Divider, {})] }), _jsxs(Prompt.Actions, { children: [_jsxs(Button, { variant: "solid", color: "negative", size: gtMobile ? 'small' : 'large', label: _(msg `Yes, deactivate`), onPress: handleDeactivate, children: [_jsx(ButtonText, { children: _(msg `Yes, deactivate`) }), pending && _jsx(ButtonIcon, { icon: Loader, position: "right" })] }), _jsx(Prompt.Cancel, {})] }), error && (_jsxs(View, { style: [
                    a.flex_row,
                    a.gap_sm,
                    a.mt_md,
                    a.p_md,
                    a.rounded_sm,
                    t.atoms.bg_contrast_25,
                ], children: [_jsx(CircleInfo, { size: "md", fill: t.palette.negative_400 }), _jsx(Text, { style: [a.flex_1, a.leading_snug], children: error })] }))] }));
}
//# sourceMappingURL=DeactivateAccountDialog.js.map