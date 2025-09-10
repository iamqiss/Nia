import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
const CurrentConvoIdContext = React.createContext({
    currentConvoId: undefined,
    setCurrentConvoId: () => { },
});
CurrentConvoIdContext.displayName = 'CurrentConvoIdContext';
export function useCurrentConvoId() {
    const ctx = React.useContext(CurrentConvoIdContext);
    if (!ctx) {
        throw new Error('useCurrentConvoId must be used within a CurrentConvoIdProvider');
    }
    return ctx;
}
export function CurrentConvoIdProvider({ children, }) {
    const [currentConvoId, setCurrentConvoId] = React.useState();
    const ctx = React.useMemo(() => ({ currentConvoId, setCurrentConvoId }), [currentConvoId]);
    return (_jsx(CurrentConvoIdContext.Provider, { value: ctx, children: children }));
}
//# sourceMappingURL=current-convo-id.js.map