import React from 'react';
import { type FlatListPropsWithLayout } from 'react-native-reanimated';
import { FlatList_INTERNAL } from './Views';
export type ListMethods = FlatList_INTERNAL;
export type ListProps<ItemT = any> = Omit<FlatListPropsWithLayout<ItemT>, 'onMomentumScrollBegin' | 'onMomentumScrollEnd' | 'onScroll' | 'onScrollBeginDrag' | 'onScrollEndDrag' | 'refreshControl' | 'contentOffset' | 'progressViewOffset'> & {
    onScrolledDownChange?: (isScrolledDown: boolean) => void;
    headerOffset?: number;
    refreshing?: boolean;
    onRefresh?: () => void;
    onItemSeen?: (item: ItemT) => void;
    desktopFixedHeight?: number | boolean;
    disableFullWindowScroll?: boolean;
    sideBorders?: boolean;
    progressViewOffset?: number;
};
export type ListRef = React.MutableRefObject<FlatList_INTERNAL | null>;
declare let List: any;
export { List };
//# sourceMappingURL=List.d.ts.map