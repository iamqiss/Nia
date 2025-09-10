import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
const stateContext = React.createContext(false);
stateContext.displayName = 'DrawerSwipeDisabledStateContext';
const setContext = React.createContext((_) => { });
setContext.displayName = 'DrawerSwipeDisabledSetContext';
export function Provider({ children }) {
    const [state, setState] = React.useState(false);
    return (_jsx(stateContext.Provider, { value: state, children: _jsx(setContext.Provider, { value: setState, children: children }) }));
}
export function useIsDrawerSwipeDisabled() {
    return React.useContext(stateContext);
}
export function useSetDrawerSwipeDisabled() {
    return React.useContext(setContext);
}
//# sourceMappingURL=drawer-swipe-disabled.js.map