import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
const MessageContext = React.createContext(false);
MessageContext.displayName = 'MessageContext';
export function MessageContextProvider({ children, }) {
    return (_jsx(MessageContext.Provider, { value: true, children: children }));
}
export function useIsWithinMessage() {
    return React.useContext(MessageContext);
}
//# sourceMappingURL=MessageContext.js.map