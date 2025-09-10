import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback } from 'react';
import { ScrollView, StyleSheet, View, } from 'react-native';
import Animated, { interpolate, runOnJS, runOnUI, scrollTo, useAnimatedReaction, useAnimatedRef, useAnimatedStyle, useSharedValue, } from 'react-native-reanimated';
import { PressableWithHover } from '#/view/com/util/PressableWithHover';
import { BlockDrawerGesture } from '#/view/shell/BlockDrawerGesture';
import { atoms as a, useTheme } from '#/alf';
import { Text } from '#/components/Typography';
const ITEM_PADDING = 10;
const CONTENT_PADDING = 6;
// How much of the previous/next item we're requiring
// when deciding whether to scroll into view on tap.
const OFFSCREEN_ITEM_WIDTH = 20;
export function TabBar({ testID, selectedPage, items, onSelect, onPressSelected, dragProgress, dragState, }) {
    const t = useTheme();
    const scrollElRef = useAnimatedRef();
    const syncScrollState = useSharedValue('synced');
    const didInitialScroll = useSharedValue(false);
    const contentSize = useSharedValue(0);
    const containerSize = useSharedValue(0);
    const scrollX = useSharedValue(0);
    const layouts = useSharedValue([]);
    const textLayouts = useSharedValue([]);
    const itemsLength = items.length;
    const scrollToOffsetJS = useCallback((x) => {
        scrollElRef.current?.scrollTo({
            x,
            y: 0,
            animated: true,
        });
    }, [scrollElRef]);
    const indexToOffset = useCallback((index) => {
        'worklet';
        const layout = layouts.get()[index];
        const availableSize = containerSize.get() - 2 * CONTENT_PADDING;
        if (!layout) {
            // Should not happen, but fall back to equal sizes.
            const offsetPerPage = contentSize.get() - availableSize;
            return (index / (itemsLength - 1)) * offsetPerPage;
        }
        const freeSpace = availableSize - layout.width;
        const accumulatingOffset = interpolate(index, 
        // Gradually shift every next item to the left so that the first item
        // is positioned like "left: 0" but the last item is like "right: 0".
        [0, itemsLength - 1], [0, freeSpace], 'clamp');
        return layout.x - accumulatingOffset;
    }, [itemsLength, contentSize, containerSize, layouts]);
    const progressToOffset = useCallback((progress) => {
        'worklet';
        return interpolate(progress, [Math.floor(progress), Math.ceil(progress)], [
            indexToOffset(Math.floor(progress)),
            indexToOffset(Math.ceil(progress)),
        ], 'clamp');
    }, [indexToOffset]);
    // When we know the entire layout for the first time, scroll selection into view.
    useAnimatedReaction(() => layouts.get().length, (nextLayoutsLength, prevLayoutsLength) => {
        if (nextLayoutsLength !== prevLayoutsLength) {
            if (nextLayoutsLength === itemsLength &&
                didInitialScroll.get() === false) {
                didInitialScroll.set(true);
                const progress = dragProgress.get();
                const offset = progressToOffset(progress);
                // It's unclear why we need to go back to JS here. It seems iOS-specific.
                runOnJS(scrollToOffsetJS)(offset);
            }
        }
    });
    // When you swipe the pager, the tabbar should scroll automatically
    // as you're dragging the page and then even during deceleration.
    useAnimatedReaction(() => dragProgress.get(), (nextProgress, prevProgress) => {
        if (nextProgress !== prevProgress &&
            dragState.value !== 'idle' &&
            // This is only OK to do when we're 100% sure we're synced.
            // Otherwise, there would be a jump at the beginning of the swipe.
            syncScrollState.get() === 'synced') {
            const offset = progressToOffset(nextProgress);
            scrollTo(scrollElRef, offset, 0, false);
        }
    });
    // If the syncing is currently off but you've just finished swiping,
    // it's an opportunity to resync. It won't feel disruptive because
    // you're not directly interacting with the tabbar at the moment.
    useAnimatedReaction(() => dragState.value, (nextDragState, prevDragState) => {
        if (nextDragState !== prevDragState &&
            nextDragState === 'idle' &&
            (syncScrollState.get() === 'unsynced' ||
                syncScrollState.get() === 'needs-sync')) {
            const progress = dragProgress.get();
            const offset = progressToOffset(progress);
            scrollTo(scrollElRef, offset, 0, true);
            syncScrollState.set('synced');
        }
    });
    // When you press on the item, we'll scroll into view -- unless you previously
    // have scrolled the tabbar manually, in which case it'll re-sync on next press.
    const onPressUIThread = useCallback((index) => {
        'worklet';
        const itemLayout = layouts.get()[index];
        if (!itemLayout) {
            // Should not happen.
            return;
        }
        const leftEdge = itemLayout.x - OFFSCREEN_ITEM_WIDTH;
        const rightEdge = itemLayout.x + itemLayout.width + OFFSCREEN_ITEM_WIDTH;
        const scrollLeft = scrollX.get();
        const scrollRight = scrollLeft + containerSize.get();
        const scrollIntoView = leftEdge < scrollLeft || rightEdge > scrollRight;
        if (syncScrollState.get() === 'synced' ||
            syncScrollState.get() === 'needs-sync' ||
            scrollIntoView) {
            const offset = progressToOffset(index);
            scrollTo(scrollElRef, offset, 0, true);
            syncScrollState.set('synced');
        }
        else {
            // The item is already in view so it's disruptive to
            // scroll right now. Do it on the next opportunity.
            syncScrollState.set('needs-sync');
        }
    }, [
        syncScrollState,
        scrollElRef,
        scrollX,
        progressToOffset,
        containerSize,
        layouts,
    ]);
    const onItemLayout = useCallback((i, layout) => {
        'worklet';
        layouts.modify(ls => {
            ls[i] = layout;
            return ls;
        });
    }, [layouts]);
    const onTextLayout = useCallback((i, layout) => {
        'worklet';
        textLayouts.modify(ls => {
            ls[i] = layout;
            return ls;
        });
    }, [textLayouts]);
    const indicatorStyle = useAnimatedStyle(() => {
        if (!_WORKLET) {
            return { opacity: 0 };
        }
        const layoutsValue = layouts.get();
        const textLayoutsValue = textLayouts.get();
        if (layoutsValue.length !== itemsLength ||
            textLayoutsValue.length !== itemsLength) {
            return {
                opacity: 0,
            };
        }
        function getScaleX(index) {
            const textWidth = textLayoutsValue[index].width;
            const itemWidth = layoutsValue[index].width;
            const minIndicatorWidth = 45;
            const maxIndicatorWidth = itemWidth - 2 * CONTENT_PADDING;
            const indicatorWidth = Math.min(Math.max(minIndicatorWidth, textWidth), maxIndicatorWidth);
            return indicatorWidth / contentSize.get();
        }
        if (textLayoutsValue.length === 1) {
            return {
                opacity: 1,
                transform: [
                    {
                        scaleX: getScaleX(0),
                    },
                ],
            };
        }
        return {
            opacity: 1,
            transform: [
                {
                    translateX: interpolate(dragProgress.get(), layoutsValue.map((l, i) => {
                        'worklet';
                        return i;
                    }), layoutsValue.map(l => {
                        'worklet';
                        return l.x + l.width / 2 - contentSize.get() / 2;
                    })),
                },
                {
                    scaleX: interpolate(dragProgress.get(), textLayoutsValue.map((l, i) => {
                        'worklet';
                        return i;
                    }), textLayoutsValue.map((l, i) => {
                        'worklet';
                        return getScaleX(i);
                    })),
                },
            ],
        };
    });
    const onPressItem = useCallback((index) => {
        runOnUI(onPressUIThread)(index);
        onSelect?.(index);
        if (index === selectedPage) {
            onPressSelected?.(index);
        }
    }, [onSelect, selectedPage, onPressSelected, onPressUIThread]);
    return (_jsxs(View, { testID: testID, style: [t.atoms.bg, a.flex_row], accessibilityRole: "tablist", children: [_jsx(BlockDrawerGesture, { children: _jsx(ScrollView, { testID: `${testID}-selector`, horizontal: true, showsHorizontalScrollIndicator: false, ref: scrollElRef, contentContainerStyle: styles.contentContainer, onLayout: e => {
                        containerSize.set(e.nativeEvent.layout.width);
                    }, onScrollBeginDrag: () => {
                        // Remember that you've manually messed with the tabbar scroll.
                        // This will disable auto-adjustment until after next pager swipe or item tap.
                        syncScrollState.set('unsynced');
                    }, onScroll: e => {
                        scrollX.value = Math.round(e.nativeEvent.contentOffset.x);
                    }, children: _jsxs(Animated.View, { onLayout: e => {
                            contentSize.set(e.nativeEvent.layout.width);
                        }, style: { flexDirection: 'row', flexGrow: 1 }, children: [items.map((item, i) => {
                                return (_jsx(TabBarItem, { index: i, testID: testID, dragProgress: dragProgress, item: item, onPressItem: onPressItem, onItemLayout: onItemLayout, onTextLayout: onTextLayout }, i));
                            }), _jsx(Animated.View, { style: [
                                    indicatorStyle,
                                    {
                                        position: 'absolute',
                                        left: 0,
                                        bottom: 0,
                                        right: 0,
                                        borderBottomWidth: 2,
                                        borderColor: t.palette.primary_500,
                                    },
                                ] })] }) }) }), _jsx(View, { style: [t.atoms.border_contrast_low, styles.outerBottomBorder] })] }));
}
function TabBarItem({ index, testID, dragProgress, item, onPressItem, onItemLayout, onTextLayout, }) {
    const t = useTheme();
    const style = useAnimatedStyle(() => {
        if (!_WORKLET) {
            return { opacity: 0.7 };
        }
        return {
            opacity: interpolate(dragProgress.get(), [index - 1, index, index + 1], [0.7, 1, 0.7], 'clamp'),
        };
    });
    const handleLayout = useCallback((e) => {
        runOnUI(onItemLayout)(index, e.nativeEvent.layout);
    }, [index, onItemLayout]);
    const handleTextLayout = useCallback((e) => {
        runOnUI(onTextLayout)(index, e.nativeEvent.layout);
    }, [index, onTextLayout]);
    return (_jsx(View, { onLayout: handleLayout, style: { flexGrow: 1 }, children: _jsx(PressableWithHover, { testID: `${testID}-selector-${index}`, style: styles.item, hoverStyle: t.atoms.bg_contrast_25, onPress: () => onPressItem(index), accessibilityRole: "tab", children: _jsx(Animated.View, { style: [style, styles.itemInner], children: _jsx(Text, { emoji: true, testID: testID ? `${testID}-${item}` : undefined, style: [styles.itemText, t.atoms.text, a.text_md, a.font_bold], onLayout: handleTextLayout, children: item }) }) }) }));
}
const styles = StyleSheet.create({
    contentContainer: {
        flexGrow: 1,
        backgroundColor: 'transparent',
        paddingHorizontal: CONTENT_PADDING,
    },
    item: {
        flexGrow: 1,
        paddingTop: 10,
        paddingHorizontal: ITEM_PADDING,
        justifyContent: 'center',
    },
    itemInner: {
        alignItems: 'center',
        flexGrow: 1,
        paddingBottom: 10,
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },
    itemText: {
        lineHeight: 20,
        textAlign: 'center',
    },
    outerBottomBorder: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: '100%',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
});
//# sourceMappingURL=TabBar.js.map