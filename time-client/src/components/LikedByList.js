import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import {} from '@atproto/api';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useInitialNumToRender } from '#/lib/hooks/useInitialNumToRender';
import { cleanError } from '#/lib/strings/errors';
import { logger } from '#/logger';
import { useLikedByQuery } from '#/state/queries/post-liked-by';
import { useResolveUriQuery } from '#/state/queries/resolve-uri';
import { ProfileCardWithFollowBtn } from '#/view/com/profile/ProfileCard';
import { List } from '#/view/com/util/List';
import { ListFooter, ListMaybePlaceholder } from '#/components/Lists';
function renderItem({ item, index }) {
    return (_jsx(ProfileCardWithFollowBtn, { profile: item.actor, noBorder: index === 0 }, item.actor.did));
}
function keyExtractor(item) {
    return item.actor.did;
}
export function LikedByList({ uri }) {
    const { _ } = useLingui();
    const initialNumToRender = useInitialNumToRender();
    const [isPTRing, setIsPTRing] = React.useState(false);
    const { data: resolvedUri, error: resolveError, isLoading: isUriLoading, } = useResolveUriQuery(uri);
    const { data, isLoading: isLikedByLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error: likedByError, refetch, } = useLikedByQuery(resolvedUri?.uri);
    const error = resolveError || likedByError;
    const isError = !!resolveError || !!likedByError;
    const likes = React.useMemo(() => {
        if (data?.pages) {
            return data.pages.flatMap(page => page.likes);
        }
        return [];
    }, [data]);
    const onRefresh = React.useCallback(async () => {
        setIsPTRing(true);
        try {
            await refetch();
        }
        catch (err) {
            logger.error('Failed to refresh likes', { message: err });
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
            logger.error('Failed to load more likes', { message: err });
        }
    }, [isFetchingNextPage, hasNextPage, isError, fetchNextPage]);
    if (likes.length < 1) {
        return (_jsx(ListMaybePlaceholder, { isLoading: isUriLoading || isLikedByLoading, isError: isError, emptyType: "results", emptyTitle: _(msg `No likes yet`), emptyMessage: _(msg `Nobody has liked this yet. Maybe you should be the first!`), errorMessage: cleanError(resolveError || error), onRetry: isError ? refetch : undefined, topBorder: false, sideBorders: false }));
    }
    return (_jsx(List, { data: likes, renderItem: renderItem, keyExtractor: keyExtractor, refreshing: isPTRing, onRefresh: onRefresh, onEndReached: onEndReached, ListFooterComponent: _jsx(ListFooter, { isFetchingNextPage: isFetchingNextPage, error: cleanError(error), onRetry: fetchNextPage }), onEndReachedThreshold: 3, initialNumToRender: initialNumToRender, windowSize: 11, sideBorders: false }));
}
//# sourceMappingURL=LikedByList.js.map