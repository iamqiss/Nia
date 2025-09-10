import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import {} from 'react-native';
import { AppBskyRichtextFacet, RichText as RichTextAPI } from '@atproto/api';
import { toShortUrl } from '#/lib/strings/url-helpers';
import { atoms as a, flatten } from '#/alf';
import { isOnlyEmoji } from '#/alf/typography';
import { InlineLinkText } from '#/components/Link';
import { ProfileHoverCard } from '#/components/ProfileHoverCard';
import { RichTextTag } from '#/components/RichTextTag';
import { Text } from '#/components/Typography';
const WORD_WRAP = { wordWrap: 1 };
export function RichText({ testID, value, style, numberOfLines, disableLinks, selectable, enableTags = false, authorHandle, onLinkPress, interactiveStyle, emojiMultiplier = 1.85, onLayout, onTextLayout, shouldProxyLinks, }) {
    const richText = React.useMemo(() => value instanceof RichTextAPI ? value : new RichTextAPI({ text: value }), [value]);
    const flattenedStyle = flatten(style);
    const plainStyles = [a.leading_snug, flattenedStyle];
    const interactiveStyles = [
        a.leading_snug,
        flatten(interactiveStyle),
        flattenedStyle,
    ];
    const { text, facets } = richText;
    if (!facets?.length) {
        if (isOnlyEmoji(text)) {
            const fontSize = (flattenedStyle.fontSize ?? a.text_sm.fontSize) * emojiMultiplier;
            return (_jsx(Text, { emoji: true, selectable: selectable, testID: testID, style: [plainStyles, { fontSize }], onLayout: onLayout, onTextLayout: onTextLayout, 
                // @ts-ignore web only -prf
                dataSet: WORD_WRAP, children: text }));
        }
        return (_jsx(Text, { emoji: true, selectable: selectable, testID: testID, style: plainStyles, numberOfLines: numberOfLines, onLayout: onLayout, onTextLayout: onTextLayout, 
            // @ts-ignore web only -prf
            dataSet: WORD_WRAP, children: text }));
    }
    const els = [];
    let key = 0;
    // N.B. must access segments via `richText.segments`, not via destructuring
    for (const segment of richText.segments()) {
        const link = segment.link;
        const mention = segment.mention;
        const tag = segment.tag;
        if (mention &&
            AppBskyRichtextFacet.validateMention(mention).success &&
            !disableLinks) {
            els.push(_jsx(ProfileHoverCard, { did: mention.did, children: _jsx(InlineLinkText, { selectable: selectable, to: `/profile/${mention.did}`, style: interactiveStyles, 
                    // @ts-ignore TODO
                    dataSet: WORD_WRAP, shouldProxy: shouldProxyLinks, onPress: onLinkPress, children: segment.text }) }, key));
        }
        else if (link && AppBskyRichtextFacet.validateLink(link).success) {
            if (disableLinks) {
                els.push(toShortUrl(segment.text));
            }
            else {
                els.push(_jsx(InlineLinkText, { selectable: selectable, to: link.uri, style: interactiveStyles, 
                    // @ts-ignore TODO
                    dataSet: WORD_WRAP, shareOnLongPress: true, shouldProxy: shouldProxyLinks, onPress: onLinkPress, emoji: true, children: toShortUrl(segment.text) }, key));
            }
        }
        else if (!disableLinks &&
            enableTags &&
            tag &&
            AppBskyRichtextFacet.validateTag(tag).success) {
            els.push(_jsx(RichTextTag, { display: segment.text, tag: tag.tag, textStyle: interactiveStyles, authorHandle: authorHandle }, key));
        }
        else {
            els.push(segment.text);
        }
        key++;
    }
    return (_jsx(Text, { emoji: true, selectable: selectable, testID: testID, style: plainStyles, numberOfLines: numberOfLines, onLayout: onLayout, onTextLayout: onTextLayout, 
        // @ts-ignore web only -prf
        dataSet: WORD_WRAP, children: els }));
}
//# sourceMappingURL=RichText.js.map