import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import {} from 'react';
import { View } from 'react-native';
import { useAnimatedRef } from 'react-native-reanimated';
import { Pager, } from '#/view/com/pager/Pager';
import { atoms as a, web } from '#/alf';
import * as Layout from '#/components/Layout';
import {} from '../util/List';
import { TabBar } from './TabBar';
export const PagerWithHeader = React.forwardRef(function PageWithHeaderImpl({ children, testID, items, isHeaderReady, renderHeader, initialPage, onPageSelected, onCurrentPageSelected, }, ref) {
    const [currentPage, setCurrentPage] = React.useState(0);
    const renderTabBar = React.useCallback((props) => {
        return (_jsx(PagerTabBar, { items: items, renderHeader: renderHeader, isHeaderReady: isHeaderReady, currentPage: currentPage, onCurrentPageSelected: onCurrentPageSelected, onSelect: props.onSelect, tabBarAnchor: props.tabBarAnchor, testID: testID }));
    }, [
        items,
        isHeaderReady,
        renderHeader,
        currentPage,
        onCurrentPageSelected,
        testID,
    ]);
    const onPageSelectedInner = React.useCallback((index) => {
        setCurrentPage(index);
        onPageSelected?.(index);
    }, [onPageSelected, setCurrentPage]);
    return (_jsx(Pager, { ref: ref, testID: testID, initialPage: initialPage, onPageSelected: onPageSelectedInner, renderTabBar: renderTabBar, children: toArray(children)
            .filter(Boolean)
            .map((child, i) => {
            const isReady = isHeaderReady;
            return (_jsx(View, { collapsable: false, style: {
                    display: isReady ? undefined : 'none',
                }, children: _jsx(PagerItem, { isFocused: i === currentPage, renderTab: child }) }, i));
        }) }));
});
let PagerTabBar = ({ currentPage, items, isHeaderReady, testID, renderHeader, onCurrentPageSelected, onSelect, tabBarAnchor, }) => {
    return (_jsxs(_Fragment, { children: [_jsx(Layout.Center, { children: renderHeader?.({ setMinimumHeight: noop }) }), tabBarAnchor, _jsx(Layout.Center, { style: [
                    a.z_10,
                    web([
                        a.sticky,
                        {
                            top: 0,
                            display: isHeaderReady ? undefined : 'none',
                        },
                    ]),
                ], children: _jsx(TabBar, { testID: testID, items: items, selectedPage: currentPage, onSelect: onSelect, onPressSelected: onCurrentPageSelected, dragProgress: undefined /* native-only */, dragState: undefined /* native-only */ }) })] }));
};
PagerTabBar = React.memo(PagerTabBar);
function PagerItem({ isFocused, renderTab, }) {
    const scrollElRef = useAnimatedRef();
    if (renderTab == null) {
        return null;
    }
    return renderTab({
        headerHeight: 0,
        isFocused,
        scrollElRef: scrollElRef,
    });
}
function toArray(v) {
    if (Array.isArray(v)) {
        return v;
    }
    return [v];
}
function noop() { }
//# sourceMappingURL=PagerWithHeader.web.js.map