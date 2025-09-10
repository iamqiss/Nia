import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { findNodeHandle, View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useInitialNumToRender } from '#/lib/hooks/useInitialNumToRender';
import { isIOS, isNative } from '#/platform/detection';
import {} from '#/state/queries/post-feed';
import { RQKEY as FEED_RQKEY } from '#/state/queries/post-feed';
import { truncateAndInvalidate } from '#/state/queries/util';
import { PostFeed } from '#/view/com/posts/PostFeed';
import { EmptyState } from '#/view/com/util/EmptyState';
import {} from '#/view/com/util/List';
import { LoadLatestBtn } from '#/view/com/util/load-latest/LoadLatestBtn';
import { atoms as a, ios, useTheme } from '#/alf';
import { Text } from '#/components/Typography';
import {} from './types';
export const ProfileFeedSection = React.forwardRef(function FeedSectionImpl({ feed, headerHeight, isFocused, scrollElRef, ignoreFilterFor, setScrollViewTag, }, ref) {
    const { _ } = useLingui();
    const queryClient = useQueryClient();
    const [hasNew, setHasNew] = React.useState(false);
    const [isScrolledDown, setIsScrolledDown] = React.useState(false);
    const shouldUseAdjustedNumToRender = feed.endsWith('posts_and_author_threads');
    const isVideoFeed = isNative && feed.endsWith('posts_with_video');
    const adjustedInitialNumToRender = useInitialNumToRender({
        screenHeightOffset: headerHeight,
    });
    const onScrollToTop = React.useCallback(() => {
        scrollElRef.current?.scrollToOffset({
            animated: isNative,
            offset: -headerHeight,
        });
        truncateAndInvalidate(queryClient, FEED_RQKEY(feed));
        setHasNew(false);
    }, [scrollElRef, headerHeight, queryClient, feed, setHasNew]);
    React.useImperativeHandle(ref, () => ({
        scrollToTop: onScrollToTop,
    }));
    const renderPostsEmpty = React.useCallback(() => {
        return _jsx(EmptyState, { icon: "growth", message: _(msg `No posts yet.`) });
    }, [_]);
    React.useEffect(() => {
        if (isIOS && isFocused && scrollElRef.current) {
            const nativeTag = findNodeHandle(scrollElRef.current);
            setScrollViewTag(nativeTag);
        }
    }, [isFocused, scrollElRef, setScrollViewTag]);
    return (_jsxs(View, { children: [_jsx(PostFeed, { testID: "postsFeed", enabled: isFocused, feed: feed, scrollElRef: scrollElRef, onHasNew: setHasNew, onScrolledDownChange: setIsScrolledDown, renderEmptyState: renderPostsEmpty, headerOffset: headerHeight, progressViewOffset: ios(0), renderEndOfFeed: isVideoFeed ? undefined : ProfileEndOfFeed, ignoreFilterFor: ignoreFilterFor, initialNumToRender: shouldUseAdjustedNumToRender ? adjustedInitialNumToRender : undefined, isVideoFeed: isVideoFeed }), (isScrolledDown || hasNew) && (_jsx(LoadLatestBtn, { onPress: onScrollToTop, label: _(msg `Load new posts`), showIndicator: hasNew }))] }));
});
function ProfileEndOfFeed() {
    const t = useTheme();
    return (_jsx(View, { style: [a.w_full, a.py_5xl, a.border_t, t.atoms.border_contrast_medium], children: _jsx(Text, { style: [t.atoms.text_contrast_medium, a.text_center], children: _jsx(Trans, { children: "End of feed" }) }) }));
}
//# sourceMappingURL=Feed.js.map