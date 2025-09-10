import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import {} from '@atproto/api';
import { useNonReactiveCallback } from '#/lib/hooks/useNonReactiveCallback';
const ModalContext = React.createContext({
    isModalActive: false,
    activeModals: [],
});
ModalContext.displayName = 'ModalContext';
const ModalControlContext = React.createContext({
    openModal: () => { },
    closeModal: () => false,
    closeAllModals: () => false,
});
ModalControlContext.displayName = 'ModalControlContext';
export function Provider({ children }) {
    const [activeModals, setActiveModals] = React.useState([]);
    const openModal = useNonReactiveCallback((modal) => {
        setActiveModals(modals => [...modals, modal]);
    });
    const closeModal = useNonReactiveCallback(() => {
        let wasActive = activeModals.length > 0;
        setActiveModals(modals => {
            return modals.slice(0, -1);
        });
        return wasActive;
    });
    const closeAllModals = useNonReactiveCallback(() => {
        let wasActive = activeModals.length > 0;
        setActiveModals([]);
        return wasActive;
    });
    const state = React.useMemo(() => ({
        isModalActive: activeModals.length > 0,
        activeModals,
    }), [activeModals]);
    const methods = React.useMemo(() => ({
        openModal,
        closeModal,
        closeAllModals,
    }), [openModal, closeModal, closeAllModals]);
    return (_jsx(ModalContext.Provider, { value: state, children: _jsx(ModalControlContext.Provider, { value: methods, children: children }) }));
}
/**
 * @deprecated use the dialog system from `#/components/Dialog.tsx`
 */
export function useModals() {
    return React.useContext(ModalContext);
}
/**
 * @deprecated use the dialog system from `#/components/Dialog.tsx`
 */
export function useModalControls() {
    return React.useContext(ModalControlContext);
}
//# sourceMappingURL=index.js.map