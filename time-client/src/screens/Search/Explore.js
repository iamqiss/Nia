import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useQueryClient } from '@tanstack/react-query';
import * as bcp47Match from 'bcp-47-match';
import { cleanError } from '#/lib/strings/errors';
import { sanitizeHandle } from '#/lib/strings/handles';
import { logger } from '#/logger';
import {} from '#/logger/metrics';
import { isNative } from '#/platform/detection';
import { useLanguagePrefs } from '#/state/preferences/languages';
import { useModerationOpts } from '#/state/preferences/moderation-opts';
import { RQKEY_ROOT_PAGINATED as useActorSearchPaginatedQueryKeyRoot } from '#/state/queries/actor-search';
import { useFeedPreviews, } from '#/state/queries/explore-feed-previews';
import { useGetPopularFeedsQuery } from '#/state/queries/feed';
import { Nux, useNux } from '#/state/queries/nuxs';
import { usePreferencesQuery } from '#/state/queries/preferences';
import { createGetSuggestedFeedsQueryKey, useGetSuggestedFeedsQuery, } from '#/state/queries/trending/useGetSuggestedFeedsQuery';
import { getSuggestedUsersQueryKeyRoot } from '#/state/queries/trending/useGetSuggestedUsersQuery';
import { createGetTrendsQueryKey } from '#/state/queries/trending/useGetTrendsQuery';
import { createSuggestedStarterPacksQueryKey, useSuggestedStarterPacksQuery, } from '#/state/queries/useSuggestedStarterPacksQuery';
import { isThreadChildAt, isThreadParentAt } from '#/view/com/posts/PostFeed';
import { PostFeedItem } from '#/view/com/posts/PostFeedItem';
import { ViewFullThread } from '#/view/com/posts/ViewFullThread';
import { List } from '#/view/com/util/List';
import { FeedFeedLoadingPlaceholder } from '#/view/com/util/LoadingPlaceholder';
import { LoadMoreRetryBtn } from '#/view/com/util/LoadMoreRetryBtn';
import { popularInterests, useInterestsDisplayNames, } from '#/screens/Onboarding/state';
import { StarterPackCard, StarterPackCardSkeleton, } from '#/screens/Search/components/StarterPackCard';
import { ExploreInterestsCard } from '#/screens/Search/modules/ExploreInterestsCard';
import { ExploreRecommendations } from '#/screens/Search/modules/ExploreRecommendations';
import { ExploreTrendingTopics } from '#/screens/Search/modules/ExploreTrendingTopics';
import { ExploreTrendingVideos } from '#/screens/Search/modules/ExploreTrendingVideos';
import { useSuggestedUsers } from '#/screens/Search/util/useSuggestedUsers';
import { atoms as a, native, platform, useTheme } from '#/alf';
import { Admonition } from '#/components/Admonition';
import { Button } from '#/components/Button';
import * as FeedCard from '#/components/FeedCard';
import { ChevronBottom_Stroke2_Corner0_Rounded as ChevronDownIcon } from '#/components/icons/Chevron';
import { CircleInfo_Stroke2_Corner0_Rounded as CircleInfo } from '#/components/icons/CircleInfo';
import {} from '#/components/icons/common';
import { ListSparkle_Stroke2_Corner0_Rounded as ListSparkle } from '#/components/icons/ListSparkle';
import { StarterPack } from '#/components/icons/StarterPack';
import { UserCircle_Stroke2_Corner0_Rounded as Person } from '#/components/icons/UserCircle';
import { boostInterests } from '#/components/InterestTabs';
import { Loader } from '#/components/Loader';
import * as ProfileCard from '#/components/ProfileCard';
import { SubtleHover } from '#/components/SubtleHover';
import { Text } from '#/components/Typography';
import * as ModuleHeader from './components/ModuleHeader';
import { SuggestedAccountsTabBar, SuggestedProfileCard, } from './modules/ExploreSuggestedAccounts';
function LoadMore({ item }) {
    const t = useTheme();
    const { _ } = useLingui();
    return (_jsx(Button, { label: _(msg `Load more`), onPress: item.onLoadMore, style: [a.relative, a.w_full], children: ({ hovered, pressed }) => (_jsxs(_Fragment, { children: [_jsx(SubtleHover, { hover: hovered || pressed }), _jsxs(View, { style: [
                        a.flex_1,
                        a.flex_row,
                        a.align_center,
                        a.justify_center,
                        a.px_lg,
                        a.py_md,
                        a.gap_sm,
                    ], children: [_jsx(Text, { style: [a.leading_snug], children: item.message }), item.isLoadingMore ? (_jsx(Loader, { size: "sm" })) : (_jsx(ChevronDownIcon, { size: "sm", style: t.atoms.text_contrast_medium }))] })] })) }));
}
export function Explore({ focusSearchInput, }) {
    const { _ } = useLingui();
    const t = useTheme();
    const { data: preferences, error: preferencesError } = usePreferencesQuery();
    const moderationOpts = useModerationOpts();
    const [selectedInterest, setSelectedInterest] = useState(null);
    /*
     * Begin special language handling
     */
    const { contentLanguages } = useLanguagePrefs();
    const useFullExperience = useMemo(() => {
        if (contentLanguages.length === 0)
            return true;
        return bcp47Match.basicFilter('en', contentLanguages).length > 0;
    }, [contentLanguages]);
    const personalizedInterests = preferences?.interests?.tags;
    const interestsDisplayNames = useInterestsDisplayNames();
    const interests = Object.keys(interestsDisplayNames)
        .sort(boostInterests(popularInterests))
        .sort(boostInterests(personalizedInterests));
    const { data: suggestedUsers, isLoading: suggestedUsersIsLoading, error: suggestedUsersError, isRefetching: suggestedUsersIsRefetching, } = useSuggestedUsers({
        category: selectedInterest || (useFullExperience ? null : interests[0]),
        search: !useFullExperience,
    });
    /* End special language handling */
    const { data: feeds, hasNextPage: hasNextFeedsPage, isLoading: isLoadingFeeds, isFetchingNextPage: isFetchingNextFeedsPage, error: feedsError, fetchNextPage: fetchNextFeedsPage, } = useGetPopularFeedsQuery({ limit: 10, enabled: useFullExperience });
    const interestsNux = useNux(Nux.ExploreInterestsCard);
    const showInterestsNux = interestsNux.status === 'ready' && !interestsNux.nux?.completed;
    const { data: suggestedSPs, isLoading: isLoadingSuggestedSPs, error: suggestedSPsError, isRefetching: isRefetchingSuggestedSPs, } = useSuggestedStarterPacksQuery({ enabled: useFullExperience });
    const isLoadingMoreFeeds = isFetchingNextFeedsPage && !isLoadingFeeds;
    const [hasPressedLoadMoreFeeds, setHasPressedLoadMoreFeeds] = useState(false);
    const onLoadMoreFeeds = useCallback(async () => {
        if (isFetchingNextFeedsPage || !hasNextFeedsPage || feedsError)
            return;
        if (!hasPressedLoadMoreFeeds) {
            setHasPressedLoadMoreFeeds(true);
            return;
        }
        try {
            await fetchNextFeedsPage();
        }
        catch (err) {
            logger.error('Failed to load more suggested follows', { message: err });
        }
    }, [
        isFetchingNextFeedsPage,
        hasNextFeedsPage,
        feedsError,
        fetchNextFeedsPage,
        hasPressedLoadMoreFeeds,
    ]);
    const { data: suggestedFeeds, error: suggestedFeedsError } = useGetSuggestedFeedsQuery({
        enabled: useFullExperience,
    });
    const { data: feedPreviewSlices, query: { isPending: isPendingFeedPreviews, isFetchingNextPage: isFetchingNextPageFeedPreviews, fetchNextPage: fetchNextPageFeedPreviews, hasNextPage: hasNextPageFeedPreviews, error: feedPreviewSlicesError, }, } = useFeedPreviews(suggestedFeeds?.feeds ?? [], useFullExperience);
    const qc = useQueryClient();
    const [isPTR, setIsPTR] = useState(false);
    const onPTR = useCallback(async () => {
        setIsPTR(true);
        await Promise.all([
            qc.resetQueries({
                queryKey: createGetTrendsQueryKey(),
            }),
            qc.resetQueries({
                queryKey: createSuggestedStarterPacksQueryKey(),
            }),
            qc.resetQueries({
                queryKey: [getSuggestedUsersQueryKeyRoot],
            }),
            qc.resetQueries({
                queryKey: [useActorSearchPaginatedQueryKeyRoot],
            }),
            qc.resetQueries({
                queryKey: createGetSuggestedFeedsQueryKey(),
            }),
        ]);
        setIsPTR(false);
    }, [qc, setIsPTR]);
    const onLoadMoreFeedPreviews = useCallback(async () => {
        if (isPendingFeedPreviews ||
            isFetchingNextPageFeedPreviews ||
            !hasNextPageFeedPreviews ||
            feedPreviewSlicesError)
            return;
        try {
            await fetchNextPageFeedPreviews();
        }
        catch (err) {
            logger.error('Failed to load more feed previews', { message: err });
        }
    }, [
        isPendingFeedPreviews,
        isFetchingNextPageFeedPreviews,
        hasNextPageFeedPreviews,
        feedPreviewSlicesError,
        fetchNextPageFeedPreviews,
    ]);
    const topBorder = useMemo(() => ({ type: 'topBorder', key: 'top-border' }), []);
    const trendingTopicsModule = useMemo(() => ({ type: 'trendingTopics', key: 'trending-topics' }), []);
    const suggestedFollowsModule = useMemo(() => {
        const i = [];
        i.push({
            type: 'tabbedHeader',
            key: 'suggested-accounts-header',
            title: _(msg `Suggested Accounts`),
            icon: Person,
            searchButton: {
                label: _(msg `Search for more accounts`),
                metricsTag: 'suggestedAccounts',
                tab: 'user',
            },
            hideDefaultTab: !useFullExperience,
        });
        if (suggestedUsersIsLoading || suggestedUsersIsRefetching) {
            i.push({ type: 'profilePlaceholder', key: 'profilePlaceholder' });
        }
        else if (suggestedUsersError) {
            i.push({
                type: 'error',
                key: 'suggestedUsersError',
                message: _(msg `Failed to load suggested follows`),
                error: cleanError(suggestedUsersError),
            });
        }
        else {
            if (suggestedUsers !== undefined) {
                if (suggestedUsers.actors.length > 0 && moderationOpts) {
                    // Currently the responses contain duplicate items.
                    // Needs to be fixed on backend, but let's dedupe to be safe.
                    let seen = new Set();
                    const profileItems = [];
                    for (const actor of suggestedUsers.actors) {
                        // checking for following still necessary if search data is used
                        if (!seen.has(actor.did) && !actor.viewer?.following) {
                            seen.add(actor.did);
                            profileItems.push({
                                type: 'profile',
                                key: actor.did,
                                profile: actor,
                            });
                        }
                    }
                    if (profileItems.length === 0) {
                        i.push({
                            type: 'profileEmpty',
                            key: 'profileEmpty',
                        });
                    }
                    else {
                        if (selectedInterest === null && useFullExperience) {
                            // First "For You" tab, only show 5 to keep screen short
                            i.push(...profileItems.slice(0, 5));
                        }
                        else {
                            i.push(...profileItems);
                        }
                    }
                }
                else {
                    i.push({
                        type: 'profileEmpty',
                        key: 'profileEmpty',
                    });
                }
            }
            else {
                i.push({ type: 'profilePlaceholder', key: 'profilePlaceholder' });
            }
        }
        return i;
    }, [
        _,
        moderationOpts,
        suggestedUsers,
        suggestedUsersIsLoading,
        suggestedUsersIsRefetching,
        suggestedUsersError,
        selectedInterest,
        useFullExperience,
    ]);
    const suggestedFeedsModule = useMemo(() => {
        const i = [];
        i.push({
            type: 'header',
            key: 'suggested-feeds-header',
            title: _(msg `Discover New Feeds`),
            icon: ListSparkle,
            searchButton: {
                label: _(msg `Search for more feeds`),
                metricsTag: 'suggestedFeeds',
                tab: 'feed',
            },
        });
        if (useFullExperience) {
            if (suggestedFeeds && preferences) {
                let seen = new Set();
                const feedItems = [];
                for (const feed of suggestedFeeds.feeds) {
                    if (!seen.has(feed.uri)) {
                        seen.add(feed.uri);
                        feedItems.push({
                            type: 'feed',
                            key: feed.uri,
                            feed,
                        });
                    }
                }
                // feeds errors can occur during pagination, so feeds is truthy
                if (suggestedFeedsError) {
                    i.push({
                        type: 'error',
                        key: 'feedsError',
                        message: _(msg `Failed to load suggested feeds`),
                        error: cleanError(feedsError),
                    });
                }
                else if (preferencesError) {
                    i.push({
                        type: 'error',
                        key: 'preferencesError',
                        message: _(msg `Failed to load feeds preferences`),
                        error: cleanError(preferencesError),
                    });
                }
                else {
                    if (feedItems.length === 0) {
                        i.pop();
                    }
                    else {
                        // This query doesn't follow the limit very well, so the first press of the
                        // load more button just unslices the array back to ~10 items
                        if (!hasPressedLoadMoreFeeds) {
                            i.push(...feedItems.slice(0, 6));
                        }
                        else {
                            i.push(...feedItems);
                        }
                        for (const [index, item] of feedItems.entries()) {
                            if (item.type !== 'feed') {
                                continue;
                            }
                            // don't log the ones we've already sent
                            if (hasPressedLoadMoreFeeds && index < 6) {
                                continue;
                            }
                            logger.metric('feed:suggestion:seen', { feedUrl: item.feed.uri }, { statsig: false });
                        }
                    }
                    if (!hasPressedLoadMoreFeeds) {
                        i.push({
                            type: 'loadMore',
                            key: 'loadMoreFeeds',
                            message: _(msg `Load more suggested feeds`),
                            isLoadingMore: isLoadingMoreFeeds,
                            onLoadMore: onLoadMoreFeeds,
                        });
                    }
                }
            }
            else {
                if (feedsError) {
                    i.push({
                        type: 'error',
                        key: 'feedsError',
                        message: _(msg `Failed to load suggested feeds`),
                        error: cleanError(feedsError),
                    });
                }
                else if (preferencesError) {
                    i.push({
                        type: 'error',
                        key: 'preferencesError',
                        message: _(msg `Failed to load feeds preferences`),
                        error: cleanError(preferencesError),
                    });
                }
                else {
                    i.push({ type: 'feedPlaceholder', key: 'feedPlaceholder' });
                }
            }
        }
        else {
            if (feeds && preferences) {
                // Currently the responses contain duplicate items.
                // Needs to be fixed on backend, but let's dedupe to be safe.
                let seen = new Set();
                const feedItems = [];
                for (const page of feeds.pages) {
                    for (const feed of page.feeds) {
                        if (!seen.has(feed.uri)) {
                            seen.add(feed.uri);
                            feedItems.push({
                                type: 'feed',
                                key: feed.uri,
                                feed,
                            });
                        }
                    }
                }
                // feeds errors can occur during pagination, so feeds is truthy
                if (feedsError) {
                    i.push({
                        type: 'error',
                        key: 'feedsError',
                        message: _(msg `Failed to load suggested feeds`),
                        error: cleanError(feedsError),
                    });
                }
                else if (preferencesError) {
                    i.push({
                        type: 'error',
                        key: 'preferencesError',
                        message: _(msg `Failed to load feeds preferences`),
                        error: cleanError(preferencesError),
                    });
                }
                else {
                    if (feedItems.length === 0) {
                        if (!hasNextFeedsPage) {
                            i.pop();
                        }
                    }
                    else {
                        // This query doesn't follow the limit very well, so the first press of the
                        // load more button just unslices the array back to ~10 items
                        if (!hasPressedLoadMoreFeeds) {
                            i.push(...feedItems.slice(0, 3));
                        }
                        else {
                            i.push(...feedItems);
                        }
                    }
                    if (hasNextFeedsPage) {
                        i.push({
                            type: 'loadMore',
                            key: 'loadMoreFeeds',
                            message: _(msg `Load more suggested feeds`),
                            isLoadingMore: isLoadingMoreFeeds,
                            onLoadMore: onLoadMoreFeeds,
                        });
                    }
                }
            }
            else {
                if (feedsError) {
                    i.push({
                        type: 'error',
                        key: 'feedsError',
                        message: _(msg `Failed to load suggested feeds`),
                        error: cleanError(feedsError),
                    });
                }
                else if (preferencesError) {
                    i.push({
                        type: 'error',
                        key: 'preferencesError',
                        message: _(msg `Failed to load feeds preferences`),
                        error: cleanError(preferencesError),
                    });
                }
                else {
                    i.push({ type: 'feedPlaceholder', key: 'feedPlaceholder' });
                }
            }
        }
        return i;
    }, [
        _,
        useFullExperience,
        suggestedFeeds,
        preferences,
        suggestedFeedsError,
        preferencesError,
        feedsError,
        hasNextFeedsPage,
        hasPressedLoadMoreFeeds,
        isLoadingMoreFeeds,
        onLoadMoreFeeds,
        feeds,
    ]);
    const suggestedStarterPacksModule = useMemo(() => {
        const i = [];
        i.push({
            type: 'header',
            key: 'suggested-starterPacks-header',
            title: _(msg `Starter Packs`),
            icon: StarterPack,
            iconSize: 'xl',
        });
        if (isLoadingSuggestedSPs || isRefetchingSuggestedSPs) {
            Array.from({ length: 3 }).forEach((__, index) => i.push({
                type: 'starterPackSkeleton',
                key: `starterPackSkeleton-${index}`,
            }));
        }
        else if (suggestedSPsError || !suggestedSPs) {
            // just get rid of the section
            i.pop();
        }
        else {
            suggestedSPs.starterPacks.map(s => {
                i.push({
                    type: 'starterPack',
                    key: s.uri,
                    view: s,
                });
            });
        }
        return i;
    }, [
        suggestedSPs,
        _,
        isLoadingSuggestedSPs,
        suggestedSPsError,
        isRefetchingSuggestedSPs,
    ]);
    const feedPreviewsModule = useMemo(() => {
        const i = [];
        i.push(...feedPreviewSlices);
        if (isFetchingNextPageFeedPreviews) {
            i.push({
                type: 'preview:loading',
                key: 'preview-loading-more',
            });
        }
        return i;
    }, [feedPreviewSlices, isFetchingNextPageFeedPreviews]);
    const interestsNuxModule = useMemo(() => {
        if (!showInterestsNux)
            return [];
        return [
            {
                type: 'interests-card',
                key: 'interests-card',
            },
        ];
    }, [showInterestsNux]);
    const items = useMemo(() => {
        const i = [];
        // Dynamic module ordering
        i.push(topBorder);
        i.push(...interestsNuxModule);
        if (useFullExperience) {
            i.push(trendingTopicsModule);
            i.push(...suggestedFeedsModule);
            i.push(...suggestedFollowsModule);
            i.push(...suggestedStarterPacksModule);
            i.push(...feedPreviewsModule);
        }
        else {
            i.push(...suggestedFollowsModule);
        }
        return i;
    }, [
        topBorder,
        suggestedFollowsModule,
        suggestedStarterPacksModule,
        suggestedFeedsModule,
        trendingTopicsModule,
        feedPreviewsModule,
        interestsNuxModule,
        useFullExperience,
    ]);
    const renderItem = useCallback(({ item, index }) => {
        switch (item.type) {
            case 'topBorder':
                return (_jsx(View, { style: [a.w_full, t.atoms.border_contrast_low, a.border_t] }));
            case 'header': {
                return (_jsxs(ModuleHeader.Container, { bottomBorder: item.bottomBorder, children: [_jsx(ModuleHeader.Icon, { icon: item.icon, size: item.iconSize }), _jsx(ModuleHeader.TitleText, { children: item.title }), item.searchButton && (_jsx(ModuleHeader.SearchButton, { ...item.searchButton, onPress: () => focusSearchInput(item.searchButton?.tab || 'user') }))] }));
            }
            case 'tabbedHeader': {
                return (_jsxs(View, { style: [a.pb_md], children: [_jsxs(ModuleHeader.Container, { style: [a.pb_xs], children: [_jsx(ModuleHeader.Icon, { icon: item.icon }), _jsx(ModuleHeader.TitleText, { children: item.title }), item.searchButton && (_jsx(ModuleHeader.SearchButton, { ...item.searchButton, onPress: () => focusSearchInput(item.searchButton?.tab || 'user') }))] }), _jsx(SuggestedAccountsTabBar, { selectedInterest: selectedInterest, onSelectInterest: setSelectedInterest, hideDefaultTab: item.hideDefaultTab })] }));
            }
            case 'trendingTopics': {
                return (_jsx(View, { style: [a.pb_md], children: _jsx(ExploreTrendingTopics, {}) }));
            }
            case 'trendingVideos': {
                return _jsx(ExploreTrendingVideos, {});
            }
            case 'recommendations': {
                return _jsx(ExploreRecommendations, {});
            }
            case 'profile': {
                return (_jsx(SuggestedProfileCard, { profile: item.profile, moderationOpts: moderationOpts, recId: item.recId, position: index }));
            }
            case 'profileEmpty': {
                return (_jsx(View, { style: [a.px_lg, a.pb_lg], children: _jsx(Admonition, { children: selectedInterest ? (_jsxs(Trans, { children: ["No results for \"", interestsDisplayNames[selectedInterest], "\"."] })) : (_jsx(Trans, { children: "No results." })) }) }));
            }
            case 'feed': {
                return (_jsx(View, { style: [
                        a.border_t,
                        t.atoms.border_contrast_low,
                        a.px_lg,
                        a.py_lg,
                    ], children: _jsx(FeedCard.Default, { view: item.feed, onPress: () => {
                            if (!useFullExperience) {
                                return;
                            }
                            logger.metric('feed:suggestion:press', {
                                feedUrl: item.feed.uri,
                            });
                        } }) }));
            }
            case 'starterPack': {
                return (_jsx(View, { style: [a.px_lg, a.pb_lg], children: _jsx(StarterPackCard, { view: item.view }) }));
            }
            case 'starterPackSkeleton': {
                return (_jsx(View, { style: [a.px_lg, a.pb_lg], children: _jsx(StarterPackCardSkeleton, {}) }));
            }
            case 'loadMore': {
                return (_jsx(View, { style: [a.border_t, t.atoms.border_contrast_low], children: _jsx(LoadMore, { item: item }) }));
            }
            case 'profilePlaceholder': {
                return (_jsx(_Fragment, { children: Array.from({ length: 3 }).map((__, i) => (_jsx(View, { style: [
                            a.px_lg,
                            a.py_lg,
                            a.border_t,
                            t.atoms.border_contrast_low,
                        ], children: _jsxs(ProfileCard.Outer, { children: [_jsxs(ProfileCard.Header, { children: [_jsx(ProfileCard.AvatarPlaceholder, {}), _jsx(ProfileCard.NameAndHandlePlaceholder, {})] }), _jsx(ProfileCard.DescriptionPlaceholder, { numberOfLines: 2 })] }) }, i))) }));
            }
            case 'feedPlaceholder': {
                return _jsx(FeedFeedLoadingPlaceholder, {});
            }
            case 'error':
            case 'preview:error': {
                return (_jsx(View, { style: [
                        a.border_t,
                        a.pt_md,
                        a.px_md,
                        t.atoms.border_contrast_low,
                    ], children: _jsxs(View, { style: [
                            a.flex_row,
                            a.gap_md,
                            a.p_lg,
                            a.rounded_sm,
                            t.atoms.bg_contrast_25,
                        ], children: [_jsx(CircleInfo, { size: "md", fill: t.palette.negative_400 }), _jsxs(View, { style: [a.flex_1, a.gap_sm], children: [_jsx(Text, { style: [a.font_bold, a.leading_snug], children: item.message }), _jsx(Text, { style: [
                                            a.italic,
                                            a.leading_snug,
                                            t.atoms.text_contrast_medium,
                                        ], children: item.error })] })] }) }));
            }
            // feed previews
            case 'preview:spacer': {
                return _jsx(View, { style: [a.w_full, a.pt_4xl] });
            }
            case 'preview:empty': {
                return null; // what should we do here?
            }
            case 'preview:loading': {
                return (_jsx(View, { style: [a.py_2xl, a.flex_1, a.align_center], children: _jsx(Loader, { size: "lg" }) }));
            }
            case 'preview:header': {
                return (_jsxs(ModuleHeader.Container, { style: [a.pt_xs], bottomBorder: isNative, children: [_jsx(View, { style: [a.absolute, a.inset_0, t.atoms.bg, { top: -2 }] }), _jsxs(ModuleHeader.FeedLink, { feed: item.feed, children: [_jsx(ModuleHeader.FeedAvatar, { feed: item.feed }), _jsxs(View, { style: [a.flex_1, a.gap_xs], children: [_jsx(ModuleHeader.TitleText, { style: [a.text_lg], children: item.feed.displayName }), _jsx(ModuleHeader.SubtitleText, { children: _jsxs(Trans, { children: ["By ", sanitizeHandle(item.feed.creator.handle, '@')] }) })] })] }), _jsx(ModuleHeader.PinButton, { feed: item.feed })] }));
            }
            case 'preview:footer': {
                return (_jsx(View, { style: [
                        a.border_t,
                        t.atoms.border_contrast_low,
                        a.w_full,
                        a.pt_4xl,
                    ] }));
            }
            case 'preview:sliceItem': {
                const slice = item.slice;
                const indexInSlice = item.indexInSlice;
                const subItem = slice.items[indexInSlice];
                return (_jsx(PostFeedItem, { post: subItem.post, record: subItem.record, reason: indexInSlice === 0 ? slice.reason : undefined, feedContext: slice.feedContext, reqId: slice.reqId, moderation: subItem.moderation, parentAuthor: subItem.parentAuthor, showReplyTo: item.showReplyTo, isThreadParent: isThreadParentAt(slice.items, indexInSlice), isThreadChild: isThreadChildAt(slice.items, indexInSlice), isThreadLastChild: isThreadChildAt(slice.items, indexInSlice) &&
                        slice.items.length === indexInSlice + 1, isParentBlocked: subItem.isParentBlocked, isParentNotFound: subItem.isParentNotFound, hideTopBorder: item.hideTopBorder, rootPost: slice.items[0].post }));
            }
            case 'preview:sliceViewFullThread': {
                return _jsx(ViewFullThread, { uri: item.uri });
            }
            case 'preview:loadMoreError': {
                return (_jsx(LoadMoreRetryBtn, { label: _(msg `There was an issue fetching posts. Tap here to try again.`), onPress: fetchNextPageFeedPreviews }));
            }
            case 'interests-card': {
                return _jsx(ExploreInterestsCard, {});
            }
        }
    }, [
        t.atoms.border_contrast_low,
        t.atoms.bg_contrast_25,
        t.atoms.text_contrast_medium,
        t.atoms.bg,
        t.palette.negative_400,
        focusSearchInput,
        selectedInterest,
        moderationOpts,
        interestsDisplayNames,
        useFullExperience,
        _,
        fetchNextPageFeedPreviews,
    ]);
    const stickyHeaderIndices = useMemo(() => items.reduce((acc, curr) => ['topBorder', 'preview:header'].includes(curr.type)
        ? acc.concat(items.indexOf(curr))
        : acc, []), [items]);
    // track headers and report module viewability
    const alreadyReportedRef = useRef(new Map());
    const onItemSeen = useCallback((item) => {
        let module;
        if (item.type === 'trendingTopics' || item.type === 'trendingVideos') {
            module = item.type;
        }
        else if (item.type === 'profile') {
            module = 'suggestedAccounts';
        }
        else if (item.type === 'feed') {
            module = 'suggestedFeeds';
        }
        else if (item.type === 'starterPack') {
            module = 'suggestedStarterPacks';
        }
        else if (item.type === 'preview:sliceItem') {
            module = `feed:feedgen|${item.feed.uri}`;
        }
        else {
            return;
        }
        if (!alreadyReportedRef.current.has(module)) {
            alreadyReportedRef.current.set(module, module);
            logger.metric('explore:module:seen', { module }, { statsig: false });
        }
    }, []);
    return (_jsx(List, { data: items, renderItem: renderItem, keyExtractor: keyExtractor, desktopFixedHeight: true, contentContainerStyle: { paddingBottom: 100 }, keyboardShouldPersistTaps: "handled", keyboardDismissMode: "on-drag", stickyHeaderIndices: native(stickyHeaderIndices), viewabilityConfig: viewabilityConfig, onItemSeen: onItemSeen, onEndReached: onLoadMoreFeedPreviews, 
        /**
         * Default: 2
         */
        onEndReachedThreshold: 4, 
        /**
         * Default: 10
         */
        initialNumToRender: 10, 
        /**
         * Default: 21
         */
        windowSize: platform({ android: 11 }), 
        /**
         * Default: 10
         */
        maxToRenderPerBatch: platform({ android: 1 }), 
        /**
         * Default: 50
         */
        updateCellsBatchingPeriod: platform({ android: 25 }), refreshing: isPTR, onRefresh: onPTR }));
}
function keyExtractor(item) {
    return item.key;
}
const viewabilityConfig = {
    itemVisiblePercentThreshold: 100,
};
//# sourceMappingURL=Explore.js.map