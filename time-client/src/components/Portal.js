import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { createContext, Fragment, useCallback, useContext, useEffect, useId, useMemo, useRef, useState, } from 'react';
export function createPortalGroup() {
    const Context = createContext({
        outlet: null,
        append: () => { },
        remove: () => { },
    });
    Context.displayName = 'PortalContext';
    function Provider(props) {
        const map = useRef({});
        const [outlet, setOutlet] = useState(null);
        const append = useCallback((id, component) => {
            if (map.current[id])
                return;
            map.current[id] = _jsx(Fragment, { children: component }, id);
            setOutlet(_jsx(_Fragment, { children: Object.values(map.current) }));
        }, []);
        const remove = useCallback(id => {
            map.current[id] = null;
            setOutlet(_jsx(_Fragment, { children: Object.values(map.current) }));
        }, []);
        const contextValue = useMemo(() => ({
            outlet,
            append,
            remove,
        }), [outlet, append, remove]);
        return (_jsx(Context.Provider, { value: contextValue, children: props.children }));
    }
    function Outlet() {
        const ctx = useContext(Context);
        return ctx.outlet;
    }
    function Portal({ children }) {
        const { append, remove } = useContext(Context);
        const id = useId();
        useEffect(() => {
            append(id, children);
            return () => remove(id);
        }, [id, children, append, remove]);
        return null;
    }
    return { Provider, Outlet, Portal };
}
const DefaultPortal = createPortalGroup();
export const Provider = DefaultPortal.Provider;
export const Outlet = DefaultPortal.Outlet;
export const Portal = DefaultPortal.Portal;
//# sourceMappingURL=Portal.js.map