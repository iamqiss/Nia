import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { PROD_DEFAULT_FEED } from '#/lib/constants';
import { useNonReactiveCallback } from '#/lib/hooks/useNonReactiveCallback';
import { useOTAUpdates } from '#/lib/hooks/useOTAUpdates';
import { useSetTitle } from '#/lib/hooks/useSetTitle';
import { useRequestNotificationsPermission } from '#/lib/notifications/notifications';
import {} from '#/lib/routes/types';
import { logEvent } from '#/lib/statsig/statsig';
import { isWeb } from '#/platform/detection';
import { emitSoftReset } from '#/state/events';
import { usePinnedFeedsInfos, } from '#/state/queries/feed';
import {} from '#/state/queries/post-feed';
import { usePreferencesQuery } from '#/state/queries/preferences';
import {} from '#/state/queries/preferences/types';
import { useSession } from '#/state/session';
import { useSetMinimalShellMode } from '#/state/shell';
import { useLoggedOutViewControls } from '#/state/shell/logged-out';
import { useSelectedFeed, useSetSelectedFeed } from '#/state/shell/selected-feed';
import { FeedPage } from '#/view/com/feeds/FeedPage';
import { HomeHeader } from '#/view/com/home/HomeHeader';
import { Pager, } from '#/view/com/pager/Pager';
import { CustomFeedEmptyState } from '#/view/com/posts/CustomFeedEmptyState';
import { FollowingEmptyState } from '#/view/com/posts/FollowingEmptyState';
import { FollowingEndOfFeed } from '#/view/com/posts/FollowingEndOfFeed';
import { NoFeedsPinned } from '#/screens/Home/NoFeedsPinned';
import * as Layout from '#/components/Layout';
import { useDemoMode } from '#/storage/hooks/demo-mode';
export function HomeScreen(props) {
    const { setShowLoggedOut } = useLoggedOutViewControls();
    const { data: preferences } = usePreferencesQuery();
    const { currentAccount } = useSession();
    const { data: pinnedFeedInfos, isLoading: isPinnedFeedsLoading } = usePinnedFeedsInfos();
    React.useEffect(() => {
        if (isWeb && !currentAccount) {
            const getParams = new URLSearchParams(window.location.search);
            const splash = getParams.get('splash');
            if (splash === 'true') {
                setShowLoggedOut(true);
                return;
            }
        }
        const params = props.route.params;
        if (currentAccount &&
            props.route.name === 'Start' &&
            params?.name &&
            params?.rkey) {
            props.navigation.navigate('StarterPack', {
                rkey: params.rkey,
                name: params.name,
            });
        }
    }, [
        currentAccount,
        props.navigation,
        props.route.name,
        props.route.params,
        setShowLoggedOut,
    ]);
    if (preferences && pinnedFeedInfos && !isPinnedFeedsLoading) {
        return (_jsx(Layout.Screen, { testID: "HomeScreen", children: _jsx(HomeScreenReady, { ...props, preferences: preferences, pinnedFeedInfos: pinnedFeedInfos }) }));
    }
    else {
        return (_jsx(Layout.Screen, { children: _jsx(Layout.Center, { style: styles.loading, children: _jsx(ActivityIndicator, { size: "large" }) }) }));
    }
}
function HomeScreenReady({ preferences, pinnedFeedInfos, }) {
    const allFeeds = React.useMemo(() => pinnedFeedInfos.map(f => f.feedDescriptor), [pinnedFeedInfos]);
    const maybeRawSelectedFeed = useSelectedFeed() ?? allFeeds[0];
    const setSelectedFeed = useSetSelectedFeed();
    const maybeFoundIndex = allFeeds.indexOf(maybeRawSelectedFeed);
    const selectedIndex = Math.max(0, maybeFoundIndex);
    const maybeSelectedFeed = allFeeds[selectedIndex];
    const requestNotificationsPermission = useRequestNotificationsPermission();
    useSetTitle(pinnedFeedInfos[selectedIndex]?.displayName);
    useOTAUpdates();
    React.useEffect(() => {
        requestNotificationsPermission('Home');
    }, [requestNotificationsPermission]);
    const pagerRef = React.useRef(null);
    const lastPagerReportedIndexRef = React.useRef(selectedIndex);
    React.useLayoutEffect(() => {
        // Since the pager is not a controlled component, adjust it imperatively
        // if the selected index gets out of sync with what it last reported.
        // This is supposed to only happen on the web when you use the right nav.
        if (selectedIndex !== lastPagerReportedIndexRef.current) {
            lastPagerReportedIndexRef.current = selectedIndex;
            pagerRef.current?.setPage(selectedIndex);
        }
    }, [selectedIndex]);
    const { hasSession } = useSession();
    const setMinimalShellMode = useSetMinimalShellMode();
    useFocusEffect(React.useCallback(() => {
        setMinimalShellMode(false);
    }, [setMinimalShellMode]));
    useFocusEffect(useNonReactiveCallback(() => {
        if (maybeSelectedFeed) {
            logEvent('home:feedDisplayed', {
                index: selectedIndex,
                feedType: maybeSelectedFeed.split('|')[0],
                feedUrl: maybeSelectedFeed,
                reason: 'focus',
            });
        }
    }));
    const onPageSelected = React.useCallback((index) => {
        setMinimalShellMode(false);
        const maybeFeed = allFeeds[index];
        // Mutate the ref before setting state to avoid the imperative syncing effect
        // above from starting a loop on Android when swiping back and forth.
        lastPagerReportedIndexRef.current = index;
        setSelectedFeed(maybeFeed);
        if (maybeFeed) {
            logEvent('home:feedDisplayed', {
                index,
                feedType: maybeFeed.split('|')[0],
                feedUrl: maybeFeed,
            });
        }
    }, [setSelectedFeed, setMinimalShellMode, allFeeds]);
    const onPressSelected = React.useCallback(() => {
        emitSoftReset();
    }, []);
    const onPageScrollStateChanged = React.useCallback((state) => {
        'worklet';
        if (state === 'dragging') {
            setMinimalShellMode(false);
        }
    }, [setMinimalShellMode]);
    const [demoMode] = useDemoMode();
    const renderTabBar = React.useCallback((props) => {
        if (demoMode) {
            return (_jsx(HomeHeader, { ...props, testID: "homeScreenFeedTabs", onPressSelected: onPressSelected, 
                // @ts-ignore
                feeds: [{ displayName: 'Following' }, { displayName: 'Discover' }] }, "FEEDS_TAB_BAR"));
        }
        return (_jsx(HomeHeader, { ...props, testID: "homeScreenFeedTabs", onPressSelected: onPressSelected, feeds: pinnedFeedInfos }, "FEEDS_TAB_BAR"));
    }, [onPressSelected, pinnedFeedInfos, demoMode]);
    const renderFollowingEmptyState = React.useCallback(() => {
        return _jsx(FollowingEmptyState, {});
    }, []);
    const renderCustomFeedEmptyState = React.useCallback(() => {
        return _jsx(CustomFeedEmptyState, {});
    }, []);
    const homeFeedParams = React.useMemo(() => {
        return {
            mergeFeedEnabled: Boolean(preferences.feedViewPrefs.lab_mergeFeedEnabled),
            mergeFeedSources: preferences.feedViewPrefs.lab_mergeFeedEnabled
                ? preferences.savedFeeds
                    .filter(f => f.type === 'feed' || f.type === 'list')
                    .map(f => f.value)
                : [],
        };
    }, [preferences]);
    if (demoMode) {
        return (_jsxs(Pager, { ref: pagerRef, testID: "homeScreen", onPageSelected: onPageSelected, onPageScrollStateChanged: onPageScrollStateChanged, renderTabBar: renderTabBar, initialPage: selectedIndex, children: [_jsx(FeedPage, { testID: "demoFeedPage", isPageFocused: true, isPageAdjacent: false, feed: "demo", renderEmptyState: renderCustomFeedEmptyState, feedInfo: pinnedFeedInfos[0] }), _jsx(FeedPage, { testID: "customFeedPage", isPageFocused: true, isPageAdjacent: false, feed: `feedgen|${PROD_DEFAULT_FEED('whats-hot')}`, renderEmptyState: renderCustomFeedEmptyState, feedInfo: pinnedFeedInfos[0] })] }));
    }
    return hasSession ? (_jsx(Pager, { ref: pagerRef, testID: "homeScreen", initialPage: selectedIndex, onPageSelected: onPageSelected, onPageScrollStateChanged: onPageScrollStateChanged, renderTabBar: renderTabBar, children: pinnedFeedInfos.length ? (pinnedFeedInfos.map((feedInfo, index) => {
            const feed = feedInfo.feedDescriptor;
            if (feed === 'following') {
                return (_jsx(FeedPage, { testID: "followingFeedPage", isPageFocused: maybeSelectedFeed === feed, isPageAdjacent: Math.abs(selectedIndex - index) === 1, feed: feed, feedParams: homeFeedParams, renderEmptyState: renderFollowingEmptyState, renderEndOfFeed: FollowingEndOfFeed, feedInfo: feedInfo }, feed));
            }
            const savedFeedConfig = feedInfo.savedFeed;
            return (_jsx(FeedPage, { testID: "customFeedPage", isPageFocused: maybeSelectedFeed === feed, isPageAdjacent: Math.abs(selectedIndex - index) === 1, feed: feed, renderEmptyState: renderCustomFeedEmptyState, savedFeedConfig: savedFeedConfig, feedInfo: feedInfo }, feed));
        })) : (_jsx(NoFeedsPinned, { preferences: preferences })) }, allFeeds.join(','))) : (_jsx(Pager, { testID: "homeScreen", onPageSelected: onPageSelected, onPageScrollStateChanged: onPageScrollStateChanged, renderTabBar: renderTabBar, children: _jsx(FeedPage, { testID: "customFeedPage", isPageFocused: true, isPageAdjacent: false, feed: `feedgen|${PROD_DEFAULT_FEED('whats-hot')}`, renderEmptyState: renderCustomFeedEmptyState, feedInfo: pinnedFeedInfos[0] }) }));
}
const styles = StyleSheet.create({
    loading: {
        height: '100%',
        alignContent: 'center',
        justifyContent: 'center',
        paddingBottom: 100,
    },
});
//# sourceMappingURL=Home.js.map