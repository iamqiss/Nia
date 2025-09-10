import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { AppBskyFeedDefs, } from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useFocusEffect } from '@react-navigation/native';
import { useCleanError } from '#/lib/hooks/useCleanError';
import { useInitialNumToRender } from '#/lib/hooks/useInitialNumToRender';
import {} from '#/lib/routes/types';
import { logger } from '#/logger';
import { isIOS } from '#/platform/detection';
import { useBookmarkMutation } from '#/state/queries/bookmarks/useBookmarkMutation';
import { useBookmarksQuery } from '#/state/queries/bookmarks/useBookmarksQuery';
import { useSetMinimalShellMode } from '#/state/shell';
import { Post } from '#/view/com/post/Post';
import { List } from '#/view/com/util/List';
import { PostFeedLoadingPlaceholder } from '#/view/com/util/LoadingPlaceholder';
import { EmptyState } from '#/screens/Bookmarks/components/EmptyState';
import { atoms as a, useTheme } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import { BookmarkFilled } from '#/components/icons/Bookmark';
import { CircleQuestion_Stroke2_Corner2_Rounded as QuestionIcon } from '#/components/icons/CircleQuestion';
import * as Layout from '#/components/Layout';
import { ListFooter } from '#/components/Lists';
import * as Skele from '#/components/Skeleton';
import * as toast from '#/components/Toast';
import { Text } from '#/components/Typography';
export function BookmarksScreen({}) {
    const setMinimalShellMode = useSetMinimalShellMode();
    useFocusEffect(useCallback(() => {
        setMinimalShellMode(false);
        logger.metric('bookmarks:view', {});
    }, [setMinimalShellMode]));
    return (_jsxs(Layout.Screen, { testID: "bookmarksScreen", children: [_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, { children: _jsx(Layout.Header.TitleText, { children: _jsx(Trans, { children: "Saved Posts" }) }) }), _jsx(Layout.Header.Slot, {})] }), _jsx(BookmarksInner, {})] }));
}
function BookmarksInner() {
    const initialNumToRender = useInitialNumToRender();
    const cleanError = useCleanError();
    const [isPTRing, setIsPTRing] = useState(false);
    const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error, refetch, } = useBookmarksQuery();
    const cleanedError = useMemo(() => {
        const { raw, clean } = cleanError(error);
        return clean || raw;
    }, [error, cleanError]);
    const onRefresh = useCallback(async () => {
        setIsPTRing(true);
        try {
            await refetch();
        }
        finally {
            setIsPTRing(false);
        }
    }, [refetch, setIsPTRing]);
    const onEndReached = useCallback(async () => {
        if (isFetchingNextPage || !hasNextPage || error)
            return;
        try {
            await fetchNextPage();
        }
        catch { }
    }, [isFetchingNextPage, hasNextPage, error, fetchNextPage]);
    const items = useMemo(() => {
        const i = [];
        if (isLoading) {
            i.push({ type: 'loading', key: 'loading' });
        }
        else if (error || !data) {
            // handled in Footer
        }
        else {
            const bookmarks = data.pages.flatMap(p => p.bookmarks);
            if (bookmarks.length > 0) {
                for (const bookmark of bookmarks) {
                    if (AppBskyFeedDefs.isNotFoundPost(bookmark.item)) {
                        i.push({
                            type: 'bookmarkNotFound',
                            key: bookmark.item.uri,
                            bookmark: {
                                ...bookmark,
                                item: bookmark.item,
                            },
                        });
                    }
                    if (AppBskyFeedDefs.isPostView(bookmark.item)) {
                        i.push({
                            type: 'bookmark',
                            key: bookmark.item.uri,
                            bookmark: {
                                ...bookmark,
                                item: bookmark.item,
                            },
                        });
                    }
                }
            }
            else {
                i.push({ type: 'empty', key: 'empty' });
            }
        }
        return i;
    }, [isLoading, error, data]);
    const isEmpty = items.length === 1 && items[0]?.type === 'empty';
    return (_jsx(List, { data: items, renderItem: renderItem, keyExtractor: keyExtractor, refreshing: isPTRing, onRefresh: onRefresh, onEndReached: onEndReached, onEndReachedThreshold: 4, ListFooterComponent: _jsx(ListFooter, { isFetchingNextPage: isFetchingNextPage, error: cleanedError, onRetry: fetchNextPage, style: [isEmpty && a.border_t_0] }), initialNumToRender: initialNumToRender, windowSize: 9, maxToRenderPerBatch: isIOS ? 5 : 1, updateCellsBatchingPeriod: 40, sideBorders: false }));
}
function BookmarkNotFound({ hideTopBorder, post, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const { mutateAsync: bookmark } = useBookmarkMutation();
    const cleanError = useCleanError();
    const remove = async () => {
        try {
            await bookmark({ action: 'delete', uri: post.uri });
            toast.show(_(msg `Removed from saved posts`), {
                type: 'info',
            });
        }
        catch (e) {
            const { raw, clean } = cleanError(e);
            toast.show(clean || raw || e, {
                type: 'error',
            });
        }
    };
    return (_jsxs(View, { style: [
            a.flex_row,
            a.align_start,
            a.px_xl,
            a.py_lg,
            a.gap_sm,
            !hideTopBorder && a.border_t,
            t.atoms.border_contrast_low,
        ], children: [_jsx(Skele.Circle, { size: 42, children: _jsx(QuestionIcon, { size: "lg", fill: t.atoms.text_contrast_low.color }) }), _jsxs(View, { style: [a.flex_1, a.gap_2xs], children: [_jsxs(View, { style: [a.flex_row, a.gap_xs], children: [_jsx(Skele.Text, { style: [a.text_md, { width: 80 }] }), _jsx(Skele.Text, { style: [a.text_md, { width: 100 }] })] }), _jsx(Text, { style: [
                            a.text_md,
                            a.leading_snug,
                            a.italic,
                            t.atoms.text_contrast_medium,
                        ], children: _jsx(Trans, { children: "This post was deleted by its author" }) })] }), _jsxs(Button, { label: _(msg `Remove from saved posts`), size: "tiny", color: "secondary", onPress: remove, children: [_jsx(ButtonIcon, { icon: BookmarkFilled }), _jsx(ButtonText, { children: _jsx(Trans, { children: "Remove" }) })] })] }));
}
function renderItem({ item, index }) {
    switch (item.type) {
        case 'loading': {
            return _jsx(PostFeedLoadingPlaceholder, {});
        }
        case 'empty': {
            return _jsx(EmptyState, {});
        }
        case 'bookmark': {
            return (_jsx(Post, { post: item.bookmark.item, hideTopBorder: index === 0, onBeforePress: () => {
                    logger.metric('bookmarks:post-clicked', {});
                } }));
        }
        case 'bookmarkNotFound': {
            return (_jsx(BookmarkNotFound, { post: item.bookmark.item, hideTopBorder: index === 0 }));
        }
        default:
            return null;
    }
}
const keyExtractor = (item) => item.key;
//# sourceMappingURL=index.js.map