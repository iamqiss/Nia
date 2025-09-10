import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import {} from '@atproto/api';
const StateContext = React.createContext({
    uris: new Set(),
    recentlyUnhiddenUris: new Set(),
});
StateContext.displayName = 'ThreadgateHiddenRepliesStateContext';
const ApiContext = React.createContext({
    addHiddenReplyUri: () => { },
    removeHiddenReplyUri: () => { },
});
ApiContext.displayName = 'ThreadgateHiddenRepliesApiContext';
export function Provider({ children }) {
    const [uris, setHiddenReplyUris] = React.useState(new Set());
    const [recentlyUnhiddenUris, setRecentlyUnhiddenUris] = React.useState(new Set());
    const stateCtx = React.useMemo(() => ({
        uris,
        recentlyUnhiddenUris,
    }), [uris, recentlyUnhiddenUris]);
    const apiCtx = React.useMemo(() => ({
        addHiddenReplyUri(uri) {
            setHiddenReplyUris(prev => new Set(prev.add(uri)));
            setRecentlyUnhiddenUris(prev => {
                prev.delete(uri);
                return new Set(prev);
            });
        },
        removeHiddenReplyUri(uri) {
            setHiddenReplyUris(prev => {
                prev.delete(uri);
                return new Set(prev);
            });
            setRecentlyUnhiddenUris(prev => new Set(prev.add(uri)));
        },
    }), [setHiddenReplyUris]);
    return (_jsx(ApiContext.Provider, { value: apiCtx, children: _jsx(StateContext.Provider, { value: stateCtx, children: children }) }));
}
export function useThreadgateHiddenReplyUris() {
    return React.useContext(StateContext);
}
export function useThreadgateHiddenReplyUrisAPI() {
    return React.useContext(ApiContext);
}
export function useMergedThreadgateHiddenReplies({ threadgateRecord, }) {
    const { uris, recentlyUnhiddenUris } = useThreadgateHiddenReplyUris();
    return React.useMemo(() => {
        const set = new Set([...(threadgateRecord?.hiddenReplies || []), ...uris]);
        for (const uri of recentlyUnhiddenUris) {
            set.delete(uri);
        }
        return set;
    }, [uris, recentlyUnhiddenUris, threadgateRecord]);
}
export function useMergeThreadgateHiddenReplies() {
    const { uris, recentlyUnhiddenUris } = useThreadgateHiddenReplyUris();
    return React.useCallback((threadgate) => {
        const set = new Set([...(threadgate?.hiddenReplies || []), ...uris]);
        for (const uri of recentlyUnhiddenUris) {
            set.delete(uri);
        }
        return set;
    }, [uris, recentlyUnhiddenUris]);
}
//# sourceMappingURL=threadgate-hidden-replies.js.map