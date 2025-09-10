import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, } from 'react';
import { KeyboardProvider, useKeyboardController, } from 'react-native-keyboard-controller';
import { useFocusEffect } from '@react-navigation/native';
const KeyboardControllerRefCountContext = createContext({
    incrementRefCount: () => { },
    decrementRefCount: () => { },
});
KeyboardControllerRefCountContext.displayName =
    'KeyboardControllerRefCountContext';
export function KeyboardControllerProvider({ children, }) {
    return (_jsx(KeyboardProvider, { enabled: false, children: _jsx(KeyboardControllerProviderInner, { children: children }) }));
}
function KeyboardControllerProviderInner({ children, }) {
    const { setEnabled } = useKeyboardController();
    const refCount = useRef(0);
    const value = useMemo(() => ({
        incrementRefCount: () => {
            refCount.current++;
            setEnabled(refCount.current > 0);
        },
        decrementRefCount: () => {
            refCount.current--;
            setEnabled(refCount.current > 0);
            if (__DEV__ && refCount.current < 0) {
                console.error('KeyboardController ref count < 0');
            }
        },
    }), [setEnabled]);
    return (_jsx(KeyboardControllerRefCountContext.Provider, { value: value, children: children }));
}
export function useEnableKeyboardController(shouldEnable) {
    const { incrementRefCount, decrementRefCount } = useContext(KeyboardControllerRefCountContext);
    useEffect(() => {
        if (!shouldEnable) {
            return;
        }
        incrementRefCount();
        return () => {
            decrementRefCount();
        };
    }, [shouldEnable, incrementRefCount, decrementRefCount]);
}
/**
 * Like `useEnableKeyboardController`, but using `useFocusEffect`
 */
export function useEnableKeyboardControllerScreen(shouldEnable) {
    const { incrementRefCount, decrementRefCount } = useContext(KeyboardControllerRefCountContext);
    useFocusEffect(useCallback(() => {
        if (!shouldEnable) {
            return;
        }
        incrementRefCount();
        return () => {
            decrementRefCount();
        };
    }, [shouldEnable, incrementRefCount, decrementRefCount]));
}
//# sourceMappingURL=useEnableKeyboardController.js.map