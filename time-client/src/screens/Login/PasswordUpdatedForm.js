import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { atoms as a, useBreakpoints } from '#/alf';
import { Button, ButtonText } from '#/components/Button';
import { Text } from '#/components/Typography';
import { FormContainer } from './FormContainer';
export const PasswordUpdatedForm = ({ onPressNext, }) => {
    const { _ } = useLingui();
    const { gtMobile } = useBreakpoints();
    return (_jsxs(FormContainer, { testID: "passwordUpdatedForm", style: [a.gap_2xl, !gtMobile && a.mt_5xl], children: [_jsx(Text, { style: [a.text_3xl, a.font_bold, a.text_center], children: _jsx(Trans, { children: "Password updated!" }) }), _jsx(Text, { style: [a.text_center, a.mx_auto, { maxWidth: '80%' }], children: _jsx(Trans, { children: "You can now sign in with your new password." }) }), _jsx(View, { style: [a.flex_row, a.justify_center], children: _jsx(Button, { onPress: onPressNext, label: _(msg `Close alert`), accessibilityHint: _(msg `Closes password update alert`), variant: "solid", color: "primary", size: "large", children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Okay" }) }) }) })] }));
};
//# sourceMappingURL=PasswordUpdatedForm.js.map