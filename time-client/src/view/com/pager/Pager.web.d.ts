import { type JSX } from 'react';
export interface PagerRef {
    setPage: (index: number) => void;
}
export interface RenderTabBarFnProps {
    selectedPage: number;
    onSelect?: (index: number) => void;
    tabBarAnchor?: JSX.Element;
}
export type RenderTabBarFn = (props: RenderTabBarFnProps) => JSX.Element;
interface Props {
    ref?: React.Ref<PagerRef>;
    initialPage?: number;
    renderTabBar: RenderTabBarFn;
    onPageSelected?: (index: number) => void;
}
export declare function Pager({ ref, children, initialPage, renderTabBar, onPageSelected, }: React.PropsWithChildren<Props>): any;
export {};
//# sourceMappingURL=Pager.web.d.ts.map