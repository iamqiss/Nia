import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from 'react';
import {} from 'react-native';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import {} from 'react-native-reanimated';
// If you explode these into functions, don't forget to forwardRef!
/**
 * Avoid using `FlatList_INTERNAL` and use `List` where possible.
 * The types are a bit wrong on `FlatList_INTERNAL`
 */
export const FlatList_INTERNAL = Animated.FlatList;
/**
 * @deprecated use `Layout` components
 */
export const ScrollView = Animated.ScrollView;
/**
 * @deprecated use `Layout` components
 */
export const CenteredView = forwardRef(function CenteredView(props, ref) {
    return _jsx(View, { ref: ref, ...props });
});
//# sourceMappingURL=Views.js.map