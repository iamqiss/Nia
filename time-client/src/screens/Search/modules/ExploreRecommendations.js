import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { View } from 'react-native';
import {} from '@atproto/api';
import { Trans } from '@lingui/macro';
import { logger } from '#/logger';
import { isWeb } from '#/platform/detection';
import { DEFAULT_LIMIT as RECOMMENDATIONS_COUNT, useTrendingTopics, } from '#/state/queries/trending/useTrendingTopics';
import { useTrendingConfig } from '#/state/service-config';
import { atoms as a, useGutters, useTheme } from '#/alf';
import { Hashtag_Stroke2_Corner0_Rounded } from '#/components/icons/Hashtag';
import { TrendingTopic, TrendingTopicLink, TrendingTopicSkeleton, } from '#/components/TrendingTopics';
import { Text } from '#/components/Typography';
// Note: This module is not currently used and may be removed in the future.
export function ExploreRecommendations() {
    const { enabled } = useTrendingConfig();
    return enabled ? _jsx(Inner, {}) : null;
}
function Inner() {
    const t = useTheme();
    const gutters = useGutters([0, 'compact']);
    const { data: trending, error, isLoading } = useTrendingTopics();
    const noRecs = !isLoading && !error && !trending?.suggested?.length;
    const allFeeds = trending?.suggested && isAllFeeds(trending.suggested);
    return error || noRecs ? null : (_jsxs(_Fragment, { children: [_jsx(View, { style: [
                    a.flex_row,
                    isWeb
                        ? [a.px_lg, a.py_lg, a.pt_2xl, a.gap_md]
                        : [a.p_lg, a.pt_2xl, a.gap_md],
                    a.border_b,
                    t.atoms.border_contrast_low,
                ], children: _jsxs(View, { style: [a.flex_1, a.gap_sm], children: [_jsxs(View, { style: [a.flex_row, a.align_center, a.gap_sm], children: [_jsx(Hashtag_Stroke2_Corner0_Rounded, { size: "lg", fill: t.palette.primary_500, style: { marginLeft: -2 } }), _jsx(Text, { style: [a.text_2xl, a.font_heavy, t.atoms.text], children: _jsx(Trans, { children: "Recommended" }) })] }), !allFeeds ? (_jsx(Text, { style: [t.atoms.text_contrast_high, a.leading_snug], children: _jsx(Trans, { children: "Content from across the network we think you might like." }) })) : (_jsx(Text, { style: [t.atoms.text_contrast_high, a.leading_snug], children: _jsx(Trans, { children: "Feeds we think you might like." }) }))] }) }), _jsx(View, { style: [a.pt_md, a.pb_lg], children: _jsx(View, { style: [
                        a.flex_row,
                        a.justify_start,
                        a.flex_wrap,
                        { rowGap: 8, columnGap: 6 },
                        gutters,
                    ], children: isLoading ? (Array(RECOMMENDATIONS_COUNT)
                        .fill(0)
                        .map((_, i) => _jsx(TrendingTopicSkeleton, { index: i }, i))) : !trending?.suggested ? null : (_jsx(_Fragment, { children: trending.suggested.map(topic => (_jsx(TrendingTopicLink, { topic: topic, onPress: () => {
                                logger.metric('recommendedTopic:click', { context: 'explore' }, { statsig: true });
                            }, children: ({ hovered }) => (_jsx(TrendingTopic, { topic: topic, style: [
                                    hovered && [
                                        t.atoms.border_contrast_high,
                                        t.atoms.bg_contrast_25,
                                    ],
                                ] })) }, topic.link))) })) }) })] }));
}
function isAllFeeds(topics) {
    return topics.every(topic => {
        const segments = topic.link.split('/').slice(1);
        return segments[0] === 'profile' && segments[2] === 'feed';
    });
}
//# sourceMappingURL=ExploreRecommendations.js.map