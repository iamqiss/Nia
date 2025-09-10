import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import * as persisted from '#/state/persisted';
const stateContext = React.createContext(persisted.defaults.requireAltTextEnabled);
stateContext.displayName = 'AltTextRequiredStateContext';
const setContext = React.createContext((_) => { });
setContext.displayName = 'AltTextRequiredSetContext';
export function Provider({ children }) {
    const [state, setState] = React.useState(persisted.get('requireAltTextEnabled'));
    const setStateWrapped = React.useCallback((requireAltTextEnabled) => {
        setState(requireAltTextEnabled);
        persisted.write('requireAltTextEnabled', requireAltTextEnabled);
    }, [setState]);
    React.useEffect(() => {
        return persisted.onUpdate('requireAltTextEnabled', nextRequireAltTextEnabled => {
            setState(nextRequireAltTextEnabled);
        });
    }, [setStateWrapped]);
    return (_jsx(stateContext.Provider, { value: state, children: _jsx(setContext.Provider, { value: setStateWrapped, children: children }) }));
}
export function useRequireAltTextEnabled() {
    return React.useContext(stateContext);
}
export function useSetRequireAltTextEnabled() {
    return React.useContext(setContext);
}
//# sourceMappingURL=alt-text-required.js.map