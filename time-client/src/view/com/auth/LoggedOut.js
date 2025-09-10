import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { PressableScale } from '#/lib/custom-animations/PressableScale';
import { logEvent } from '#/lib/statsig/statsig';
import { useLoggedOutView, useLoggedOutViewControls, } from '#/state/shell/logged-out';
import { useSetMinimalShellMode } from '#/state/shell/minimal-mode';
import { ErrorBoundary } from '#/view/com/util/ErrorBoundary';
import { Login } from '#/screens/Login';
import { Signup } from '#/screens/Signup';
import { LandingScreen } from '#/screens/StarterPack/StarterPackLandingScreen';
import { atoms as a, native, tokens, useTheme } from '#/alf';
import { Button, ButtonIcon } from '#/components/Button';
import { TimesLarge_Stroke2_Corner0_Rounded as XIcon } from '#/components/icons/Times';
import { SplashScreen } from './SplashScreen';
var ScreenState;
(function (ScreenState) {
    ScreenState[ScreenState["S_LoginOrCreateAccount"] = 0] = "S_LoginOrCreateAccount";
    ScreenState[ScreenState["S_Login"] = 1] = "S_Login";
    ScreenState[ScreenState["S_CreateAccount"] = 2] = "S_CreateAccount";
    ScreenState[ScreenState["S_StarterPack"] = 3] = "S_StarterPack";
})(ScreenState || (ScreenState = {}));
export { ScreenState as LoggedOutScreenState };
export function LoggedOut({ onDismiss }) {
    const { _ } = useLingui();
    const t = useTheme();
    const insets = useSafeAreaInsets();
    const setMinimalShellMode = useSetMinimalShellMode();
    const { requestedAccountSwitchTo } = useLoggedOutView();
    const [screenState, setScreenState] = React.useState(() => {
        if (requestedAccountSwitchTo === 'new') {
            return ScreenState.S_CreateAccount;
        }
        else if (requestedAccountSwitchTo === 'starterpack') {
            return ScreenState.S_StarterPack;
        }
        else if (requestedAccountSwitchTo != null) {
            return ScreenState.S_Login;
        }
        else {
            return ScreenState.S_LoginOrCreateAccount;
        }
    });
    const { clearRequestedAccount } = useLoggedOutViewControls();
    React.useEffect(() => {
        setMinimalShellMode(true);
    }, [setMinimalShellMode]);
    const onPressDismiss = React.useCallback(() => {
        if (onDismiss) {
            onDismiss();
        }
        clearRequestedAccount();
    }, [clearRequestedAccount, onDismiss]);
    return (_jsx(View, { testID: "noSessionView", style: [
            a.util_screen_outer,
            t.atoms.bg,
            { paddingTop: insets.top, paddingBottom: insets.bottom },
        ], children: _jsxs(ErrorBoundary, { children: [onDismiss && screenState === ScreenState.S_LoginOrCreateAccount ? (_jsx(Button, { label: _(msg `Go back`), variant: "solid", color: "secondary_inverted", size: "small", shape: "round", PressableComponent: native(PressableScale), style: [
                        a.absolute,
                        {
                            top: insets.top + tokens.space.xl,
                            right: tokens.space.xl,
                            zIndex: 100,
                        },
                    ], onPress: onPressDismiss, children: _jsx(ButtonIcon, { icon: XIcon }) })) : null, screenState === ScreenState.S_StarterPack ? (_jsx(LandingScreen, { setScreenState: setScreenState })) : screenState === ScreenState.S_LoginOrCreateAccount ? (_jsx(SplashScreen, { onPressSignin: () => {
                        setScreenState(ScreenState.S_Login);
                        logEvent('splash:signInPressed', {});
                    }, onPressCreateAccount: () => {
                        setScreenState(ScreenState.S_CreateAccount);
                        logEvent('splash:createAccountPressed', {});
                    } })) : undefined, screenState === ScreenState.S_Login ? (_jsx(Login, { onPressBack: () => {
                        setScreenState(ScreenState.S_LoginOrCreateAccount);
                        clearRequestedAccount();
                    } })) : undefined, screenState === ScreenState.S_CreateAccount ? (_jsx(Signup, { onPressBack: () => setScreenState(ScreenState.S_LoginOrCreateAccount) })) : undefined] }) }));
}
//# sourceMappingURL=LoggedOut.js.map