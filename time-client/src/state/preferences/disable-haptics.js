import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import * as persisted from '#/state/persisted';
const stateContext = React.createContext(Boolean(persisted.defaults.disableHaptics));
stateContext.displayName = 'DisableHapticsStateContext';
const setContext = React.createContext((_) => { });
setContext.displayName = 'DisableHapticsSetContext';
export function Provider({ children }) {
    const [state, setState] = React.useState(Boolean(persisted.get('disableHaptics')));
    const setStateWrapped = React.useCallback((hapticsEnabled) => {
        setState(Boolean(hapticsEnabled));
        persisted.write('disableHaptics', hapticsEnabled);
    }, [setState]);
    React.useEffect(() => {
        return persisted.onUpdate('disableHaptics', nextDisableHaptics => {
            setState(Boolean(nextDisableHaptics));
        });
    }, [setStateWrapped]);
    return (_jsx(stateContext.Provider, { value: state, children: _jsx(setContext.Provider, { value: setStateWrapped, children: children }) }));
}
export const useHapticsDisabled = () => React.useContext(stateContext);
export const useSetHapticsDisabled = () => React.useContext(setContext);
//# sourceMappingURL=disable-haptics.js.map