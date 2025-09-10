import { type JSX } from 'react';
import { type PagerViewOnPageSelectedEvent } from 'react-native-pager-view';
import { type SharedValue } from 'react-native-reanimated';
export type PageSelectedEvent = PagerViewOnPageSelectedEvent;
export interface PagerRef {
    setPage: (index: number) => void;
}
export interface RenderTabBarFnProps {
    selectedPage: number;
    onSelect?: (index: number) => void;
    tabBarAnchor?: JSX.Element | null | undefined;
    dragProgress: SharedValue<number>;
    dragState: SharedValue<'idle' | 'dragging' | 'settling'>;
}
export type RenderTabBarFn = (props: RenderTabBarFnProps) => JSX.Element;
interface Props {
    ref?: React.Ref<PagerRef>;
    initialPage?: number;
    renderTabBar: RenderTabBarFn;
    onTabPressed?: (index: number) => void;
    onPageSelected?: (index: number) => void;
    onPageScrollStateChanged?: (scrollState: 'idle' | 'dragging' | 'settling') => void;
    testID?: string;
}
export declare function Pager({ ref, children, initialPage, renderTabBar, onPageSelected: parentOnPageSelected, onTabPressed: parentOnTabPressed, onPageScrollStateChanged: parentOnPageScrollStateChanged, testID, }: React.PropsWithChildren<Props>): any;
export {};
//# sourceMappingURL=Pager.d.ts.map