import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useSession } from '#/state/session';
import { useDialogControl } from '#/components/Dialog';
import { EmailDialogScreenID, useEmailDialogControl, } from '#/components/dialogs/EmailDialog';
import { DisableEmail2FADialog } from './DisableEmail2FADialog';
import * as SettingsList from './SettingsList';
export function Email2FAToggle() {
    const { _ } = useLingui();
    const { currentAccount } = useSession();
    const disableDialogControl = useDialogControl();
    const emailDialogControl = useEmailDialogControl();
    const onToggle = React.useCallback(() => {
        emailDialogControl.open({
            id: EmailDialogScreenID.Manage2FA,
        });
    }, [emailDialogControl]);
    return (_jsxs(_Fragment, { children: [_jsx(DisableEmail2FADialog, { control: disableDialogControl }), _jsx(SettingsList.BadgeButton, { label: currentAccount?.emailAuthFactor ? _(msg `Change`) : _(msg `Enable`), onPress: onToggle })] }));
}
//# sourceMappingURL=Email2FAToggle.js.map