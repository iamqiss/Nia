import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAnimatedRef } from 'react-native-reanimated';
import { AppBskyFeedDefs } from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import {} from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { VIDEO_FEED_URIS } from '#/lib/constants';
import { useOpenComposer } from '#/lib/hooks/useOpenComposer';
import { usePalette } from '#/lib/hooks/usePalette';
import { useSetTitle } from '#/lib/hooks/useSetTitle';
import { ComposeIcon2 } from '#/lib/icons';
import {} from '#/lib/routes/types';
import {} from '#/lib/routes/types';
import { makeRecordUri } from '#/lib/strings/url-helpers';
import { s } from '#/lib/styles';
import { isNative } from '#/platform/detection';
import { listenSoftReset } from '#/state/events';
import { FeedFeedbackProvider, useFeedFeedback } from '#/state/feed-feedback';
import { useFeedSourceInfoQuery, } from '#/state/queries/feed';
import {} from '#/state/queries/post-feed';
import { RQKEY as FEED_RQKEY } from '#/state/queries/post-feed';
import { usePreferencesQuery, } from '#/state/queries/preferences';
import { useResolveUriQuery } from '#/state/queries/resolve-uri';
import { truncateAndInvalidate } from '#/state/queries/util';
import { useSession } from '#/state/session';
import { PostFeed } from '#/view/com/posts/PostFeed';
import { EmptyState } from '#/view/com/util/EmptyState';
import { FAB } from '#/view/com/util/fab/FAB';
import { Button } from '#/view/com/util/forms/Button';
import {} from '#/view/com/util/List';
import { LoadLatestBtn } from '#/view/com/util/load-latest/LoadLatestBtn';
import { PostFeedLoadingPlaceholder } from '#/view/com/util/LoadingPlaceholder';
import { Text } from '#/view/com/util/text/Text';
import { ProfileFeedHeader, ProfileFeedHeaderSkeleton, } from '#/screens/Profile/components/ProfileFeedHeader';
import * as Layout from '#/components/Layout';
export function ProfileFeedScreen(props) {
    const { rkey, name: handleOrDid } = props.route.params;
    const feedParams = props.route.params.feedCacheKey
        ? {
            feedCacheKey: props.route.params.feedCacheKey,
        }
        : undefined;
    const pal = usePalette('default');
    const { _ } = useLingui();
    const navigation = useNavigation();
    const uri = useMemo(() => makeRecordUri(handleOrDid, 'app.bsky.feed.generator', rkey), [rkey, handleOrDid]);
    const { error, data: resolvedUri } = useResolveUriQuery(uri);
    const onPressBack = React.useCallback(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
        else {
            navigation.navigate('Home');
        }
    }, [navigation]);
    if (error) {
        return (_jsx(Layout.Screen, { testID: "profileFeedScreenError", children: _jsx(Layout.Content, { children: _jsxs(View, { style: [pal.view, pal.border, styles.notFoundContainer], children: [_jsx(Text, { type: "title-lg", style: [pal.text, s.mb10], children: _jsx(Trans, { children: "Could not load feed" }) }), _jsx(Text, { type: "md", style: [pal.text, s.mb20], children: error.toString() }), _jsx(View, { style: { flexDirection: 'row' }, children: _jsx(Button, { type: "default", accessibilityLabel: _(msg `Go back`), accessibilityHint: _(msg `Returns to previous page`), onPress: onPressBack, style: { flexShrink: 1 }, children: _jsx(Text, { type: "button", style: pal.text, children: _jsx(Trans, { children: "Go Back" }) }) }) })] }) }) }));
    }
    return resolvedUri ? (_jsx(Layout.Screen, { testID: "profileFeedScreen", children: _jsx(ProfileFeedScreenIntermediate, { feedUri: resolvedUri.uri, feedParams: feedParams }) })) : (_jsxs(Layout.Screen, { testID: "profileFeedScreen", children: [_jsx(ProfileFeedHeaderSkeleton, {}), _jsx(Layout.Content, { children: _jsx(PostFeedLoadingPlaceholder, {}) })] }));
}
function ProfileFeedScreenIntermediate({ feedUri, feedParams, }) {
    const { data: preferences } = usePreferencesQuery();
    const { data: info } = useFeedSourceInfoQuery({ uri: feedUri });
    if (!preferences || !info) {
        return (_jsxs(Layout.Content, { children: [_jsx(ProfileFeedHeaderSkeleton, {}), _jsx(PostFeedLoadingPlaceholder, {})] }));
    }
    return (_jsx(ProfileFeedScreenInner, { preferences: preferences, feedInfo: info, feedParams: feedParams }));
}
export function ProfileFeedScreenInner({ feedInfo, feedParams, }) {
    const { _ } = useLingui();
    const { hasSession } = useSession();
    const { openComposer } = useOpenComposer();
    const isScreenFocused = useIsFocused();
    useSetTitle(feedInfo?.displayName);
    const feed = `feedgen|${feedInfo.uri}`;
    const [hasNew, setHasNew] = React.useState(false);
    const [isScrolledDown, setIsScrolledDown] = React.useState(false);
    const queryClient = useQueryClient();
    const feedFeedback = useFeedFeedback(feedInfo, hasSession);
    const scrollElRef = useAnimatedRef();
    const onScrollToTop = useCallback(() => {
        scrollElRef.current?.scrollToOffset({
            animated: isNative,
            offset: 0, // -headerHeight,
        });
        truncateAndInvalidate(queryClient, FEED_RQKEY(feed));
        setHasNew(false);
    }, [scrollElRef, queryClient, feed, setHasNew]);
    React.useEffect(() => {
        if (!isScreenFocused) {
            return;
        }
        return listenSoftReset(onScrollToTop);
    }, [onScrollToTop, isScreenFocused]);
    const renderPostsEmpty = useCallback(() => {
        return _jsx(EmptyState, { icon: "hashtag", message: _(msg `This feed is empty.`) });
    }, [_]);
    const isVideoFeed = React.useMemo(() => {
        const isBskyVideoFeed = VIDEO_FEED_URIS.includes(feedInfo.uri);
        const feedIsVideoMode = feedInfo.contentMode === AppBskyFeedDefs.CONTENTMODEVIDEO;
        const _isVideoFeed = isBskyVideoFeed || feedIsVideoMode;
        return isNative && _isVideoFeed;
    }, [feedInfo]);
    return (_jsxs(_Fragment, { children: [_jsx(ProfileFeedHeader, { info: feedInfo }), _jsx(FeedFeedbackProvider, { value: feedFeedback, children: _jsx(PostFeed, { feed: feed, feedParams: feedParams, pollInterval: 60e3, disablePoll: hasNew, onHasNew: setHasNew, scrollElRef: scrollElRef, onScrolledDownChange: setIsScrolledDown, renderEmptyState: renderPostsEmpty, isVideoFeed: isVideoFeed }) }), (isScrolledDown || hasNew) && (_jsx(LoadLatestBtn, { onPress: onScrollToTop, label: _(msg `Load new posts`), showIndicator: hasNew })), hasSession && (_jsx(FAB, { testID: "composeFAB", onPress: () => openComposer({}), icon: _jsx(ComposeIcon2, { strokeWidth: 1.5, size: 29, style: { color: 'white' } }), accessibilityRole: "button", accessibilityLabel: _(msg `New post`), accessibilityHint: "" }))] }));
}
const styles = StyleSheet.create({
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 7,
        paddingHorizontal: 14,
        borderRadius: 50,
        marginLeft: 6,
    },
    notFoundContainer: {
        margin: 10,
        paddingHorizontal: 18,
        paddingVertical: 14,
        borderRadius: 6,
    },
    aboutSectionContainer: {
        paddingVertical: 4,
        paddingHorizontal: 16,
        gap: 12,
    },
});
//# sourceMappingURL=index.js.map