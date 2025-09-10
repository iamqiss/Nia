import { jsx as _jsx } from "react/jsx-runtime";
import React, { useEffect } from 'react';
import * as persisted from '#/state/persisted';
import { useAgent, useSession } from '../session';
const stateContext = React.createContext(new Map());
stateContext.displayName = 'ThreadMutesStateContext';
const setStateContext = React.createContext((_) => false);
setStateContext.displayName = 'ThreadMutesSetStateContext';
export function Provider({ children }) {
    const [state, setState] = React.useState(() => new Map());
    const setThreadMute = React.useCallback((uri, value) => {
        setState(prev => {
            const next = new Map(prev);
            next.set(uri, value);
            return next;
        });
    }, [setState]);
    useMigrateMutes(setThreadMute);
    return (_jsx(stateContext.Provider, { value: state, children: _jsx(setStateContext.Provider, { value: setThreadMute, children: children }) }));
}
export function useMutedThreads() {
    return React.useContext(stateContext);
}
export function useIsThreadMuted(uri, defaultValue = false) {
    const state = React.useContext(stateContext);
    return state.get(uri) ?? defaultValue;
}
export function useSetThreadMute() {
    return React.useContext(setStateContext);
}
function useMigrateMutes(setThreadMute) {
    const agent = useAgent();
    const { currentAccount } = useSession();
    useEffect(() => {
        if (currentAccount) {
            if (!persisted
                .get('mutedThreads')
                .some(uri => uri.includes(currentAccount.did))) {
                return;
            }
            let cancelled = false;
            const migrate = async () => {
                while (!cancelled) {
                    const threads = persisted.get('mutedThreads');
                    // @ts-ignore findLast is polyfilled - esb
                    const root = threads.findLast(uri => uri.includes(currentAccount.did));
                    if (!root)
                        break;
                    persisted.write('mutedThreads', threads.filter(uri => uri !== root));
                    setThreadMute(root, true);
                    await agent.api.app.bsky.graph
                        .muteThread({ root })
                        // not a big deal if this fails, since the post might have been deleted
                        .catch(console.error);
                }
            };
            migrate();
            return () => {
                cancelled = true;
            };
        }
    }, [agent, currentAccount, setThreadMute]);
}
//# sourceMappingURL=thread-mutes.js.map