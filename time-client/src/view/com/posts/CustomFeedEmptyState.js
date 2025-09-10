import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FontAwesomeIcon, } from '@fortawesome/react-native-fontawesome';
import { Trans } from '@lingui/macro';
import { useNavigation } from '@react-navigation/native';
import { usePalette } from '#/lib/hooks/usePalette';
import { MagnifyingGlassIcon } from '#/lib/icons';
import {} from '#/lib/routes/types';
import { s } from '#/lib/styles';
import { isWeb } from '#/platform/detection';
import { Button } from '../util/forms/Button';
import { Text } from '../util/text/Text';
export function CustomFeedEmptyState() {
    const pal = usePalette('default');
    const palInverted = usePalette('inverted');
    const navigation = useNavigation();
    const onPressFindAccounts = React.useCallback(() => {
        if (isWeb) {
            navigation.navigate('Search', {});
        }
        else {
            navigation.navigate('SearchTab');
            navigation.popToTop();
        }
    }, [navigation]);
    return (_jsxs(View, { style: styles.emptyContainer, children: [_jsx(View, { style: styles.emptyIconContainer, children: _jsx(MagnifyingGlassIcon, { style: [styles.emptyIcon, pal.text], size: 62 }) }), _jsx(Text, { type: "xl-medium", style: [s.textCenter, pal.text], children: _jsx(Trans, { children: "This feed is empty! You may need to follow more users or tune your language settings." }) }), _jsxs(Button, { type: "inverted", style: styles.emptyBtn, onPress: onPressFindAccounts, children: [_jsx(Text, { type: "lg-medium", style: palInverted.text, children: _jsx(Trans, { children: "Find accounts to follow" }) }), _jsx(FontAwesomeIcon, { icon: "angle-right", style: palInverted.text, size: 14 })] })] }));
}
const styles = StyleSheet.create({
    emptyContainer: {
        height: '100%',
        paddingVertical: 40,
        paddingHorizontal: 30,
    },
    emptyIconContainer: {
        marginBottom: 16,
    },
    emptyIcon: {
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    emptyBtn: {
        marginVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderRadius: 30,
    },
    feedsTip: {
        position: 'absolute',
        left: 22,
    },
    feedsTipArrow: {
        marginLeft: 32,
        marginTop: 8,
    },
});
//# sourceMappingURL=CustomFeedEmptyState.js.map