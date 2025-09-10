import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback } from 'react';
import {} from '@atproto/api';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { logger } from '#/logger';
import { useVerificationsRemoveMutation } from '#/state/queries/verification/useVerificationsRemoveMutation';
import * as Toast from '#/view/com/util/Toast';
import {} from '#/components/Dialog';
import * as Prompt from '#/components/Prompt';
export { useDialogControl as usePromptControl } from '#/components/Dialog';
export function VerificationRemovePrompt({ control, profile, verifications, onConfirm: onConfirmInner, }) {
    const { _ } = useLingui();
    const { mutateAsync: remove } = useVerificationsRemoveMutation();
    const onConfirm = useCallback(async () => {
        onConfirmInner?.();
        try {
            await remove({ profile, verifications });
            Toast.show(_(msg `Removed verification`));
        }
        catch (e) {
            Toast.show(_(msg `Failed to remove verification`), 'xmark');
            logger.error('Failed to remove verification', {
                safeMessage: e,
            });
        }
    }, [_, profile, verifications, remove, onConfirmInner]);
    return (_jsx(Prompt.Basic, { control: control, title: _(msg `Remove your verification for this account?`), onConfirm: onConfirm, confirmButtonCta: _(msg `Remove verification`), confirmButtonColor: "negative" }));
}
//# sourceMappingURL=VerificationRemovePrompt.js.map