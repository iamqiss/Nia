import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Children, useCallback, useImperativeHandle, useRef, useState, } from 'react';
import { View } from 'react-native';
import { flushSync } from 'react-dom';
import { s } from '#/lib/styles';
import { atoms as a } from '#/alf';
export function Pager({ ref, children, initialPage = 0, renderTabBar, onPageSelected, }) {
    const [selectedPage, setSelectedPage] = useState(initialPage);
    const scrollYs = useRef([]);
    const anchorRef = useRef(null);
    useImperativeHandle(ref, () => ({
        setPage: (index) => {
            onTabBarSelect(index);
        },
    }));
    const onTabBarSelect = useCallback((index) => {
        const scrollY = window.scrollY;
        // We want to determine if the tabbar is already "sticking" at the top (in which
        // case we should preserve and restore scroll), or if it is somewhere below in the
        // viewport (in which case a scroll jump would be jarring). We determine this by
        // measuring where the "anchor" element is (which we place just above the tabbar).
        let anchorTop = anchorRef.current
            ? anchorRef.current.getBoundingClientRect().top
            : -scrollY; // If there's no anchor, treat the top of the page as one.
        const isSticking = anchorTop <= 5; // This would be 0 if browser scrollTo() was reliable.
        if (isSticking) {
            scrollYs.current[selectedPage] = window.scrollY;
        }
        else {
            scrollYs.current[selectedPage] = null;
        }
        flushSync(() => {
            setSelectedPage(index);
            onPageSelected?.(index);
        });
        if (isSticking) {
            const restoredScrollY = scrollYs.current[index];
            if (restoredScrollY != null) {
                window.scrollTo(0, restoredScrollY);
            }
            else {
                window.scrollTo(0, scrollY + anchorTop);
            }
        }
    }, [selectedPage, setSelectedPage, onPageSelected]);
    return (_jsxs(View, { style: s.hContentRegion, children: [renderTabBar({
                selectedPage,
                tabBarAnchor: _jsx(View, { ref: anchorRef }),
                onSelect: e => onTabBarSelect(e),
            }), Children.map(children, (child, i) => (_jsx(View, { style: selectedPage === i ? a.flex_1 : a.hidden, children: child }, `page-${i}`)))] }));
}
//# sourceMappingURL=Pager.web.js.map