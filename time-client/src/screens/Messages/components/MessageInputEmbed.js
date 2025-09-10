import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { LayoutAnimation, View } from 'react-native';
import { AppBskyFeedPost, AppBskyRichtextFacet, AtUri, moderatePost, RichText as RichTextAPI, } from '@atproto/api';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { makeProfileLink } from '#/lib/routes/links';
import {} from '#/lib/routes/types';
import { convertBskyAppUrlIfNeeded, isBskyPostUrl, makeRecordUri, } from '#/lib/strings/url-helpers';
import { useModerationOpts } from '#/state/preferences/moderation-opts';
import { usePostQuery } from '#/state/queries/post';
import { PostMeta } from '#/view/com/util/PostMeta';
import { atoms as a, useTheme } from '#/alf';
import { Button, ButtonIcon } from '#/components/Button';
import { TimesLarge_Stroke2_Corner0_Rounded as X } from '#/components/icons/Times';
import { Loader } from '#/components/Loader';
import * as MediaPreview from '#/components/MediaPreview';
import { ContentHider } from '#/components/moderation/ContentHider';
import { PostAlerts } from '#/components/moderation/PostAlerts';
import { RichText } from '#/components/RichText';
import { Text } from '#/components/Typography';
import * as bsky from '#/types/bsky';
export function useMessageEmbed() {
    const route = useRoute();
    const navigation = useNavigation();
    const embedFromParams = route.params.embed;
    const [embedUri, setEmbed] = useState(embedFromParams);
    if (embedFromParams && embedUri !== embedFromParams) {
        setEmbed(embedFromParams);
    }
    return {
        embedUri,
        setEmbed: useCallback((embedUrl) => {
            if (!embedUrl) {
                navigation.setParams({ embed: '' });
                setEmbed(undefined);
                return;
            }
            if (embedFromParams)
                return;
            const url = convertBskyAppUrlIfNeeded(embedUrl);
            const [_0, user, _1, rkey] = url.split('/').filter(Boolean);
            const uri = makeRecordUri(user, 'app.bsky.feed.post', rkey);
            setEmbed(uri);
        }, [embedFromParams, navigation]),
    };
}
export function useExtractEmbedFromFacets(message, setEmbed) {
    const rt = new RichTextAPI({ text: message });
    rt.detectFacetsWithoutResolution();
    let uriFromFacet;
    for (const facet of rt.facets ?? []) {
        for (const feature of facet.features) {
            if (AppBskyRichtextFacet.isLink(feature) && isBskyPostUrl(feature.uri)) {
                uriFromFacet = feature.uri;
                break;
            }
        }
    }
    useEffect(() => {
        if (uriFromFacet) {
            setEmbed(uriFromFacet);
        }
    }, [uriFromFacet, setEmbed]);
}
export function MessageInputEmbed({ embedUri, setEmbed, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const { data: post, status } = usePostQuery(embedUri);
    const moderationOpts = useModerationOpts();
    const moderation = useMemo(() => moderationOpts && post ? moderatePost(post, moderationOpts) : undefined, [moderationOpts, post]);
    const { rt, record } = useMemo(() => {
        if (post &&
            bsky.dangerousIsType(post.record, AppBskyFeedPost.isRecord)) {
            return {
                rt: new RichTextAPI({
                    text: post.record.text,
                    facets: post.record.facets,
                }),
                record: post.record,
            };
        }
        return { rt: undefined, record: undefined };
    }, [post]);
    if (!embedUri) {
        return null;
    }
    let content = null;
    switch (status) {
        case 'pending':
            content = (_jsx(View, { style: [a.flex_1, { minHeight: 64 }, a.justify_center, a.align_center], children: _jsx(Loader, {}) }));
            break;
        case 'error':
            content = (_jsx(View, { style: [a.flex_1, { minHeight: 64 }, a.justify_center, a.align_center], children: _jsx(Text, { style: a.text_center, children: "Could not fetch post" }) }));
            break;
        case 'success':
            const itemUrip = new AtUri(post.uri);
            const itemHref = makeProfileLink(post.author, 'post', itemUrip.rkey);
            if (!post || !moderation || !rt || !record) {
                return null;
            }
            content = (_jsxs(View, { style: [
                    a.flex_1,
                    t.atoms.bg,
                    t.atoms.border_contrast_low,
                    a.rounded_md,
                    a.border,
                    a.p_sm,
                    a.mb_sm,
                ], pointerEvents: "none", children: [_jsx(PostMeta, { showAvatar: true, author: post.author, moderation: moderation, timestamp: post.indexedAt, postHref: itemHref, style: a.flex_0 }), _jsxs(ContentHider, { modui: moderation.ui('contentView'), children: [_jsx(PostAlerts, { modui: moderation.ui('contentView'), style: a.py_xs }), rt.text && (_jsx(View, { style: a.mt_xs, children: _jsx(RichText, { enableTags: true, testID: "postText", value: rt, style: [a.text_sm, t.atoms.text_contrast_high], authorHandle: post.author.handle, numberOfLines: 3 }) })), _jsx(MediaPreview.Embed, { embed: post.embed, style: a.mt_sm })] })] }));
            break;
    }
    return (_jsxs(View, { style: [a.flex_row, a.gap_sm], children: [content, _jsx(Button, { label: _(msg `Remove embed`), onPress: () => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setEmbed(undefined);
                }, size: "tiny", variant: "solid", color: "secondary", shape: "round", children: _jsx(ButtonIcon, { icon: X }) })] }));
}
//# sourceMappingURL=MessageInputEmbed.js.map