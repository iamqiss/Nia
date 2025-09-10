import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { FontAwesomeIcon, } from '@fortawesome/react-native-fontawesome';
import { Trans } from '@lingui/macro';
import { useNavigation } from '@react-navigation/native';
import { usePalette } from '#/lib/hooks/usePalette';
import {} from '#/lib/routes/types';
import { s } from '#/lib/styles';
import { isWeb } from '#/platform/detection';
import { Button } from '../util/forms/Button';
import { Text } from '../util/text/Text';
export function FollowingEndOfFeed() {
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
    const onPressDiscoverFeeds = React.useCallback(() => {
        navigation.navigate('Feeds');
    }, [navigation]);
    return (_jsx(View, { style: [
            styles.container,
            pal.border,
            { minHeight: Dimensions.get('window').height * 0.75 },
        ], children: _jsxs(View, { style: styles.inner, children: [_jsx(Text, { type: "xl-medium", style: [s.textCenter, pal.text], children: _jsx(Trans, { children: "You've reached the end of your feed! Find some more accounts to follow." }) }), _jsxs(Button, { type: "inverted", style: styles.emptyBtn, onPress: onPressFindAccounts, children: [_jsx(Text, { type: "lg-medium", style: palInverted.text, children: _jsx(Trans, { children: "Find accounts to follow" }) }), _jsx(FontAwesomeIcon, { icon: "angle-right", style: palInverted.text, size: 14 })] }), _jsx(Text, { type: "xl-medium", style: [s.textCenter, pal.text, s.mt20], children: _jsx(Trans, { children: "You can also discover new Custom Feeds to follow." }) }), _jsxs(Button, { type: "inverted", style: [styles.emptyBtn, s.mt10], onPress: onPressDiscoverFeeds, children: [_jsx(Text, { type: "lg-medium", style: palInverted.text, children: _jsx(Trans, { children: "Discover new custom feeds" }) }), _jsx(FontAwesomeIcon, { icon: "angle-right", style: palInverted.text, size: 14 })] })] }) }));
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 40,
        paddingBottom: 80,
        paddingHorizontal: 30,
        borderTopWidth: 1,
    },
    inner: {
        width: '100%',
        maxWidth: 460,
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
});
//# sourceMappingURL=FollowingEndOfFeed.js.map