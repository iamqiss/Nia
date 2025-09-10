import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { View } from 'react-native';
// Based on @react-navigation/native-stack/src/navigators/createNativeStackNavigator.ts
// MIT License
// Copyright (c) 2017 React Navigation Contributors
import { createNavigatorFactory, StackActions, StackRouter, useNavigationBuilder, } from '@react-navigation/native';
import { NativeStackView } from '@react-navigation/native-stack';
import {} from '@react-navigation/native-stack';
import { PWI_ENABLED } from '#/lib/build-flags';
import { useWebMediaQueries } from '#/lib/hooks/useWebMediaQueries';
import { isNative, isWeb } from '#/platform/detection';
import { useSession } from '#/state/session';
import { useOnboardingState } from '#/state/shell';
import { useLoggedOutView, useLoggedOutViewControls, } from '#/state/shell/logged-out';
import { LoggedOut } from '#/view/com/auth/LoggedOut';
import { Deactivated } from '#/screens/Deactivated';
import { Onboarding } from '#/screens/Onboarding';
import { SignupQueued } from '#/screens/SignupQueued';
import { Takendown } from '#/screens/Takendown';
import { atoms as a, useLayoutBreakpoints } from '#/alf';
import { PolicyUpdateOverlay } from '#/components/PolicyUpdateOverlay';
import { BottomBarWeb } from './bottom-bar/BottomBarWeb';
import { DesktopLeftNav } from './desktop/LeftNav';
import { DesktopRightNav } from './desktop/RightNav';
function NativeStackNavigator({ id, initialRouteName, children, layout, screenListeners, screenOptions, screenLayout, ...rest }) {
    // --- this is copy and pasted from the original native stack navigator ---
    const { state, describe, descriptors, navigation, NavigationContent } = useNavigationBuilder(StackRouter, {
        id,
        initialRouteName,
        children,
        layout,
        screenListeners,
        screenOptions,
        screenLayout,
    });
    React.useEffect(() => 
    // @ts-expect-error: there may not be a tab navigator in parent
    navigation?.addListener?.('tabPress', (e) => {
        const isFocused = navigation.isFocused();
        // Run the operation in the next frame so we're sure all listeners have been run
        // This is necessary to know if preventDefault() has been called
        requestAnimationFrame(() => {
            if (state.index > 0 &&
                isFocused &&
                !e.defaultPrevented) {
                // When user taps on already focused tab and we're inside the tab,
                // reset the stack to replicate native behaviour
                navigation.dispatch({
                    ...StackActions.popToTop(),
                    target: state.key,
                });
            }
        });
    }), [navigation, state.index, state.key]);
    // --- our custom logic starts here ---
    const { hasSession, currentAccount } = useSession();
    const activeRoute = state.routes[state.index];
    const activeDescriptor = descriptors[activeRoute.key];
    const activeRouteRequiresAuth = activeDescriptor.options.requireAuth ?? false;
    const onboardingState = useOnboardingState();
    const { showLoggedOut } = useLoggedOutView();
    const { setShowLoggedOut } = useLoggedOutViewControls();
    const { isMobile } = useWebMediaQueries();
    const { leftNavMinimal } = useLayoutBreakpoints();
    if (!hasSession && (!PWI_ENABLED || activeRouteRequiresAuth || isNative)) {
        return _jsx(LoggedOut, {});
    }
    if (hasSession && currentAccount?.signupQueued) {
        return _jsx(SignupQueued, {});
    }
    if (hasSession && currentAccount?.status === 'takendown') {
        return _jsx(Takendown, {});
    }
    if (showLoggedOut) {
        return _jsx(LoggedOut, { onDismiss: () => setShowLoggedOut(false) });
    }
    if (currentAccount?.status === 'deactivated') {
        return _jsx(Deactivated, {});
    }
    if (onboardingState.isActive) {
        return _jsx(Onboarding, {});
    }
    const newDescriptors = {};
    for (let key in descriptors) {
        const descriptor = descriptors[key];
        const requireAuth = descriptor.options.requireAuth ?? false;
        newDescriptors[key] = {
            ...descriptor,
            render() {
                if (requireAuth && !hasSession) {
                    return _jsx(View, {});
                }
                else {
                    return descriptor.render();
                }
            },
        };
    }
    // Show the bottom bar if we have a session only on mobile web. If we don't have a session, we want to show it
    // on both tablet and mobile web so that we see the create account CTA.
    const showBottomBar = hasSession ? isMobile : leftNavMinimal;
    return (_jsxs(NavigationContent, { children: [_jsx(View, { role: "main", style: a.flex_1, children: _jsx(NativeStackView, { ...rest, state: state, navigation: navigation, descriptors: descriptors, describe: describe }) }), isWeb && (_jsxs(_Fragment, { children: [showBottomBar ? _jsx(BottomBarWeb, {}) : _jsx(DesktopLeftNav, {}), !isMobile && _jsx(DesktopRightNav, { routeName: activeRoute.name })] })), hasSession && _jsx(PolicyUpdateOverlay, {})] }));
}
export function createNativeStackNavigatorWithAuth(config) {
    return createNavigatorFactory(NativeStackNavigator)(config);
}
//# sourceMappingURL=createNativeStackNavigatorWithAuth.js.map