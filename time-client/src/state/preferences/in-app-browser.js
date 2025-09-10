import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import * as persisted from '#/state/persisted';
const stateContext = React.createContext(persisted.defaults.useInAppBrowser);
stateContext.displayName = 'InAppBrowserStateContext';
const setContext = React.createContext((_) => { });
setContext.displayName = 'InAppBrowserSetContext';
export function Provider({ children }) {
    const [state, setState] = React.useState(persisted.get('useInAppBrowser'));
    const setStateWrapped = React.useCallback((inAppBrowser) => {
        setState(inAppBrowser);
        persisted.write('useInAppBrowser', inAppBrowser);
    }, [setState]);
    React.useEffect(() => {
        return persisted.onUpdate('useInAppBrowser', nextUseInAppBrowser => {
            setState(nextUseInAppBrowser);
        });
    }, [setStateWrapped]);
    return (_jsx(stateContext.Provider, { value: state, children: _jsx(setContext.Provider, { value: setStateWrapped, children: children }) }));
}
export function useInAppBrowser() {
    return React.useContext(stateContext);
}
export function useSetInAppBrowser() {
    return React.useContext(setContext);
}
//# sourceMappingURL=in-app-browser.js.map