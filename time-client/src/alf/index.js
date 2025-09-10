import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { computeFontScaleMultiplier, getFontFamily, getFontScale, setFontFamily as persistFontFamily, setFontScale as persistFontScale, } from '#/alf/fonts';
import { createThemes, defaultTheme } from '#/alf/themes';
import {} from '#/alf/types';
import { BLUE_HUE, GREEN_HUE, RED_HUE } from '#/alf/util/colorGeneration';
import {} from '#/storage';
export { atoms } from '#/alf/atoms';
export * from '#/alf/breakpoints';
export * from '#/alf/fonts';
export * as tokens from '#/alf/tokens';
export * from '#/alf/types';
export * from '#/alf/util/flatten';
export * from '#/alf/util/platform';
export * from '#/alf/util/themeSelector';
export * from '#/alf/util/useGutters';
/*
 * Context
 */
export const Context = React.createContext({
    themeName: 'light',
    theme: defaultTheme,
    themes: createThemes({
        hues: {
            primary: BLUE_HUE,
            negative: RED_HUE,
            positive: GREEN_HUE,
        },
    }),
    fonts: {
        scale: getFontScale(),
        scaleMultiplier: computeFontScaleMultiplier(getFontScale()),
        family: getFontFamily(),
        setFontScale: () => { },
        setFontFamily: () => { },
    },
    flags: {},
});
Context.displayName = 'AlfContext';
export function ThemeProvider({ children, theme: themeName, }) {
    const [fontScale, setFontScale] = React.useState(() => getFontScale());
    const [fontScaleMultiplier, setFontScaleMultiplier] = React.useState(() => computeFontScaleMultiplier(fontScale));
    const setFontScaleAndPersist = React.useCallback(fontScale => {
        setFontScale(fontScale);
        persistFontScale(fontScale);
        setFontScaleMultiplier(computeFontScaleMultiplier(fontScale));
    }, [setFontScale]);
    const [fontFamily, setFontFamily] = React.useState(() => getFontFamily());
    const setFontFamilyAndPersist = React.useCallback(fontFamily => {
        setFontFamily(fontFamily);
        persistFontFamily(fontFamily);
    }, [setFontFamily]);
    const themes = React.useMemo(() => {
        return createThemes({
            hues: {
                primary: BLUE_HUE,
                negative: RED_HUE,
                positive: GREEN_HUE,
            },
        });
    }, []);
    const value = React.useMemo(() => ({
        themes,
        themeName: themeName,
        theme: themes[themeName],
        fonts: {
            scale: fontScale,
            scaleMultiplier: fontScaleMultiplier,
            family: fontFamily,
            setFontScale: setFontScaleAndPersist,
            setFontFamily: setFontFamilyAndPersist,
        },
        flags: {},
    }), [
        themeName,
        themes,
        fontScale,
        setFontScaleAndPersist,
        fontFamily,
        setFontFamilyAndPersist,
        fontScaleMultiplier,
    ]);
    return _jsx(Context.Provider, { value: value, children: children });
}
export function useAlf() {
    return React.useContext(Context);
}
export function useTheme(theme) {
    const alf = useAlf();
    return React.useMemo(() => {
        return theme ? alf.themes[theme] : alf.theme;
    }, [theme, alf]);
}
//# sourceMappingURL=index.js.map