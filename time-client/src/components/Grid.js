import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useMemo } from 'react';
import { View } from 'react-native';
import { atoms as a } from '#/alf';
const Context = createContext({
    gap: 0,
});
Context.displayName = 'GridContext';
export function Row({ children, gap = 0, style, }) {
    return (_jsx(Context.Provider, { value: useMemo(() => ({ gap }), [gap]), children: _jsx(View, { style: [
                a.flex_row,
                a.flex_1,
                {
                    marginLeft: -gap / 2,
                    marginRight: -gap / 2,
                },
                style,
            ], children: children }) }));
}
export function Col({ children, width = 1, style, }) {
    const { gap } = useContext(Context);
    return (_jsx(View, { style: [
            a.flex_col,
            {
                paddingLeft: gap / 2,
                paddingRight: gap / 2,
                width: `${width * 100}%`,
            },
            style,
        ], children: children }));
}
//# sourceMappingURL=Grid.js.map