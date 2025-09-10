import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useGoBack } from '#/lib/hooks/useGoBack';
import { CenteredView } from '#/view/com/util/Views';
import { atoms as a, useBreakpoints, useTheme } from '#/alf';
import { Button, ButtonText } from '#/components/Button';
import { Text } from '#/components/Typography';
export function Error({ title, message, onRetry, onGoBack, hideBackButton, sideBorders = true, }) {
    const { _ } = useLingui();
    const t = useTheme();
    const { gtMobile } = useBreakpoints();
    const goBack = useGoBack(onGoBack);
    return (_jsxs(CenteredView, { style: [
            a.h_full_vh,
            a.align_center,
            a.gap_5xl,
            !gtMobile && a.justify_between,
            t.atoms.border_contrast_low,
            { paddingTop: 175, paddingBottom: 110 },
        ], sideBorders: sideBorders, children: [_jsxs(View, { style: [a.w_full, a.align_center, a.gap_lg], children: [_jsx(Text, { style: [a.font_bold, a.text_3xl], children: title }), _jsx(Text, { style: [
                            a.text_md,
                            a.text_center,
                            t.atoms.text_contrast_high,
                            { lineHeight: 1.4 },
                            gtMobile ? { width: 450 } : [a.w_full, a.px_lg],
                        ], children: message })] }), _jsxs(View, { style: [a.gap_md, gtMobile ? { width: 350 } : [a.w_full, a.px_lg]], children: [onRetry && (_jsx(Button, { variant: "solid", color: "primary", label: _(msg `Press to retry`), onPress: onRetry, size: "large", style: [a.rounded_sm, a.overflow_hidden, { paddingVertical: 10 }], children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Retry" }) }) })), !hideBackButton && (_jsx(Button, { variant: "solid", color: onRetry ? 'secondary' : 'primary', label: _(msg `Return to previous page`), onPress: goBack, size: "large", style: [a.rounded_sm, a.overflow_hidden, { paddingVertical: 10 }], children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Go Back" }) }) }))] })] }));
}
//# sourceMappingURL=Error.js.map