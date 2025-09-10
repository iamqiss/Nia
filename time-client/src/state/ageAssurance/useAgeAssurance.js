import { useMemo } from 'react';
import { useAgeAssuranceContext } from '#/state/ageAssurance';
import { logger } from '#/state/ageAssurance/util';
import { usePreferencesQuery } from '#/state/queries/preferences';
/**
 * Computed age information based on age assurance status and the user's
 * declared age. Use this instead of {@link useAgeAssuranceContext} to get a
 * more user-friendly interface.
 */
export function useAgeAssurance() {
    const aa = useAgeAssuranceContext();
    const { isFetched: preferencesLoaded, data: preferences } = usePreferencesQuery();
    const declaredAge = preferences?.userAge;
    return useMemo(() => {
        const isReady = aa.isReady && preferencesLoaded;
        const isDeclaredUnderage = declaredAge !== undefined ? declaredAge < 18 : false;
        const state = {
            isReady,
            status: aa.status,
            lastInitiatedAt: aa.lastInitiatedAt,
            isAgeRestricted: aa.isAgeRestricted,
            declaredAge,
            isDeclaredUnderage,
        };
        logger.debug(`state`, state);
        return state;
    }, [aa, preferencesLoaded, declaredAge]);
}
//# sourceMappingURL=useAgeAssurance.js.map