import { jsx as _jsx } from "react/jsx-runtime";
import { View } from 'react-native';
import { atoms as a, flatten, useTheme, } from '#/alf';
import {} from '#/components/icons/common';
import {} from '#/components/icons/Growth';
export function IconCircle({ icon: Icon, size = 'xl', style, iconStyle, }) {
    const t = useTheme();
    return (_jsx(View, { style: [
            a.justify_center,
            a.align_center,
            a.rounded_full,
            {
                width: size === 'lg' ? 52 : 64,
                height: size === 'lg' ? 52 : 64,
                backgroundColor: t.palette.primary_50,
            },
            flatten(style),
        ], children: _jsx(Icon, { size: size, style: [
                {
                    color: t.palette.primary_500,
                },
                flatten(iconStyle),
            ] }) }));
}
//# sourceMappingURL=IconCircle.js.map