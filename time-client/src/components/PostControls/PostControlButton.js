import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useMemo } from 'react';
import {} from 'react-native';
import { useHaptics } from '#/lib/haptics';
import { atoms as a, useTheme } from '#/alf';
import { Button } from '#/components/Button';
import {} from '#/components/icons/common';
import { Text } from '#/components/Typography';
export const DEFAULT_HITSLOP = { top: 5, bottom: 10, left: 10, right: 10 };
const PostControlContext = createContext({});
PostControlContext.displayName = 'PostControlContext';
// Base button style, which the the other ones extend
export function PostControlButton({ ref, onPress, onLongPress, children, big, active, activeColor, ...props }) {
    const t = useTheme();
    const playHaptic = useHaptics();
    const ctx = useMemo(() => ({
        big,
        active,
        color: {
            color: activeColor && active ? activeColor : t.palette.contrast_500,
        },
    }), [big, active, activeColor, t.palette.contrast_500]);
    const style = useMemo(() => [
        a.flex_row,
        a.align_center,
        a.gap_xs,
        a.bg_transparent,
        { padding: 5 },
    ], []);
    const handlePress = useMemo(() => {
        if (!onPress)
            return;
        return (evt) => {
            playHaptic('Light');
            onPress(evt);
        };
    }, [onPress, playHaptic]);
    const handleLongPress = useMemo(() => {
        if (!onLongPress)
            return;
        return (evt) => {
            playHaptic('Heavy');
            onLongPress(evt);
        };
    }, [onLongPress, playHaptic]);
    return (_jsx(Button, { ref: ref, onPress: handlePress, onLongPress: handleLongPress, style: style, hoverStyle: t.atoms.bg_contrast_25, shape: "round", variant: "ghost", color: "secondary", ...props, hitSlop: {
            ...DEFAULT_HITSLOP,
            ...(props.hitSlop || {}),
        }, children: typeof children === 'function' ? (args => (_jsx(PostControlContext.Provider, { value: ctx, children: children(args) }))) : (_jsx(PostControlContext.Provider, { value: ctx, children: children })) }));
}
export function PostControlButtonIcon({ icon: Comp, style, ...rest }) {
    const { big, color } = useContext(PostControlContext);
    return (_jsx(Comp, { style: [color, a.pointer_events_none, style], ...rest, width: big ? 22 : 18 }));
}
export function PostControlButtonText({ style, ...props }) {
    const { big, active, color } = useContext(PostControlContext);
    return (_jsx(Text, { style: [color, big ? a.text_md : a.text_sm, active && a.font_bold, style], ...props }));
}
//# sourceMappingURL=PostControlButton.js.map