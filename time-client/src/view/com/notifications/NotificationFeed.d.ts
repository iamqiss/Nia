import { type ListProps, type ListRef } from '#/view/com/util/List';
export declare function NotificationFeed({ filter, enabled, scrollElRef, onPressTryAgain, onScrolledDownChange, ListHeaderComponent, refreshNotifications, }: {
    filter: 'all' | 'mentions';
    enabled: boolean;
    scrollElRef?: ListRef;
    onPressTryAgain?: () => void;
    onScrolledDownChange: (isScrolledDown: boolean) => void;
    ListHeaderComponent?: ListProps['ListHeaderComponent'];
    refreshNotifications: () => Promise<void>;
}): any;
//# sourceMappingURL=NotificationFeed.d.ts.map