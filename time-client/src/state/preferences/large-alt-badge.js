import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import * as persisted from '#/state/persisted';
const stateContext = React.createContext(persisted.defaults.largeAltBadgeEnabled);
stateContext.displayName = 'LargeAltBadgeStateContext';
const setContext = React.createContext((_) => { });
setContext.displayName = 'LargeAltBadgeSetContext';
export function Provider({ children }) {
    const [state, setState] = React.useState(persisted.get('largeAltBadgeEnabled'));
    const setStateWrapped = React.useCallback((largeAltBadgeEnabled) => {
        setState(largeAltBadgeEnabled);
        persisted.write('largeAltBadgeEnabled', largeAltBadgeEnabled);
    }, [setState]);
    React.useEffect(() => {
        return persisted.onUpdate('largeAltBadgeEnabled', nextLargeAltBadgeEnabled => {
            setState(nextLargeAltBadgeEnabled);
        });
    }, [setStateWrapped]);
    return (_jsx(stateContext.Provider, { value: state, children: _jsx(setContext.Provider, { value: setStateWrapped, children: children }) }));
}
export function useLargeAltBadgeEnabled() {
    return React.useContext(stateContext);
}
export function useSetLargeAltBadgeEnabled() {
    return React.useContext(setContext);
}
//# sourceMappingURL=large-alt-badge.js.map