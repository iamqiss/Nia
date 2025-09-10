import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { isValidElement, memo, startTransition, useRef, } from 'react';
import { StyleSheet, View, } from 'react-native';
import {} from 'react-native-reanimated/lib/typescript/hook/commonTypes';
import { batchedUpdates } from '#/lib/batchedUpdates';
import { useNonReactiveCallback } from '#/lib/hooks/useNonReactiveCallback';
import { useScrollHandlers } from '#/lib/ScrollContext';
import { addStyle } from '#/lib/styles';
import * as Layout from '#/components/Layout';
const ON_ITEM_SEEN_WAIT_DURATION = 0.5e3; // when we consider post to  be "seen"
const ON_ITEM_SEEN_INTERSECTION_OPTS = {
    rootMargin: '-200px 0px -200px 0px',
}; // post must be 200px visible to be "seen"
function ListImpl({ ListHeaderComponent, ListFooterComponent, ListEmptyComponent, disableFullWindowScroll, contentContainerStyle, data, desktopFixedHeight, headerOffset, keyExtractor, refreshing: _unsupportedRefreshing, onStartReached, onStartReachedThreshold = 2, onEndReached, onEndReachedThreshold = 2, onRefresh: _unsupportedOnRefresh, onScrolledDownChange, onContentSizeChange, onItemSeen, renderItem, extraData, style, ...props }, ref) {
    const contextScrollHandlers = useScrollHandlers();
    const isEmpty = !data || data.length === 0;
    let headerComponent = null;
    if (ListHeaderComponent != null) {
        if (isValidElement(ListHeaderComponent)) {
            headerComponent = ListHeaderComponent;
        }
        else {
            // @ts-ignore Nah it's fine.
            headerComponent = _jsx(ListHeaderComponent, {});
        }
    }
    let footerComponent = null;
    if (ListFooterComponent != null) {
        if (isValidElement(ListFooterComponent)) {
            footerComponent = ListFooterComponent;
        }
        else {
            // @ts-ignore Nah it's fine.
            footerComponent = _jsx(ListFooterComponent, {});
        }
    }
    let emptyComponent = null;
    if (ListEmptyComponent != null) {
        if (isValidElement(ListEmptyComponent)) {
            emptyComponent = ListEmptyComponent;
        }
        else {
            // @ts-ignore Nah it's fine.
            emptyComponent = _jsx(ListEmptyComponent, {});
        }
    }
    if (headerOffset != null) {
        style = addStyle(style, {
            paddingTop: headerOffset,
        });
    }
    const getScrollableNode = React.useCallback(() => {
        if (disableFullWindowScroll) {
            const element = nativeRef.current;
            if (!element)
                return;
            return {
                get scrollWidth() {
                    return element.scrollWidth;
                },
                get scrollHeight() {
                    return element.scrollHeight;
                },
                get clientWidth() {
                    return element.clientWidth;
                },
                get clientHeight() {
                    return element.clientHeight;
                },
                get scrollY() {
                    return element.scrollTop;
                },
                get scrollX() {
                    return element.scrollLeft;
                },
                scrollTo(options) {
                    element.scrollTo(options);
                },
                scrollBy(options) {
                    element.scrollBy(options);
                },
                addEventListener(event, handler) {
                    element.addEventListener(event, handler);
                },
                removeEventListener(event, handler) {
                    element.removeEventListener(event, handler);
                },
            };
        }
        else {
            return {
                get scrollWidth() {
                    return document.documentElement.scrollWidth;
                },
                get scrollHeight() {
                    return document.documentElement.scrollHeight;
                },
                get clientWidth() {
                    return window.innerWidth;
                },
                get clientHeight() {
                    return window.innerHeight;
                },
                get scrollY() {
                    return window.scrollY;
                },
                get scrollX() {
                    return window.scrollX;
                },
                scrollTo(options) {
                    window.scrollTo(options);
                },
                scrollBy(options) {
                    window.scrollBy(options);
                },
                addEventListener(event, handler) {
                    window.addEventListener(event, handler);
                },
                removeEventListener(event, handler) {
                    window.removeEventListener(event, handler);
                },
            };
        }
    }, [disableFullWindowScroll]);
    const nativeRef = React.useRef(null);
    React.useImperativeHandle(ref, () => ({
        scrollToTop() {
            getScrollableNode()?.scrollTo({ top: 0 });
        },
        scrollToOffset({ animated, offset, }) {
            getScrollableNode()?.scrollTo({
                left: 0,
                top: offset,
                behavior: animated ? 'smooth' : 'instant',
            });
        },
        scrollToEnd({ animated = true }) {
            const element = getScrollableNode();
            element?.scrollTo({
                left: 0,
                top: element.scrollHeight,
                behavior: animated ? 'smooth' : 'instant',
            });
        },
    }), // TODO: Better types.
    [getScrollableNode]);
    // --- onContentSizeChange, maintainVisibleContentPosition ---
    const containerRef = useRef(null);
    useResizeObserver(containerRef, onContentSizeChange);
    // --- onScroll ---
    const [isInsideVisibleTree, setIsInsideVisibleTree] = React.useState(false);
    const handleScroll = useNonReactiveCallback(() => {
        if (!isInsideVisibleTree)
            return;
        const element = getScrollableNode();
        contextScrollHandlers.onScroll?.({
            contentOffset: {
                x: Math.max(0, element?.scrollX ?? 0),
                y: Math.max(0, element?.scrollY ?? 0),
            },
            layoutMeasurement: {
                width: element?.clientWidth,
                height: element?.clientHeight,
            },
            contentSize: {
                width: element?.scrollWidth,
                height: element?.scrollHeight,
            },
        }, null);
    });
    React.useEffect(() => {
        if (!isInsideVisibleTree) {
            // Prevents hidden tabs from firing scroll events.
            // Only one list is expected to be firing these at a time.
            return;
        }
        const element = getScrollableNode();
        element?.addEventListener('scroll', handleScroll);
        return () => {
            element?.removeEventListener('scroll', handleScroll);
        };
    }, [
        isInsideVisibleTree,
        handleScroll,
        disableFullWindowScroll,
        getScrollableNode,
    ]);
    // --- onScrolledDownChange ---
    const isScrolledDown = useRef(false);
    function handleAboveTheFoldVisibleChange(isAboveTheFold) {
        const didScrollDown = !isAboveTheFold;
        if (isScrolledDown.current !== didScrollDown) {
            isScrolledDown.current = didScrollDown;
            startTransition(() => {
                onScrolledDownChange?.(didScrollDown);
            });
        }
    }
    // --- onStartReached ---
    const onHeadVisibilityChange = useNonReactiveCallback((isHeadVisible) => {
        if (isHeadVisible) {
            onStartReached?.({
                distanceFromStart: onStartReachedThreshold || 0,
            });
        }
    });
    // --- onEndReached ---
    const onTailVisibilityChange = useNonReactiveCallback((isTailVisible) => {
        if (isTailVisible) {
            onEndReached?.({
                distanceFromEnd: onEndReachedThreshold || 0,
            });
        }
    });
    return (_jsxs(View, { ...props, style: [
            style,
            disableFullWindowScroll && {
                flex: 1,
                // @ts-expect-error web only
                'overflow-y': 'scroll',
            },
        ], ref: nativeRef, children: [_jsx(Visibility, { onVisibleChange: setIsInsideVisibleTree, style: 
                // This has position: fixed, so it should always report as visible
                // unless we're within a display: none tree (like a hidden tab).
                styles.parentTreeVisibilityDetector }), _jsx(Layout.Center, { children: _jsxs(View, { ref: containerRef, style: [
                        contentContainerStyle,
                        desktopFixedHeight ? styles.minHeightViewport : null,
                    ], children: [_jsx(Visibility, { root: disableFullWindowScroll ? nativeRef : null, onVisibleChange: handleAboveTheFoldVisibleChange, style: [styles.aboveTheFoldDetector, { height: headerOffset }] }), onStartReached && !isEmpty && (_jsx(EdgeVisibility, { root: disableFullWindowScroll ? nativeRef : null, onVisibleChange: onHeadVisibilityChange, topMargin: (onStartReachedThreshold ?? 0) * 100 + '%', containerRef: containerRef })), headerComponent, isEmpty
                            ? emptyComponent
                            : data?.map((item, index) => {
                                const key = keyExtractor(item, index);
                                return (_jsx(Row, { item: item, index: index, renderItem: renderItem, extraData: extraData, onItemSeen: onItemSeen }, key));
                            }), onEndReached && !isEmpty && (_jsx(EdgeVisibility, { root: disableFullWindowScroll ? nativeRef : null, onVisibleChange: onTailVisibilityChange, bottomMargin: (onEndReachedThreshold ?? 0) * 100 + '%', containerRef: containerRef })), footerComponent] }) })] }));
}
function EdgeVisibility({ root, topMargin, bottomMargin, containerRef, onVisibleChange, }) {
    const [containerHeight, setContainerHeight] = React.useState(0);
    useResizeObserver(containerRef, (w, h) => {
        setContainerHeight(h);
    });
    return (_jsx(Visibility, { root: root, topMargin: topMargin, bottomMargin: bottomMargin, onVisibleChange: onVisibleChange }, containerHeight));
}
function useResizeObserver(ref, onResize) {
    const handleResize = useNonReactiveCallback(onResize ?? (() => { }));
    const isActive = !!onResize;
    React.useEffect(() => {
        if (!isActive) {
            return;
        }
        const resizeObserver = new ResizeObserver(entries => {
            batchedUpdates(() => {
                for (let entry of entries) {
                    const rect = entry.contentRect;
                    handleResize(rect.width, rect.height);
                }
            });
        });
        const node = ref.current;
        resizeObserver.observe(node);
        return () => {
            resizeObserver.unobserve(node);
        };
    }, [handleResize, isActive, ref]);
}
let Row = function RowImpl({ item, index, renderItem, extraData: _unused, onItemSeen, }) {
    const rowRef = React.useRef(null);
    const intersectionTimeout = React.useRef(undefined);
    const handleIntersection = useNonReactiveCallback((entries) => {
        batchedUpdates(() => {
            if (!onItemSeen) {
                return;
            }
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!intersectionTimeout.current) {
                        intersectionTimeout.current = setTimeout(() => {
                            intersectionTimeout.current = undefined;
                            onItemSeen(item);
                        }, ON_ITEM_SEEN_WAIT_DURATION);
                    }
                }
                else {
                    if (intersectionTimeout.current) {
                        clearTimeout(intersectionTimeout.current);
                        intersectionTimeout.current = undefined;
                    }
                }
            });
        });
    });
    React.useEffect(() => {
        if (!onItemSeen) {
            return;
        }
        const observer = new IntersectionObserver(handleIntersection, ON_ITEM_SEEN_INTERSECTION_OPTS);
        const row = rowRef.current;
        observer.observe(row);
        return () => {
            observer.unobserve(row);
        };
    }, [handleIntersection, onItemSeen]);
    if (!renderItem) {
        return null;
    }
    return (_jsx(View, { ref: rowRef, children: renderItem({ item, index, separators: null }) }));
};
Row = React.memo(Row);
let Visibility = ({ root, topMargin = '0px', bottomMargin = '0px', onVisibleChange, style, }) => {
    const tailRef = React.useRef(null);
    const isIntersecting = React.useRef(false);
    const handleIntersection = useNonReactiveCallback((entries) => {
        batchedUpdates(() => {
            entries.forEach(entry => {
                if (entry.isIntersecting !== isIntersecting.current) {
                    isIntersecting.current = entry.isIntersecting;
                    onVisibleChange(entry.isIntersecting);
                }
            });
        });
    });
    React.useEffect(() => {
        const observer = new IntersectionObserver(handleIntersection, {
            root: root?.current ?? null,
            rootMargin: `${topMargin} 0px ${bottomMargin} 0px`,
        });
        const tail = tailRef.current;
        observer.observe(tail);
        return () => {
            observer.unobserve(tail);
        };
    }, [bottomMargin, handleIntersection, topMargin, root]);
    return (_jsx(View, { ref: tailRef, style: addStyle(styles.visibilityDetector, style) }));
};
Visibility = React.memo(Visibility);
export const List = memo(React.forwardRef(ListImpl));
// https://stackoverflow.com/questions/7944460/detect-safari-browser
const styles = StyleSheet.create({
    minHeightViewport: {
        // @ts-ignore web only
        minHeight: '100vh',
    },
    parentTreeVisibilityDetector: {
        // @ts-ignore web only
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    aboveTheFoldDetector: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        // Bottom is dynamic.
    },
    visibilityDetector: {
        pointerEvents: 'none',
        zIndex: -1,
    },
});
//# sourceMappingURL=List.web.js.map