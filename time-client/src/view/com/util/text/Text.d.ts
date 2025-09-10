import React from 'react';
import { type TextProps } from 'react-native';
import { type TypographyVariant } from '#/lib/ThemeContext';
import { type StringChild } from '#/alf/typography';
export type CustomTextProps = Omit<TextProps, 'children'> & {
    type?: TypographyVariant;
    lineHeight?: number;
    title?: string;
    dataSet?: Record<string, string | number>;
    selectable?: boolean;
} & ({
    emoji: true;
    children: StringChild;
} | {
    emoji?: false;
    children: TextProps['children'];
});
export { Text_DEPRECATED as Text };
/**
 * @deprecated use Text from `#/components/Typography.tsx` instead
 */
declare function Text_DEPRECATED({ type, children, emoji, lineHeight, style, title, dataSet, selectable, ...props }: React.PropsWithChildren<CustomTextProps>): any;
//# sourceMappingURL=Text.d.ts.map