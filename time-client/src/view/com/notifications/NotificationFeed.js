import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { ActivityIndicator, StyleSheet, View, } from 'react-native';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useInitialNumToRender } from '#/lib/hooks/useInitialNumToRender';
import { cleanError } from '#/lib/strings/errors';
import { s } from '#/lib/styles';
import { logger } from '#/logger';
import { useModerationOpts } from '#/state/preferences/moderation-opts';
import { useNotificationFeedQuery } from '#/state/queries/notifications/feed';
import { EmptyState } from '#/view/com/util/EmptyState';
import { ErrorMessage } from '#/view/com/util/error/ErrorMessage';
import { List } from '#/view/com/util/List';
import { NotificationFeedLoadingPlaceholder } from '#/view/com/util/LoadingPlaceholder';
import { LoadMoreRetryBtn } from '#/view/com/util/LoadMoreRetryBtn';
import { NotificationFeedItem } from './NotificationFeedItem';
const EMPTY_FEED_ITEM = { _reactKey: '__empty__' };
const LOAD_MORE_ERROR_ITEM = { _reactKey: '__load_more_error__' };
const LOADING_ITEM = { _reactKey: '__loading__' };
export function NotificationFeed({ filter, enabled, scrollElRef, onPressTryAgain, onScrolledDownChange, ListHeaderComponent, refreshNotifications, }) {
    const initialNumToRender = useInitialNumToRender();
    const [isPTRing, setIsPTRing] = React.useState(false);
    const { _ } = useLingui();
    const moderationOpts = useModerationOpts();
    const { data, isFetching, isFetched, isError, error, hasNextPage, isFetchingNextPage, fetchNextPage, } = useNotificationFeedQuery({
        enabled: enabled && !!moderationOpts,
        filter,
    });
    // previously, this was `!isFetching && !data?.pages[0]?.items.length`
    // however, if the first page had no items (can happen in the mentions tab!)
    // it would flicker the empty state whenever it was loading.
    // therefore, we need to find if *any* page has items. in 99.9% of cases,
    // the `.find()` won't need to go any further than the first page -sfn
    const isEmpty = !isFetching && !data?.pages.find(page => page.items.length > 0);
    const items = React.useMemo(() => {
        let arr = [];
        if (isFetched) {
            if (isEmpty) {
                arr = arr.concat([EMPTY_FEED_ITEM]);
            }
            else if (data) {
                for (const page of data?.pages) {
                    arr = arr.concat(page.items);
                }
            }
            if (isError && !isEmpty) {
                arr = arr.concat([LOAD_MORE_ERROR_ITEM]);
            }
        }
        else {
            arr.push(LOADING_ITEM);
        }
        return arr;
    }, [isFetched, isError, isEmpty, data]);
    const onRefresh = React.useCallback(async () => {
        try {
            setIsPTRing(true);
            await refreshNotifications();
        }
        catch (err) {
            logger.error('Failed to refresh notifications feed', {
                message: err,
            });
        }
        finally {
            setIsPTRing(false);
        }
    }, [refreshNotifications, setIsPTRing]);
    const onEndReached = React.useCallback(async () => {
        if (isFetching || !hasNextPage || isError)
            return;
        try {
            await fetchNextPage();
        }
        catch (err) {
            logger.error('Failed to load more notifications', { message: err });
        }
    }, [isFetching, hasNextPage, isError, fetchNextPage]);
    const onPressRetryLoadMore = React.useCallback(() => {
        fetchNextPage();
    }, [fetchNextPage]);
    const renderItem = React.useCallback(({ item, index }) => {
        if (item === EMPTY_FEED_ITEM) {
            return (_jsx(EmptyState, { icon: "bell", message: _(msg `No notifications yet!`), style: styles.emptyState }));
        }
        else if (item === LOAD_MORE_ERROR_ITEM) {
            return (_jsx(LoadMoreRetryBtn, { label: _(msg `There was an issue fetching notifications. Tap here to try again.`), onPress: onPressRetryLoadMore }));
        }
        else if (item === LOADING_ITEM) {
            return _jsx(NotificationFeedLoadingPlaceholder, {});
        }
        return (_jsx(NotificationFeedItem, { highlightUnread: filter === 'all', item: item, moderationOpts: moderationOpts, hideTopBorder: index === 0 }));
    }, [moderationOpts, _, onPressRetryLoadMore, filter]);
    const FeedFooter = React.useCallback(() => isFetchingNextPage ? (_jsx(View, { style: styles.feedFooter, children: _jsx(ActivityIndicator, {}) })) : (_jsx(View, {})), [isFetchingNextPage]);
    return (_jsxs(View, { style: s.hContentRegion, children: [error && (_jsx(ErrorMessage, { message: cleanError(error), onPressTryAgain: onPressTryAgain })), _jsx(List, { testID: "notifsFeed", ref: scrollElRef, data: items, keyExtractor: item => item._reactKey, renderItem: renderItem, ListHeaderComponent: ListHeaderComponent, ListFooterComponent: FeedFooter, refreshing: isPTRing, onRefresh: onRefresh, onEndReached: onEndReached, onEndReachedThreshold: 2, onScrolledDownChange: onScrolledDownChange, contentContainerStyle: s.contentContainer, desktopFixedHeight: true, initialNumToRender: initialNumToRender, windowSize: 11, sideBorders: false, removeClippedSubviews: true })] }));
}
const styles = StyleSheet.create({
    feedFooter: { paddingTop: 20 },
    emptyState: { paddingVertical: 40 },
});
//# sourceMappingURL=NotificationFeed.js.map