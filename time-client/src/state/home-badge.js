import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
const stateContext = React.createContext(false);
stateContext.displayName = 'HomeBadgeStateContext';
const apiContext = React.createContext((_) => { });
apiContext.displayName = 'HomeBadgeApiContext';
export function Provider({ children }) {
    const [state, setState] = React.useState(false);
    return (_jsx(stateContext.Provider, { value: state, children: _jsx(apiContext.Provider, { value: setState, children: children }) }));
}
export function useHomeBadge() {
    return React.useContext(stateContext);
}
export function useSetHomeBadge() {
    return React.useContext(apiContext);
}
//# sourceMappingURL=home-badge.js.map