import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { StyleSheet } from 'react-native';
import { UITextView } from 'react-native-uitextview';
import { lh, s } from '#/lib/styles';
import { useTheme } from '#/lib/ThemeContext';
import { logger } from '#/logger';
import { isIOS, isWeb } from '#/platform/detection';
import { applyFonts, useAlf } from '#/alf';
import { childHasEmoji, renderChildrenWithEmoji, } from '#/alf/typography';
export { Text_DEPRECATED as Text };
/**
 * @deprecated use Text from `#/components/Typography.tsx` instead
 */
function Text_DEPRECATED({ type = 'md', children, emoji, lineHeight, style, title, dataSet, selectable, ...props }) {
    const theme = useTheme();
    const { fonts } = useAlf();
    if (__DEV__) {
        if (!emoji && childHasEmoji(children)) {
            logger.warn(`Text: emoji detected but emoji not enabled: "${children}"\n\nPlease add <Text emoji />'`);
        }
    }
    const textProps = React.useMemo(() => {
        const typography = theme.typography[type];
        const lineHeightStyle = lineHeight ? lh(theme, type, lineHeight) : undefined;
        const flattened = StyleSheet.flatten([
            s.black,
            typography,
            lineHeightStyle,
            style,
        ]);
        applyFonts(flattened, fonts.family);
        // should always be defined on `typography`
        // @ts-ignore
        if (flattened.fontSize) {
            // @ts-ignore
            flattened.fontSize = Math.round(
            // @ts-ignore
            flattened.fontSize * fonts.scaleMultiplier);
        }
        return {
            uiTextView: selectable && isIOS,
            selectable,
            style: flattened,
            dataSet: isWeb
                ? Object.assign({ tooltip: title }, dataSet || {})
                : undefined,
            ...props,
        };
    }, [
        dataSet,
        fonts.family,
        fonts.scaleMultiplier,
        lineHeight,
        props,
        selectable,
        style,
        theme,
        title,
        type,
    ]);
    return (_jsx(UITextView, { ...textProps, children: renderChildrenWithEmoji(children, textProps, emoji ?? false) }));
}
//# sourceMappingURL=Text.js.map