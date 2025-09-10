import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { render } from '@testing-library/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootSiblingParent } from 'react-native-root-siblings';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootStoreProvider, RootStoreModel } from '../src/state';
import { ThemeProvider } from '../src/lib/ThemeContext';
const customRender = (ui, rootStore) => render(
// eslint-disable-next-line react-native/no-inline-styles
_jsx(GestureHandlerRootView, { style: { flex: 1 }, children: _jsx(RootSiblingParent, { children: _jsx(RootStoreProvider, { value: rootStore, children: _jsx(ThemeProvider, { theme: "light", children: _jsx(SafeAreaProvider, { children: ui }) }) }) }) }));
// re-export everything
export * from '@testing-library/react-native';
// override render method
export { customRender as render };
//# sourceMappingURL=test-utils.js.map