import { jsx as _jsx } from "react/jsx-runtime";
import { Image } from 'expo-image';
import {} from '#/screens/Settings/AppIconSettings/types';
import { atoms as a, platform, useTheme } from '#/alf';
export function AppIconImage({ icon, size = 50, }) {
    const t = useTheme();
    return (_jsx(Image, { source: platform({
            ios: icon.iosImage(),
            android: icon.androidImage(),
        }), style: [
            { width: size, height: size },
            platform({
                ios: { borderRadius: size / 5 },
                android: a.rounded_full,
            }),
            a.curve_continuous,
            t.atoms.border_contrast_medium,
            a.border,
        ], accessibilityIgnoresInvertColors: true }));
}
//# sourceMappingURL=AppIconImage.js.map