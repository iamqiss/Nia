import React from 'react';
import { type FlatListProps } from 'react-native';
export type ListMethods = any;
export type ListProps<ItemT> = Omit<FlatListProps<ItemT>, 'onScroll' | 'refreshControl' | 'contentOffset'> & {
    onScrolledDownChange?: (isScrolledDown: boolean) => void;
    headerOffset?: number;
    refreshing?: boolean;
    onRefresh?: () => void;
    onItemSeen?: (item: ItemT) => void;
    desktopFixedHeight?: number | boolean;
    disableFullWindowScroll?: boolean;
    /**
     * @deprecated Should be using Layout components
     */
    sideBorders?: boolean;
};
export type ListRef = React.MutableRefObject<any | null>;
export declare const List: <ItemT>(props: ListProps<ItemT> & {
    ref?: React.Ref<ListMethods>;
}) => React.ReactElement<any>;
//# sourceMappingURL=List.web.d.ts.map