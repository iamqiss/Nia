import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useAgeAssurance } from '#/state/ageAssurance/useAgeAssurance';
import { logger } from '#/state/ageAssurance/util';
import { atoms as a, select, useTheme } from '#/alf';
import { useDialogControl } from '#/components/ageAssurance/AgeAssuranceInitDialog';
import { ShieldCheck_Stroke2_Corner0_Rounded as Shield } from '#/components/icons/Shield';
import { InlineLinkText } from '#/components/Link';
import { Text } from '#/components/Typography';
export function AgeAssuranceAdmonition({ children, style, }) {
    const control = useDialogControl();
    const { isReady, isDeclaredUnderage, isAgeRestricted } = useAgeAssurance();
    if (!isReady)
        return null;
    if (isDeclaredUnderage)
        return null;
    if (!isAgeRestricted)
        return null;
    return (_jsx(Inner, { style: style, control: control, children: children }));
}
function Inner({ children, style, }) {
    const t = useTheme();
    const { _ } = useLingui();
    return (_jsx(_Fragment, { children: _jsx(View, { style: style, children: _jsxs(View, { style: [
                    a.p_md,
                    a.rounded_md,
                    a.border,
                    a.flex_row,
                    a.align_start,
                    a.gap_sm,
                    {
                        backgroundColor: select(t.name, {
                            light: t.palette.primary_25,
                            dark: t.palette.primary_25,
                            dim: t.palette.primary_25,
                        }),
                        borderColor: select(t.name, {
                            light: t.palette.primary_100,
                            dark: t.palette.primary_100,
                            dim: t.palette.primary_100,
                        }),
                    },
                ], children: [_jsx(View, { style: [
                            a.align_center,
                            a.justify_center,
                            a.rounded_full,
                            {
                                width: 32,
                                height: 32,
                                backgroundColor: select(t.name, {
                                    light: t.palette.primary_100,
                                    dark: t.palette.primary_100,
                                    dim: t.palette.primary_100,
                                }),
                            },
                        ], children: _jsx(Shield, { size: "md" }) }), _jsxs(View, { style: [a.flex_1, a.gap_xs, a.pr_4xl], children: [_jsx(Text, { style: [a.text_sm, a.leading_snug], children: children }), _jsx(Text, { style: [a.text_sm, a.leading_snug, a.font_bold], children: _jsxs(Trans, { children: ["Learn more in your", ' ', _jsx(InlineLinkText, { label: _(msg `Go to account settings`), to: '/settings/account', style: [a.text_sm, a.leading_snug, a.font_bold], onPress: () => {
                                                logger.metric('ageAssurance:navigateToSettings', {});
                                            }, children: "account settings." })] }) })] })] }) }) }));
}
//# sourceMappingURL=AgeAssuranceAdmonition.js.map