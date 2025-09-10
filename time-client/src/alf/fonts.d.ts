import { type TextStyle } from 'react-native';
import { type Device } from '#/storage';
export declare function computeFontScaleMultiplier(scale: Device['fontScale']): number | undefined;
export declare function getFontScale(): any;
export declare function setFontScale(fontScale: Device['fontScale']): void;
export declare function getFontFamily(): any;
export declare function setFontFamily(fontFamily: Device['fontFamily']): void;
export declare function applyFonts(style: TextStyle, fontFamily: 'system' | 'theme'): void;
/**
 * Here only for bundling purposes, not actually used.
 */
export { DO_NOT_USE } from '#/alf/util/unusedUseFonts';
//# sourceMappingURL=fonts.d.ts.map