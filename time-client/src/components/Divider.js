import { jsx as _jsx } from "react/jsx-runtime";
import { View } from 'react-native';
import { atoms as a, useTheme } from '#/alf';
export function Divider({ style }) {
    const t = useTheme();
    return (_jsx(View, { style: [a.w_full, a.border_t, t.atoms.border_contrast_low, style] }));
}
//# sourceMappingURL=Divider.js.map