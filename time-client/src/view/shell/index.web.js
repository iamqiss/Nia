import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useNavigation } from '@react-navigation/native';
import { RemoveScrollBar } from 'react-remove-scroll-bar';
import { useIntentHandler } from '#/lib/hooks/useIntentHandler';
import { useWebMediaQueries } from '#/lib/hooks/useWebMediaQueries';
import {} from '#/lib/routes/types';
import { useGate } from '#/lib/statsig/statsig';
import { useGeolocationStatus } from '#/state/geolocation';
import { useIsDrawerOpen, useSetDrawerOpen } from '#/state/shell';
import { useComposerKeyboardShortcut } from '#/state/shell/composer/useComposerKeyboardShortcut';
import { useCloseAllActiveElements } from '#/state/util';
import { Lightbox } from '#/view/com/lightbox/Lightbox';
import { ModalsContainer } from '#/view/com/modals/Modal';
import { ErrorBoundary } from '#/view/com/util/ErrorBoundary';
import { atoms as a, select, useTheme } from '#/alf';
import { AgeAssuranceRedirectDialog } from '#/components/ageAssurance/AgeAssuranceRedirectDialog';
import { BlockedGeoOverlay } from '#/components/BlockedGeoOverlay';
import { EmailDialog } from '#/components/dialogs/EmailDialog';
import { LinkWarningDialog } from '#/components/dialogs/LinkWarning';
import { MutedWordsDialog } from '#/components/dialogs/MutedWords';
import { SigninDialog } from '#/components/dialogs/Signin';
import { useWelcomeModal } from '#/components/hooks/useWelcomeModal';
import { Outlet as PolicyUpdateOverlayPortalOutlet, usePolicyUpdateContext, } from '#/components/PolicyUpdateOverlay';
import { Outlet as PortalOutlet } from '#/components/Portal';
import { WelcomeModal } from '#/components/WelcomeModal';
import { FlatNavigator, RoutesContainer } from '#/Navigation';
import { Composer } from './Composer.web';
import { DrawerContent } from './Drawer';
function ShellInner() {
    const t = useTheme();
    const isDrawerOpen = useIsDrawerOpen();
    const setDrawerOpen = useSetDrawerOpen();
    const { isDesktop } = useWebMediaQueries();
    const navigator = useNavigation();
    const closeAllActiveElements = useCloseAllActiveElements();
    const { _ } = useLingui();
    const showDrawer = !isDesktop && isDrawerOpen;
    const [showDrawerDelayedExit, setShowDrawerDelayedExit] = useState(showDrawer);
    const { state: policyUpdateState } = usePolicyUpdateContext();
    const welcomeModalControl = useWelcomeModal();
    const gate = useGate();
    useLayoutEffect(() => {
        if (showDrawer !== showDrawerDelayedExit) {
            if (showDrawer) {
                setShowDrawerDelayedExit(true);
            }
            else {
                const timeout = setTimeout(() => {
                    setShowDrawerDelayedExit(false);
                }, 160);
                return () => clearTimeout(timeout);
            }
        }
    }, [showDrawer, showDrawerDelayedExit]);
    useComposerKeyboardShortcut();
    useIntentHandler();
    useEffect(() => {
        const unsubscribe = navigator.addListener('state', () => {
            closeAllActiveElements();
        });
        return unsubscribe;
    }, [navigator, closeAllActiveElements]);
    return (_jsxs(_Fragment, { children: [_jsx(ErrorBoundary, { children: _jsx(FlatNavigator, {}) }), _jsx(Composer, { winHeight: 0 }), _jsx(ModalsContainer, {}), _jsx(MutedWordsDialog, {}), _jsx(SigninDialog, {}), _jsx(EmailDialog, {}), _jsx(AgeAssuranceRedirectDialog, {}), _jsx(LinkWarningDialog, {}), _jsx(Lightbox, {}), welcomeModalControl.isOpen && gate('welcome_modal') && (_jsx(WelcomeModal, { control: welcomeModalControl })), policyUpdateState.completed && (_jsx(_Fragment, { children: _jsx(PortalOutlet, {}) })), showDrawerDelayedExit && (_jsxs(_Fragment, { children: [_jsx(RemoveScrollBar, {}), _jsx(TouchableWithoutFeedback, { onPress: ev => {
                            // Only close if press happens outside of the drawer
                            if (ev.target === ev.currentTarget) {
                                setDrawerOpen(false);
                            }
                        }, accessibilityLabel: _(msg `Close drawer menu`), accessibilityHint: "", children: _jsx(View, { style: [
                                styles.drawerMask,
                                {
                                    backgroundColor: showDrawer
                                        ? select(t.name, {
                                            light: 'rgba(0, 57, 117, 0.1)',
                                            dark: 'rgba(1, 82, 168, 0.1)',
                                            dim: 'rgba(10, 13, 16, 0.8)',
                                        })
                                        : 'transparent',
                                },
                                a.transition_color,
                            ], children: _jsx(View, { style: [
                                    styles.drawerContainer,
                                    showDrawer ? a.slide_in_left : a.slide_out_left,
                                ], children: _jsx(DrawerContent, {}) }) }) })] })), _jsx(PolicyUpdateOverlayPortalOutlet, {})] }));
}
export function Shell() {
    const t = useTheme();
    const { status: geolocation } = useGeolocationStatus();
    return (_jsx(View, { style: [a.util_screen_outer, t.atoms.bg], children: geolocation?.isAgeBlockedGeo ? (_jsx(BlockedGeoOverlay, {})) : (_jsx(RoutesContainer, { children: _jsx(ShellInner, {}) })) }));
}
const styles = StyleSheet.create({
    drawerMask: {
        ...a.fixed,
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
    },
    drawerContainer: {
        display: 'flex',
        ...a.fixed,
        top: 0,
        left: 0,
        height: '100%',
        width: 330,
        maxWidth: '80%',
    },
});
//# sourceMappingURL=index.web.js.map