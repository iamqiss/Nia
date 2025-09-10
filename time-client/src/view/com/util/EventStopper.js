import { jsx as _jsx } from "react/jsx-runtime";
import { View } from 'react-native';
/**
 * This utility function captures events and stops
 * them from propagating upwards.
 */
export function EventStopper({ children, style, onKeyDown = true, }) {
    const stop = (e) => {
        e.stopPropagation();
    };
    return (_jsx(View, { onStartShouldSetResponder: _ => true, onTouchEnd: stop, 
        // @ts-ignore web only -prf
        onClick: stop, onKeyDown: onKeyDown ? stop : undefined, style: style, children: children }));
}
//# sourceMappingURL=EventStopper.js.map