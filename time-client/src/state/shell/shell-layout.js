import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { useSharedValue } from 'react-native-reanimated';
const stateContext = React.createContext({
    headerHeight: {
        value: 0,
        addListener() { },
        removeListener() { },
        modify() { },
        get() {
            return 0;
        },
        set() { },
    },
    footerHeight: {
        value: 0,
        addListener() { },
        removeListener() { },
        modify() { },
        get() {
            return 0;
        },
        set() { },
    },
});
stateContext.displayName = 'ShellLayoutContext';
export function Provider({ children }) {
    const headerHeight = useSharedValue(0);
    const footerHeight = useSharedValue(0);
    const value = React.useMemo(() => ({
        headerHeight,
        footerHeight,
    }), [headerHeight, footerHeight]);
    return _jsx(stateContext.Provider, { value: value, children: children });
}
export function useShellLayout() {
    return React.useContext(stateContext);
}
//# sourceMappingURL=shell-layout.js.map