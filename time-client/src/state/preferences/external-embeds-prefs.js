import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import {} from '#/lib/strings/embed-player';
import * as persisted from '#/state/persisted';
const stateContext = React.createContext(persisted.defaults.externalEmbeds);
stateContext.displayName = 'ExternalEmbedsPrefsStateContext';
const setContext = React.createContext({});
setContext.displayName = 'ExternalEmbedsPrefsSetContext';
export function Provider({ children }) {
    const [state, setState] = React.useState(persisted.get('externalEmbeds'));
    const setStateWrapped = React.useCallback((source, value) => {
        setState(prev => {
            persisted.write('externalEmbeds', {
                ...prev,
                [source]: value,
            });
            return {
                ...prev,
                [source]: value,
            };
        });
    }, [setState]);
    React.useEffect(() => {
        return persisted.onUpdate('externalEmbeds', nextExternalEmbeds => {
            setState(nextExternalEmbeds);
        });
    }, [setStateWrapped]);
    return (_jsx(stateContext.Provider, { value: state, children: _jsx(setContext.Provider, { value: setStateWrapped, children: children }) }));
}
export function useExternalEmbedsPrefs() {
    return React.useContext(stateContext);
}
export function useSetExternalEmbedPref() {
    return React.useContext(setContext);
}
//# sourceMappingURL=external-embeds-prefs.js.map