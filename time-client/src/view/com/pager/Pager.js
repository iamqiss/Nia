import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useCallback, useContext, useImperativeHandle, useMemo, useRef, useState, } from 'react';
import { View } from 'react-native';
import { DrawerGestureContext } from 'react-native-drawer-layout';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import PagerView, {} from 'react-native-pager-view';
import Animated, { runOnJS, useEvent, useHandler, useSharedValue, } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import { useSetDrawerSwipeDisabled } from '#/state/shell';
import { atoms as a, native } from '#/alf';
const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);
const MemoizedAnimatedPagerView = memo(AnimatedPagerView);
export function Pager({ ref, children, initialPage = 0, renderTabBar, onPageSelected: parentOnPageSelected, onTabPressed: parentOnTabPressed, onPageScrollStateChanged: parentOnPageScrollStateChanged, testID, }) {
    const [selectedPage, setSelectedPage] = useState(initialPage);
    const pagerView = useRef(null);
    const [isIdle, setIsIdle] = useState(true);
    const setDrawerSwipeDisabled = useSetDrawerSwipeDisabled();
    useFocusEffect(useCallback(() => {
        const canSwipeDrawer = selectedPage === 0 && isIdle;
        setDrawerSwipeDisabled(!canSwipeDrawer);
        return () => {
            setDrawerSwipeDisabled(false);
        };
    }, [setDrawerSwipeDisabled, selectedPage, isIdle]));
    useImperativeHandle(ref, () => ({
        setPage: (index) => {
            pagerView.current?.setPage(index);
        },
    }));
    const onPageSelectedJSThread = useCallback((nextPosition) => {
        setSelectedPage(nextPosition);
        parentOnPageSelected?.(nextPosition);
    }, [setSelectedPage, parentOnPageSelected]);
    const onTabBarSelect = useCallback((index) => {
        parentOnTabPressed?.(index);
        pagerView.current?.setPage(index);
    }, [pagerView, parentOnTabPressed]);
    const dragState = useSharedValue('idle');
    const dragProgress = useSharedValue(selectedPage);
    const didInit = useSharedValue(false);
    const handlePageScroll = usePagerHandlers({
        onPageScroll(e) {
            'worklet';
            if (didInit.get() === false) {
                // On iOS, there's a spurious scroll event with 0 position
                // even if a different page was supplied as the initial page.
                // Ignore it and wait for the first confirmed selection instead.
                return;
            }
            dragProgress.set(e.offset + e.position);
        },
        onPageScrollStateChanged(e) {
            'worklet';
            runOnJS(setIsIdle)(e.pageScrollState === 'idle');
            if (dragState.get() === 'idle' && e.pageScrollState === 'settling') {
                // This is a programmatic scroll on Android.
                // Stay "idle" to match iOS and avoid confusing downstream code.
                return;
            }
            dragState.set(e.pageScrollState);
            parentOnPageScrollStateChanged?.(e.pageScrollState);
        },
        onPageSelected(e) {
            'worklet';
            didInit.set(true);
            runOnJS(onPageSelectedJSThread)(e.position);
        },
    }, [parentOnPageScrollStateChanged]);
    return (_jsxs(View, { testID: testID, style: [a.flex_1, native(a.overflow_hidden)], children: [renderTabBar({
                selectedPage,
                onSelect: onTabBarSelect,
                dragProgress,
                dragState,
            }), _jsx(DrawerGestureRequireFail, { children: _jsx(MemoizedAnimatedPagerView, { ref: pagerView, style: a.flex_1, initialPage: initialPage, onPageScroll: handlePageScroll, children: children }) })] }));
}
function DrawerGestureRequireFail({ children }) {
    const drawerGesture = useContext(DrawerGestureContext);
    const nativeGesture = useMemo(() => {
        const gesture = Gesture.Native();
        if (drawerGesture) {
            gesture.requireExternalGestureToFail(drawerGesture);
        }
        return gesture;
    }, [drawerGesture]);
    return _jsx(GestureDetector, { gesture: nativeGesture, children: children });
}
function usePagerHandlers(handlers, dependencies) {
    const { doDependenciesDiffer } = useHandler(handlers, dependencies);
    const subscribeForEvents = [
        'onPageScroll',
        'onPageScrollStateChanged',
        'onPageSelected',
    ];
    return useEvent(event => {
        'worklet';
        const { onPageScroll, onPageScrollStateChanged, onPageSelected } = handlers;
        if (event.eventName.endsWith('onPageScroll')) {
            onPageScroll(event);
        }
        else if (event.eventName.endsWith('onPageScrollStateChanged')) {
            onPageScrollStateChanged(event);
        }
        else if (event.eventName.endsWith('onPageSelected')) {
            onPageSelected(event);
        }
    }, subscribeForEvents, doDependenciesDiffer);
}
//# sourceMappingURL=Pager.js.map