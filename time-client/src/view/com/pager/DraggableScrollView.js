import { jsx as _jsx } from "react/jsx-runtime";
import {} from 'react';
import { ScrollView } from 'react-native';
import { useDraggableScroll } from '#/lib/hooks/useDraggableScrollView';
import { atoms as a, web } from '#/alf';
export function DraggableScrollView({ ref, style, ...props }) {
    const { refs } = useDraggableScroll({
        outerRef: ref,
        cursor: 'grab', // optional, default
    });
    return (_jsx(ScrollView, { ref: refs, style: [style, web(a.user_select_none)], horizontal: true, ...props }));
}
//# sourceMappingURL=DraggableScrollView.js.map