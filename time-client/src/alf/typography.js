import { createElement as _createElement } from "react";
import { Children } from 'react';
import {} from 'react-native';
import {} from 'react-native';
import { UITextView } from 'react-native-uitextview';
import createEmojiRegex from 'emoji-regex';
import { isNative } from '#/platform/detection';
import { isIOS } from '#/platform/detection';
import { applyFonts, atoms, flatten } from '#/alf';
/**
 * Util to calculate lineHeight from a text size atom and a leading atom
 *
 * Example:
 *   `leading(atoms.text_md, atoms.leading_normal)` // => 24
 */
export function leading(textSize, leading) {
    const size = textSize?.fontSize || atoms.text_md.fontSize;
    const lineHeight = leading?.lineHeight || atoms.leading_normal.lineHeight;
    return Math.round(size * lineHeight);
}
/**
 * Ensures that `lineHeight` defaults to a relative value of `1`, or applies
 * other relative leading atoms.
 *
 * If the `lineHeight` value is > 2, we assume it's an absolute value and
 * returns it as-is.
 */
export function normalizeTextStyles(styles, { fontScale, fontFamily, }) {
    const s = flatten(styles);
    // should always be defined on these components
    s.fontSize = (s.fontSize || atoms.text_md.fontSize) * fontScale;
    if (s?.lineHeight) {
        if (s.lineHeight !== 0 && s.lineHeight <= 2) {
            s.lineHeight = Math.round(s.fontSize * s.lineHeight);
        }
    }
    else if (!isNative) {
        s.lineHeight = s.fontSize;
    }
    applyFonts(s, fontFamily);
    return s;
}
const EMOJI = createEmojiRegex();
export function childHasEmoji(children) {
    let hasEmoji = false;
    Children.forEach(children, child => {
        if (typeof child === 'string' && createEmojiRegex().test(child)) {
            hasEmoji = true;
        }
    });
    return hasEmoji;
}
export function renderChildrenWithEmoji(children, props = {}, emoji) {
    if (!isIOS || !emoji) {
        return children;
    }
    return Children.map(children, child => {
        if (typeof child !== 'string')
            return child;
        const emojis = child.match(EMOJI);
        if (emojis === null) {
            return child;
        }
        return child.split(EMOJI).map((stringPart, index) => [
            stringPart,
            emojis[index] ? (_createElement(UITextView, { ...props, style: [props?.style, { fontFamily: 'System' }], key: index }, emojis[index])) : null,
        ]);
    });
}
const SINGLE_EMOJI_RE = /^[\p{Emoji_Presentation}\p{Extended_Pictographic}]+$/u;
export function isOnlyEmoji(text) {
    return text.length <= 15 && SINGLE_EMOJI_RE.test(text);
}
//# sourceMappingURL=typography.js.map