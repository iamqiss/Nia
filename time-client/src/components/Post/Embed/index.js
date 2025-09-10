import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { AppBskyFeedPost, AtUri, moderatePost, RichText as RichTextAPI, } from '@atproto/api';
import { Trans } from '@lingui/macro';
import { useQueryClient } from '@tanstack/react-query';
import { usePalette } from '#/lib/hooks/usePalette';
import { makeProfileLink } from '#/lib/routes/links';
import { useModerationOpts } from '#/state/preferences/moderation-opts';
import { unstableCacheProfileView } from '#/state/queries/profile';
import { useSession } from '#/state/session';
import { Link } from '#/view/com/util/Link';
import { PostMeta } from '#/view/com/util/PostMeta';
import { atoms as a, useTheme } from '#/alf';
import { ContentHider } from '#/components/moderation/ContentHider';
import { PostAlerts } from '#/components/moderation/PostAlerts';
import { RichText } from '#/components/RichText';
import { Embed as StarterPackCard } from '#/components/StarterPack/StarterPackCard';
import { SubtleWebHover } from '#/components/SubtleWebHover';
import * as bsky from '#/types/bsky';
import { parseEmbed, } from '#/types/bsky/post';
import { ExternalEmbed } from './ExternalEmbed';
import { ModeratedFeedEmbed } from './FeedEmbed';
import { ImageEmbed } from './ImageEmbed';
import { ModeratedListEmbed } from './ListEmbed';
import { PostPlaceholder as PostPlaceholderText } from './PostPlaceholder';
import { PostEmbedViewContext, QuoteEmbedViewContext, } from './types';
import { VideoEmbed } from './VideoEmbed';
export { PostEmbedViewContext, QuoteEmbedViewContext } from './types';
export function Embed({ embed: rawEmbed, ...rest }) {
    const embed = parseEmbed(rawEmbed);
    switch (embed.type) {
        case 'images':
        case 'link':
        case 'video': {
            return _jsx(MediaEmbed, { embed: embed, ...rest });
        }
        case 'feed':
        case 'list':
        case 'starter_pack':
        case 'labeler':
        case 'post':
        case 'post_not_found':
        case 'post_blocked':
        case 'post_detached': {
            return _jsx(RecordEmbed, { embed: embed, ...rest });
        }
        case 'post_with_media': {
            return (_jsxs(View, { style: rest.style, children: [_jsx(MediaEmbed, { embed: embed.media, ...rest }), _jsx(RecordEmbed, { embed: embed.view, ...rest })] }));
        }
        default: {
            return null;
        }
    }
}
function MediaEmbed({ embed, ...rest }) {
    switch (embed.type) {
        case 'images': {
            return (_jsx(ContentHider, { modui: rest.moderation?.ui('contentMedia'), activeStyle: [a.mt_sm], children: _jsx(ImageEmbed, { embed: embed, ...rest }) }));
        }
        case 'link': {
            return (_jsx(ContentHider, { modui: rest.moderation?.ui('contentMedia'), activeStyle: [a.mt_sm], children: _jsx(ExternalEmbed, { link: embed.view.external, onOpen: rest.onOpen, style: [a.mt_sm, rest.style] }) }));
        }
        case 'video': {
            return (_jsx(ContentHider, { modui: rest.moderation?.ui('contentMedia'), activeStyle: [a.mt_sm], children: _jsx(VideoEmbed, { embed: embed.view }) }));
        }
        default: {
            return null;
        }
    }
}
function RecordEmbed({ embed, ...rest }) {
    switch (embed.type) {
        case 'feed': {
            return (_jsx(View, { style: a.mt_sm, children: _jsx(ModeratedFeedEmbed, { embed: embed, ...rest }) }));
        }
        case 'list': {
            return (_jsx(View, { style: a.mt_sm, children: _jsx(ModeratedListEmbed, { embed: embed }) }));
        }
        case 'starter_pack': {
            return (_jsx(View, { style: a.mt_sm, children: _jsx(StarterPackCard, { starterPack: embed.view }) }));
        }
        case 'labeler': {
            // not implemented
            return null;
        }
        case 'post': {
            if (rest.isWithinQuote && !rest.allowNestedQuotes) {
                return null;
            }
            return (_jsx(QuoteEmbed, { ...rest, embed: embed, viewContext: rest.viewContext === PostEmbedViewContext.Feed
                    ? QuoteEmbedViewContext.FeedEmbedRecordWithMedia
                    : undefined, isWithinQuote: rest.isWithinQuote, allowNestedQuotes: rest.allowNestedQuotes }));
        }
        case 'post_not_found': {
            return (_jsx(PostPlaceholderText, { children: _jsx(Trans, { children: "Deleted" }) }));
        }
        case 'post_blocked': {
            return (_jsx(PostPlaceholderText, { children: _jsx(Trans, { children: "Blocked" }) }));
        }
        case 'post_detached': {
            return _jsx(PostDetachedEmbed, { embed: embed });
        }
        default: {
            return null;
        }
    }
}
export function PostDetachedEmbed({ embed, }) {
    const { currentAccount } = useSession();
    const isViewerOwner = currentAccount?.did
        ? embed.view.uri.includes(currentAccount.did)
        : false;
    return (_jsx(PostPlaceholderText, { children: isViewerOwner ? (_jsx(Trans, { children: "Removed by you" })) : (_jsx(Trans, { children: "Removed by author" })) }));
}
/*
 * Nests parent `Embed` component and therefore must live in this file to avoid
 * circular imports.
 */
export function QuoteEmbed({ embed, onOpen, style, isWithinQuote: parentIsWithinQuote, allowNestedQuotes: parentAllowNestedQuotes, }) {
    const moderationOpts = useModerationOpts();
    const quote = React.useMemo(() => ({
        ...embed.view,
        $type: 'app.bsky.feed.defs#postView',
        record: embed.view.value,
        embed: embed.view.embeds?.[0],
    }), [embed]);
    const moderation = React.useMemo(() => {
        return moderationOpts ? moderatePost(quote, moderationOpts) : undefined;
    }, [quote, moderationOpts]);
    const t = useTheme();
    const queryClient = useQueryClient();
    const pal = usePalette('default');
    const itemUrip = new AtUri(quote.uri);
    const itemHref = makeProfileLink(quote.author, 'post', itemUrip.rkey);
    const itemTitle = `Post by ${quote.author.handle}`;
    const richText = React.useMemo(() => {
        if (!bsky.dangerousIsType(quote.record, AppBskyFeedPost.isRecord))
            return undefined;
        const { text, facets } = quote.record;
        return text.trim()
            ? new RichTextAPI({ text: text, facets: facets })
            : undefined;
    }, [quote.record]);
    const onBeforePress = React.useCallback(() => {
        unstableCacheProfileView(queryClient, quote.author);
        onOpen?.();
    }, [queryClient, quote.author, onOpen]);
    const [hover, setHover] = React.useState(false);
    return (_jsx(View, { style: [a.mt_sm], onPointerEnter: () => setHover(true), onPointerLeave: () => setHover(false), children: _jsx(ContentHider, { modui: moderation?.ui('contentList'), style: [a.rounded_md, a.border, t.atoms.border_contrast_low, style], activeStyle: [a.p_md, a.pt_sm], childContainerStyle: [a.pt_sm], children: ({ active }) => (_jsxs(_Fragment, { children: [!active && _jsx(SubtleWebHover, { hover: hover, style: [a.rounded_md] }), _jsxs(Link, { style: [!active && a.p_md], hoverStyle: { borderColor: pal.colors.borderLinkHover }, href: itemHref, title: itemTitle, onBeforePress: onBeforePress, children: [_jsx(View, { pointerEvents: "none", children: _jsx(PostMeta, { author: quote.author, moderation: moderation, showAvatar: true, postHref: itemHref, timestamp: quote.indexedAt }) }), moderation ? (_jsx(PostAlerts, { modui: moderation.ui('contentView'), style: [a.py_xs] })) : null, richText ? (_jsx(RichText, { value: richText, style: a.text_md, numberOfLines: 20, disableLinks: true })) : null, quote.embed && (_jsx(Embed, { embed: quote.embed, moderation: moderation, isWithinQuote: parentIsWithinQuote ?? true, 
                                // already within quote? override nested
                                allowNestedQuotes: parentIsWithinQuote ? false : parentAllowNestedQuotes }))] })] })) }) }));
}
//# sourceMappingURL=index.js.map