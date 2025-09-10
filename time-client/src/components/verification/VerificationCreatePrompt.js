import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { logger } from '#/logger';
import { useModerationOpts } from '#/state/preferences/moderation-opts';
import { useVerificationCreateMutation } from '#/state/queries/verification/useVerificationCreateMutation';
import * as Toast from '#/view/com/util/Toast';
import { atoms as a, useBreakpoints } from '#/alf';
import { Admonition } from '#/components/Admonition';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import {} from '#/components/Dialog';
import * as Dialog from '#/components/Dialog';
import { VerifiedCheck } from '#/components/icons/VerifiedCheck';
import { Loader } from '#/components/Loader';
import * as ProfileCard from '#/components/ProfileCard';
import * as Prompt from '#/components/Prompt';
export function VerificationCreatePrompt({ control, profile, }) {
    const { _ } = useLingui();
    const { gtMobile } = useBreakpoints();
    const moderationOpts = useModerationOpts();
    const { mutateAsync: create, isPending } = useVerificationCreateMutation();
    const [error, setError] = useState(``);
    const onConfirm = useCallback(async () => {
        try {
            await create({ profile });
            Toast.show(_(msg `Successfully verified`));
            control.close();
        }
        catch (e) {
            setError(_(msg `Verification failed, please try again.`));
            logger.error('Failed to create a verification', {
                safeMessage: e,
            });
        }
    }, [_, profile, create, control]);
    return (_jsxs(Prompt.Outer, { control: control, children: [_jsxs(View, { style: [a.flex_row, a.align_center, a.gap_sm, a.pb_sm], children: [_jsx(VerifiedCheck, { width: 18 }), _jsx(Prompt.TitleText, { style: [a.pb_0], children: _(msg `Verify this account?`) })] }), _jsx(Prompt.DescriptionText, { children: _(msg `This action can be undone at any time.`) }), moderationOpts ? (_jsxs(ProfileCard.Header, { children: [_jsx(ProfileCard.Avatar, { profile: profile, moderationOpts: moderationOpts }), _jsx(ProfileCard.NameAndHandle, { profile: profile, moderationOpts: moderationOpts })] })) : null, error && (_jsx(View, { style: [a.pt_lg], children: _jsx(Admonition, { type: "error", children: error }) })), _jsx(View, { style: [a.pt_xl], children: profile.displayName ? (_jsxs(Prompt.Actions, { children: [_jsxs(Button, { variant: "solid", color: "primary", size: gtMobile ? 'small' : 'large', label: _(msg `Verify account`), onPress: onConfirm, children: [_jsx(ButtonText, { children: _(msg `Verify account`) }), isPending && _jsx(ButtonIcon, { icon: Loader })] }), _jsx(Prompt.Cancel, {})] })) : (_jsx(Admonition, { type: "warning", children: _jsx(Trans, { children: "This user does not have a display name, and therefore cannot be verified." }) })) }), _jsx(Dialog.Close, {})] }));
}
//# sourceMappingURL=VerificationCreatePrompt.js.map