import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import * as persisted from '#/state/persisted';
const stateContext = React.createContext(false);
stateContext.displayName = 'UsedStarterPacksStateContext';
const setContext = React.createContext((_) => { });
setContext.displayName = 'UsedStarterPacksSetContext';
export function Provider({ children }) {
    const [state, setState] = React.useState(() => persisted.get('hasCheckedForStarterPack'));
    const setStateWrapped = (v) => {
        setState(v);
        persisted.write('hasCheckedForStarterPack', v);
    };
    React.useEffect(() => {
        return persisted.onUpdate('hasCheckedForStarterPack', nextHasCheckedForStarterPack => {
            setState(nextHasCheckedForStarterPack);
        });
    }, []);
    return (_jsx(stateContext.Provider, { value: state, children: _jsx(setContext.Provider, { value: setStateWrapped, children: children }) }));
}
export const useHasCheckedForStarterPack = () => React.useContext(stateContext);
export const useSetHasCheckedForStarterPack = () => React.useContext(setContext);
//# sourceMappingURL=used-starter-packs.js.map