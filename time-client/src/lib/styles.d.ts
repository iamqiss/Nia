import { type StyleProp, type TextStyle } from 'react-native';
import { type Theme, type TypographyVariant } from './ThemeContext';
/**
 * @deprecated use ALF colors instead
 */
export declare const colors: {
    white: string;
    black: string;
    gray1: string;
    gray2: string;
    gray3: string;
    gray4: string;
    gray5: string;
    gray6: string;
    gray7: string;
    gray8: string;
    blue0: string;
    blue1: string;
    blue2: string;
    blue3: string;
    blue4: string;
    blue5: string;
    blue6: string;
    blue7: string;
    red1: string;
    red2: string;
    red3: string;
    red4: string;
    red5: string;
    red6: string;
    red7: string;
    pink1: string;
    pink2: string;
    pink3: string;
    pink4: string;
    pink5: string;
    purple1: string;
    purple2: string;
    purple3: string;
    purple4: string;
    purple5: string;
    green1: string;
    green2: string;
    green3: string;
    green4: string;
    green5: string;
    unreadNotifBg: string;
    brandBlue: string;
    like: string;
};
export declare const gradients: {
    blueLight: {
        start: string;
        end: string;
    };
    blue: {
        start: string;
        end: string;
    };
    blueDark: {
        start: string;
        end: string;
    };
};
/**
 * @deprecated use atoms from `#/alf`
 */
export declare const s: any;
export declare function lh(theme: Theme, type: TypographyVariant, height: number): TextStyle;
export declare function addStyle<T>(base: StyleProp<T>, addedStyle: StyleProp<T>): StyleProp<T>;
//# sourceMappingURL=styles.d.ts.map