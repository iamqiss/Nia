import React from 'react';
import {} from '#/components/Menu/types';
export const Context = React.createContext(null);
Context.displayName = 'MenuContext';
export const ItemContext = React.createContext(null);
ItemContext.displayName = 'MenuItemContext';
export function useMenuContext() {
    const context = React.useContext(Context);
    if (!context) {
        throw new Error('useMenuContext must be used within a Context.Provider');
    }
    return context;
}
export function useMenuItemContext() {
    const context = React.useContext(ItemContext);
    if (!context) {
        throw new Error('useMenuItemContext must be used within a Context.Provider');
    }
    return context;
}
//# sourceMappingURL=context.js.map