import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import * as persisted from '#/state/persisted';
const StateContext = React.createContext({
    trendingDisabled: Boolean(persisted.defaults.trendingDisabled),
    trendingVideoDisabled: Boolean(persisted.defaults.trendingVideoDisabled),
});
StateContext.displayName = 'TrendingStateContext';
const ApiContext = React.createContext({
    setTrendingDisabled() { },
    setTrendingVideoDisabled() { },
});
ApiContext.displayName = 'TrendingApiContext';
function usePersistedBooleanValue(key) {
    const [value, _set] = React.useState(() => {
        return Boolean(persisted.get(key));
    });
    const set = React.useCallback(hidden => {
        _set(Boolean(hidden));
        persisted.write(key, hidden);
    }, [key, _set]);
    React.useEffect(() => {
        return persisted.onUpdate(key, hidden => {
            _set(Boolean(hidden));
        });
    }, [key, _set]);
    return [value, set];
}
export function Provider({ children }) {
    const [trendingDisabled, setTrendingDisabled] = usePersistedBooleanValue('trendingDisabled');
    const [trendingVideoDisabled, setTrendingVideoDisabled] = usePersistedBooleanValue('trendingVideoDisabled');
    /*
     * Context
     */
    const state = React.useMemo(() => ({ trendingDisabled, trendingVideoDisabled }), [trendingDisabled, trendingVideoDisabled]);
    const api = React.useMemo(() => ({ setTrendingDisabled, setTrendingVideoDisabled }), [setTrendingDisabled, setTrendingVideoDisabled]);
    return (_jsx(StateContext.Provider, { value: state, children: _jsx(ApiContext.Provider, { value: api, children: children }) }));
}
export function useTrendingSettings() {
    return React.useContext(StateContext);
}
export function useTrendingSettingsApi() {
    return React.useContext(ApiContext);
}
//# sourceMappingURL=trending.js.map