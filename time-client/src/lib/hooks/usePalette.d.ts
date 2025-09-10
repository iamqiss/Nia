import { type TextStyle, type ViewStyle } from 'react-native';
import { type PaletteColor, type PaletteColorName } from '../ThemeContext';
export interface UsePaletteValue {
    colors: PaletteColor;
    view: ViewStyle;
    viewLight: ViewStyle;
    btn: ViewStyle;
    border: ViewStyle;
    borderDark: ViewStyle;
    text: TextStyle;
    textLight: TextStyle;
    textInverted: TextStyle;
    link: TextStyle;
    icon: TextStyle;
}
/**
 * @deprecated use `useTheme` from `#/alf`
 */
export declare function usePalette(color: PaletteColorName): UsePaletteValue;
//# sourceMappingURL=usePalette.d.ts.map