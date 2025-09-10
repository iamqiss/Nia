import { jsx as _jsx } from "react/jsx-runtime";
import { View } from 'react-native';
import { Trans } from '@lingui/macro';
import { atoms as a, tokens, useTheme } from '#/alf';
import { Text } from '#/components/Typography';
export function LiveIndicator({ size = 'small', style, }) {
    const t = useTheme();
    const fontSize = {
        tiny: { fontSize: 7, letterSpacing: tokens.TRACKING },
        small: a.text_2xs,
        large: a.text_xs,
    }[size];
    return (_jsx(View, { style: [
            a.absolute,
            a.w_full,
            a.align_center,
            a.pointer_events_none,
            { bottom: size === 'large' ? -8 : -5 },
            style,
        ], children: _jsx(View, { style: {
                backgroundColor: t.palette.negative_500,
                paddingVertical: size === 'large' ? 2 : 1,
                paddingHorizontal: size === 'large' ? 4 : 3,
                borderRadius: size === 'large' ? 5 : tokens.borderRadius.xs,
            }, children: _jsx(Text, { style: [
                    a.text_center,
                    a.font_bold,
                    fontSize,
                    { color: t.palette.white },
                ], children: _jsx(Trans, { comment: "Live status indicator on avatar. Should be extremely short, not much space for more than 4 characters", children: "LIVE" }) }) }) }));
}
//# sourceMappingURL=LiveIndicator.js.map