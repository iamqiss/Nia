import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { isWeb } from '#/platform/detection';
import { atoms as a, useTheme, web } from '#/alf';
import { Button, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { useNuxDialogContext } from '#/components/dialogs/nuxs';
import { Sparkle_Stroke2_Corner0_Rounded as SparkleIcon } from '#/components/icons/Sparkle';
import { Text } from '#/components/Typography';
export function ActivitySubscriptionsNUX() {
    const t = useTheme();
    const { _ } = useLingui();
    const nuxDialogs = useNuxDialogContext();
    const control = Dialog.useDialogControl();
    Dialog.useAutoOpen(control);
    const onClose = useCallback(() => {
        nuxDialogs.dismissActiveNux();
    }, [nuxDialogs]);
    return (_jsxs(Dialog.Outer, { control: control, onClose: onClose, children: [_jsx(Dialog.Handle, {}), _jsxs(Dialog.ScrollableInner, { label: _(msg `Introducing activity notifications`), style: [web({ maxWidth: 400 })], contentContainerStyle: [
                    {
                        paddingTop: 0,
                        paddingLeft: 0,
                        paddingRight: 0,
                    },
                ], children: [_jsxs(View, { style: [
                            a.align_center,
                            a.overflow_hidden,
                            t.atoms.bg_contrast_25,
                            {
                                gap: isWeb ? 16 : 24,
                                paddingTop: isWeb ? 24 : 48,
                                borderTopLeftRadius: a.rounded_md.borderRadius,
                                borderTopRightRadius: a.rounded_md.borderRadius,
                            },
                        ], children: [_jsxs(View, { style: [
                                    a.pl_sm,
                                    a.pr_md,
                                    a.py_sm,
                                    a.rounded_full,
                                    a.flex_row,
                                    a.align_center,
                                    a.gap_xs,
                                    {
                                        backgroundColor: t.palette.primary_100,
                                    },
                                ], children: [_jsx(SparkleIcon, { fill: t.palette.primary_800, size: "sm" }), _jsx(Text, { style: [
                                            a.font_bold,
                                            {
                                                color: t.palette.primary_800,
                                            },
                                        ], children: _jsx(Trans, { children: "New Feature" }) })] }), _jsxs(View, { style: [a.relative, a.w_full], children: [_jsx(View, { style: [
                                            a.absolute,
                                            t.atoms.bg_contrast_25,
                                            t.atoms.shadow_md,
                                            {
                                                shadowOpacity: 0.4,
                                                top: 5,
                                                bottom: 0,
                                                left: '17%',
                                                right: '17%',
                                                width: '66%',
                                                borderTopLeftRadius: 40,
                                                borderTopRightRadius: 40,
                                            },
                                        ] }), _jsx(View, { style: [
                                            a.overflow_hidden,
                                            {
                                                aspectRatio: 398 / 228,
                                            },
                                        ], children: _jsx(Image, { accessibilityIgnoresInvertColors: true, source: require('../../../../assets/images/activity_notifications_announcement.webp'), style: [
                                                a.w_full,
                                                {
                                                    aspectRatio: 398 / 268,
                                                },
                                            ], alt: _(msg `A screenshot of a profile page with a bell icon next to the follow button, indicating the new activity notifications feature.`) }) })] })] }), _jsxs(View, { style: [
                            a.align_center,
                            a.px_xl,
                            isWeb ? [a.pt_xl, a.gap_xl, a.pb_sm] : [a.pt_3xl, a.gap_3xl],
                        ], children: [_jsxs(View, { style: [a.gap_md, a.align_center], children: [_jsx(Text, { style: [
                                            a.text_3xl,
                                            a.leading_tight,
                                            a.font_heavy,
                                            a.text_center,
                                            {
                                                fontSize: isWeb ? 28 : 32,
                                                maxWidth: 300,
                                            },
                                        ], children: _jsx(Trans, { children: "Get notified when someone posts" }) }), _jsx(Text, { style: [
                                            a.text_md,
                                            a.leading_snug,
                                            a.text_center,
                                            {
                                                maxWidth: 340,
                                            },
                                        ], children: _jsx(Trans, { children: "You can now choose to be notified when specific people post. If there\u2019s someone you want timely updates from, go to their profile and find the new bell icon near the follow button." }) })] }), !isWeb && (_jsx(Button, { label: _(msg `Close`), size: "large", variant: "solid", color: "primary", onPress: () => {
                                    control.close();
                                }, style: [a.w_full, { maxWidth: 280 }], children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Close" }) }) }))] }), _jsx(Dialog.Close, {})] })] }));
}
//# sourceMappingURL=ActivitySubscriptions.js.map