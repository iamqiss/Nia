import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useMemo, useState } from 'react';
import {} from '#/components/ageAssurance/AgeAssuranceRedirectDialog';
import * as Dialog from '#/components/Dialog';
import {} from '#/components/dialogs/EmailDialog/types';
const ControlsContext = createContext(null);
ControlsContext.displayName = 'GlobalDialogControlsContext';
export function useGlobalDialogsControlContext() {
    const ctx = useContext(ControlsContext);
    if (!ctx) {
        throw new Error('useGlobalDialogsControlContext must be used within a Provider');
    }
    return ctx;
}
export function Provider({ children }) {
    const mutedWordsDialogControl = Dialog.useDialogControl();
    const signinDialogControl = Dialog.useDialogControl();
    const inAppBrowserConsentControl = useStatefulDialogControl();
    const emailDialogControl = useStatefulDialogControl();
    const linkWarningDialogControl = useStatefulDialogControl();
    const ageAssuranceRedirectDialogControl = useStatefulDialogControl();
    const ctx = useMemo(() => ({
        mutedWordsDialogControl,
        signinDialogControl,
        inAppBrowserConsentControl,
        emailDialogControl,
        linkWarningDialogControl,
        ageAssuranceRedirectDialogControl,
    }), [
        mutedWordsDialogControl,
        signinDialogControl,
        inAppBrowserConsentControl,
        emailDialogControl,
        linkWarningDialogControl,
        ageAssuranceRedirectDialogControl,
    ]);
    return (_jsx(ControlsContext.Provider, { value: ctx, children: children }));
}
export function useStatefulDialogControl(initialValue) {
    const [value, setValue] = useState(initialValue);
    const control = Dialog.useDialogControl();
    return useMemo(() => ({
        control,
        open: (v) => {
            setValue(v);
            control.open();
        },
        clear: () => setValue(initialValue),
        value,
    }), [control, value, initialValue]);
}
//# sourceMappingURL=Context.js.map