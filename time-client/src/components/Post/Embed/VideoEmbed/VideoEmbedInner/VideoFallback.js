import { jsx as _jsx } from "react/jsx-runtime";
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { atoms as a, useTheme } from '#/alf';
import { Button, ButtonText } from '#/components/Button';
import { Text as TypoText } from '#/components/Typography';
export function Container({ children }) {
    const t = useTheme();
    return (_jsx(View, { style: [
            a.flex_1,
            t.atoms.bg_contrast_25,
            a.justify_center,
            a.align_center,
            a.px_lg,
            a.border,
            t.atoms.border_contrast_low,
            a.rounded_sm,
            a.gap_lg,
        ], children: children }));
}
export function Text({ children }) {
    const t = useTheme();
    return (_jsx(TypoText, { style: [
            a.text_center,
            t.atoms.text_contrast_high,
            a.text_md,
            a.leading_snug,
            { maxWidth: 300 },
        ], children: children }));
}
export function RetryButton({ onPress }) {
    const { _ } = useLingui();
    return (_jsx(Button, { onPress: onPress, size: "small", color: "secondary_inverted", variant: "solid", label: _(msg `Retry`), children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Retry" }) }) }));
}
//# sourceMappingURL=VideoFallback.js.map