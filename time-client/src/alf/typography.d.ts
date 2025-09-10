import { type TextProps as RNTextProps } from 'react-native';
import { type StyleProp, type TextStyle } from 'react-native';
import { type Alf } from '#/alf';
/**
 * Util to calculate lineHeight from a text size atom and a leading atom
 *
 * Example:
 *   `leading(atoms.text_md, atoms.leading_normal)` // => 24
 */
export declare function leading<Size extends {
    fontSize?: number;
}, Leading extends {
    lineHeight?: number;
}>(textSize: Size, leading: Leading): number;
/**
 * Ensures that `lineHeight` defaults to a relative value of `1`, or applies
 * other relative leading atoms.
 *
 * If the `lineHeight` value is > 2, we assume it's an absolute value and
 * returns it as-is.
 */
export declare function normalizeTextStyles(styles: StyleProp<TextStyle>, { fontScale, fontFamily, }: {
    fontScale: number;
    fontFamily: Alf['fonts']['family'];
} & Pick<Alf, 'flags'>): any;
export type StringChild = string | (string | null)[];
export type TextProps = RNTextProps & {
    /**
     * Lets the user select text, to use the native copy and paste functionality.
     */
    selectable?: boolean;
    /**
     * Provides `data-*` attributes to the underlying `UITextView` component on
     * web only.
     */
    dataSet?: Record<string, string | number | undefined>;
    /**
     * Appears as a small tooltip on web hover.
     */
    title?: string;
    /**
     * Whether the children could possibly contain emoji.
     */
    emoji?: boolean;
};
export declare function childHasEmoji(children: React.ReactNode): boolean;
export declare function renderChildrenWithEmoji(children: React.ReactNode, props: Omit<TextProps, "children"> | undefined, emoji: boolean): any;
export declare function isOnlyEmoji(text: string): boolean;
//# sourceMappingURL=typography.d.ts.map