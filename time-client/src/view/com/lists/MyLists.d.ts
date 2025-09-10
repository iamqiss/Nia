import { type JSX } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { type AppBskyGraphDefs as GraphDefs } from '@atproto/api';
import { type MyListsFilter } from '#/state/queries/my-lists';
export declare function MyLists({ filter, inline, style, renderItem, testID, }: {
    filter: MyListsFilter;
    inline?: boolean;
    style?: StyleProp<ViewStyle>;
    renderItem?: (list: GraphDefs.ListView, index: number) => JSX.Element;
    testID?: string;
}): any;
//# sourceMappingURL=MyLists.d.ts.map