import React from 'react';
import { useColorScheme } from 'react-native';
import { isWeb } from '#/platform/detection';
import { useThemePrefs } from '#/state/shell';
import { dark, dim, light } from '#/alf/themes';
import {} from '#/alf/types';
export function useColorModeTheme() {
    const theme = useThemeName();
    React.useLayoutEffect(() => {
        updateDocument(theme);
    }, [theme]);
    return theme;
}
export function useThemeName() {
    const colorScheme = useColorScheme();
    const { colorMode, darkTheme } = useThemePrefs();
    return getThemeName(colorScheme, colorMode, darkTheme);
}
function getThemeName(colorScheme, colorMode, darkTheme) {
    if ((colorMode === 'system' && colorScheme === 'light') ||
        colorMode === 'light') {
        return 'light';
    }
    else {
        return darkTheme ?? 'dim';
    }
}
function updateDocument(theme) {
    // @ts-ignore web only
    if (isWeb && typeof window !== 'undefined') {
        // @ts-ignore web only
        const html = window.document.documentElement;
        // @ts-ignore web only
        const meta = window.document.querySelector('meta[name="theme-color"]');
        // remove any other color mode classes
        html.className = html.className.replace(/(theme)--\w+/g, '');
        html.classList.add(`theme--${theme}`);
        // set color to 'theme-color' meta tag
        meta?.setAttribute('content', getBackgroundColor(theme));
    }
}
export function getBackgroundColor(theme) {
    switch (theme) {
        case 'light':
            return light.atoms.bg.backgroundColor;
        case 'dark':
            return dark.atoms.bg.backgroundColor;
        case 'dim':
            return dim.atoms.bg.backgroundColor;
    }
}
//# sourceMappingURL=useColorModeTheme.js.map