import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { nanoid } from 'nanoid/non-secure';
import { useNonReactiveCallback } from '#/lib/hooks/useNonReactiveCallback';
import {} from '#/view/com/lightbox/ImageViewing/@types';
const LightboxContext = React.createContext({
    activeLightbox: null,
});
LightboxContext.displayName = 'LightboxContext';
const LightboxControlContext = React.createContext({
    openLightbox: () => { },
    closeLightbox: () => false,
});
LightboxControlContext.displayName = 'LightboxControlContext';
export function Provider({ children }) {
    const [activeLightbox, setActiveLightbox] = React.useState(null);
    const openLightbox = useNonReactiveCallback((lightbox) => {
        setActiveLightbox(prevLightbox => {
            if (prevLightbox) {
                // Ignore duplicate open requests. If it's already open,
                // the user has to explicitly close the previous one first.
                return prevLightbox;
            }
            else {
                return { ...lightbox, id: nanoid() };
            }
        });
    });
    const closeLightbox = useNonReactiveCallback(() => {
        let wasActive = !!activeLightbox;
        setActiveLightbox(null);
        return wasActive;
    });
    const state = React.useMemo(() => ({
        activeLightbox,
    }), [activeLightbox]);
    const methods = React.useMemo(() => ({
        openLightbox,
        closeLightbox,
    }), [openLightbox, closeLightbox]);
    return (_jsx(LightboxContext.Provider, { value: state, children: _jsx(LightboxControlContext.Provider, { value: methods, children: children }) }));
}
export function useLightbox() {
    return React.useContext(LightboxContext);
}
export function useLightboxControls() {
    return React.useContext(LightboxControlContext);
}
//# sourceMappingURL=lightbox.js.map