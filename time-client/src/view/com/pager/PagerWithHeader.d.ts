import { type JSX } from 'react';
import { type ScrollView } from 'react-native';
import { type PagerRef } from '#/view/com/pager/Pager';
import { type ListMethods } from '../util/List';
export interface PagerWithHeaderChildParams {
    headerHeight: number;
    isFocused: boolean;
    scrollElRef: React.MutableRefObject<ListMethods | ScrollView | null>;
}
export interface PagerWithHeaderProps {
    ref?: React.Ref<PagerRef>;
    testID?: string;
    children: (((props: PagerWithHeaderChildParams) => JSX.Element) | null)[] | ((props: PagerWithHeaderChildParams) => JSX.Element);
    items: string[];
    isHeaderReady: boolean;
    renderHeader?: ({ setMinimumHeight, }: {
        setMinimumHeight: (height: number) => void;
    }) => JSX.Element;
    initialPage?: number;
    onPageSelected?: (index: number) => void;
    onCurrentPageSelected?: (index: number) => void;
    allowHeaderOverScroll?: boolean;
}
export declare function PagerWithHeader({ ref, children, testID, items, isHeaderReady, renderHeader, initialPage, onPageSelected, onCurrentPageSelected, allowHeaderOverScroll, }: PagerWithHeaderProps): any;
//# sourceMappingURL=PagerWithHeader.d.ts.map