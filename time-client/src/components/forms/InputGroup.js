import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { atoms, useTheme } from '#/alf';
/**
 * NOT FINISHED, just here as a reference
 */
export function InputGroup(props) {
    const t = useTheme();
    const children = React.Children.toArray(props.children);
    const total = children.length;
    return (_jsx(View, { style: [atoms.w_full], children: children.map((child, i) => {
            return React.isValidElement(child) ? (_jsxs(React.Fragment, { children: [i > 0 ? (_jsx(View, { style: [atoms.border_b, { borderColor: t.palette.contrast_500 }] })) : null, React.cloneElement(child, {
                        // @ts-ignore
                        style: [
                            // @ts-ignore
                            ...(Array.isArray(child.props?.style)
                                ? // @ts-ignore
                                    child.props.style
                                : // @ts-ignore
                                    [child.props.style || {}]),
                            {
                                borderTopLeftRadius: i > 0 ? 0 : undefined,
                                borderTopRightRadius: i > 0 ? 0 : undefined,
                                borderBottomLeftRadius: i < total - 1 ? 0 : undefined,
                                borderBottomRightRadius: i < total - 1 ? 0 : undefined,
                                borderBottomWidth: i < total - 1 ? 0 : undefined,
                            },
                        ],
                    })] }, i)) : null;
        }) }));
}
//# sourceMappingURL=InputGroup.js.map