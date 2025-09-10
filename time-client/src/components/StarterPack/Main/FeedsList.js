import { jsx as _jsx } from "react/jsx-runtime";
import React, { useCallback } from 'react';
import { View } from 'react-native';
import {} from '@atproto/api';
import { useBottomBarOffset } from '#/lib/hooks/useBottomBarOffset';
import { isNative, isWeb } from '#/platform/detection';
import { List } from '#/view/com/util/List';
import {} from '#/screens/Profile/Sections/types';
import { atoms as a, useTheme } from '#/alf';
import * as FeedCard from '#/components/FeedCard';
function keyExtractor(item) {
    return item.uri;
}
export const FeedsList = React.forwardRef(function FeedsListImpl({ feeds, headerHeight, scrollElRef }, ref) {
    const [initialHeaderHeight] = React.useState(headerHeight);
    const bottomBarOffset = useBottomBarOffset(20);
    const t = useTheme();
    const onScrollToTop = useCallback(() => {
        scrollElRef.current?.scrollToOffset({
            animated: isNative,
            offset: -headerHeight,
        });
    }, [scrollElRef, headerHeight]);
    React.useImperativeHandle(ref, () => ({
        scrollToTop: onScrollToTop,
    }));
    const renderItem = ({ item, index, }) => {
        return (_jsx(View, { style: [
                a.p_lg,
                (isWeb || index !== 0) && a.border_t,
                t.atoms.border_contrast_low,
            ], children: _jsx(FeedCard.Default, { view: item }) }));
    };
    return (_jsx(List, { data: feeds, renderItem: renderItem, keyExtractor: keyExtractor, ref: scrollElRef, headerOffset: headerHeight, ListFooterComponent: _jsx(View, { style: [{ height: initialHeaderHeight + bottomBarOffset }] }), showsVerticalScrollIndicator: false, desktopFixedHeight: true }));
});
//# sourceMappingURL=FeedsList.js.map