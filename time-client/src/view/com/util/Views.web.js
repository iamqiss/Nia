import { jsx as _jsx } from "react/jsx-runtime";
/**
 * In the Web build, we center all content so that it mirrors the
 * mobile experience (a single narrow column). We then place a UI
 * shell around the content if you're in desktop.
 *
 * Because scrolling is handled by components deep in the hierarchy,
 * we can't just wrap the top-level element with a max width. The
 * centering has to be done at the ScrollView.
 *
 * These components wrap the RN ScrollView-based components to provide
 * consistent layout. It also provides <CenteredView> for views that
 * need to match layout but which aren't scrolled.
 */
import React from 'react';
import { StyleSheet, View, } from 'react-native';
import Animated from 'react-native-reanimated';
import { usePalette } from '#/lib/hooks/usePalette';
import { useWebMediaQueries } from '#/lib/hooks/useWebMediaQueries';
import { addStyle } from '#/lib/styles';
import { useLayoutBreakpoints } from '#/alf';
import { useDialogContext } from '#/components/Dialog';
import { CENTER_COLUMN_OFFSET } from '#/components/Layout';
/**
 * @deprecated use `Layout` components
 */
export const CenteredView = React.forwardRef(function CenteredView({ style, topBorder, ...props }, ref) {
    const pal = usePalette('default');
    const { isMobile } = useWebMediaQueries();
    const { centerColumnOffset } = useLayoutBreakpoints();
    const { isWithinDialog } = useDialogContext();
    if (!isMobile) {
        style = addStyle(style, styles.container);
    }
    if (centerColumnOffset && !isWithinDialog) {
        style = addStyle(style, styles.containerOffset);
    }
    if (topBorder) {
        style = addStyle(style, {
            borderTopWidth: 1,
        });
        style = addStyle(style, pal.border);
    }
    return _jsx(View, { ref: ref, style: style, ...props });
});
export const FlatList_INTERNAL = React.forwardRef(function FlatListImpl({ contentContainerStyle, style, contentOffset, desktopFixedHeight, ...props }, ref) {
    const { isMobile } = useWebMediaQueries();
    const { centerColumnOffset } = useLayoutBreakpoints();
    const { isWithinDialog } = useDialogContext();
    if (!isMobile) {
        contentContainerStyle = addStyle(contentContainerStyle, styles.containerScroll);
    }
    if (centerColumnOffset && !isWithinDialog) {
        style = addStyle(style, styles.containerOffset);
    }
    if (contentOffset && contentOffset?.y !== 0) {
        // NOTE
        // we use paddingTop & contentOffset to space around the floating header
        // but reactnative web puts the paddingTop on the wrong element (style instead of the contentContainer)
        // so we manually correct it here
        // -prf
        style = addStyle(style, {
            paddingTop: 0,
        });
        contentContainerStyle = addStyle(contentContainerStyle, {
            paddingTop: Math.abs(contentOffset.y),
        });
    }
    if (desktopFixedHeight) {
        if (typeof desktopFixedHeight === 'number') {
            // @ts-expect-error Web only -prf
            style = addStyle(style, {
                height: `calc(100vh - ${desktopFixedHeight}px)`,
            });
        }
        else {
            style = addStyle(style, styles.fixedHeight);
        }
        if (!isMobile) {
            // NOTE
            // react native web produces *three* wrapping divs
            // the first two use the `style` prop and the innermost uses the
            // `contentContainerStyle`. Unfortunately the stable-gutter style
            // needs to be applied to only the "middle" of these. To hack
            // around this, we set data-stable-gutters which can then be
            // styled in our external CSS.
            // -prf
            // @ts-expect-error web only -prf
            props.dataSet = props.dataSet || {};
            // @ts-expect-error web only -prf
            props.dataSet.stableGutters = '1';
        }
    }
    return (_jsx(Animated.FlatList, { ref: ref, contentContainerStyle: [styles.contentContainer, contentContainerStyle], style: style, contentOffset: contentOffset, ...props }));
});
/**
 * @deprecated use `Layout` components
 */
export const ScrollView = React.forwardRef(function ScrollViewImpl({ contentContainerStyle, ...props }, ref) {
    const { isMobile } = useWebMediaQueries();
    const { centerColumnOffset } = useLayoutBreakpoints();
    if (!isMobile) {
        contentContainerStyle = addStyle(contentContainerStyle, styles.containerScroll);
    }
    if (centerColumnOffset) {
        contentContainerStyle = addStyle(contentContainerStyle, styles.containerOffset);
    }
    return (_jsx(Animated.ScrollView, { contentContainerStyle: [styles.contentContainer, contentContainerStyle], ref: ref, ...props }));
});
const styles = StyleSheet.create({
    contentContainer: {
        // @ts-expect-error web only
        minHeight: '100vh',
    },
    container: {
        width: '100%',
        maxWidth: 600,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    containerOffset: {
        transform: [{ translateX: CENTER_COLUMN_OFFSET }],
    },
    containerScroll: {
        width: '100%',
        maxWidth: 600,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    fixedHeight: {
        // @ts-expect-error web only
        height: '100vh',
    },
});
//# sourceMappingURL=Views.web.js.map