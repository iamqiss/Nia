import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { View, } from 'react-native';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useNonReactiveCallback } from '#/lib/hooks/useNonReactiveCallback';
import { isWeb } from '#/platform/detection';
import { DraggableScrollView } from '#/view/com/pager/DraggableScrollView';
import { atoms as a, tokens, useTheme, web } from '#/alf';
import { transparentifyColor } from '#/alf/util/colorGeneration';
import { Button, ButtonIcon } from '#/components/Button';
import { ArrowLeft_Stroke2_Corner0_Rounded as ArrowLeft, ArrowRight_Stroke2_Corner0_Rounded as ArrowRight, } from '#/components/icons/Arrow';
import { Text } from '#/components/Typography';
/**
 * Tab component that automatically scrolls the selected tab into view - used for interests
 * in the Find Follows dialog, Explore screen, etc.
 */
export function InterestTabs({ onSelectTab, interests, selectedInterest, disabled, interestsDisplayNames, TabComponent = Tab, contentContainerStyle, gutterWidth = tokens.space.lg, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const listRef = useRef(null);
    const [totalWidth, setTotalWidth] = useState(0);
    const [scrollX, setScrollX] = useState(0);
    const [contentWidth, setContentWidth] = useState(0);
    const pendingTabOffsets = useRef([]);
    const [tabOffsets, setTabOffsets] = useState([]);
    const onInitialLayout = useNonReactiveCallback(() => {
        const index = interests.indexOf(selectedInterest);
        scrollIntoViewIfNeeded(index);
    });
    useEffect(() => {
        if (tabOffsets) {
            onInitialLayout();
        }
    }, [tabOffsets, onInitialLayout]);
    function scrollIntoViewIfNeeded(index) {
        const btnLayout = tabOffsets[index];
        if (!btnLayout)
            return;
        listRef.current?.scrollTo({
            // centered
            x: btnLayout.x - (totalWidth / 2 - btnLayout.width / 2),
            animated: true,
        });
    }
    function handleSelectTab(index) {
        const tab = interests[index];
        onSelectTab(tab);
        scrollIntoViewIfNeeded(index);
    }
    function handleTabLayout(index, x, width) {
        if (!tabOffsets.length) {
            pendingTabOffsets.current[index] = { x, width };
            if (pendingTabOffsets.current.length === interests.length) {
                setTabOffsets(pendingTabOffsets.current);
            }
        }
    }
    const canScrollLeft = scrollX > 0;
    const canScrollRight = Math.ceil(scrollX) < contentWidth - totalWidth;
    const cleanupRef = useRef(null);
    function scrollLeft() {
        if (isContinuouslyScrollingRef.current) {
            return;
        }
        if (listRef.current && canScrollLeft) {
            const newScrollX = Math.max(0, scrollX - 200);
            listRef.current.scrollTo({ x: newScrollX, animated: true });
        }
    }
    function scrollRight() {
        if (isContinuouslyScrollingRef.current) {
            return;
        }
        if (listRef.current && canScrollRight) {
            const maxScroll = contentWidth - totalWidth;
            const newScrollX = Math.min(maxScroll, scrollX + 200);
            listRef.current.scrollTo({ x: newScrollX, animated: true });
        }
    }
    const isContinuouslyScrollingRef = useRef(false);
    function startContinuousScroll(direction) {
        // Clear any existing continuous scroll
        if (cleanupRef.current) {
            cleanupRef.current();
        }
        let holdTimeout = null;
        let animationFrame = null;
        let isActive = true;
        isContinuouslyScrollingRef.current = false;
        const cleanup = () => {
            isActive = false;
            if (holdTimeout)
                clearTimeout(holdTimeout);
            if (animationFrame)
                cancelAnimationFrame(animationFrame);
            cleanupRef.current = null;
            // Reset flag after a delay to prevent onPress from firing
            setTimeout(() => {
                isContinuouslyScrollingRef.current = false;
            }, 100);
        };
        cleanupRef.current = cleanup;
        // Start continuous scrolling after hold delay
        holdTimeout = setTimeout(() => {
            if (!isActive)
                return;
            isContinuouslyScrollingRef.current = true;
            let currentScrollPosition = scrollX;
            const scroll = () => {
                if (!isActive || !listRef.current)
                    return;
                const scrollAmount = 3;
                const maxScroll = contentWidth - totalWidth;
                let newScrollX;
                let canContinue = false;
                if (direction === 'left' && currentScrollPosition > 0) {
                    newScrollX = Math.max(0, currentScrollPosition - scrollAmount);
                    canContinue = newScrollX > 0;
                }
                else if (direction === 'right' && currentScrollPosition < maxScroll) {
                    newScrollX = Math.min(maxScroll, currentScrollPosition + scrollAmount);
                    canContinue = newScrollX < maxScroll;
                }
                else {
                    return;
                }
                currentScrollPosition = newScrollX;
                listRef.current.scrollTo({ x: newScrollX, animated: false });
                if (canContinue && isActive) {
                    animationFrame = requestAnimationFrame(scroll);
                }
            };
            scroll();
        }, 500);
    }
    function stopContinuousScroll() {
        if (cleanupRef.current) {
            cleanupRef.current();
        }
    }
    useEffect(() => {
        return () => {
            if (cleanupRef.current) {
                cleanupRef.current();
            }
        };
    }, []);
    return (_jsxs(View, { style: [a.relative, a.flex_row], children: [_jsx(DraggableScrollView, { ref: listRef, contentContainerStyle: [
                    a.gap_sm,
                    { paddingHorizontal: gutterWidth },
                    contentContainerStyle,
                ], showsHorizontalScrollIndicator: false, decelerationRate: "fast", snapToOffsets: tabOffsets.length === interests.length
                    ? tabOffsets.map(o => o.x - tokens.space.xl)
                    : undefined, onLayout: evt => setTotalWidth(evt.nativeEvent.layout.width), onContentSizeChange: width => setContentWidth(width), onScroll: evt => {
                    const newScrollX = evt.nativeEvent.contentOffset.x;
                    setScrollX(newScrollX);
                }, scrollEventThrottle: 16, children: interests.map((interest, i) => {
                    const active = interest === selectedInterest && !disabled;
                    return (_jsx(TabComponent, { onSelectTab: handleSelectTab, active: active, index: i, interest: interest, interestsDisplayName: interestsDisplayNames[interest], onLayout: handleTabLayout }, interest));
                }) }), isWeb && canScrollLeft && (_jsx(View, { style: [
                    a.absolute,
                    a.top_0,
                    a.left_0,
                    a.bottom_0,
                    a.justify_center,
                    { paddingLeft: gutterWidth },
                    a.pr_md,
                    a.z_10,
                    web({
                        background: `linear-gradient(to right,  ${t.atoms.bg.backgroundColor} 0%, ${t.atoms.bg.backgroundColor} 70%, ${transparentifyColor(t.atoms.bg.backgroundColor, 0)} 100%)`,
                    }),
                ], children: _jsx(Button, { label: _(msg `Scroll left`), onPress: scrollLeft, onPressIn: () => startContinuousScroll('left'), onPressOut: stopContinuousScroll, color: "secondary", size: "small", style: [
                        a.border,
                        t.atoms.border_contrast_low,
                        t.atoms.bg,
                        a.h_full,
                        { aspectRatio: 1 },
                        a.rounded_full,
                    ], children: _jsx(ButtonIcon, { icon: ArrowLeft }) }) })), isWeb && canScrollRight && (_jsx(View, { style: [
                    a.absolute,
                    a.top_0,
                    a.right_0,
                    a.bottom_0,
                    a.justify_center,
                    { paddingRight: gutterWidth },
                    a.pl_md,
                    a.z_10,
                    web({
                        background: `linear-gradient(to left, ${t.atoms.bg.backgroundColor} 0%, ${t.atoms.bg.backgroundColor} 70%, ${transparentifyColor(t.atoms.bg.backgroundColor, 0)} 100%)`,
                    }),
                ], children: _jsx(Button, { label: _(msg `Scroll right`), onPress: scrollRight, onPressIn: () => startContinuousScroll('right'), onPressOut: stopContinuousScroll, color: "secondary", size: "small", style: [
                        a.border,
                        t.atoms.border_contrast_low,
                        t.atoms.bg,
                        a.h_full,
                        { aspectRatio: 1 },
                        a.rounded_full,
                    ], children: _jsx(ButtonIcon, { icon: ArrowRight }) }) }))] }));
}
function Tab({ onSelectTab, interest, active, index, interestsDisplayName, onLayout, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const label = active
        ? _(msg({
            message: `"${interestsDisplayName}" category (active)`,
            comment: 'Accessibility label for a category (e.g. Art, Video Games, Sports, etc.) that shows suggested accounts for the user to follow. The tab is currently selected.',
        }))
        : _(msg({
            message: `Select "${interestsDisplayName}" category`,
            comment: 'Accessibility label for a category (e.g. Art, Video Games, Sports, etc.) that shows suggested accounts for the user to follow. The tab is not currently active and can be selected.',
        }));
    return (_jsx(View, { onLayout: e => onLayout(index, e.nativeEvent.layout.x, e.nativeEvent.layout.width), children: _jsx(Button, { label: label, onPress: () => onSelectTab(index), 
            // disable focus ring, we handle it
            style: web({ outline: 'none' }), children: ({ hovered, pressed, focused }) => (_jsx(View, { style: [
                    a.rounded_full,
                    a.px_lg,
                    a.py_sm,
                    a.border,
                    active || hovered || pressed
                        ? [t.atoms.bg_contrast_25, t.atoms.border_contrast_medium]
                        : focused
                            ? {
                                borderColor: t.palette.primary_300,
                                backgroundColor: t.palette.primary_25,
                            }
                            : [t.atoms.bg, t.atoms.border_contrast_low],
                ], children: _jsx(Text, { style: [
                        a.font_medium,
                        active || hovered || pressed
                            ? t.atoms.text
                            : t.atoms.text_contrast_medium,
                    ], children: interestsDisplayName }) })) }) }, interest));
}
export function boostInterests(boosts) {
    return (_a, _b) => {
        const indexA = boosts?.indexOf(_a) ?? -1;
        const indexB = boosts?.indexOf(_b) ?? -1;
        const rankA = indexA === -1 ? Infinity : indexA;
        const rankB = indexB === -1 ? Infinity : indexB;
        return rankA - rankB;
    };
}
//# sourceMappingURL=InterestTabs.js.map