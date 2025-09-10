import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { isWeb } from '#/platform/detection';
import { useSession } from '#/state/session';
import { useActiveStarterPack } from '#/state/shell/starter-pack';
const StateContext = React.createContext({
    showLoggedOut: false,
    requestedAccountSwitchTo: undefined,
});
StateContext.displayName = 'LoggedOutStateContext';
const ControlsContext = React.createContext({
    setShowLoggedOut: () => { },
    requestSwitchToAccount: () => { },
    clearRequestedAccount: () => { },
});
ControlsContext.displayName = 'LoggedOutControlsContext';
export function Provider({ children }) {
    const activeStarterPack = useActiveStarterPack();
    const { hasSession } = useSession();
    const shouldShowStarterPack = Boolean(activeStarterPack?.uri) && !hasSession;
    const [state, setState] = React.useState({
        showLoggedOut: shouldShowStarterPack,
        requestedAccountSwitchTo: shouldShowStarterPack
            ? isWeb
                ? 'starterpack'
                : 'new'
            : undefined,
    });
    const controls = React.useMemo(() => ({
        setShowLoggedOut(show) {
            setState(s => ({
                ...s,
                showLoggedOut: show,
            }));
        },
        requestSwitchToAccount({ requestedAccount }) {
            setState(s => ({
                ...s,
                showLoggedOut: true,
                requestedAccountSwitchTo: requestedAccount,
            }));
        },
        clearRequestedAccount() {
            setState(s => ({
                ...s,
                requestedAccountSwitchTo: undefined,
            }));
        },
    }), [setState]);
    return (_jsx(StateContext.Provider, { value: state, children: _jsx(ControlsContext.Provider, { value: controls, children: children }) }));
}
export function useLoggedOutView() {
    return React.useContext(StateContext);
}
export function useLoggedOutViewControls() {
    return React.useContext(ControlsContext);
}
//# sourceMappingURL=logged-out.js.map