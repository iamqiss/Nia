import { jsx as _jsx } from "react/jsx-runtime";
import React, { useCallback } from 'react';
import { View } from 'react-native';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { isNative } from '#/platform/detection';
import {} from '#/state/queries/post-feed';
import { PostFeed } from '#/view/com/posts/PostFeed';
import { EmptyState } from '#/view/com/util/EmptyState';
import {} from '#/view/com/util/List';
import {} from '#/screens/Profile/Sections/types';
export const PostsList = React.forwardRef(function PostsListImpl({ listUri, headerHeight, scrollElRef }, ref) {
    const feed = `list|${listUri}`;
    const { _ } = useLingui();
    const onScrollToTop = useCallback(() => {
        scrollElRef.current?.scrollToOffset({
            animated: isNative,
            offset: -headerHeight,
        });
    }, [scrollElRef, headerHeight]);
    React.useImperativeHandle(ref, () => ({
        scrollToTop: onScrollToTop,
    }));
    const renderPostsEmpty = useCallback(() => {
        return _jsx(EmptyState, { icon: "hashtag", message: _(msg `This feed is empty.`) });
    }, [_]);
    return (_jsx(View, { children: _jsx(PostFeed, { feed: feed, pollInterval: 60e3, scrollElRef: scrollElRef, renderEmptyState: renderPostsEmpty, headerOffset: headerHeight }) }));
});
//# sourceMappingURL=PostsList.js.map