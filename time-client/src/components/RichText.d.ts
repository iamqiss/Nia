import { type TextStyle } from 'react-native';
import { RichText as RichTextAPI } from '@atproto/api';
import { type TextStyleProp } from '#/alf';
import { type LinkProps } from '#/components/Link';
import { type TextProps } from '#/components/Typography';
export type RichTextProps = TextStyleProp & Pick<TextProps, 'selectable' | 'onLayout' | 'onTextLayout'> & {
    value: RichTextAPI | string;
    testID?: string;
    numberOfLines?: number;
    disableLinks?: boolean;
    enableTags?: boolean;
    authorHandle?: string;
    onLinkPress?: LinkProps['onPress'];
    interactiveStyle?: TextStyle;
    emojiMultiplier?: number;
    shouldProxyLinks?: boolean;
};
export declare function RichText({ testID, value, style, numberOfLines, disableLinks, selectable, enableTags, authorHandle, onLinkPress, interactiveStyle, emojiMultiplier, onLayout, onTextLayout, shouldProxyLinks, }: RichTextProps): any;
//# sourceMappingURL=RichText.d.ts.map