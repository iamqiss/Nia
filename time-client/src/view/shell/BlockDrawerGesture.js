import { jsx as _jsx } from "react/jsx-runtime";
import { useContext } from 'react';
import { DrawerGestureContext } from 'react-native-drawer-layout';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
export function BlockDrawerGesture({ children }) {
    const drawerGesture = useContext(DrawerGestureContext) ?? Gesture.Native(); // noop for web
    const scrollGesture = Gesture.Native().blocksExternalGesture(drawerGesture);
    return _jsx(GestureDetector, { gesture: scrollGesture, children: children });
}
//# sourceMappingURL=BlockDrawerGesture.js.map