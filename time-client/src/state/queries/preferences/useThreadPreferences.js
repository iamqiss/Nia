import { useCallback, useMemo, useRef, useState } from 'react';
import {} from '@atproto/api';
import debounce from 'lodash.debounce';
import { OnceKey, useCallOnce } from '#/lib/hooks/useCallOnce';
import { logger } from '#/logger';
import { usePreferencesQuery, useSetThreadViewPreferencesMutation, } from '#/state/queries/preferences';
import {} from '#/state/queries/preferences/types';
import {} from '#/types/utils';
export function useThreadPreferences({ save, } = {}) {
    const { data: preferences } = usePreferencesQuery();
    const serverPrefs = preferences?.threadViewPrefs;
    const once = useCallOnce(OnceKey.PreferencesThread);
    /*
     * Create local state representations of server state
     */
    const [sort, setSort] = useState(normalizeSort(serverPrefs?.sort || 'top'));
    const [view, setView] = useState(normalizeView({
        treeViewEnabled: !!serverPrefs?.lab_treeViewEnabled,
    }));
    const [prioritizeFollowedUsers, setPrioritizeFollowedUsers] = useState(!!serverPrefs?.prioritizeFollowedUsers);
    /**
     * If we get a server update, update local state
     */
    const [prevServerPrefs, setPrevServerPrefs] = useState(serverPrefs);
    const isLoaded = !!prevServerPrefs;
    if (serverPrefs && prevServerPrefs !== serverPrefs) {
        setPrevServerPrefs(serverPrefs);
        /*
         * Update
         */
        setSort(normalizeSort(serverPrefs.sort));
        setPrioritizeFollowedUsers(serverPrefs.prioritizeFollowedUsers);
        setView(normalizeView({
            treeViewEnabled: !!serverPrefs.lab_treeViewEnabled,
        }));
        once(() => {
            logger.metric('thread:preferences:load', {
                sort: serverPrefs.sort,
                view: serverPrefs.lab_treeViewEnabled ? 'tree' : 'linear',
                prioritizeFollowedUsers: serverPrefs.prioritizeFollowedUsers,
            });
        });
    }
    const userUpdatedPrefs = useRef(false);
    const [isSaving, setIsSaving] = useState(false);
    const { mutateAsync } = useSetThreadViewPreferencesMutation();
    const savePrefs = useMemo(() => {
        return debounce(async (prefs) => {
            try {
                setIsSaving(true);
                await mutateAsync(prefs);
                logger.metric('thread:preferences:update', {
                    sort: prefs.sort,
                    view: prefs.lab_treeViewEnabled ? 'tree' : 'linear',
                    prioritizeFollowedUsers: prefs.prioritizeFollowedUsers,
                });
            }
            catch (e) {
                logger.error('useThreadPreferences failed to save', {
                    safeMessage: e,
                });
            }
            finally {
                setIsSaving(false);
            }
        }, 4e3);
    }, [mutateAsync]);
    if (save && userUpdatedPrefs.current) {
        savePrefs({
            sort,
            prioritizeFollowedUsers,
            lab_treeViewEnabled: view === 'tree',
        });
        userUpdatedPrefs.current = false;
    }
    const setSortWrapped = useCallback((next) => {
        userUpdatedPrefs.current = true;
        setSort(normalizeSort(next));
    }, [setSort]);
    const setViewWrapped = useCallback((next) => {
        userUpdatedPrefs.current = true;
        setView(next);
    }, [setView]);
    const setPrioritizeFollowedUsersWrapped = useCallback((next) => {
        userUpdatedPrefs.current = true;
        setPrioritizeFollowedUsers(next);
    }, [setPrioritizeFollowedUsers]);
    return useMemo(() => ({
        isLoaded,
        isSaving,
        sort,
        setSort: setSortWrapped,
        view,
        setView: setViewWrapped,
        prioritizeFollowedUsers,
        setPrioritizeFollowedUsers: setPrioritizeFollowedUsersWrapped,
    }), [
        isLoaded,
        isSaving,
        sort,
        setSortWrapped,
        view,
        setViewWrapped,
        prioritizeFollowedUsers,
        setPrioritizeFollowedUsersWrapped,
    ]);
}
/**
 * Migrates user thread preferences from the old sort values to V2
 */
export function normalizeSort(sort) {
    switch (sort) {
        case 'oldest':
            return 'oldest';
        case 'newest':
            return 'newest';
        default:
            return 'top';
    }
}
/**
 * Transforms existing treeViewEnabled preference into a ThreadViewOption
 */
export function normalizeView({ treeViewEnabled, }) {
    return treeViewEnabled ? 'tree' : 'linear';
}
//# sourceMappingURL=useThreadPreferences.js.map