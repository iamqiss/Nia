import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { createPortalGroup_INTERNAL } from './lib/Portal';
export const Context = React.createContext({});
Context.displayName = 'BottomSheetPortalContext';
export const useBottomSheetPortal_INTERNAL = () => React.useContext(Context);
export function BottomSheetPortalProvider({ children, }) {
    const portal = React.useMemo(() => {
        return createPortalGroup_INTERNAL();
    }, []);
    return (_jsx(Context.Provider, { value: portal.Portal, children: _jsxs(portal.Provider, { children: [children, _jsx(portal.Outlet, {})] }) }));
}
const defaultPortal = createPortalGroup_INTERNAL();
export const BottomSheetOutlet = defaultPortal.Outlet;
export function BottomSheetProvider({ children }) {
    return (_jsx(Context.Provider, { value: defaultPortal.Portal, children: _jsx(defaultPortal.Provider, { children: children }) }));
}
//# sourceMappingURL=BottomSheetPortal.js.map