import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import * as persisted from '#/state/persisted';
const stateContext = React.createContext(persisted.defaults.hiddenPosts);
stateContext.displayName = 'HiddenPostsStateContext';
const apiContext = React.createContext({
    hidePost: () => { },
    unhidePost: () => { },
});
apiContext.displayName = 'HiddenPostsApiContext';
export function Provider({ children }) {
    const [state, setState] = React.useState(persisted.get('hiddenPosts'));
    const setStateWrapped = React.useCallback((fn) => {
        const s = fn(persisted.get('hiddenPosts'));
        setState(s);
        persisted.write('hiddenPosts', s);
    }, [setState]);
    const api = React.useMemo(() => ({
        hidePost: ({ uri }) => {
            setStateWrapped(s => [...(s || []), uri]);
        },
        unhidePost: ({ uri }) => {
            setStateWrapped(s => (s || []).filter(u => u !== uri));
        },
    }), [setStateWrapped]);
    React.useEffect(() => {
        return persisted.onUpdate('hiddenPosts', nextHiddenPosts => {
            setState(nextHiddenPosts);
        });
    }, [setStateWrapped]);
    return (_jsx(stateContext.Provider, { value: state, children: _jsx(apiContext.Provider, { value: api, children: children }) }));
}
export function useHiddenPosts() {
    return React.useContext(stateContext);
}
export function useHiddenPostsApi() {
    return React.useContext(apiContext);
}
//# sourceMappingURL=hidden-posts.js.map