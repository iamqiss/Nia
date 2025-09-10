import { type ForwardedRef } from 'react';
import { type ScrollView } from 'react-native';
type Props<Scrollable extends ScrollView = ScrollView> = {
    cursor?: string;
    outerRef?: ForwardedRef<Scrollable>;
};
export declare function useDraggableScroll<Scrollable extends ScrollView = ScrollView>({ outerRef, cursor, }?: Props<Scrollable>): {
    refs: any;
};
export {};
//# sourceMappingURL=useDraggableScrollView.d.ts.map