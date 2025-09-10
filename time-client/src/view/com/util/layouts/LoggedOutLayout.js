import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ScrollView, StyleSheet, View } from 'react-native';
import { useColorSchemeStyle } from '#/lib/hooks/useColorSchemeStyle';
import { useIsKeyboardVisible } from '#/lib/hooks/useIsKeyboardVisible';
import { usePalette } from '#/lib/hooks/usePalette';
import { useWebMediaQueries } from '#/lib/hooks/useWebMediaQueries';
import { isWeb } from '#/platform/detection';
import { atoms as a } from '#/alf';
import { Text } from '../text/Text';
export const LoggedOutLayout = ({ leadin, title, description, children, scrollable, }) => {
    const { isMobile, isTabletOrMobile } = useWebMediaQueries();
    const pal = usePalette('default');
    const sideBg = useColorSchemeStyle(pal.viewLight, pal.view);
    const contentBg = useColorSchemeStyle(pal.view, {
        backgroundColor: pal.colors.background,
        borderColor: pal.colors.border,
        borderLeftWidth: 1,
    });
    const [isKeyboardVisible] = useIsKeyboardVisible();
    if (isMobile) {
        if (scrollable) {
            return (_jsx(ScrollView, { style: a.flex_1, keyboardShouldPersistTaps: "handled", keyboardDismissMode: "none", contentContainerStyle: [
                    { paddingBottom: isKeyboardVisible ? 300 : 0 },
                ], children: _jsx(View, { style: a.pt_md, children: children }) }));
        }
        else {
            return _jsx(View, { style: a.pt_md, children: children });
        }
    }
    return (_jsxs(View, { style: styles.container, children: [_jsxs(View, { style: [styles.side, sideBg], children: [_jsx(Text, { style: [
                            pal.textLight,
                            styles.leadinText,
                            isTabletOrMobile && styles.leadinTextSmall,
                        ], children: leadin }), _jsx(Text, { style: [
                            pal.link,
                            styles.titleText,
                            isTabletOrMobile && styles.titleTextSmall,
                        ], children: title }), _jsx(Text, { type: "2xl-medium", style: [pal.textLight, styles.descriptionText], children: description })] }), scrollable ? (_jsx(View, { style: [styles.scrollableContent, contentBg], children: _jsx(ScrollView, { style: a.flex_1, contentContainerStyle: styles.scrollViewContentContainer, keyboardShouldPersistTaps: "handled", keyboardDismissMode: "on-drag", children: _jsx(View, { style: [styles.contentWrapper, isWeb && a.my_auto], children: children }) }) })) : (_jsx(View, { style: [styles.content, contentBg], children: _jsx(View, { style: styles.contentWrapper, children: children }) }))] }));
};
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        // @ts-ignore web only
        height: '100vh',
    },
    side: {
        flex: 1,
        paddingHorizontal: 40,
        paddingBottom: 80,
        justifyContent: 'center',
    },
    content: {
        flex: 2,
        paddingHorizontal: 40,
        justifyContent: 'center',
    },
    scrollableContent: {
        flex: 2,
    },
    scrollViewContentContainer: {
        flex: 1,
        paddingHorizontal: 40,
    },
    leadinText: {
        fontSize: 36,
        fontWeight: '800',
        textAlign: 'right',
    },
    leadinTextSmall: {
        fontSize: 24,
    },
    titleText: {
        fontSize: 58,
        fontWeight: '800',
        textAlign: 'right',
    },
    titleTextSmall: {
        fontSize: 36,
    },
    descriptionText: {
        maxWidth: 400,
        marginTop: 10,
        marginLeft: 'auto',
        textAlign: 'right',
    },
    contentWrapper: {
        maxWidth: 600,
    },
});
//# sourceMappingURL=LoggedOutLayout.js.map