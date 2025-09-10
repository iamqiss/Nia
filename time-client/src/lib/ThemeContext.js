import { jsx as _jsx } from "react/jsx-runtime";
import {} from 'react';
import { createContext, useContext } from 'react';
import {} from 'react-native';
import {} from '#/alf/types';
import { darkTheme, defaultTheme, dimTheme } from './themes';
export const ThemeContext = createContext(defaultTheme);
ThemeContext.displayName = 'ThemeContext';
export const useTheme = () => useContext(ThemeContext);
function getTheme(theme) {
    switch (theme) {
        case 'light':
            return defaultTheme;
        case 'dim':
            return dimTheme;
        case 'dark':
            return darkTheme;
        default:
            return defaultTheme;
    }
}
export const ThemeProvider = ({ theme, children, }) => {
    const themeValue = getTheme(theme);
    return (_jsx(ThemeContext.Provider, { value: themeValue, children: children }));
};
//# sourceMappingURL=ThemeContext.js.map