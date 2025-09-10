import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import * as Dialog from '#/components/Dialog';
import {} from '#/components/Dialog';
import { VerifyEmailIntentDialog } from '#/components/intents/VerifyEmailIntentDialog';
const Context = React.createContext({});
Context.displayName = 'IntentDialogsContext';
export const useIntentDialogs = () => React.useContext(Context);
export function Provider({ children }) {
    const verifyEmailDialogControl = Dialog.useDialogControl();
    const [verifyEmailState, setVerifyEmailState] = React.useState();
    const value = React.useMemo(() => ({
        verifyEmailDialogControl,
        verifyEmailState,
        setVerifyEmailState,
    }), [verifyEmailDialogControl, verifyEmailState, setVerifyEmailState]);
    return (_jsxs(Context.Provider, { value: value, children: [children, _jsx(VerifyEmailIntentDialog, {})] }));
}
//# sourceMappingURL=IntentDialogs.js.map