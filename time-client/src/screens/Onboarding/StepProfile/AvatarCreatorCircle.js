import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import {} from '#/screens/Onboarding/StepProfile/index';
import { atoms as a, useTheme } from '#/alf';
export function AvatarCreatorCircle({ avatar, size = 125, }) {
    const t = useTheme();
    const Icon = avatar.placeholder.component;
    const styles = React.useMemo(() => ({
        imageContainer: [
            a.rounded_full,
            a.overflow_hidden,
            a.align_center,
            a.justify_center,
            a.border,
            t.atoms.border_contrast_high,
            {
                height: size,
                width: size,
                backgroundColor: avatar.backgroundColor,
            },
        ],
    }), [avatar.backgroundColor, size, t.atoms.border_contrast_high]);
    return (_jsx(View, { children: _jsx(View, { style: styles.imageContainer, children: _jsx(Icon, { height: 85, width: 85, style: { color: t.palette.white } }) }) }));
}
//# sourceMappingURL=AvatarCreatorCircle.js.map