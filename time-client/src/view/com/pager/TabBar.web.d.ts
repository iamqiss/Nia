export interface TabBarProps {
    testID?: string;
    selectedPage: number;
    items: string[];
    indicatorColor?: string;
    backgroundColor?: string;
    onSelect?: (index: number) => void;
    onPressSelected?: (index: number) => void;
}
export declare function TabBar({ testID, selectedPage, items, onSelect, onPressSelected, }: TabBarProps): any;
//# sourceMappingURL=TabBar.web.d.ts.map