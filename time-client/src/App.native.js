import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import '#/logger/sentry/setup';
import '#/logger/bitdrift/setup';
import '#/view/icons';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootSiblingParent } from 'react-native-root-siblings';
import { initialWindowMetrics, SafeAreaProvider, } from 'react-native-safe-area-context';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import * as Sentry from '@sentry/react-native';
import { KeyboardControllerProvider } from '#/lib/hooks/useEnableKeyboardController';
import { Provider as HideBottomBarBorderProvider } from '#/lib/hooks/useHideBottomBarBorder';
import { QueryProvider } from '#/lib/react-query';
import { Provider as StatsigProvider, tryFetchGates } from '#/lib/statsig/statsig';
import { s } from '#/lib/styles';
import { ThemeProvider } from '#/lib/ThemeContext';
import I18nProvider from '#/locale/i18nProvider';
import { logger } from '#/logger';
import { isAndroid, isIOS } from '#/platform/detection';
import { Provider as A11yProvider } from '#/state/a11y';
import { Provider as AgeAssuranceProvider } from '#/state/ageAssurance';
import { Provider as MutedThreadsProvider } from '#/state/cache/thread-mutes';
import { Provider as DialogStateProvider } from '#/state/dialogs';
import { Provider as EmailVerificationProvider } from '#/state/email-verification';
import { listenSessionDropped } from '#/state/events';
import { beginResolveGeolocationConfig, ensureGeolocationConfigIsResolved, Provider as GeolocationProvider, } from '#/state/geolocation';
import { GlobalGestureEventsProvider } from '#/state/global-gesture-events';
import { Provider as HomeBadgeProvider } from '#/state/home-badge';
import { Provider as InvitesStateProvider } from '#/state/invites';
import { Provider as LightboxStateProvider } from '#/state/lightbox';
import { MessagesProvider } from '#/state/messages';
import { Provider as ModalStateProvider } from '#/state/modals';
import { init as initPersistedState } from '#/state/persisted';
import { Provider as PrefsStateProvider } from '#/state/preferences';
import { Provider as LabelDefsProvider } from '#/state/preferences/label-defs';
import { Provider as ModerationOptsProvider } from '#/state/preferences/moderation-opts';
import { Provider as UnreadNotifsProvider } from '#/state/queries/notifications/unread';
import { Provider as ServiceAccountManager } from '#/state/service-config';
import { Provider as SessionProvider, useSession, useSessionApi, } from '#/state/session';
import { readLastActiveAccount } from '#/state/session/util';
import { Provider as ShellStateProvider } from '#/state/shell';
import { Provider as ComposerProvider } from '#/state/shell/composer';
import { Provider as LoggedOutViewProvider } from '#/state/shell/logged-out';
import { Provider as ProgressGuideProvider } from '#/state/shell/progress-guide';
import { Provider as SelectedFeedProvider } from '#/state/shell/selected-feed';
import { Provider as StarterPackProvider } from '#/state/shell/starter-pack';
import { Provider as HiddenRepliesProvider } from '#/state/threadgate-hidden-replies';
import { TestCtrls } from '#/view/com/testing/TestCtrls';
import * as Toast from '#/view/com/util/Toast';
import { Shell } from '#/view/shell';
import { ThemeProvider as Alf } from '#/alf';
import { useColorModeTheme } from '#/alf/util/useColorModeTheme';
import { Provider as ContextMenuProvider } from '#/components/ContextMenu';
import { NuxDialogs } from '#/components/dialogs/nuxs';
import { useStarterPackEntry } from '#/components/hooks/useStarterPackEntry';
import { Provider as IntentDialogProvider } from '#/components/intents/IntentDialogs';
import { Provider as PolicyUpdateOverlayProvider } from '#/components/PolicyUpdateOverlay';
import { Provider as PortalProvider } from '#/components/Portal';
import { Provider as VideoVolumeProvider } from '#/components/Post/Embed/VideoEmbed/VideoVolumeContext';
import { ToastOutlet } from '#/components/Toast';
import { Splash } from '#/Splash';
import { BottomSheetProvider } from '../modules/bottom-sheet';
import { BackgroundNotificationPreferencesProvider } from '../modules/expo-background-notification-handler/src/BackgroundNotificationHandlerProvider';
SplashScreen.preventAutoHideAsync();
if (isIOS) {
    SystemUI.setBackgroundColorAsync('black');
}
if (isAndroid) {
    // iOS is handled by the config plugin -sfn
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
}
/**
 * Begin geolocation ASAP
 */
beginResolveGeolocationConfig();
function InnerApp() {
    const [isReady, setIsReady] = React.useState(false);
    const { currentAccount } = useSession();
    const { resumeSession } = useSessionApi();
    const theme = useColorModeTheme();
    const { _ } = useLingui();
    const hasCheckedReferrer = useStarterPackEntry();
    // init
    useEffect(() => {
        async function onLaunch(account) {
            try {
                if (account) {
                    await resumeSession(account);
                }
                else {
                    await tryFetchGates(undefined, 'prefer-fresh-gates');
                }
            }
            catch (e) {
                logger.error(`session: resume failed`, { message: e });
            }
            finally {
                setIsReady(true);
            }
        }
        const account = readLastActiveAccount();
        onLaunch(account);
    }, [resumeSession]);
    useEffect(() => {
        return listenSessionDropped(() => {
            Toast.show(_(msg `Sorry! Your session expired. Please sign in again.`), 'info');
        });
    }, [_]);
    return (_jsx(Alf, { theme: theme, children: _jsx(ThemeProvider, { theme: theme, children: _jsx(ContextMenuProvider, { children: _jsx(Splash, { isReady: isReady && hasCheckedReferrer, children: _jsx(RootSiblingParent, { children: _jsx(VideoVolumeProvider, { children: _jsx(React.Fragment
                            // Resets the entire tree below when it changes:
                            , { children: _jsx(QueryProvider, { currentDid: currentAccount?.did, children: _jsx(PolicyUpdateOverlayProvider, { children: _jsx(StatsigProvider, { children: _jsx(AgeAssuranceProvider, { children: _jsx(ComposerProvider, { children: _jsx(MessagesProvider, { children: _jsx(LabelDefsProvider, { children: _jsx(ModerationOptsProvider, { children: _jsx(LoggedOutViewProvider, { children: _jsx(SelectedFeedProvider, { children: _jsx(HiddenRepliesProvider, { children: _jsx(HomeBadgeProvider, { children: _jsx(UnreadNotifsProvider, { children: _jsx(BackgroundNotificationPreferencesProvider, { children: _jsx(MutedThreadsProvider, { children: _jsx(ProgressGuideProvider, { children: _jsx(ServiceAccountManager, { children: _jsx(EmailVerificationProvider, { children: _jsx(HideBottomBarBorderProvider, { children: _jsx(GestureHandlerRootView, { style: s.h100pct, children: _jsx(GlobalGestureEventsProvider, { children: _jsxs(IntentDialogProvider, { children: [_jsx(TestCtrls, {}), _jsx(Shell, {}), _jsx(NuxDialogs, {}), _jsx(ToastOutlet, {})] }) }) }) }) }) }) }) }) }) }) }) }) }) }) }) }) }) }) }) }) }) }) }, currentAccount?.did) }) }) }) }) }) }));
}
function App() {
    const [isReady, setReady] = useState(false);
    React.useEffect(() => {
        Promise.all([
            initPersistedState(),
            ensureGeolocationConfigIsResolved(),
        ]).then(() => setReady(true));
    }, []);
    if (!isReady) {
        return null;
    }
    /*
     * NOTE: only nothing here can depend on other data or session state, since
     * that is set up in the InnerApp component above.
     */
    return (_jsx(GeolocationProvider, { children: _jsx(A11yProvider, { children: _jsx(KeyboardControllerProvider, { children: _jsx(SessionProvider, { children: _jsx(PrefsStateProvider, { children: _jsx(I18nProvider, { children: _jsx(ShellStateProvider, { children: _jsx(InvitesStateProvider, { children: _jsx(ModalStateProvider, { children: _jsx(DialogStateProvider, { children: _jsx(LightboxStateProvider, { children: _jsx(PortalProvider, { children: _jsx(BottomSheetProvider, { children: _jsx(StarterPackProvider, { children: _jsx(SafeAreaProvider, { initialMetrics: initialWindowMetrics, children: _jsx(InnerApp, {}) }) }) }) }) }) }) }) }) }) }) }) }) }) }) }));
}
export default Sentry.wrap(App);
//# sourceMappingURL=App.native.js.map