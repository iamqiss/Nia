import { type StyleProp, type ViewStyle } from 'react-native';
/**
 * Tab component that automatically scrolls the selected tab into view - used for interests
 * in the Find Follows dialog, Explore screen, etc.
 */
export declare function InterestTabs({ onSelectTab, interests, selectedInterest, disabled, interestsDisplayNames, TabComponent, contentContainerStyle, gutterWidth, }: {
    onSelectTab: (tab: string) => void;
    interests: string[];
    selectedInterest: string;
    interestsDisplayNames: Record<string, string>;
    /** still allows changing tab, but removes the active state from the selected tab */
    disabled?: boolean;
    TabComponent?: React.ComponentType<React.ComponentProps<typeof Tab>>;
    contentContainerStyle?: StyleProp<ViewStyle>;
    gutterWidth?: number;
}): any;
declare function Tab({ onSelectTab, interest, active, index, interestsDisplayName, onLayout, }: {
    onSelectTab: (index: number) => void;
    interest: string;
    active: boolean;
    index: number;
    interestsDisplayName: string;
    onLayout: (index: number, x: number, width: number) => void;
}): any;
export declare function boostInterests(boosts?: string[]): (_a: string, _b: string) => number;
export {};
//# sourceMappingURL=InterestTabs.d.ts.map