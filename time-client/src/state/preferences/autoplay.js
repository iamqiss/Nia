import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import * as persisted from '#/state/persisted';
const stateContext = React.createContext(Boolean(persisted.defaults.disableAutoplay));
stateContext.displayName = 'AutoplayStateContext';
const setContext = React.createContext((_) => { });
setContext.displayName = 'AutoplaySetContext';
export function Provider({ children }) {
    const [state, setState] = React.useState(Boolean(persisted.get('disableAutoplay')));
    const setStateWrapped = React.useCallback((autoplayDisabled) => {
        setState(Boolean(autoplayDisabled));
        persisted.write('disableAutoplay', autoplayDisabled);
    }, [setState]);
    React.useEffect(() => {
        return persisted.onUpdate('disableAutoplay', nextDisableAutoplay => {
            setState(Boolean(nextDisableAutoplay));
        });
    }, [setStateWrapped]);
    return (_jsx(stateContext.Provider, { value: state, children: _jsx(setContext.Provider, { value: setStateWrapped, children: children }) }));
}
export const useAutoplayDisabled = () => React.useContext(stateContext);
export const useSetAutoplayDisabled = () => React.useContext(setContext);
//# sourceMappingURL=autoplay.js.map