import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useNavigation } from '@react-navigation/native';
import {} from '#/lib/routes/types';
import { atoms as a, useTheme } from '#/alf';
import { Button, ButtonText } from '#/components/Button';
import { Text } from '#/components/Typography';
export function ErrorScreen({ error }) {
    const t = useTheme();
    const navigation = useNavigation();
    const { _ } = useLingui();
    const onPressBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
        else {
            navigation.navigate('Home');
        }
    };
    return (_jsxs(View, { style: [a.px_xl, a.py_md, a.gap_md], children: [_jsx(Text, { style: [a.text_4xl, a.font_heavy], children: _jsx(Trans, { children: "Could not load list" }) }), _jsx(Text, { style: [a.text_md, t.atoms.text_contrast_high, a.leading_snug], children: error }), _jsx(View, { style: [a.flex_row, a.mt_lg], children: _jsx(Button, { label: _(msg `Go back`), accessibilityHint: _(msg `Returns to previous page`), onPress: onPressBack, size: "small", color: "secondary", children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Go back" }) }) }) })] }));
}
//# sourceMappingURL=ErrorScreen.js.map