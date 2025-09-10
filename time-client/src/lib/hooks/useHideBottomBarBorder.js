import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
const HideBottomBarBorderContext = createContext(false);
HideBottomBarBorderContext.displayName = 'HideBottomBarBorderContext';
const HideBottomBarBorderSetterContext = createContext(null);
HideBottomBarBorderSetterContext.displayName =
    'HideBottomBarBorderSetterContext';
export function useHideBottomBarBorderSetter() {
    const hideBottomBarBorder = useContext(HideBottomBarBorderSetterContext);
    if (!hideBottomBarBorder) {
        throw new Error('useHideBottomBarBorderSetter must be used within a HideBottomBarBorderProvider');
    }
    return hideBottomBarBorder;
}
export function useHideBottomBarBorderForScreen() {
    const hideBorder = useHideBottomBarBorderSetter();
    useFocusEffect(useCallback(() => {
        const cleanup = hideBorder();
        return () => cleanup();
    }, [hideBorder]));
}
export function useHideBottomBarBorder() {
    return useContext(HideBottomBarBorderContext);
}
export function Provider({ children }) {
    const [refCount, setRefCount] = useState(0);
    const setter = useCallback(() => {
        setRefCount(prev => prev + 1);
        return () => setRefCount(prev => prev - 1);
    }, []);
    return (_jsx(HideBottomBarBorderSetterContext.Provider, { value: setter, children: _jsx(HideBottomBarBorderContext.Provider, { value: refCount > 0, children: children }) }));
}
//# sourceMappingURL=useHideBottomBarBorder.js.map