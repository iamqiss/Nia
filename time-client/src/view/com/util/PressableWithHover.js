import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { Pressable, } from 'react-native';
import {} from 'react-native';
import { addStyle } from '#/lib/styles';
import { useInteractionState } from '#/components/hooks/useInteractionState';
export const PressableWithHover = forwardRef(function PressableWithHoverImpl({ children, style, hoverStyle, ...props }, ref) {
    const { state: hovered, onIn: onHoverIn, onOut: onHoverOut, } = useInteractionState();
    return (_jsx(Pressable, { ...props, style: typeof style !== 'function' && hovered
            ? addStyle(style, hoverStyle)
            : style, onHoverIn: onHoverIn, onHoverOut: onHoverOut, ref: ref, children: children }));
});
//# sourceMappingURL=PressableWithHover.js.map