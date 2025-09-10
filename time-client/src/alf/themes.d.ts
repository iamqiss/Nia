import { type Palette, type Theme } from '#/alf/types';
/**
 * @deprecated use ALF and access palette from `useTheme()`
 */
export declare const lightPalette: Palette;
/**
 * @deprecated use ALF and access palette from `useTheme()`
 */
export declare const darkPalette: Palette;
/**
 * @deprecated use ALF and access palette from `useTheme()`
 */
export declare const dimPalette: Palette;
/**
 * @deprecated use ALF and access theme from `useTheme()`
 */
export declare const light: Theme;
/**
 * @deprecated use ALF and access theme from `useTheme()`
 */
export declare const dark: Theme;
/**
 * @deprecated use ALF and access theme from `useTheme()`
 */
export declare const dim: Theme;
export declare const defaultTheme: Theme;
export declare function createThemes({ hues, }: {
    hues: {
        primary: number;
        negative: number;
        positive: number;
    };
}): {
    lightPalette: Palette;
    darkPalette: Palette;
    dimPalette: Palette;
    light: Theme;
    dark: Theme;
    dim: Theme;
};
//# sourceMappingURL=themes.d.ts.map