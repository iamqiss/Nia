import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useIsFocused } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { isNative } from '#/platform/detection';
import { listenSoftReset } from '#/state/events';
import {} from '#/state/queries/post-feed';
import { RQKEY as FEED_RQKEY } from '#/state/queries/post-feed';
import { PostFeed } from '#/view/com/posts/PostFeed';
import { EmptyState } from '#/view/com/util/EmptyState';
import {} from '#/view/com/util/List';
import { LoadLatestBtn } from '#/view/com/util/load-latest/LoadLatestBtn';
import { atoms as a } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import { PersonPlus_Stroke2_Corner0_Rounded as PersonPlusIcon } from '#/components/icons/Person';
export function FeedSection({ ref, feed, scrollElRef, headerHeight, isFocused, isOwner, onPressAddUser, }) {
    const queryClient = useQueryClient();
    const [hasNew, setHasNew] = useState(false);
    const [isScrolledDown, setIsScrolledDown] = useState(false);
    const isScreenFocused = useIsFocused();
    const { _ } = useLingui();
    const onScrollToTop = useCallback(() => {
        scrollElRef.current?.scrollToOffset({
            animated: isNative,
            offset: -headerHeight,
        });
        queryClient.resetQueries({ queryKey: FEED_RQKEY(feed) });
        setHasNew(false);
    }, [scrollElRef, headerHeight, queryClient, feed, setHasNew]);
    useImperativeHandle(ref, () => ({
        scrollToTop: onScrollToTop,
    }));
    useEffect(() => {
        if (!isScreenFocused) {
            return;
        }
        return listenSoftReset(onScrollToTop);
    }, [onScrollToTop, isScreenFocused]);
    const renderPostsEmpty = useCallback(() => {
        return (_jsxs(View, { style: [a.gap_xl, a.align_center], children: [_jsx(EmptyState, { icon: "hashtag", message: _(msg `This feed is empty.`) }), isOwner && (_jsxs(Button, { label: _(msg `Start adding people`), onPress: onPressAddUser, color: "primary", size: "small", children: [_jsx(ButtonIcon, { icon: PersonPlusIcon }), _jsx(ButtonText, { children: _jsx(Trans, { children: "Start adding people!" }) })] }))] }));
    }, [_, onPressAddUser, isOwner]);
    return (_jsxs(View, { children: [_jsx(PostFeed, { testID: "listFeed", enabled: isFocused, feed: feed, pollInterval: 60e3, disablePoll: hasNew, scrollElRef: scrollElRef, onHasNew: setHasNew, onScrolledDownChange: setIsScrolledDown, renderEmptyState: renderPostsEmpty, headerOffset: headerHeight }), (isScrolledDown || hasNew) && (_jsx(LoadLatestBtn, { onPress: onScrollToTop, label: _(msg `Load new posts`), showIndicator: hasNew }))] }));
}
//# sourceMappingURL=FeedSection.js.map