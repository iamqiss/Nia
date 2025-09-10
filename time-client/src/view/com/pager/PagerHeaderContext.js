import { jsx as _jsx } from "react/jsx-runtime";
import React, { useContext } from 'react';
import {} from 'react-native-reanimated';
import { isNative } from '#/platform/detection';
export const PagerHeaderContext = React.createContext(null);
PagerHeaderContext.displayName = 'PagerHeaderContext';
/**
 * Passes information about the scroll position and header height down via
 * context for the pager header to consume.
 *
 * @platform ios, android
 */
export function PagerHeaderProvider({ scrollY, headerHeight, children, }) {
    const value = React.useMemo(() => ({ scrollY, headerHeight }), [scrollY, headerHeight]);
    return (_jsx(PagerHeaderContext.Provider, { value: value, children: children }));
}
export function usePagerHeaderContext() {
    const ctx = useContext(PagerHeaderContext);
    if (isNative) {
        if (!ctx) {
            throw new Error('usePagerHeaderContext must be used within a HeaderProvider');
        }
        return ctx;
    }
    else {
        return null;
    }
}
//# sourceMappingURL=PagerHeaderContext.js.map