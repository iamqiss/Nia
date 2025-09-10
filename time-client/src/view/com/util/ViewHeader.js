import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import {} from 'react';
import { Header } from '#/components/Layout';
/**
 * Legacy ViewHeader component. Use Layout.Header going forward.
 *
 * @deprecated use `Layout.Header` from `#/components/Layout.tsx`
 */
export function ViewHeader({ title, renderButton, }) {
    return (_jsxs(Header.Outer, { children: [_jsx(Header.BackButton, {}), _jsx(Header.Content, { children: _jsx(Header.TitleText, { children: title }) }), _jsx(Header.Slot, { children: renderButton?.() ?? null })] }));
}
//# sourceMappingURL=ViewHeader.js.map