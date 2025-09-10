import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
const stateContext = createContext(false);
stateContext.displayName = 'DrawerOpenStateContext';
const setContext = createContext((_) => { });
setContext.displayName = 'DrawerOpenSetContext';
export function Provider({ children }) {
    const [state, setState] = useState(false);
    return (_jsx(stateContext.Provider, { value: state, children: _jsx(setContext.Provider, { value: setState, children: children }) }));
}
export function useIsDrawerOpen() {
    return useContext(stateContext);
}
export function useSetDrawerOpen() {
    return useContext(setContext);
}
//# sourceMappingURL=drawer-open.js.map