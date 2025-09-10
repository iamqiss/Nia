import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Text as RNText, View } from 'react-native';
import { Image } from 'expo-image';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { urls } from '#/lib/constants';
import { getUserDisplayName } from '#/lib/getUserDisplayName';
import { logger } from '#/logger';
import { useSession } from '#/state/session';
import { atoms as a, useBreakpoints, useTheme } from '#/alf';
import { Button, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { VerifierCheck } from '#/components/icons/VerifierCheck';
import { Link } from '#/components/Link';
import { Text } from '#/components/Typography';
import {} from '#/components/verification';
export { useDialogControl } from '#/components/Dialog';
export function VerifierDialog({ control, profile, verificationState, }) {
    return (_jsxs(Dialog.Outer, { control: control, children: [_jsx(Dialog.Handle, {}), _jsx(Inner, { control: control, profile: profile, verificationState: verificationState }), _jsx(Dialog.Close, {})] }));
}
function Inner({ profile, control, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const { gtMobile } = useBreakpoints();
    const { currentAccount } = useSession();
    const isSelf = profile.did === currentAccount?.did;
    const userName = getUserDisplayName(profile);
    const label = isSelf
        ? _(msg `You are a trusted verifier`)
        : _(msg `${userName} is a trusted verifier`);
    return (_jsx(Dialog.ScrollableInner, { label: label, style: [
            gtMobile ? { width: 'auto', maxWidth: 400, minWidth: 200 } : a.w_full,
        ], children: _jsxs(View, { style: [a.gap_lg], children: [_jsx(View, { style: [
                        a.w_full,
                        a.rounded_md,
                        a.overflow_hidden,
                        t.atoms.bg_contrast_25,
                        { minHeight: 100 },
                    ], children: _jsx(Image, { accessibilityIgnoresInvertColors: true, source: require('../../../assets/images/initial_verification_announcement_1.png'), style: [
                            {
                                aspectRatio: 353 / 160,
                            },
                        ], alt: _(msg `An illustration showing that Bluesky selects trusted verifiers, and trusted verifiers in turn verify individual user accounts.`) }) }), _jsxs(View, { style: [a.gap_sm], children: [_jsx(Text, { style: [a.text_2xl, a.font_bold, a.pr_4xl, a.leading_tight], children: label }), _jsx(Text, { style: [a.text_md, a.leading_snug], children: _jsxs(Trans, { children: ["Accounts with a scalloped blue check mark", ' ', _jsx(RNText, { children: _jsx(VerifierCheck, { width: 14 }) }), ' ', "can verify others. These trusted verifiers are selected by Bluesky."] }) })] }), _jsxs(View, { style: [
                        a.w_full,
                        a.gap_sm,
                        a.justify_end,
                        gtMobile ? [a.flex_row, a.justify_end] : [a.flex_col],
                    ], children: [_jsx(Link, { overridePresentation: true, to: urls.website.blog.initialVerificationAnnouncement, label: _(msg({
                                message: `Learn more about verification on Bluesky`,
                                context: `english-only-resource`,
                            })), size: "small", variant: "solid", color: "primary", style: [a.justify_center], onPress: () => {
                                logger.metric('verification:learn-more', {
                                    location: 'verifierDialog',
                                }, { statsig: true });
                            }, children: _jsx(ButtonText, { children: _jsx(Trans, { context: "english-only-resource", children: "Learn more" }) }) }), _jsx(Button, { label: _(msg `Close dialog`), size: "small", variant: "solid", color: "secondary", onPress: () => {
                                control.close();
                            }, children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Close" }) }) })] })] }) }));
}
//# sourceMappingURL=VerifierDialog.js.map