import { type FlatListComponent } from 'react-native';
import Animated from 'react-native-reanimated';
import { type FlatListPropsWithLayout } from 'react-native-reanimated';
/**
 * Avoid using `FlatList_INTERNAL` and use `List` where possible.
 * The types are a bit wrong on `FlatList_INTERNAL`
 */
export declare const FlatList_INTERNAL: any;
export type FlatList_INTERNAL<ItemT = any> = Omit<FlatListComponent<ItemT, FlatListPropsWithLayout<ItemT>>, 'CellRendererComponent'>;
/**
 * @deprecated use `Layout` components
 */
export declare const ScrollView: any;
export type ScrollView = typeof Animated.ScrollView;
/**
 * @deprecated use `Layout` components
 */
export declare const CenteredView: any;
//# sourceMappingURL=Views.d.ts.map