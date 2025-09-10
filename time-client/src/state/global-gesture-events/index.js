import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector, } from 'react-native-gesture-handler';
import EventEmitter from 'eventemitter3';
const Context = createContext({
    events: new EventEmitter(),
    register: () => { },
    unregister: () => { },
});
Context.displayName = 'GlobalGestureEventsContext';
export function GlobalGestureEventsProvider({ children, }) {
    const refCount = useRef(0);
    const events = useMemo(() => new EventEmitter(), []);
    const [enabled, setEnabled] = useState(false);
    const ctx = useMemo(() => ({
        events,
        register() {
            refCount.current += 1;
            if (refCount.current === 1) {
                setEnabled(true);
            }
        },
        unregister() {
            refCount.current -= 1;
            if (refCount.current === 0) {
                setEnabled(false);
            }
        },
    }), [events, setEnabled]);
    const gesture = Gesture.Pan()
        .runOnJS(true)
        .enabled(enabled)
        .simultaneousWithExternalGesture()
        .onBegin(e => {
        events.emit('begin', e);
    })
        .onUpdate(e => {
        events.emit('update', e);
    })
        .onEnd(e => {
        events.emit('end', e);
    })
        .onFinalize(e => {
        events.emit('finalize', e);
    });
    return (_jsx(Context.Provider, { value: ctx, children: _jsx(GestureDetector, { gesture: gesture, children: _jsx(View, { collapsable: false, children: children }) }) }));
}
export function useGlobalGestureEvents() {
    return useContext(Context);
}
//# sourceMappingURL=index.js.map