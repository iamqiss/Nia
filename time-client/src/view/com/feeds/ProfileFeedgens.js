import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { findNodeHandle, View, } from 'react-native';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useQueryClient } from '@tanstack/react-query';
import { cleanError } from '#/lib/strings/errors';
import { logger } from '#/logger';
import { isIOS, isNative, isWeb } from '#/platform/detection';
import { usePreferencesQuery } from '#/state/queries/preferences';
import { RQKEY, useProfileFeedgensQuery } from '#/state/queries/profile-feedgens';
import { EmptyState } from '#/view/com/util/EmptyState';
import { ErrorMessage } from '#/view/com/util/error/ErrorMessage';
import { List } from '#/view/com/util/List';
import { FeedLoadingPlaceholder } from '#/view/com/util/LoadingPlaceholder';
import { LoadMoreRetryBtn } from '#/view/com/util/LoadMoreRetryBtn';
import { atoms as a, ios, useTheme } from '#/alf';
import * as FeedCard from '#/components/FeedCard';
import { ListFooter } from '#/components/Lists';
const LOADING = { _reactKey: '__loading__' };
const EMPTY = { _reactKey: '__empty__' };
const ERROR_ITEM = { _reactKey: '__error__' };
const LOAD_MORE_ERROR_ITEM = { _reactKey: '__load_more_error__' };
export const ProfileFeedgens = React.forwardRef(function ProfileFeedgensImpl({ did, scrollElRef, headerOffset, enabled, style, testID, setScrollViewTag }, ref) {
    const { _ } = useLingui();
    const t = useTheme();
    const [isPTRing, setIsPTRing] = React.useState(false);
    const opts = React.useMemo(() => ({ enabled }), [enabled]);
    const { data, isPending, isFetchingNextPage, hasNextPage, fetchNextPage, isError, error, refetch, } = useProfileFeedgensQuery(did, opts);
    const isEmpty = !isPending && !data?.pages[0]?.feeds.length;
    const { data: preferences } = usePreferencesQuery();
    const items = React.useMemo(() => {
        let items = [];
        if (isError && isEmpty) {
            items = items.concat([ERROR_ITEM]);
        }
        if (isPending) {
            items = items.concat([LOADING]);
        }
        else if (isEmpty) {
            items = items.concat([EMPTY]);
        }
        else if (data?.pages) {
            for (const page of data?.pages) {
                items = items.concat(page.feeds);
            }
        }
        else if (isError && !isEmpty) {
            items = items.concat([LOAD_MORE_ERROR_ITEM]);
        }
        return items;
    }, [isError, isEmpty, isPending, data]);
    // events
    // =
    const queryClient = useQueryClient();
    const onScrollToTop = React.useCallback(() => {
        scrollElRef.current?.scrollToOffset({
            animated: isNative,
            offset: -headerOffset,
        });
        queryClient.invalidateQueries({ queryKey: RQKEY(did) });
    }, [scrollElRef, queryClient, headerOffset, did]);
    React.useImperativeHandle(ref, () => ({
        scrollToTop: onScrollToTop,
    }));
    const onRefresh = React.useCallback(async () => {
        setIsPTRing(true);
        try {
            await refetch();
        }
        catch (err) {
            logger.error('Failed to refresh feeds', { message: err });
        }
        setIsPTRing(false);
    }, [refetch, setIsPTRing]);
    const onEndReached = React.useCallback(async () => {
        if (isFetchingNextPage || !hasNextPage || isError)
            return;
        try {
            await fetchNextPage();
        }
        catch (err) {
            logger.error('Failed to load more feeds', { message: err });
        }
    }, [isFetchingNextPage, hasNextPage, isError, fetchNextPage]);
    const onPressRetryLoadMore = React.useCallback(() => {
        fetchNextPage();
    }, [fetchNextPage]);
    // rendering
    // =
    const renderItem = React.useCallback(({ item, index }) => {
        if (item === EMPTY) {
            return (_jsx(EmptyState, { icon: "hashtag", message: _(msg `You have no feeds.`), testID: "listsEmpty" }));
        }
        else if (item === ERROR_ITEM) {
            return (_jsx(ErrorMessage, { message: cleanError(error), onPressTryAgain: refetch }));
        }
        else if (item === LOAD_MORE_ERROR_ITEM) {
            return (_jsx(LoadMoreRetryBtn, { label: _(msg `There was an issue fetching your lists. Tap here to try again.`), onPress: onPressRetryLoadMore }));
        }
        else if (item === LOADING) {
            return _jsx(FeedLoadingPlaceholder, {});
        }
        if (preferences) {
            return (_jsx(View, { style: [
                    (index !== 0 || isWeb) && a.border_t,
                    t.atoms.border_contrast_low,
                    a.px_lg,
                    a.py_lg,
                ], children: _jsx(FeedCard.Default, { view: item }) }));
        }
        return null;
    }, [_, t, error, refetch, onPressRetryLoadMore, preferences]);
    React.useEffect(() => {
        if (isIOS && enabled && scrollElRef.current) {
            const nativeTag = findNodeHandle(scrollElRef.current);
            setScrollViewTag(nativeTag);
        }
    }, [enabled, scrollElRef, setScrollViewTag]);
    const ProfileFeedgensFooter = React.useCallback(() => {
        if (isEmpty)
            return null;
        return (_jsx(ListFooter, { hasNextPage: hasNextPage, isFetchingNextPage: isFetchingNextPage, onRetry: fetchNextPage, error: cleanError(error), height: 180 + headerOffset }));
    }, [
        hasNextPage,
        error,
        isFetchingNextPage,
        headerOffset,
        fetchNextPage,
        isEmpty,
    ]);
    return (_jsx(View, { testID: testID, style: style, children: _jsx(List, { testID: testID ? `${testID}-flatlist` : undefined, ref: scrollElRef, data: items, keyExtractor: keyExtractor, renderItem: renderItem, ListFooterComponent: ProfileFeedgensFooter, refreshing: isPTRing, onRefresh: onRefresh, headerOffset: headerOffset, progressViewOffset: ios(0), removeClippedSubviews: true, desktopFixedHeight: true, onEndReached: onEndReached }) }));
});
function keyExtractor(item) {
    return item._reactKey || item.uri;
}
//# sourceMappingURL=ProfileFeedgens.js.map