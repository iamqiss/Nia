import { jsx as _jsx } from "react/jsx-runtime";
import { requireNativeViewManager } from 'expo-modules-core';
import {} from './ExpoScrollForwarder.types';
const NativeView = requireNativeViewManager('ExpoScrollForwarder');
export function ExpoScrollForwarderView({ children, ...rest }) {
    return _jsx(NativeView, { ...rest, children: children });
}
//# sourceMappingURL=ExpoScrollForwarderView.ios.js.map