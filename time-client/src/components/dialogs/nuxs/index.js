import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import {} from '@atproto/api';
import { useGate } from '#/lib/statsig/statsig';
import { logger } from '#/logger';
import { STALE } from '#/state/queries';
import { Nux, useNuxs, useResetNuxs, useSaveNux } from '#/state/queries/nuxs';
import { usePreferencesQuery, } from '#/state/queries/preferences';
import { useProfileQuery } from '#/state/queries/profile';
import { useSession } from '#/state/session';
import { useOnboardingState } from '#/state/shell';
import { BookmarksAnnouncement } from '#/components/dialogs/nuxs/BookmarksAnnouncement';
/*
 * NUXs
 */
import { isSnoozed, snooze, unsnooze } from '#/components/dialogs/nuxs/snoozing';
import { isExistingUserAsOf } from './utils';
const queuedNuxs = [
    {
        id: Nux.BookmarksAnnouncement,
        enabled: ({ currentProfile }) => {
            return isExistingUserAsOf('2025-09-08T00:00:00.000Z', currentProfile.createdAt);
        },
    },
];
const Context = React.createContext({
    activeNux: undefined,
    dismissActiveNux: () => { },
});
Context.displayName = 'NuxDialogContext';
export function useNuxDialogContext() {
    return React.useContext(Context);
}
export function NuxDialogs() {
    const { currentAccount } = useSession();
    const { data: preferences } = usePreferencesQuery();
    const { data: profile } = useProfileQuery({
        did: currentAccount?.did,
        staleTime: STALE.INFINITY, // createdAt isn't gonna change
    });
    const onboardingActive = useOnboardingState().isActive;
    const isLoading = onboardingActive ||
        !currentAccount ||
        !preferences ||
        !profile ||
        // Profile isn't legit ready until createdAt is a real date.
        !profile.createdAt ||
        profile.createdAt === '0001-01-01T00:00:00.000Z'; // TODO: Fix this in AppView.
    return !isLoading ? (_jsx(Inner, { currentAccount: currentAccount, currentProfile: profile, preferences: preferences })) : null;
}
function Inner({ currentAccount, currentProfile, preferences, }) {
    const gate = useGate();
    const { nuxs } = useNuxs();
    const [snoozed, setSnoozed] = React.useState(() => {
        return isSnoozed();
    });
    const [activeNux, setActiveNux] = React.useState();
    const { mutateAsync: saveNux } = useSaveNux();
    const { mutate: resetNuxs } = useResetNuxs();
    const snoozeNuxDialog = React.useCallback(() => {
        snooze();
        setSnoozed(true);
    }, [setSnoozed]);
    const dismissActiveNux = React.useCallback(() => {
        if (!activeNux)
            return;
        setActiveNux(undefined);
    }, [activeNux, setActiveNux]);
    if (__DEV__ && typeof window !== 'undefined') {
        // @ts-ignore
        window.clearNuxDialog = (id) => {
            if (!__DEV__ || !id)
                return;
            resetNuxs([id]);
            unsnooze();
        };
    }
    React.useEffect(() => {
        if (snoozed)
            return; // comment this out to test
        if (!nuxs)
            return;
        for (const { id, enabled } of queuedNuxs) {
            const nux = nuxs.find(nux => nux.id === id);
            // check if completed first
            if (nux && nux.completed) {
                continue; // comment this out to test
            }
            // then check gate (track exposure)
            if (enabled &&
                !enabled({ gate, currentAccount, currentProfile, preferences })) {
                continue;
            }
            logger.debug(`NUX dialogs: activating '${id}' NUX`);
            // we have a winner
            setActiveNux(id);
            // immediately snooze for a day
            snoozeNuxDialog();
            // immediately update remote data (affects next reload)
            saveNux({
                id,
                completed: true,
                data: undefined,
            }).catch(e => {
                logger.error(`NUX dialogs: failed to upsert '${id}' NUX`, {
                    safeMessage: e.message,
                });
            });
            break;
        }
    }, [
        nuxs,
        snoozed,
        snoozeNuxDialog,
        saveNux,
        gate,
        currentAccount,
        currentProfile,
        preferences,
    ]);
    const ctx = React.useMemo(() => {
        return {
            activeNux,
            dismissActiveNux,
        };
    }, [activeNux, dismissActiveNux]);
    return (_jsx(Context.Provider, { value: ctx, children: activeNux === Nux.BookmarksAnnouncement && _jsx(BookmarksAnnouncement, {}) }));
}
//# sourceMappingURL=index.js.map