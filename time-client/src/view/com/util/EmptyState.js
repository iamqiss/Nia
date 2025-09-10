import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { StyleSheet, View } from 'react-native';
import {} from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon, } from '@fortawesome/react-native-fontawesome';
import { usePalette } from '#/lib/hooks/usePalette';
import { useWebMediaQueries } from '#/lib/hooks/useWebMediaQueries';
import { UserGroupIcon } from '#/lib/icons';
import { Growth_Stroke2_Corner0_Rounded as Growth } from '#/components/icons/Growth';
import { Text } from './text/Text';
export function EmptyState({ testID, icon, message, style, }) {
    const pal = usePalette('default');
    const { isTabletOrDesktop } = useWebMediaQueries();
    const iconSize = isTabletOrDesktop ? 64 : 48;
    return (_jsxs(View, { testID: testID, style: style, children: [_jsx(View, { style: [
                    styles.iconContainer,
                    isTabletOrDesktop && styles.iconContainerBig,
                    pal.viewLight,
                ], children: icon === 'user-group' ? (_jsx(UserGroupIcon, { size: iconSize })) : icon === 'growth' ? (_jsx(Growth, { width: iconSize, fill: pal.colors.emptyStateIcon })) : (_jsx(FontAwesomeIcon, { icon: icon, size: iconSize, style: [{ color: pal.colors.emptyStateIcon }] })) }), _jsx(Text, { type: "xl", style: [{ color: pal.colors.textLight }, styles.text], children: message })] }));
}
const styles = StyleSheet.create({
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 80,
        width: 80,
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 80,
        marginTop: 30,
    },
    iconContainerBig: {
        width: 100,
        height: 100,
        marginTop: 50,
    },
    text: {
        textAlign: 'center',
        paddingTop: 20,
    },
});
//# sourceMappingURL=EmptyState.js.map