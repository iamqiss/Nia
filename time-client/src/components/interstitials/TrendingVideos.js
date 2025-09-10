import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { AppBskyEmbedVideo, AtUri } from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useQueryClient } from '@tanstack/react-query';
import { VIDEO_FEED_URI } from '#/lib/constants';
import { makeCustomFeedLink } from '#/lib/routes/links';
import { logEvent } from '#/lib/statsig/statsig';
import { useTrendingSettingsApi } from '#/state/preferences/trending';
import { usePostFeedQuery } from '#/state/queries/post-feed';
import { RQKEY } from '#/state/queries/post-feed';
import { BlockDrawerGesture } from '#/view/shell/BlockDrawerGesture';
import { atoms as a, useGutters, useTheme } from '#/alf';
import { Button, ButtonIcon } from '#/components/Button';
import { ChevronRight_Stroke2_Corner0_Rounded as ChevronRight } from '#/components/icons/Chevron';
import { TimesLarge_Stroke2_Corner0_Rounded as X } from '#/components/icons/Times';
import { Link } from '#/components/Link';
import * as Prompt from '#/components/Prompt';
import { Text } from '#/components/Typography';
import { CompactVideoPostCard, CompactVideoPostCardPlaceholder, } from '#/components/VideoPostCard';
const CARD_WIDTH = 108;
const FEED_DESC = `feedgen|${VIDEO_FEED_URI}`;
const FEED_PARAMS = {
    feedCacheKey: 'discover',
};
export function TrendingVideos() {
    const t = useTheme();
    const { _ } = useLingui();
    const gutters = useGutters([0, 'base']);
    const { data, isLoading, error } = usePostFeedQuery(FEED_DESC, FEED_PARAMS);
    // Refetch on unmount if nothing else is using this query.
    const queryClient = useQueryClient();
    useEffect(() => {
        return () => {
            const query = queryClient
                .getQueryCache()
                .find({ queryKey: RQKEY(FEED_DESC, FEED_PARAMS) });
            if (query && query.getObserversCount() <= 1) {
                query.fetch();
            }
        };
    }, [queryClient]);
    const { setTrendingVideoDisabled } = useTrendingSettingsApi();
    const trendingPrompt = Prompt.usePromptControl();
    const onConfirmHide = useCallback(() => {
        setTrendingVideoDisabled(true);
        logEvent('trendingVideos:hide', { context: 'interstitial:discover' });
    }, [setTrendingVideoDisabled]);
    if (error) {
        return null;
    }
    return (_jsxs(View, { style: [
            a.pt_sm,
            a.pb_lg,
            a.border_t,
            a.overflow_hidden,
            t.atoms.border_contrast_low,
            t.atoms.bg_contrast_25,
        ], children: [_jsxs(View, { style: [
                    gutters,
                    a.pb_sm,
                    a.flex_row,
                    a.align_center,
                    a.justify_between,
                ], children: [_jsx(Text, { style: [a.text_sm, a.font_bold, a.leading_snug], children: _jsx(Trans, { children: "Trending Videos" }) }), _jsx(Button, { label: _(msg `Dismiss this section`), size: "tiny", variant: "solid", color: "secondary", shape: "square", onPress: () => trendingPrompt.open(), children: _jsx(ButtonIcon, { icon: X, size: "sm" }) })] }), _jsx(BlockDrawerGesture, { children: _jsx(ScrollView, { horizontal: true, showsHorizontalScrollIndicator: false, decelerationRate: "fast", snapToInterval: CARD_WIDTH + a.gap_md.gap, style: [a.overflow_visible], children: _jsx(View, { style: [
                            a.flex_row,
                            a.gap_md,
                            {
                                paddingLeft: gutters.paddingLeft,
                                paddingRight: gutters.paddingRight,
                            },
                        ], children: isLoading ? (Array(10)
                            .fill(0)
                            .map((_, i) => (_jsx(View, { style: [{ width: CARD_WIDTH }], children: _jsx(CompactVideoPostCardPlaceholder, {}) }, i)))) : error || !data ? (_jsx(Text, { children: _jsx(Trans, { children: "Whoops! Trending videos failed to load." }) })) : (_jsx(VideoCards, { data: data })) }) }) }), _jsx(Prompt.Basic, { control: trendingPrompt, title: _(msg `Hide trending videos?`), description: _(msg `You can update this later from your settings.`), confirmButtonCta: _(msg `Hide`), onConfirm: onConfirmHide })] }));
}
function VideoCards({ data, }) {
    const items = useMemo(() => {
        return data.pages
            .flatMap(page => page.slices)
            .map(slice => slice.items[0])
            .filter(Boolean)
            .filter(item => AppBskyEmbedVideo.isView(item.post.embed))
            .slice(0, 8);
    }, [data]);
    return (_jsxs(_Fragment, { children: [items.map(item => (_jsx(View, { style: [{ width: CARD_WIDTH }], children: _jsx(CompactVideoPostCard, { post: item.post, moderation: item.moderation, sourceContext: {
                        type: 'feedgen',
                        uri: VIDEO_FEED_URI,
                        sourceInterstitial: 'discover',
                    }, onInteract: () => {
                        logEvent('videoCard:click', {
                            context: 'interstitial:discover',
                        });
                    } }) }, item.post.uri))), _jsx(ViewMoreCard, {})] }));
}
function ViewMoreCard() {
    const t = useTheme();
    const { _ } = useLingui();
    const href = useMemo(() => {
        const urip = new AtUri(VIDEO_FEED_URI);
        return makeCustomFeedLink(urip.host, urip.rkey, undefined, 'discover');
    }, []);
    return (_jsx(View, { style: [{ width: CARD_WIDTH * 2 }], children: _jsx(Link, { to: href, label: _(msg `View more`), style: [
                a.justify_center,
                a.align_center,
                a.flex_1,
                a.rounded_lg,
                a.border,
                t.atoms.border_contrast_low,
                t.atoms.bg,
                t.atoms.shadow_sm,
            ], children: ({ pressed }) => (_jsxs(View, { style: [
                    a.flex_row,
                    a.align_center,
                    a.gap_md,
                    {
                        opacity: pressed ? 0.6 : 1,
                    },
                ], children: [_jsx(Text, { style: [a.text_md], children: _jsx(Trans, { children: "View more" }) }), _jsx(Button, { color: "primary", size: "small", shape: "round", label: _(msg `View more trending videos`), children: _jsx(ButtonIcon, { icon: ChevronRight }) })] })) }) }));
}
//# sourceMappingURL=TrendingVideos.js.map