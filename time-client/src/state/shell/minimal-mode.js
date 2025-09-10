import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { useSharedValue, withSpring, } from 'react-native-reanimated';
const stateContext = React.createContext({
    headerMode: {
        value: 0,
        addListener() { },
        removeListener() { },
        modify() { },
        get() {
            return 0;
        },
        set() { },
    },
    footerMode: {
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
stateContext.displayName = 'MinimalModeStateContext';
const setContext = React.createContext((_) => { });
setContext.displayName = 'MinimalModeSetContext';
export function Provider({ children }) {
    const headerMode = useSharedValue(0);
    const footerMode = useSharedValue(0);
    const setMode = React.useCallback((v) => {
        'worklet';
        headerMode.set(() => withSpring(v ? 1 : 0, {
            overshootClamping: true,
        }));
        footerMode.set(() => withSpring(v ? 1 : 0, {
            overshootClamping: true,
        }));
    }, [headerMode, footerMode]);
    const value = React.useMemo(() => ({
        headerMode,
        footerMode,
    }), [headerMode, footerMode]);
    return (_jsx(stateContext.Provider, { value: value, children: _jsx(setContext.Provider, { value: setMode, children: children }) }));
}
export function useMinimalShellMode() {
    return React.useContext(stateContext);
}
export function useSetMinimalShellMode() {
    return React.useContext(setContext);
}
//# sourceMappingURL=minimal-mode.js.map