import { useMemo } from 'react';
import { useNavigation } from '@react-navigation/core';
import { useDedupe } from '#/lib/hooks/useDedupe';
import {} from '#/lib/routes/types';
export function useNavigationDeduped() {
    const navigation = useNavigation();
    const dedupe = useDedupe();
    return useMemo(() => ({
        push: (...args) => {
            dedupe(() => navigation.push(...args));
        },
        navigate: (...args) => {
            dedupe(() => navigation.navigate(...args));
        },
        replace: (...args) => {
            dedupe(() => navigation.replace(...args));
        },
        dispatch: (...args) => {
            dedupe(() => navigation.dispatch(...args));
        },
        popToTop: () => {
            dedupe(() => navigation.popToTop());
        },
        popTo: (...args) => {
            dedupe(() => navigation.popTo(...args));
        },
        pop: (...args) => {
            dedupe(() => navigation.pop(...args));
        },
        goBack: () => {
            dedupe(() => navigation.goBack());
        },
        canGoBack: () => {
            return navigation.canGoBack();
        },
        getState: () => {
            return navigation.getState();
        },
        getParent: (...args) => {
            return navigation.getParent(...args);
        },
    }), [dedupe, navigation]);
}
//# sourceMappingURL=useNavigationDeduped.js.map