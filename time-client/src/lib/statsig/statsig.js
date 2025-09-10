import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { Platform } from 'react-native';
import { AppState } from 'react-native';
import { Statsig, StatsigProvider } from 'statsig-react-native-expo';
import { logger } from '#/logger';
import {} from '#/logger/metrics';
import { isWeb } from '#/platform/detection';
import * as persisted from '#/state/persisted';
import * as env from '#/env';
import { useSession } from '../../state/session';
import { timeout } from '../async/timeout';
import { useNonReactiveCallback } from '../hooks/useNonReactiveCallback';
import {} from './gates';
const SDK_KEY = 'client-SXJakO39w9vIhl3D44u8UupyzFl4oZ2qPIkjwcvuPsV';
export const initPromise = initialize();
let refSrc = '';
let refUrl = '';
if (isWeb && typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    refSrc = params.get('ref_src') ?? '';
    refUrl = decodeURIComponent(params.get('ref_url') ?? '');
}
function createStatsigOptions(prefetchUsers) {
    return {
        environment: {
            tier: env.IS_DEV
                ? 'development'
                : env.IS_TESTFLIGHT
                    ? 'staging'
                    : 'production',
        },
        // Don't block on waiting for network. The fetched config will kick in on next load.
        // This ensures the UI is always consistent and doesn't update mid-session.
        // Note this makes cold load (no local storage) and private mode return `false` for all gates.
        initTimeoutMs: 1,
        // Get fresh flags for other accounts as well, if any.
        prefetchUsers,
        api: 'https://events.bsky.app/v2',
    };
}
let getCurrentRouteName = () => null;
export function attachRouteToLogEvents(getRouteName) {
    getCurrentRouteName = getRouteName;
}
export function toClout(n) {
    if (n == null) {
        return undefined;
    }
    else {
        return Math.max(0, Math.round(Math.log(n)));
    }
}
/**
 * @deprecated use `logger.metric()` instead
 */
export function logEvent(eventName, rawMetadata, options = { lake: false }) {
    try {
        const fullMetadata = toStringRecord(rawMetadata);
        fullMetadata.routeName = getCurrentRouteName() ?? '(Uninitialized)';
        if (Statsig.initializeCalled()) {
            let ev = eventName;
            if (options.lake) {
                ev = `lake:${ev}`;
            }
            Statsig.logEvent(ev, null, fullMetadata);
        }
        /**
         * All datalake events should be sent using `logger.metric`, and we don't
         * want to double-emit logs to other transports.
         */
        if (!options.lake) {
            logger.info(eventName, fullMetadata);
        }
    }
    catch (e) {
        // A log should never interrupt the calling code, whatever happens.
        logger.error('Failed to log an event', { message: e });
    }
}
function toStringRecord(metadata) {
    const record = {};
    for (let key in metadata) {
        if (metadata.hasOwnProperty(key)) {
            if (typeof metadata[key] === 'string') {
                record[key] = metadata[key];
            }
            else {
                record[key] = JSON.stringify(metadata[key]);
            }
        }
    }
    return record;
}
// We roll our own cache in front of Statsig because it is a singleton
// and it's been difficult to get it to behave in a predictable way.
// Our own cache ensures consistent evaluation within a single session.
const GateCache = React.createContext(null);
GateCache.displayName = 'StatsigGateCacheContext';
export function useGate() {
    const cache = React.useContext(GateCache);
    if (!cache) {
        throw Error('useGate() cannot be called outside StatsigProvider.');
    }
    const gate = React.useCallback((gateName, options = {}) => {
        const cachedValue = cache.get(gateName);
        if (cachedValue !== undefined) {
            return cachedValue;
        }
        let value = false;
        if (Statsig.initializeCalled()) {
            if (options.dangerouslyDisableExposureLogging) {
                value = Statsig.checkGateWithExposureLoggingDisabled(gateName);
            }
            else {
                value = Statsig.checkGate(gateName);
            }
        }
        cache.set(gateName, value);
        return value;
    }, [cache]);
    return gate;
}
/**
 * Debugging tool to override a gate. USE ONLY IN E2E TESTS!
 */
export function useDangerousSetGate() {
    const cache = React.useContext(GateCache);
    if (!cache) {
        throw Error('useDangerousSetGate() cannot be called outside StatsigProvider.');
    }
    const dangerousSetGate = React.useCallback((gateName, value) => {
        cache.set(gateName, value);
    }, [cache]);
    return dangerousSetGate;
}
function toStatsigUser(did) {
    const languagePrefs = persisted.get('languagePrefs');
    return {
        userID: did,
        platform: Platform.OS,
        custom: {
            refSrc,
            refUrl,
            platform: Platform.OS,
            appVersion: env.RELEASE_VERSION,
            bundleIdentifier: env.BUNDLE_IDENTIFIER,
            bundleDate: env.BUNDLE_DATE,
            appLanguage: languagePrefs.appLanguage,
            contentLanguages: languagePrefs.contentLanguages,
        },
    };
}
let lastState = AppState.currentState;
let lastActive = lastState === 'active' ? performance.now() : null;
AppState.addEventListener('change', (state) => {
    if (state === lastState) {
        return;
    }
    lastState = state;
    if (state === 'active') {
        lastActive = performance.now();
        logEvent('state:foreground', {});
    }
    else {
        let secondsActive = 0;
        if (lastActive != null) {
            secondsActive = Math.round((performance.now() - lastActive) / 1e3);
            lastActive = null;
            logEvent('state:background', {
                secondsActive,
            });
        }
    }
});
export async function tryFetchGates(did, strategy) {
    try {
        let timeoutMs = 250; // Don't block the UI if we can't do this fast.
        if (strategy === 'prefer-fresh-gates') {
            // Use this for less common operations where the user would be OK with a delay.
            timeoutMs = 1500;
        }
        if (Statsig.initializeCalled()) {
            await Promise.race([
                timeout(timeoutMs),
                Statsig.prefetchUsers([toStatsigUser(did)]),
            ]);
        }
    }
    catch (e) {
        // Don't leak errors to the calling code, this is meant to be always safe.
        console.error(e);
    }
}
export function initialize() {
    return Statsig.initialize(SDK_KEY, null, createStatsigOptions([]));
}
export function Provider({ children }) {
    const { currentAccount, accounts } = useSession();
    const did = currentAccount?.did;
    const currentStatsigUser = React.useMemo(() => toStatsigUser(did), [did]);
    const otherDidsConcatenated = accounts
        .map(account => account.did)
        .filter(accountDid => accountDid !== did)
        .join(' '); // We're only interested in DID changes.
    const otherStatsigUsers = React.useMemo(() => otherDidsConcatenated.split(' ').map(toStatsigUser), [otherDidsConcatenated]);
    const statsigOptions = React.useMemo(() => createStatsigOptions(otherStatsigUsers), [otherStatsigUsers]);
    // Have our own cache in front of Statsig.
    // This ensures the results remain stable until the active DID changes.
    const [gateCache, setGateCache] = React.useState(() => new Map());
    const [prevDid, setPrevDid] = React.useState(did);
    if (did !== prevDid) {
        setPrevDid(did);
        setGateCache(new Map());
    }
    // Periodically poll Statsig to get the current rule evaluations for all stored accounts.
    // These changes are prefetched and stored, but don't get applied until the active DID changes.
    // This ensures that when you switch an account, it already has fresh results by then.
    const handleIntervalTick = useNonReactiveCallback(() => {
        if (Statsig.initializeCalled()) {
            // Note: Only first five will be taken into account by Statsig.
            Statsig.prefetchUsers([currentStatsigUser, ...otherStatsigUsers]);
        }
    });
    React.useEffect(() => {
        const id = setInterval(handleIntervalTick, 60e3 /* 1 min */);
        return () => clearInterval(id);
    }, [handleIntervalTick]);
    return (_jsx(GateCache.Provider, { value: gateCache, children: _jsx(StatsigProvider, { sdkKey: SDK_KEY, mountKey: currentStatsigUser.userID, user: currentStatsigUser, 
            // This isn't really blocking due to short initTimeoutMs above.
            // However, it ensures `isLoading` is always `false`.
            waitForInitialization: true, options: statsigOptions, children: children }, did) }));
}
//# sourceMappingURL=statsig.js.map