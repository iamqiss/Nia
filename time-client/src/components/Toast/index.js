import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { nanoid } from 'nanoid/non-secure';
import { toast as sonner, Toaster } from 'sonner-native';
import { atoms as a } from '#/alf';
import { DURATION } from '#/components/Toast/const';
import { Icon as ToastIcon, Outer as BaseOuter, Text as ToastText, ToastConfigProvider, } from '#/components/Toast/Toast';
import {} from '#/components/Toast/types';
export { DURATION } from '#/components/Toast/const';
export { Action, Icon, Text, ToastConfigProvider } from '#/components/Toast/Toast';
export {} from '#/components/Toast/types';
/**
 * Toasts are rendered in a global outlet, which is placed at the top of the
 * component tree.
 */
export function ToastOutlet() {
    return _jsx(Toaster, { pauseWhenPageIsHidden: true, gap: a.gap_sm.gap });
}
export function Outer({ children }) {
    return (_jsx(View, { style: [a.px_xl, a.w_full], children: _jsx(BaseOuter, { children: children }) }));
}
/**
 * Access the full Sonner API
 */
export const api = sonner;
/**
 * Our base toast API, using the `Toast` export of this file.
 */
export function show(content, { type = 'default', ...options } = {}) {
    const id = nanoid();
    if (typeof content === 'string') {
        sonner.custom(_jsx(ToastConfigProvider, { id: id, type: type, children: _jsxs(Outer, { children: [_jsx(ToastIcon, {}), _jsx(ToastText, { children: content })] }) }), {
            ...options,
            id,
            duration: options?.duration ?? DURATION,
        });
    }
    else if (React.isValidElement(content)) {
        sonner.custom(_jsx(ToastConfigProvider, { id: id, type: type, children: content }), {
            ...options,
            id,
            duration: options?.duration ?? DURATION,
        });
    }
    else {
        throw new Error(`Toast can be a string or a React element, got ${typeof content}`);
    }
}
//# sourceMappingURL=index.js.map