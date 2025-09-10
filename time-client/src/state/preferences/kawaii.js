import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { isWeb } from '#/platform/detection';
import * as persisted from '#/state/persisted';
const stateContext = React.createContext(persisted.defaults.kawaii);
stateContext.displayName = 'KawaiiStateContext';
export function Provider({ children }) {
    const [state, setState] = React.useState(persisted.get('kawaii'));
    const setStateWrapped = React.useCallback((kawaii) => {
        setState(kawaii);
        persisted.write('kawaii', kawaii);
    }, [setState]);
    React.useEffect(() => {
        return persisted.onUpdate('kawaii', nextKawaii => {
            setState(nextKawaii);
        });
    }, [setStateWrapped]);
    React.useEffect(() => {
        // dumb and stupid but it's web only so just refresh the page if you want to change it
        if (isWeb) {
            const kawaii = new URLSearchParams(window.location.search).get('kawaii');
            switch (kawaii) {
                case 'true':
                    setStateWrapped(true);
                    break;
                case 'false':
                    setStateWrapped(false);
                    break;
            }
        }
    }, [setStateWrapped]);
    return _jsx(stateContext.Provider, { value: state, children: children });
}
export function useKawaiiMode() {
    return React.useContext(stateContext);
}
//# sourceMappingURL=kawaii.js.map