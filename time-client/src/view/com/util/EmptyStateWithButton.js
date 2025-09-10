import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { StyleSheet, View } from 'react-native';
import {} from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon, } from '@fortawesome/react-native-fontawesome';
import { usePalette } from '#/lib/hooks/usePalette';
import { s } from '#/lib/styles';
import { Button } from './forms/Button';
import { Text } from './text/Text';
export function EmptyStateWithButton(props) {
    const pal = usePalette('default');
    const palInverted = usePalette('inverted');
    return (_jsxs(View, { testID: props.testID, style: styles.container, children: [_jsx(View, { style: styles.iconContainer, children: _jsx(FontAwesomeIcon, { icon: props.icon, style: [styles.icon, pal.text], size: 62 }) }), _jsx(Text, { type: "xl-medium", style: [s.textCenter, pal.text], children: props.message }), _jsx(View, { style: styles.btns, children: _jsxs(Button, { testID: props.testID ? `${props.testID}-button` : undefined, type: "inverted", style: styles.btn, onPress: props.onPress, children: [_jsx(FontAwesomeIcon, { icon: "plus", style: palInverted.text, size: 14 }), _jsx(Text, { type: "lg-medium", style: palInverted.text, children: props.buttonLabel })] }) })] }));
}
const styles = StyleSheet.create({
    container: {
        height: '100%',
        paddingVertical: 40,
        paddingHorizontal: 30,
    },
    iconContainer: {
        marginBottom: 16,
    },
    icon: {
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    btns: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    btn: {
        gap: 10,
        marginVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 30,
    },
    notice: {
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginHorizontal: 30,
    },
});
//# sourceMappingURL=EmptyStateWithButton.js.map