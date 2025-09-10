import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { isWeb } from '#/platform/detection';
import {} from '#/components/Dialog';
import { Provider as GlobalDialogsProvider } from '#/components/dialogs/Context';
import { BottomSheetNativeComponent } from '../../../modules/bottom-sheet';
const DialogContext = React.createContext({});
DialogContext.displayName = 'DialogContext';
const DialogControlContext = React.createContext({});
DialogControlContext.displayName = 'DialogControlContext';
/**
 * The number of dialogs that are fully expanded. This is used to determine the background color of the status bar
 * on iOS.
 */
const DialogFullyExpandedCountContext = React.createContext(0);
DialogFullyExpandedCountContext.displayName = 'DialogFullyExpandedCountContext';
export function useDialogStateContext() {
    return React.useContext(DialogContext);
}
export function useDialogStateControlContext() {
    return React.useContext(DialogControlContext);
}
/** The number of dialogs that are fully expanded */
export function useDialogFullyExpandedCountContext() {
    return React.useContext(DialogFullyExpandedCountContext);
}
export function Provider({ children }) {
    const [fullyExpandedCount, setFullyExpandedCount] = React.useState(0);
    const activeDialogs = React.useRef(new Map());
    const openDialogs = React.useRef(new Set());
    const closeAllDialogs = React.useCallback(() => {
        if (isWeb) {
            openDialogs.current.forEach(id => {
                const dialog = activeDialogs.current.get(id);
                if (dialog)
                    dialog.current.close();
            });
            return openDialogs.current.size > 0;
        }
        else {
            BottomSheetNativeComponent.dismissAll();
            return false;
        }
    }, []);
    const setDialogIsOpen = React.useCallback((id, isOpen) => {
        if (isOpen) {
            openDialogs.current.add(id);
        }
        else {
            openDialogs.current.delete(id);
        }
    }, []);
    const context = React.useMemo(() => ({
        activeDialogs,
        openDialogs,
    }), [activeDialogs, openDialogs]);
    const controls = React.useMemo(() => ({
        closeAllDialogs,
        setDialogIsOpen,
        setFullyExpandedCount,
    }), [closeAllDialogs, setDialogIsOpen, setFullyExpandedCount]);
    return (_jsx(DialogContext.Provider, { value: context, children: _jsx(DialogControlContext.Provider, { value: controls, children: _jsx(DialogFullyExpandedCountContext.Provider, { value: fullyExpandedCount, children: _jsx(GlobalDialogsProvider, { children: children }) }) }) }));
}
Provider.displayName = 'DialogsProvider';
//# sourceMappingURL=index.js.map