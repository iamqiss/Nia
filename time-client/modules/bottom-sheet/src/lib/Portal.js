import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
export function createPortalGroup_INTERNAL() {
    const Context = React.createContext({
        outlet: null,
        append: () => { },
        remove: () => { },
    });
    Context.displayName = 'BottomSheetPortalContext';
    function Provider(props) {
        const map = React.useRef({});
        const [outlet, setOutlet] = React.useState(null);
        const append = React.useCallback((id, component) => {
            if (map.current[id])
                return;
            map.current[id] = _jsx(React.Fragment, { children: component }, id);
            setOutlet(_jsx(_Fragment, { children: Object.values(map.current) }));
        }, []);
        const remove = React.useCallback(id => {
            delete map.current[id];
            setOutlet(_jsx(_Fragment, { children: Object.values(map.current) }));
        }, []);
        const contextValue = React.useMemo(() => ({
            outlet,
            append,
            remove,
        }), [outlet, append, remove]);
        return (_jsx(Context.Provider, { value: contextValue, children: props.children }));
    }
    function Outlet() {
        const ctx = React.useContext(Context);
        return ctx.outlet;
    }
    function Portal({ children }) {
        const { append, remove } = React.useContext(Context);
        const id = React.useId();
        React.useEffect(() => {
            append(id, children);
            return () => remove(id);
        }, [id, children, append, remove]);
        return null;
    }
    return { Provider, Outlet, Portal };
}
//# sourceMappingURL=Portal.js.map