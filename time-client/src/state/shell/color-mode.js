import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import * as persisted from '#/state/persisted';
const stateContext = React.createContext({
    colorMode: 'system',
    darkTheme: 'dark',
});
stateContext.displayName = 'ColorModeStateContext';
const setContext = React.createContext({});
setContext.displayName = 'ColorModeSetContext';
export function Provider({ children }) {
    const [colorMode, setColorMode] = React.useState(persisted.get('colorMode'));
    const [darkTheme, setDarkTheme] = React.useState(persisted.get('darkTheme'));
    const stateContextValue = React.useMemo(() => ({
        colorMode,
        darkTheme,
    }), [colorMode, darkTheme]);
    const setContextValue = React.useMemo(() => ({
        setColorMode: (_colorMode) => {
            setColorMode(_colorMode);
            persisted.write('colorMode', _colorMode);
        },
        setDarkTheme: (_darkTheme) => {
            setDarkTheme(_darkTheme);
            persisted.write('darkTheme', _darkTheme);
        },
    }), []);
    React.useEffect(() => {
        const unsub1 = persisted.onUpdate('darkTheme', nextDarkTheme => {
            setDarkTheme(nextDarkTheme);
        });
        const unsub2 = persisted.onUpdate('colorMode', nextColorMode => {
            setColorMode(nextColorMode);
        });
        return () => {
            unsub1();
            unsub2();
        };
    }, []);
    return (_jsx(stateContext.Provider, { value: stateContextValue, children: _jsx(setContext.Provider, { value: setContextValue, children: children }) }));
}
export function useThemePrefs() {
    return React.useContext(stateContext);
}
export function useSetThemePrefs() {
    return React.useContext(setContext);
}
//# sourceMappingURL=color-mode.js.map