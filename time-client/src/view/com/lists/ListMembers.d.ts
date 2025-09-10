import { type JSX } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { type ListRef } from '#/view/com/util/List';
export declare function ListMembers({ list, style, scrollElRef, onScrolledDownChange, onPressTryAgain, renderHeader, renderEmptyState, testID, headerOffset, desktopFixedHeightOffset, }: {
    list: string;
    style?: StyleProp<ViewStyle>;
    scrollElRef?: ListRef;
    onScrolledDownChange: (isScrolledDown: boolean) => void;
    onPressTryAgain?: () => void;
    renderHeader: () => JSX.Element;
    renderEmptyState: () => JSX.Element;
    testID?: string;
    headerOffset?: number;
    desktopFixedHeightOffset?: number;
}): any;
//# sourceMappingURL=ListMembers.d.ts.map