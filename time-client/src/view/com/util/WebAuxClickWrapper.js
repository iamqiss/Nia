import { jsx as _jsx } from "react/jsx-runtime";
import { Platform } from 'react-native';
const onMouseUp = (e) => {
    // Only handle whenever it is the middle button
    if (e.button !== 1 || e.target.closest('a') || e.target.tagName === 'A') {
        return;
    }
    e.target.dispatchEvent(new MouseEvent('click', { metaKey: true, bubbles: true }));
};
const onMouseDown = (e) => {
    // Prevents the middle click scroll from enabling
    if (e.button !== 1)
        return;
    e.preventDefault();
};
export function WebAuxClickWrapper({ children }) {
    if (Platform.OS !== 'web')
        return children;
    return (
    // @ts-ignore web only
    _jsx("div", { onMouseDown: onMouseDown, onMouseUp: onMouseUp, children: children }));
}
//# sourceMappingURL=WebAuxClickWrapper.js.map