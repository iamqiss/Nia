import { type SharedValue } from 'react-native-reanimated';
export interface TabBarProps {
    testID?: string;
    selectedPage: number;
    items: string[];
    onSelect?: (index: number) => void;
    onPressSelected?: (index: number) => void;
    dragProgress: SharedValue<number>;
    dragState: SharedValue<'idle' | 'dragging' | 'settling'>;
}
export declare function TabBar({ testID, selectedPage, items, onSelect, onPressSelected, dragProgress, dragState, }: TabBarProps): any;
//# sourceMappingURL=TabBar.d.ts.map