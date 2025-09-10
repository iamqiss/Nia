import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { moderateProfile } from '@atproto/api';
import { msg, plural, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { logger } from '#/logger';
import { useModerationOpts } from '#/state/preferences/moderation-opts';
import { useTrendingSettings } from '#/state/preferences/trending';
import { useGetTrendsQuery } from '#/state/queries/trending/useGetTrendsQuery';
import { useTrendingConfig } from '#/state/service-config';
import { LoadingPlaceholder } from '#/view/com/util/LoadingPlaceholder';
import { formatCount } from '#/view/com/util/numeric/format';
import { atoms as a, useGutters, useTheme, web } from '#/alf';
import { AvatarStack } from '#/components/AvatarStack';
import {} from '#/components/icons/common';
import { Flame_Stroke2_Corner1_Rounded as FlameIcon } from '#/components/icons/Flame';
import { Trending3_Stroke2_Corner1_Rounded as TrendingIcon } from '#/components/icons/Trending';
import { Link } from '#/components/Link';
import { SubtleHover } from '#/components/SubtleHover';
import { Text } from '#/components/Typography';
const TOPIC_COUNT = 5;
export function ExploreTrendingTopics() {
    const { enabled } = useTrendingConfig();
    const { trendingDisabled } = useTrendingSettings();
    return enabled && !trendingDisabled ? _jsx(Inner, {}) : null;
}
function Inner() {
    const { data: trending, error, isLoading, isRefetching } = useGetTrendsQuery();
    const noTopics = !isLoading && !error && !trending?.trends?.length;
    return isLoading || isRefetching ? (Array.from({ length: TOPIC_COUNT }).map((__, i) => (_jsx(TrendingTopicRowSkeleton, { withPosts: i === 0 }, i)))) : error || !trending?.trends || noTopics ? null : (_jsx(_Fragment, { children: trending.trends.map((trend, index) => (_jsx(TrendRow, { trend: trend, rank: index + 1, onPress: () => {
                logger.metric('trendingTopic:click', { context: 'explore' }, { statsig: true });
            } }, trend.link))) }));
}
export function TrendRow({ trend, rank, children, onPress, }) {
    const t = useTheme();
    const { _, i18n } = useLingui();
    const gutters = useGutters([0, 'base']);
    const category = useCategoryDisplayName(trend?.category || 'other');
    const age = Math.floor((Date.now() - new Date(trend.startedAt || Date.now()).getTime()) /
        (1000 * 60 * 60));
    const badgeType = trend.status === 'hot' ? 'hot' : age < 2 ? 'new' : age;
    const postCount = trend.postCount
        ? _(plural(trend.postCount, {
            other: `${formatCount(i18n, trend.postCount)} posts`,
        }))
        : null;
    const actors = useModerateTrendingActors(trend.actors);
    return (_jsx(Link, { testID: trend.link, label: _(msg `Browse topic ${trend.displayName}`), to: trend.link, onPress: onPress, style: [a.border_b, t.atoms.border_contrast_low], PressableComponent: Pressable, children: ({ hovered, pressed }) => (_jsxs(_Fragment, { children: [_jsx(SubtleHover, { hover: hovered || pressed }), _jsxs(View, { style: [gutters, a.w_full, a.py_lg, a.flex_row, a.gap_2xs], children: [_jsxs(View, { style: [a.flex_1, a.gap_xs], children: [_jsxs(View, { style: [a.flex_row], children: [_jsx(Text, { style: [
                                                a.text_md,
                                                a.font_bold,
                                                a.leading_tight,
                                                { width: 20 },
                                            ], children: _jsxs(Trans, { comment: 'The trending topic rank, i.e. "1. March Madness", "2. The Bachelor"', children: [rank, "."] }) }), _jsx(Text, { style: [a.text_md, a.font_bold, a.leading_tight], numberOfLines: 1, children: trend.displayName })] }), _jsxs(View, { style: [
                                        a.flex_row,
                                        a.gap_sm,
                                        a.align_center,
                                        { paddingLeft: 20 },
                                    ], children: [actors.length > 0 && (_jsx(AvatarStack, { size: 20, profiles: actors })), _jsxs(Text, { style: [
                                                a.text_sm,
                                                t.atoms.text_contrast_medium,
                                                web(a.leading_snug),
                                            ], numberOfLines: 1, children: [postCount, postCount && category && _jsx(_Fragment, { children: " \u00B7 " }), category] })] })] }), _jsx(View, { style: [a.flex_shrink_0], children: _jsx(TrendingIndicator, { type: badgeType }) })] }), children] })) }));
}
function TrendingIndicator({ type }) {
    const t = useTheme();
    const { _ } = useLingui();
    const pillStyles = [
        a.flex_row,
        a.align_center,
        a.gap_xs,
        a.rounded_full,
        { height: 28, paddingHorizontal: 10 },
    ];
    let Icon = null;
    let text = null;
    let color = null;
    let backgroundColor = null;
    switch (type) {
        case 'skeleton': {
            return (_jsx(View, { style: [
                    pillStyles,
                    { backgroundColor: t.palette.contrast_25, width: 65, height: 28 },
                ] }));
        }
        case 'hot': {
            Icon = FlameIcon;
            color =
                t.scheme === 'light' ? t.palette.negative_500 : t.palette.negative_950;
            backgroundColor =
                t.scheme === 'light' ? t.palette.negative_50 : t.palette.negative_200;
            text = _(msg `Hot`);
            break;
        }
        case 'new': {
            Icon = TrendingIcon;
            text = _(msg `New`);
            color = t.palette.positive_700;
            backgroundColor = t.palette.positive_50;
            break;
        }
        default: {
            text = _(msg({
                message: `${type}h ago`,
                comment: 'trending topic time spent trending. should be as short as possible to fit in a pill',
            }));
            color = t.atoms.text_contrast_medium.color;
            backgroundColor = t.atoms.bg_contrast_25.backgroundColor;
            break;
        }
    }
    return (_jsxs(View, { style: [pillStyles, { backgroundColor }], children: [Icon && _jsx(Icon, { size: "sm", style: { color } }), _jsx(Text, { style: [a.text_sm, a.font_medium, { color }], children: text })] }));
}
function useCategoryDisplayName(category) {
    const { _ } = useLingui();
    switch (category) {
        case 'sports':
            return _(msg `Sports`);
        case 'politics':
            return _(msg `Politics`);
        case 'video-games':
            return _(msg `Video Games`);
        case 'pop-culture':
            return _(msg `Entertainment`);
        case 'news':
            return _(msg `News`);
        case 'other':
        default:
            return null;
    }
}
export function TrendingTopicRowSkeleton({}) {
    const t = useTheme();
    const gutters = useGutters([0, 'base']);
    return (_jsxs(View, { style: [
            gutters,
            a.w_full,
            a.py_lg,
            a.flex_row,
            a.gap_2xs,
            a.border_b,
            t.atoms.border_contrast_low,
        ], children: [_jsxs(View, { style: [a.flex_1, a.gap_sm], children: [_jsxs(View, { style: [a.flex_row, a.align_center], children: [_jsx(View, { style: [{ width: 20 }], children: _jsx(LoadingPlaceholder, { width: 12, height: 12, style: [a.rounded_full] }) }), _jsx(LoadingPlaceholder, { width: 90, height: 17 })] }), _jsxs(View, { style: [a.flex_row, a.gap_sm, a.align_center, { paddingLeft: 20 }], children: [_jsx(LoadingPlaceholder, { width: 70, height: 16 }), _jsx(LoadingPlaceholder, { width: 40, height: 16 }), _jsx(LoadingPlaceholder, { width: 60, height: 16 })] })] }), _jsx(View, { style: [a.flex_shrink_0], children: _jsx(TrendingIndicator, { type: "skeleton" }) })] }));
}
function useModerateTrendingActors(actors) {
    const moderationOpts = useModerationOpts();
    return useMemo(() => {
        if (!moderationOpts)
            return [];
        return actors
            .filter(actor => {
            const decision = moderateProfile(actor, moderationOpts);
            return !decision.ui('avatar').filter && !decision.ui('avatar').blur;
        })
            .slice(0, 3);
    }, [actors, moderationOpts]);
}
//# sourceMappingURL=ExploreTrendingTopics.js.map