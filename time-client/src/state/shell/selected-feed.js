import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { isWeb } from '#/platform/detection';
import * as persisted from '#/state/persisted';
import {} from '#/state/queries/post-feed';
const stateContext = React.createContext(null);
stateContext.displayName = 'SelectedFeedStateContext';
const setContext = React.createContext((_) => { });
setContext.displayName = 'SelectedFeedSetContext';
function getInitialFeed() {
    if (isWeb) {
        if (window.location.pathname === '/') {
            const params = new URLSearchParams(window.location.search);
            const feedFromUrl = params.get('feed');
            if (feedFromUrl) {
                // If explicitly booted from a link like /?feed=..., prefer that.
                return feedFromUrl;
            }
        }
        const feedFromSession = sessionStorage.getItem('lastSelectedHomeFeed');
        if (feedFromSession) {
            // Fall back to a previously chosen feed for this browser tab.
            return feedFromSession;
        }
    }
    const feedFromPersisted = persisted.get('lastSelectedHomeFeed');
    if (feedFromPersisted) {
        // Fall back to the last chosen one across all tabs.
        return feedFromPersisted;
    }
    return null;
}
export function Provider({ children }) {
    const [state, setState] = React.useState(() => getInitialFeed());
    const saveState = React.useCallback((feed) => {
        setState(feed);
        if (isWeb) {
            try {
                sessionStorage.setItem('lastSelectedHomeFeed', feed);
            }
            catch { }
        }
        persisted.write('lastSelectedHomeFeed', feed);
    }, []);
    return (_jsx(stateContext.Provider, { value: state, children: _jsx(setContext.Provider, { value: saveState, children: children }) }));
}
export function useSelectedFeed() {
    return React.useContext(stateContext);
}
export function useSetSelectedFeed() {
    return React.useContext(setContext);
}
//# sourceMappingURL=selected-feed.js.map