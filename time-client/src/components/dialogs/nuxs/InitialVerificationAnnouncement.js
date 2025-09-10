import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { urls } from '#/lib/constants';
import { logger } from '#/logger';
import { isNative } from '#/platform/detection';
import { atoms as a, useBreakpoints, useTheme } from '#/alf';
import { Button, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { useNuxDialogContext } from '#/components/dialogs/nuxs';
import { Sparkle_Stroke2_Corner0_Rounded as SparkleIcon } from '#/components/icons/Sparkle';
import { VerifierCheck } from '#/components/icons/VerifierCheck';
import { Link } from '#/components/Link';
import { Span, Text } from '#/components/Typography';
export function InitialVerificationAnnouncement() {
    const t = useTheme();
    const { _ } = useLingui();
    const { gtMobile } = useBreakpoints();
    const nuxDialogs = useNuxDialogContext();
    const control = Dialog.useDialogControl();
    Dialog.useAutoOpen(control);
    const onClose = useCallback(() => {
        nuxDialogs.dismissActiveNux();
    }, [nuxDialogs]);
    return (_jsxs(Dialog.Outer, { control: control, onClose: onClose, children: [_jsx(Dialog.Handle, {}), _jsxs(Dialog.ScrollableInner, { label: _(msg `Announcing verification on Bluesky`), style: [
                    gtMobile ? { width: 'auto', maxWidth: 400, minWidth: 200 } : a.w_full,
                ], children: [_jsxs(View, { style: [a.align_start, a.gap_xl], children: [_jsxs(View, { style: [
                                    a.pl_sm,
                                    a.pr_md,
                                    a.py_sm,
                                    a.rounded_full,
                                    a.flex_row,
                                    a.align_center,
                                    a.gap_xs,
                                    {
                                        backgroundColor: t.palette.primary_25,
                                    },
                                ], children: [_jsx(SparkleIcon, { fill: t.palette.primary_700, size: "sm" }), _jsx(Text, { style: [
                                            a.font_bold,
                                            {
                                                color: t.palette.primary_700,
                                            },
                                        ], children: _jsx(Trans, { children: "New Feature" }) })] }), _jsx(View, { style: [
                                    a.w_full,
                                    a.rounded_md,
                                    a.overflow_hidden,
                                    t.atoms.bg_contrast_25,
                                    { minHeight: 100 },
                                ], children: _jsx(Image, { accessibilityIgnoresInvertColors: true, source: require('../../../../assets/images/initial_verification_announcement_1.png'), style: [
                                        {
                                            aspectRatio: 353 / 160,
                                        },
                                    ], alt: _(msg `An illustration showing that Bluesky selects trusted verifiers, and trusted verifiers in turn verify individual user accounts.`) }) }), _jsxs(View, { style: [a.gap_xs], children: [_jsx(Text, { style: [a.text_2xl, a.font_bold, a.leading_snug], children: _jsx(Trans, { children: "A new form of verification" }) }), _jsx(Text, { style: [a.leading_snug, a.text_md], children: _jsx(Trans, { children: "We\u2019re introducing a new layer of verification on Bluesky \u2014 an easy-to-see checkmark." }) })] }), _jsx(View, { style: [
                                    a.w_full,
                                    a.rounded_md,
                                    a.overflow_hidden,
                                    t.atoms.bg_contrast_25,
                                    { minHeight: 100 },
                                ], children: _jsx(Image, { accessibilityIgnoresInvertColors: true, source: require('../../../../assets/images/initial_verification_announcement_2.png'), style: [
                                        {
                                            aspectRatio: 353 / 196,
                                        },
                                    ], alt: _(msg `An mockup of a iPhone showing the Bluesky app open to the profile of a verified user with a blue checkmark next to their display name.`) }) }), _jsxs(View, { style: [a.gap_sm], children: [_jsxs(View, { style: [a.flex_row, a.align_center, a.gap_xs], children: [_jsx(VerifierCheck, { width: 14 }), _jsx(Text, { style: [a.text_lg, a.font_bold, a.leading_snug], children: _jsx(Trans, { children: "Who can verify?" }) })] }), _jsxs(View, { style: [a.gap_sm], children: [_jsx(Text, { style: [a.leading_snug, a.text_md], children: _jsx(Trans, { children: "Bluesky will proactively verify notable and authentic accounts." }) }), _jsx(Text, { style: [a.leading_snug, a.text_md], children: _jsxs(Trans, { children: ["Trust emerges from relationships, communities, and shared context, so we\u2019re also enabling", ' ', _jsx(Span, { style: [a.font_bold], children: "trusted verifiers" }), ": organizations that can directly issue verification."] }) }), _jsx(Text, { style: [a.leading_snug, a.text_md], children: _jsx(Trans, { children: "When you tap on a check, you\u2019ll see which organizations have granted verification." }) })] })] }), _jsxs(View, { style: [a.w_full, a.gap_md], children: [_jsx(Link, { overridePresentation: true, to: urls.website.blog.initialVerificationAnnouncement, label: _(msg `Read blog post`), size: "small", variant: "solid", color: "primary", style: [a.justify_center, a.w_full], onPress: () => {
                                            logger.metric('verification:learn-more', {
                                                location: 'initialAnnouncementeNux',
                                            }, { statsig: false });
                                        }, children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Read blog post" }) }) }), isNative && (_jsx(Button, { label: _(msg `Close`), size: "small", variant: "solid", color: "secondary", style: [a.justify_center, a.w_full], onPress: () => {
                                            control.close();
                                        }, children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Close" }) }) }))] })] }), _jsx(Dialog.Close, {})] })] }));
}
//# sourceMappingURL=InitialVerificationAnnouncement.js.map