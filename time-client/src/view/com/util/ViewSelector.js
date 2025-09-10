import { jsx as _jsx } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View, } from 'react-native';
import { useColorSchemeStyle } from '#/lib/hooks/useColorSchemeStyle';
import { usePalette } from '#/lib/hooks/usePalette';
import { clamp } from '#/lib/numbers';
import { colors, s } from '#/lib/styles';
import { isAndroid } from '#/platform/detection';
import { Text } from './text/Text';
import { FlatList_INTERNAL } from './Views';
const HEADER_ITEM = { _reactKey: '__header__' };
const SELECTOR_ITEM = { _reactKey: '__selector__' };
const STICKY_HEADER_INDICES = [1];
export const ViewSelector = React.forwardRef(function ViewSelectorImpl({ sections, items, refreshing, renderHeader, renderItem, ListFooterComponent, onSelectView, onScroll, onRefresh, onEndReached, }, ref) {
    const pal = usePalette('default');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const flatListRef = React.useRef(null);
    // events
    // =
    const keyExtractor = React.useCallback((item) => item._reactKey, []);
    const onPressSelection = React.useCallback((index) => setSelectedIndex(clamp(index, 0, sections.length)), [setSelectedIndex, sections]);
    useEffect(() => {
        onSelectView?.(selectedIndex);
    }, [selectedIndex, onSelectView]);
    React.useImperativeHandle(ref, () => ({
        scrollToTop: () => {
            flatListRef.current?.scrollToOffset({ offset: 0 });
        },
    }));
    // rendering
    // =
    const renderItemInternal = React.useCallback(({ item }) => {
        if (item === HEADER_ITEM) {
            if (renderHeader) {
                return renderHeader();
            }
            return _jsx(View, {});
        }
        else if (item === SELECTOR_ITEM) {
            return (_jsx(Selector, { items: sections, selectedIndex: selectedIndex, onSelect: onPressSelection }));
        }
        else {
            return renderItem(item);
        }
    }, [sections, selectedIndex, onPressSelection, renderHeader, renderItem]);
    const data = React.useMemo(() => [HEADER_ITEM, SELECTOR_ITEM, ...items], [items]);
    return (_jsx(FlatList_INTERNAL
    // @ts-expect-error FlatList_INTERNAL ref type is wrong -sfn
    , { 
        // @ts-expect-error FlatList_INTERNAL ref type is wrong -sfn
        ref: flatListRef, data: data, keyExtractor: keyExtractor, renderItem: renderItemInternal, ListFooterComponent: ListFooterComponent, 
        // NOTE sticky header disabled on android due to major performance issues -prf
        stickyHeaderIndices: isAndroid ? undefined : STICKY_HEADER_INDICES, onScroll: onScroll, onEndReached: onEndReached, refreshControl: _jsx(RefreshControl, { refreshing: refreshing, onRefresh: onRefresh, tintColor: pal.colors.text }), onEndReachedThreshold: 0.6, contentContainerStyle: s.contentContainer, removeClippedSubviews: true, scrollIndicatorInsets: { right: 1 } }));
});
export function Selector({ selectedIndex, items, onSelect, }) {
    const pal = usePalette('default');
    const borderColor = useColorSchemeStyle({ borderColor: colors.black }, { borderColor: colors.white });
    const onPressItem = (index) => {
        onSelect?.(index);
    };
    return (_jsx(View, { style: {
            width: '100%',
            backgroundColor: pal.colors.background,
        }, children: _jsx(ScrollView, { testID: "selector", horizontal: true, showsHorizontalScrollIndicator: false, children: _jsx(View, { style: [pal.view, styles.outer], children: items.map((item, i) => {
                    const selected = i === selectedIndex;
                    return (_jsx(Pressable, { testID: `selector-${i}`, onPress: () => onPressItem(i), accessibilityLabel: item, accessibilityHint: `Selects ${item}`, children: _jsx(View, { style: [
                                styles.item,
                                selected && styles.itemSelected,
                                borderColor,
                            ], children: _jsx(Text, { style: selected
                                    ? [styles.labelSelected, pal.text]
                                    : [styles.label, pal.textLight], children: item }) }) }, item));
                }) }) }) }));
}
const styles = StyleSheet.create({
    outer: {
        flexDirection: 'row',
        paddingHorizontal: 14,
    },
    item: {
        marginRight: 14,
        paddingHorizontal: 10,
        paddingTop: 8,
        paddingBottom: 12,
    },
    itemSelected: {
        borderBottomWidth: 3,
    },
    label: {
        fontWeight: '600',
    },
    labelSelected: {
        fontWeight: '600',
    },
    underline: {
        position: 'absolute',
        height: 4,
        bottom: 0,
    },
});
//# sourceMappingURL=ViewSelector.js.map