import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, } from 'react-native';
import Animated, { runOnUI, scrollTo, useAnimatedRef, useAnimatedStyle, useSharedValue, } from 'react-native-reanimated';
import { useNonReactiveCallback } from '#/lib/hooks/useNonReactiveCallback';
import { ScrollProvider } from '#/lib/ScrollContext';
import { isIOS } from '#/platform/detection';
import { Pager, } from '#/view/com/pager/Pager';
import { useTheme } from '#/alf';
import {} from '../util/List';
import { PagerHeaderProvider } from './PagerHeaderContext';
import { TabBar } from './TabBar';
export function PagerWithHeader({ ref, children, testID, items, isHeaderReady, renderHeader, initialPage, onPageSelected, onCurrentPageSelected, allowHeaderOverScroll, }) {
    const [currentPage, setCurrentPage] = useState(0);
    const [tabBarHeight, setTabBarHeight] = useState(0);
    const [headerOnlyHeight, setHeaderOnlyHeight] = useState(0);
    const scrollY = useSharedValue(0);
    const headerHeight = headerOnlyHeight + tabBarHeight;
    // capture the header bar sizing
    const onTabBarLayout = useNonReactiveCallback((evt) => {
        const height = evt.nativeEvent.layout.height;
        if (height > 0) {
            // The rounding is necessary to prevent jumps on iOS
            setTabBarHeight(Math.round(height * 2) / 2);
        }
    });
    const onHeaderOnlyLayout = useNonReactiveCallback((height) => {
        if (height > 0) {
            // The rounding is necessary to prevent jumps on iOS
            setHeaderOnlyHeight(Math.round(height * 2) / 2);
        }
    });
    const renderTabBar = useCallback((props) => {
        return (_jsx(PagerHeaderProvider, { scrollY: scrollY, headerHeight: headerOnlyHeight, children: _jsx(PagerTabBar, { headerOnlyHeight: headerOnlyHeight, items: items, isHeaderReady: isHeaderReady, renderHeader: renderHeader, currentPage: currentPage, onCurrentPageSelected: onCurrentPageSelected, onTabBarLayout: onTabBarLayout, onHeaderOnlyLayout: onHeaderOnlyLayout, onSelect: props.onSelect, scrollY: scrollY, testID: testID, allowHeaderOverScroll: allowHeaderOverScroll, dragProgress: props.dragProgress, dragState: props.dragState }) }));
    }, [
        headerOnlyHeight,
        items,
        isHeaderReady,
        renderHeader,
        currentPage,
        onCurrentPageSelected,
        onTabBarLayout,
        onHeaderOnlyLayout,
        scrollY,
        testID,
        allowHeaderOverScroll,
    ]);
    const scrollRefs = useSharedValue([]);
    const registerRef = useCallback((scrollRef, atIndex) => {
        scrollRefs.modify(refs => {
            'worklet';
            refs[atIndex] = scrollRef;
            return refs;
        });
    }, [scrollRefs]);
    const lastForcedScrollY = useSharedValue(0);
    const adjustScrollForOtherPages = useCallback((scrollState) => {
        'worklet';
        if (scrollState !== 'dragging')
            return;
        const currentScrollY = scrollY.get();
        const forcedScrollY = Math.min(currentScrollY, headerOnlyHeight);
        if (lastForcedScrollY.get() !== forcedScrollY) {
            lastForcedScrollY.set(forcedScrollY);
            const refs = scrollRefs.get();
            for (let i = 0; i < refs.length; i++) {
                const scollRef = refs[i];
                if (i !== currentPage && scollRef != null) {
                    scrollTo(scollRef, 0, forcedScrollY, false);
                }
            }
        }
    }, [currentPage, headerOnlyHeight, lastForcedScrollY, scrollRefs, scrollY]);
    const onScrollWorklet = useCallback((e) => {
        'worklet';
        const nextScrollY = e.contentOffset.y;
        // HACK: onScroll is reporting some strange values on load (negative header height).
        // Highly improbable that you'd be overscrolled by over 400px -
        // in fact, I actually can't do it, so let's just ignore those. -sfn
        const isPossiblyInvalid = headerHeight > 0 && Math.round(nextScrollY * 2) / 2 === -headerHeight;
        if (!isPossiblyInvalid) {
            scrollY.set(nextScrollY);
        }
    }, [scrollY, headerHeight]);
    const onPageSelectedInner = useCallback((index) => {
        setCurrentPage(index);
        onPageSelected?.(index);
    }, [onPageSelected, setCurrentPage]);
    const onTabPressed = useCallback(() => {
        runOnUI(adjustScrollForOtherPages)('dragging');
    }, [adjustScrollForOtherPages]);
    return (_jsx(Pager, { ref: ref, testID: testID, initialPage: initialPage, onTabPressed: onTabPressed, onPageSelected: onPageSelectedInner, renderTabBar: renderTabBar, onPageScrollStateChanged: adjustScrollForOtherPages, children: toArray(children)
            .filter(Boolean)
            .map((child, i) => {
            const isReady = isHeaderReady && headerOnlyHeight > 0 && tabBarHeight > 0;
            return (_jsx(View, { collapsable: false, children: _jsx(PagerItem, { headerHeight: headerHeight, index: i, isReady: isReady, isFocused: i === currentPage, onScrollWorklet: i === currentPage ? onScrollWorklet : noop, registerRef: registerRef, renderTab: child }) }, i));
        }) }));
}
let PagerTabBar = ({ currentPage, headerOnlyHeight, isHeaderReady, items, scrollY, testID, renderHeader, onHeaderOnlyLayout, onTabBarLayout, onCurrentPageSelected, onSelect, allowHeaderOverScroll, dragProgress, dragState, }) => {
    const t = useTheme();
    const [minimumHeaderHeight, setMinimumHeaderHeight] = useState(0);
    const headerTransform = useAnimatedStyle(() => {
        const translateY = Math.min(scrollY.get(), Math.max(headerOnlyHeight - minimumHeaderHeight, 0)) * -1;
        return {
            transform: [
                {
                    translateY: allowHeaderOverScroll
                        ? translateY
                        : Math.min(translateY, 0),
                },
            ],
        };
    });
    const headerRef = useRef(null);
    return (_jsxs(Animated.View, { pointerEvents: isIOS ? 'auto' : 'box-none', style: [styles.tabBarMobile, headerTransform, t.atoms.bg], children: [_jsxs(View, { ref: headerRef, pointerEvents: isIOS ? 'auto' : 'box-none', collapsable: false, children: [renderHeader?.({ setMinimumHeight: setMinimumHeaderHeight }), 
                    // It wouldn't be enough to place `onLayout` on the parent node because
                    // this would risk measuring before `isHeaderReady` has turned `true`.
                    // Instead, we'll render a brand node conditionally and get fresh layout.
                    isHeaderReady && (_jsx(View
                    // It wouldn't be enough to do this in a `ref` of an effect because,
                    // even if `isHeaderReady` might have turned `true`, the associated
                    // layout might not have been performed yet on the native side.
                    , { 
                        // It wouldn't be enough to do this in a `ref` of an effect because,
                        // even if `isHeaderReady` might have turned `true`, the associated
                        // layout might not have been performed yet on the native side.
                        onLayout: () => {
                            // @ts-ignore
                            headerRef.current?.measure((_x, _y, _width, height) => {
                                onHeaderOnlyLayout(height);
                            });
                        } }))] }), _jsx(View, { onLayout: onTabBarLayout, style: {
                    // Render it immediately to measure it early since its size doesn't depend on the content.
                    // However, keep it invisible until the header above stabilizes in order to prevent jumps.
                    opacity: isHeaderReady ? 1 : 0,
                    pointerEvents: isHeaderReady ? 'auto' : 'none',
                }, children: _jsx(TabBar, { testID: testID, items: items, selectedPage: currentPage, onSelect: onSelect, onPressSelected: onCurrentPageSelected, dragProgress: dragProgress, dragState: dragState }) })] }));
};
PagerTabBar = memo(PagerTabBar);
function PagerItem({ headerHeight, index, isReady, isFocused, onScrollWorklet, renderTab, registerRef, }) {
    const scrollElRef = useAnimatedRef();
    useEffect(() => {
        registerRef(scrollElRef, index);
        return () => {
            registerRef(null, index);
        };
    }, [scrollElRef, registerRef, index]);
    if (!isReady || renderTab == null) {
        return null;
    }
    return (_jsx(ScrollProvider, { onScroll: onScrollWorklet, children: renderTab({
            headerHeight,
            isFocused,
            scrollElRef: scrollElRef,
        }) }));
}
const styles = StyleSheet.create({
    tabBarMobile: {
        position: 'absolute',
        zIndex: 1,
        top: 0,
        left: 0,
        width: '100%',
    },
});
function noop() {
    'worklet';
}
function toArray(v) {
    if (Array.isArray(v)) {
        return v;
    }
    return [v];
}
//# sourceMappingURL=PagerWithHeader.js.map