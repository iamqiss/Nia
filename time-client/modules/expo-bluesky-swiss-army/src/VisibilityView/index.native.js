import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { requireNativeModule, requireNativeViewManager } from 'expo-modules-core';
import { VisibilityViewProps } from './types';
const NativeView = requireNativeViewManager('ExpoBlueskyVisibilityView');
const NativeModule = requireNativeModule('ExpoBlueskyVisibilityView');
export async function updateActiveViewAsync() {
    await NativeModule.updateActiveViewAsync();
}
export default function VisibilityView({ children, onChangeStatus: onChangeStatusOuter, enabled, }) {
    const onChangeStatus = React.useCallback((e) => {
        onChangeStatusOuter(e.nativeEvent.isActive);
    }, [onChangeStatusOuter]);
    return (_jsx(NativeView, { onChangeStatus: onChangeStatus, enabled: enabled, style: { flex: 1 }, children: children }));
}
//# sourceMappingURL=index.native.js.map