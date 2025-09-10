import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { AppState } from 'react-native';
import { MessagesEventBus } from '#/state/messages/events/agent';
import { useAgent, useSession } from '#/state/session';
const MessagesEventBusContext = React.createContext(null);
MessagesEventBusContext.displayName = 'MessagesEventBusContext';
export function useMessagesEventBus() {
    const ctx = React.useContext(MessagesEventBusContext);
    if (!ctx) {
        throw new Error('useMessagesEventBus must be used within a MessagesEventBusProvider');
    }
    return ctx;
}
export function MessagesEventBusProvider({ children, }) {
    const { currentAccount } = useSession();
    if (!currentAccount) {
        return (_jsx(MessagesEventBusContext.Provider, { value: null, children: children }));
    }
    return (_jsx(MessagesEventBusProviderInner, { children: children }));
}
export function MessagesEventBusProviderInner({ children, }) {
    const agent = useAgent();
    const [bus] = React.useState(() => new MessagesEventBus({
        agent,
    }));
    React.useEffect(() => {
        bus.resume();
        return () => {
            bus.suspend();
        };
    }, [bus]);
    React.useEffect(() => {
        const handleAppStateChange = (nextAppState) => {
            if (nextAppState === 'active') {
                bus.resume();
            }
            else {
                bus.background();
            }
        };
        const sub = AppState.addEventListener('change', handleAppStateChange);
        return () => {
            sub.remove();
        };
    }, [bus]);
    return (_jsx(MessagesEventBusContext.Provider, { value: bus, children: children }));
}
//# sourceMappingURL=index.js.map