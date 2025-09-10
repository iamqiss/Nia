import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ErrorBoundary } from '#/view/com/util/ErrorBoundary';
import { Logo } from '#/view/icons/Logo';
import { Logotype } from '#/view/icons/Logotype';
import { atoms as a, useTheme } from '#/alf';
import { AppLanguageDropdown } from '#/components/AppLanguageDropdown';
import { Button, ButtonText } from '#/components/Button';
import { Text } from '#/components/Typography';
import { CenteredView } from '../util/Views';
export const SplashScreen = ({ onPressSignin, onPressCreateAccount, }) => {
    const t = useTheme();
    const { _ } = useLingui();
    const insets = useSafeAreaInsets();
    return (_jsx(CenteredView, { style: [a.h_full, a.flex_1], children: _jsxs(ErrorBoundary, { children: [_jsxs(View, { style: [{ flex: 1 }, a.justify_center, a.align_center], children: [_jsx(Logo, { width: 92, fill: "sky" }), _jsx(View, { style: [a.pb_sm, a.pt_5xl], children: _jsx(Logotype, { width: 161, fill: t.atoms.text.color }) }), _jsx(Text, { style: [a.text_md, a.font_bold, t.atoms.text_contrast_medium], children: _jsx(Trans, { children: "What's up?" }) })] }), _jsxs(View, { testID: "signinOrCreateAccount", style: [a.px_xl, a.gap_md, a.pb_2xl], children: [_jsx(Button, { testID: "createAccountButton", onPress: onPressCreateAccount, label: _(msg `Create new account`), accessibilityHint: _(msg `Opens flow to create a new Bluesky account`), size: "large", variant: "solid", color: "primary", children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Create account" }) }) }), _jsx(Button, { testID: "signInButton", onPress: onPressSignin, label: _(msg `Sign in`), accessibilityHint: _(msg `Opens flow to sign in to your existing Bluesky account`), size: "large", variant: "solid", color: "secondary", children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Sign in" }) }) })] }), _jsx(View, { style: [
                        a.px_lg,
                        a.pt_md,
                        a.pb_2xl,
                        a.justify_center,
                        a.align_center,
                    ], children: _jsx(View, { children: _jsx(AppLanguageDropdown, {}) }) }), _jsx(View, { style: { height: insets.bottom } })] }) }));
};
//# sourceMappingURL=SplashScreen.js.map