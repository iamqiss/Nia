import React from 'react';
import { type SharedValue } from 'react-native-reanimated';
export declare const PagerHeaderContext: any;
/**
 * Passes information about the scroll position and header height down via
 * context for the pager header to consume.
 *
 * @platform ios, android
 */
export declare function PagerHeaderProvider({ scrollY, headerHeight, children, }: {
    scrollY: SharedValue<number>;
    headerHeight: number;
    children: React.ReactNode;
}): any;
export declare function usePagerHeaderContext(): any;
//# sourceMappingURL=PagerHeaderContext.d.ts.map