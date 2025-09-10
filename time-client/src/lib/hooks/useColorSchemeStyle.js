import { useTheme } from '#/lib/ThemeContext';
export function useColorSchemeStyle(lightStyle, darkStyle) {
    const colorScheme = useTheme().colorScheme;
    return colorScheme === 'dark' ? darkStyle : lightStyle;
}
//# sourceMappingURL=useColorSchemeStyle.js.map