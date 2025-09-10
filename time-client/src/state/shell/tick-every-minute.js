import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
const stateContext = React.createContext(0);
stateContext.displayName = 'TickEveryMinuteContext';
export function Provider({ children }) {
    const [tick, setTick] = React.useState(Date.now());
    React.useEffect(() => {
        const i = setInterval(() => {
            setTick(Date.now());
        }, 60_000);
        return () => clearInterval(i);
    }, []);
    return _jsx(stateContext.Provider, { value: tick, children: children });
}
export function useTickEveryMinute() {
    return React.useContext(stateContext);
}
//# sourceMappingURL=tick-every-minute.js.map