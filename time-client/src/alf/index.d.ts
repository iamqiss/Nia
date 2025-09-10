import React from 'react';
import { createThemes } from '#/alf/themes';
import { type Theme, type ThemeName } from '#/alf/types';
import { type Device } from '#/storage';
export { atoms } from '#/alf/atoms';
export * from '#/alf/breakpoints';
export * from '#/alf/fonts';
export * as tokens from '#/alf/tokens';
export * from '#/alf/types';
export * from '#/alf/util/flatten';
export * from '#/alf/util/platform';
export * from '#/alf/util/themeSelector';
export * from '#/alf/util/useGutters';
export type Alf = {
    themeName: ThemeName;
    theme: Theme;
    themes: ReturnType<typeof createThemes>;
    fonts: {
        scale: Exclude<Device['fontScale'], undefined>;
        scaleMultiplier: number;
        family: Device['fontFamily'];
        setFontScale: (fontScale: Exclude<Device['fontScale'], undefined>) => void;
        setFontFamily: (fontFamily: Device['fontFamily']) => void;
    };
    /**
     * Feature flags or other gated options
     */
    flags: {};
};
export declare const Context: any;
export declare function ThemeProvider({ children, theme: themeName, }: React.PropsWithChildren<{
    theme: ThemeName;
}>): any;
export declare function useAlf(): any;
export declare function useTheme(theme?: ThemeName): any;
//# sourceMappingURL=index.d.ts.map