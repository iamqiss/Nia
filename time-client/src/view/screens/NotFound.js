import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { StackActions, useFocusEffect, useNavigation, } from '@react-navigation/native';
import { usePalette } from '#/lib/hooks/usePalette';
import {} from '#/lib/routes/types';
import { s } from '#/lib/styles';
import { useSetMinimalShellMode } from '#/state/shell';
import { Button } from '#/view/com/util/forms/Button';
import { Text } from '#/view/com/util/text/Text';
import { ViewHeader } from '#/view/com/util/ViewHeader';
import * as Layout from '#/components/Layout';
export const NotFoundScreen = () => {
    const pal = usePalette('default');
    const { _ } = useLingui();
    const navigation = useNavigation();
    const setMinimalShellMode = useSetMinimalShellMode();
    useFocusEffect(React.useCallback(() => {
        setMinimalShellMode(false);
    }, [setMinimalShellMode]));
    const canGoBack = navigation.canGoBack();
    const onPressHome = React.useCallback(() => {
        if (canGoBack) {
            navigation.goBack();
        }
        else {
            navigation.navigate('HomeTab');
            navigation.dispatch(StackActions.popToTop());
        }
    }, [navigation, canGoBack]);
    return (_jsxs(Layout.Screen, { testID: "notFoundView", children: [_jsx(ViewHeader, { title: _(msg `Page Not Found`) }), _jsxs(View, { style: styles.container, children: [_jsx(Text, { type: "title-2xl", style: [pal.text, s.mb10], children: _jsx(Trans, { children: "Page not found" }) }), _jsx(Text, { type: "md", style: [pal.text, s.mb10], children: _jsx(Trans, { children: "We're sorry! We can't find the page you were looking for." }) }), _jsx(Button, { type: "primary", label: canGoBack ? _(msg `Go Back`) : _(msg `Go Home`), accessibilityLabel: canGoBack ? _(msg `Go back`) : _(msg `Go home`), accessibilityHint: canGoBack
                            ? _(msg `Returns to previous page`)
                            : _(msg `Returns to home page`), onPress: onPressHome })] })] }));
};
const styles = StyleSheet.create({
    container: {
        paddingTop: 100,
        paddingHorizontal: 20,
        alignItems: 'center',
        height: '100%',
    },
});
//# sourceMappingURL=NotFound.js.map