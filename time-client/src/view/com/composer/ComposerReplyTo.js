import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useMemo, useState } from 'react';
import { LayoutAnimation, Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { AppBskyEmbedImages, AppBskyEmbedRecord, AppBskyEmbedRecordWithMedia, AppBskyFeedPost, } from '@atproto/api';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { sanitizeDisplayName } from '#/lib/strings/display-names';
import { sanitizeHandle } from '#/lib/strings/handles';
import {} from '#/state/shell/composer';
import { PreviewableUserAvatar } from '#/view/com/util/UserAvatar';
import { atoms as a, useTheme, web } from '#/alf';
import { QuoteEmbed } from '#/components/Post/Embed';
import { Text } from '#/components/Typography';
import { useSimpleVerificationState } from '#/components/verification';
import { VerificationCheck } from '#/components/verification/VerificationCheck';
import { parseEmbed } from '#/types/bsky/post';
export function ComposerReplyTo({ replyTo }) {
    const t = useTheme();
    const { _ } = useLingui();
    const { embed } = replyTo;
    const [showFull, setShowFull] = useState(false);
    const onPress = useCallback(() => {
        setShowFull(prev => !prev);
        LayoutAnimation.configureNext({
            duration: 350,
            update: { type: 'spring', springDamping: 0.7 },
        });
    }, []);
    const quoteEmbed = useMemo(() => {
        if (AppBskyEmbedRecord.isView(embed) &&
            AppBskyEmbedRecord.isViewRecord(embed.record) &&
            AppBskyFeedPost.isRecord(embed.record.value)) {
            return embed;
        }
        else if (AppBskyEmbedRecordWithMedia.isView(embed) &&
            AppBskyEmbedRecord.isViewRecord(embed.record.record) &&
            AppBskyFeedPost.isRecord(embed.record.record.value)) {
            return embed.record;
        }
        return null;
    }, [embed]);
    const parsedQuoteEmbed = quoteEmbed
        ? parseEmbed({
            $type: 'app.bsky.embed.record#view',
            ...quoteEmbed,
        })
        : null;
    const images = useMemo(() => {
        if (AppBskyEmbedImages.isView(embed)) {
            return embed.images;
        }
        else if (AppBskyEmbedRecordWithMedia.isView(embed) &&
            AppBskyEmbedImages.isView(embed.media)) {
            return embed.media.images;
        }
    }, [embed]);
    const verification = useSimpleVerificationState({ profile: replyTo.author });
    return (_jsxs(Pressable, { style: [
            a.flex_row,
            a.align_start,
            a.pt_xs,
            a.pb_lg,
            a.mb_md,
            a.mx_lg,
            a.border_b,
            t.atoms.border_contrast_medium,
            web(a.user_select_text),
        ], onPress: onPress, accessibilityRole: "button", accessibilityLabel: _(msg `Expand or collapse the full post you are replying to`), accessibilityHint: "", children: [_jsx(PreviewableUserAvatar, { size: 42, profile: replyTo.author, moderation: replyTo.moderation?.ui('avatar'), type: replyTo.author.associated?.labeler ? 'labeler' : 'user', disableNavigation: true }), _jsxs(View, { style: [a.flex_1, a.pl_md, a.pr_sm, a.gap_2xs], children: [_jsxs(View, { style: [a.flex_row, a.align_center, a.pr_xs], children: [_jsx(Text, { style: [a.font_bold, a.text_md, a.leading_snug, a.flex_shrink], numberOfLines: 1, emoji: true, children: sanitizeDisplayName(replyTo.author.displayName ||
                                    sanitizeHandle(replyTo.author.handle)) }), verification.showBadge && (_jsx(View, { style: [a.pl_xs], children: _jsx(VerificationCheck, { width: 14, verifier: verification.role === 'verifier' }) }))] }), _jsxs(View, { style: [a.flex_row, a.gap_md], children: [_jsx(View, { style: [a.flex_1, a.flex_grow], children: _jsx(Text, { style: [a.text_md, a.leading_snug, t.atoms.text_contrast_high], numberOfLines: !showFull ? 6 : undefined, emoji: true, children: replyTo.text }) }), images && !replyTo.moderation?.ui('contentMedia').blur && (_jsx(ComposerReplyToImages, { images: images, showFull: showFull }))] }), showFull && parsedQuoteEmbed && parsedQuoteEmbed.type === 'post' && (_jsx(QuoteEmbed, { embed: parsedQuoteEmbed }))] })] }));
}
function ComposerReplyToImages({ images, }) {
    return (_jsx(View, { style: [
            a.rounded_xs,
            a.overflow_hidden,
            a.mt_2xs,
            a.mx_xs,
            {
                height: 64,
                width: 64,
            },
        ], children: (images.length === 1 && (_jsx(Image, { source: { uri: images[0].thumb }, style: [a.flex_1], cachePolicy: "memory-disk", accessibilityIgnoresInvertColors: true }))) ||
            (images.length === 2 && (_jsxs(View, { style: [a.flex_1, a.flex_row, a.gap_2xs], children: [_jsx(Image, { source: { uri: images[0].thumb }, style: [a.flex_1], cachePolicy: "memory-disk", accessibilityIgnoresInvertColors: true }), _jsx(Image, { source: { uri: images[1].thumb }, style: [a.flex_1], cachePolicy: "memory-disk", accessibilityIgnoresInvertColors: true })] }))) ||
            (images.length === 3 && (_jsxs(View, { style: [a.flex_1, a.flex_row, a.gap_2xs], children: [_jsx(Image, { source: { uri: images[0].thumb }, style: [a.flex_1], cachePolicy: "memory-disk", accessibilityIgnoresInvertColors: true }), _jsxs(View, { style: [a.flex_1, a.gap_2xs], children: [_jsx(Image, { source: { uri: images[1].thumb }, style: [a.flex_1], cachePolicy: "memory-disk", accessibilityIgnoresInvertColors: true }), _jsx(Image, { source: { uri: images[2].thumb }, style: [a.flex_1], cachePolicy: "memory-disk", accessibilityIgnoresInvertColors: true })] })] }))) ||
            (images.length === 4 && (_jsxs(View, { style: [a.flex_1, a.gap_2xs], children: [_jsxs(View, { style: [a.flex_1, a.flex_row, a.gap_2xs], children: [_jsx(Image, { source: { uri: images[0].thumb }, style: [a.flex_1], cachePolicy: "memory-disk", accessibilityIgnoresInvertColors: true }), _jsx(Image, { source: { uri: images[1].thumb }, style: [a.flex_1], cachePolicy: "memory-disk", accessibilityIgnoresInvertColors: true })] }), _jsxs(View, { style: [a.flex_1, a.flex_row, a.gap_2xs], children: [_jsx(Image, { source: { uri: images[2].thumb }, style: [a.flex_1], cachePolicy: "memory-disk", accessibilityIgnoresInvertColors: true }), _jsx(Image, { source: { uri: images[3].thumb }, style: [a.flex_1], cachePolicy: "memory-disk", accessibilityIgnoresInvertColors: true })] })] }))) }));
}
//# sourceMappingURL=ComposerReplyTo.js.map