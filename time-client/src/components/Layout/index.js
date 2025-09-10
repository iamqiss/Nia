import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, memo, useContext, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import {} from 'react-native';
import { KeyboardAwareScrollView, } from 'react-native-keyboard-controller';
import Animated, { useAnimatedProps, } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isWeb } from '#/platform/detection';
import { useShellLayout } from '#/state/shell/shell-layout';
import { atoms as a, useBreakpoints, useLayoutBreakpoints, useTheme, web, } from '#/alf';
import { useDialogContext } from '#/components/Dialog';
import { CENTER_COLUMN_OFFSET, SCROLLBAR_OFFSET } from '#/components/Layout/const';
import { ScrollbarOffsetContext } from '#/components/Layout/context';
export * from '#/components/Layout/const';
export * as Header from '#/components/Layout/Header';
/**
 * Outermost component of every screen
 */
export const Screen = memo(function Screen({ style, noInsetTop, ...props }) {
    const { top } = useSafeAreaInsets();
    return (_jsxs(_Fragment, { children: [isWeb && _jsx(WebCenterBorders, {}), _jsx(View, { style: [a.util_screen_outer, { paddingTop: noInsetTop ? 0 : top }, style], ...props })] }));
});
/**
 * Default scroll view for simple pages
 */
export const Content = memo(forwardRef(function Content({ children, style, contentContainerStyle, ignoreTabletLayoutOffset, ...props }, ref) {
    const t = useTheme();
    const { footerHeight } = useShellLayout();
    const animatedProps = useAnimatedProps(() => {
        return {
            scrollIndicatorInsets: {
                bottom: footerHeight.get(),
                top: 0,
                right: 1,
            },
        };
    });
    return (_jsx(Animated.ScrollView, { ref: ref, id: "content", automaticallyAdjustsScrollIndicatorInsets: false, indicatorStyle: t.scheme === 'dark' ? 'white' : 'black', 
        // sets the scroll inset to the height of the footer
        animatedProps: animatedProps, style: [scrollViewStyles.common, style], contentContainerStyle: [
            scrollViewStyles.contentContainer,
            contentContainerStyle,
        ], ...props, children: isWeb ? (_jsx(Center, { ignoreTabletLayoutOffset: ignoreTabletLayoutOffset, children: children })) : (children) }));
}));
const scrollViewStyles = StyleSheet.create({
    common: {
        width: '100%',
    },
    contentContainer: {
        paddingBottom: 100,
    },
});
/**
 * Default scroll view for simple pages.
 *
 * BE SURE TO TEST THIS WHEN USING, it's untested as of writing this comment.
 */
export const KeyboardAwareContent = memo(function LayoutKeyboardAwareContent({ children, style, contentContainerStyle, ...props }) {
    return (_jsx(KeyboardAwareScrollView, { style: [scrollViewStyles.common, style], contentContainerStyle: [
            scrollViewStyles.contentContainer,
            contentContainerStyle,
        ], keyboardShouldPersistTaps: "handled", ...props, children: isWeb ? _jsx(Center, { children: children }) : children }));
});
/**
 * Utility component to center content within the screen
 */
export const Center = memo(function LayoutCenter({ children, style, ignoreTabletLayoutOffset, ...props }) {
    const { isWithinOffsetView } = useContext(ScrollbarOffsetContext);
    const { gtMobile } = useBreakpoints();
    const { centerColumnOffset } = useLayoutBreakpoints();
    const { isWithinDialog } = useDialogContext();
    const ctx = useMemo(() => ({ isWithinOffsetView: true }), []);
    return (_jsx(View, { style: [
            a.w_full,
            a.mx_auto,
            gtMobile && {
                maxWidth: 600,
            },
            !isWithinOffsetView && {
                transform: [
                    {
                        translateX: centerColumnOffset &&
                            !ignoreTabletLayoutOffset &&
                            !isWithinDialog
                            ? CENTER_COLUMN_OFFSET
                            : 0,
                    },
                    { translateX: web(SCROLLBAR_OFFSET) ?? 0 },
                ],
            },
            style,
        ], ...props, children: _jsx(ScrollbarOffsetContext.Provider, { value: ctx, children: children }) }));
});
/**
 * Only used within `Layout.Screen`, not for reuse
 */
const WebCenterBorders = memo(function LayoutWebCenterBorders() {
    const t = useTheme();
    const { gtMobile } = useBreakpoints();
    const { centerColumnOffset } = useLayoutBreakpoints();
    return gtMobile ? (_jsx(View, { style: [
            a.fixed,
            a.inset_0,
            a.border_l,
            a.border_r,
            t.atoms.border_contrast_low,
            web({
                width: 602,
                left: '50%',
                transform: [
                    { translateX: '-50%' },
                    { translateX: centerColumnOffset ? CENTER_COLUMN_OFFSET : 0 },
                    ...a.scrollbar_offset.transform,
                ],
            }),
        ] })) : null;
});
//# sourceMappingURL=index.js.map