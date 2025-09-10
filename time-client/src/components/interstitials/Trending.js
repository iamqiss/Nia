import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { ScrollView, View } from 'react-native';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { logEvent } from '#/lib/statsig/statsig';
import { useTrendingSettings, useTrendingSettingsApi, } from '#/state/preferences/trending';
import { useTrendingTopics } from '#/state/queries/trending/useTrendingTopics';
import { useTrendingConfig } from '#/state/service-config';
import { LoadingPlaceholder } from '#/view/com/util/LoadingPlaceholder';
import { BlockDrawerGesture } from '#/view/shell/BlockDrawerGesture';
import { atoms as a, useGutters, useTheme } from '#/alf';
import { Button, ButtonIcon } from '#/components/Button';
import { TimesLarge_Stroke2_Corner0_Rounded as X } from '#/components/icons/Times';
import { Trending2_Stroke2_Corner2_Rounded as Graph } from '#/components/icons/Trending';
import * as Prompt from '#/components/Prompt';
import { TrendingTopicLink } from '#/components/TrendingTopics';
import { Text } from '#/components/Typography';
export function TrendingInterstitial() {
    const { enabled } = useTrendingConfig();
    const { trendingDisabled } = useTrendingSettings();
    return enabled && !trendingDisabled ? _jsx(Inner, {}) : null;
}
export function Inner() {
    const t = useTheme();
    const { _ } = useLingui();
    const gutters = useGutters([0, 'base', 0, 'base']);
    const trendingPrompt = Prompt.usePromptControl();
    const { setTrendingDisabled } = useTrendingSettingsApi();
    const { data: trending, error, isLoading } = useTrendingTopics();
    const noTopics = !isLoading && !error && !trending?.topics?.length;
    const onConfirmHide = React.useCallback(() => {
        logEvent('trendingTopics:hide', { context: 'interstitial' });
        setTrendingDisabled(true);
    }, [setTrendingDisabled]);
    return error || noTopics ? null : (_jsxs(View, { style: [t.atoms.border_contrast_low, a.border_t], children: [_jsx(BlockDrawerGesture, { children: _jsx(ScrollView, { horizontal: true, showsHorizontalScrollIndicator: false, decelerationRate: "fast", children: _jsxs(View, { style: [gutters, a.flex_row, a.align_center, a.gap_lg], children: [_jsx(View, { style: { paddingLeft: 4, paddingRight: 2 }, children: _jsx(Graph, { size: "sm" }) }), isLoading ? (_jsxs(View, { style: [a.py_lg, a.flex_row, a.gap_lg, a.align_center], children: [_jsx(LoadingPlaceholder, { width: 80, height: undefined, style: { alignSelf: 'stretch' } }), _jsx(LoadingPlaceholder, { width: 50, height: undefined, style: { alignSelf: 'stretch' } }), _jsx(LoadingPlaceholder, { width: 120, height: undefined, style: { alignSelf: 'stretch' } }), _jsx(LoadingPlaceholder, { width: 30, height: undefined, style: { alignSelf: 'stretch' } }), _jsx(LoadingPlaceholder, { width: 180, height: undefined, style: { alignSelf: 'stretch' } }), _jsx(Text, { style: [
                                            t.atoms.text_contrast_medium,
                                            a.text_sm,
                                            a.font_bold,
                                        ], children: ' ' })] })) : !trending?.topics ? null : (_jsxs(_Fragment, { children: [trending.topics.map(topic => (_jsx(TrendingTopicLink, { topic: topic, onPress: () => {
                                            logEvent('trendingTopic:click', { context: 'interstitial' });
                                        }, children: _jsx(View, { style: [a.py_lg], children: _jsx(Text, { style: [
                                                    t.atoms.text,
                                                    a.text_sm,
                                                    a.font_bold,
                                                    { opacity: 0.7 }, // NOTE: we use opacity 0.7 instead of a color to match the color of the home pager tab bar
                                                ], children: topic.topic }) }) }, topic.link))), _jsx(Button, { label: _(msg `Hide trending topics`), size: "tiny", variant: "ghost", color: "secondary", shape: "round", onPress: () => trendingPrompt.open(), children: _jsx(ButtonIcon, { icon: X }) })] }))] }) }) }), _jsx(Prompt.Basic, { control: trendingPrompt, title: _(msg `Hide trending topics?`), description: _(msg `You can update this later from your settings.`), confirmButtonCta: _(msg `Hide`), onConfirm: onConfirmHide })] }));
}
//# sourceMappingURL=Trending.js.map