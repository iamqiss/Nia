import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useMemo } from 'react';
import {} from 'react-native-reanimated';
const ScrollContext = createContext({
    onBeginDrag: undefined,
    onEndDrag: undefined,
    onScroll: undefined,
    onMomentumEnd: undefined,
});
ScrollContext.displayName = 'ScrollContext';
export function useScrollHandlers() {
    return useContext(ScrollContext);
}
// Note: this completely *overrides* the parent handlers.
// It's up to you to compose them with the parent ones via useScrollHandlers() if needed.
export function ScrollProvider({ children, onBeginDrag, onEndDrag, onScroll, onMomentumEnd, }) {
    const handlers = useMemo(() => ({
        onBeginDrag,
        onEndDrag,
        onScroll,
        onMomentumEnd,
    }), [onBeginDrag, onEndDrag, onScroll, onMomentumEnd]);
    return (_jsx(ScrollContext.Provider, { value: handlers, children: children }));
}
//# sourceMappingURL=ScrollContext.js.map