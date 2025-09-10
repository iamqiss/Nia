import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
const stateContext = React.createContext(undefined);
stateContext.displayName = 'ActiveStarterPackStateContext';
const setContext = React.createContext((_) => { });
setContext.displayName = 'ActiveStarterPackSetContext';
export function Provider({ children }) {
    const [state, setState] = React.useState();
    return (_jsx(stateContext.Provider, { value: state, children: _jsx(setContext.Provider, { value: setState, children: children }) }));
}
export const useActiveStarterPack = () => React.useContext(stateContext);
export const useSetActiveStarterPack = () => React.useContext(setContext);
//# sourceMappingURL=starter-pack.js.map