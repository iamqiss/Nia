import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useState } from 'react';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { web } from '#/alf';
import * as Dialog from '#/components/Dialog';
import {} from '#/components/dialogs/Context';
import { useGlobalDialogsControlContext } from '#/components/dialogs/Context';
import { useAccountEmailState } from '#/components/dialogs/EmailDialog/data/useAccountEmailState';
import { Manage2FA } from '#/components/dialogs/EmailDialog/screens/Manage2FA';
import { Update } from '#/components/dialogs/EmailDialog/screens/Update';
import { VerificationReminder } from '#/components/dialogs/EmailDialog/screens/VerificationReminder';
import { Verify } from '#/components/dialogs/EmailDialog/screens/Verify';
import { ScreenID } from '#/components/dialogs/EmailDialog/types';
export { ScreenID as EmailDialogScreenID } from '#/components/dialogs/EmailDialog/types';
export function useEmailDialogControl() {
    return useGlobalDialogsControlContext().emailDialogControl;
}
export function EmailDialog() {
    const { _ } = useLingui();
    const emailDialogControl = useEmailDialogControl();
    const { isEmailVerified } = useAccountEmailState();
    const onClose = useCallback(() => {
        if (!isEmailVerified) {
            if (emailDialogControl.value?.id === ScreenID.Verify) {
                emailDialogControl.value.onCloseWithoutVerifying?.();
            }
        }
        emailDialogControl.clear();
    }, [isEmailVerified, emailDialogControl]);
    return (_jsxs(Dialog.Outer, { control: emailDialogControl.control, onClose: onClose, children: [_jsx(Dialog.Handle, {}), _jsxs(Dialog.ScrollableInner, { label: _(msg `Make adjustments to email settings for your account`), style: web({ maxWidth: 400 }), children: [_jsx(Inner, { control: emailDialogControl }), _jsx(Dialog.Close, {})] })] }));
}
function Inner({ control }) {
    const [screen, showScreen] = useState(() => control.value);
    if (!screen)
        return null;
    switch (screen.id) {
        case ScreenID.Update: {
            return _jsx(Update, { config: screen, showScreen: showScreen });
        }
        case ScreenID.Verify: {
            return _jsx(Verify, { config: screen, showScreen: showScreen });
        }
        case ScreenID.VerificationReminder: {
            return _jsx(VerificationReminder, { config: screen, showScreen: showScreen });
        }
        case ScreenID.Manage2FA: {
            return _jsx(Manage2FA, { config: screen, showScreen: showScreen });
        }
        default: {
            return null;
        }
    }
}
//# sourceMappingURL=index.js.map