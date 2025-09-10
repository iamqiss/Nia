import * as React from 'react';
import { type JSX } from 'react';
import { type ScrollView } from 'react-native';
import { type ListMethods } from '../util/List';
export interface PagerWithHeaderChildParams {
    headerHeight: number;
    isFocused: boolean;
    scrollElRef: React.MutableRefObject<ListMethods | ScrollView | null>;
}
export interface PagerWithHeaderProps {
    testID?: string;
    children: (((props: PagerWithHeaderChildParams) => JSX.Element) | null)[] | ((props: PagerWithHeaderChildParams) => JSX.Element);
    items: string[];
    isHeaderReady: boolean;
    renderHeader?: ({ setMinimumHeight, }: {
        setMinimumHeight: () => void;
    }) => JSX.Element;
    initialPage?: number;
    onPageSelected?: (index: number) => void;
    onCurrentPageSelected?: (index: number) => void;
}
export declare const PagerWithHeader: any;
//# sourceMappingURL=PagerWithHeader.web.d.ts.map