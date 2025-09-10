import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { View } from 'react-native';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { urls } from '#/lib/constants';
import { getUserDisplayName } from '#/lib/getUserDisplayName';
import { logger } from '#/logger';
import { useModerationOpts } from '#/state/preferences/moderation-opts';
import { useProfileQuery } from '#/state/queries/profile';
import { useSession } from '#/state/session';
import { atoms as a, useBreakpoints, useTheme } from '#/alf';
import { Admonition } from '#/components/Admonition';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { useDialogControl } from '#/components/Dialog';
import { Trash_Stroke2_Corner0_Rounded as TrashIcon } from '#/components/icons/Trash';
import { Link } from '#/components/Link';
import * as ProfileCard from '#/components/ProfileCard';
import { Text } from '#/components/Typography';
import {} from '#/components/verification';
import { VerificationRemovePrompt } from '#/components/verification/VerificationRemovePrompt';
export { useDialogControl } from '#/components/Dialog';
export function VerificationsDialog({ control, profile, verificationState, }) {
    return (_jsxs(Dialog.Outer, { control: control, children: [_jsx(Dialog.Handle, {}), _jsx(Inner, { control: control, profile: profile, verificationState: verificationState })] }));
}
function Inner({ profile, control, verificationState: state, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const { gtMobile } = useBreakpoints();
    const userName = getUserDisplayName(profile);
    const label = state.profile.isViewer
        ? state.profile.isVerified
            ? _(msg `You are verified`)
            : _(msg `Your verifications`)
        : state.profile.isVerified
            ? _(msg `${userName} is verified`)
            : _(msg({
                message: `${userName}'s verifications`,
                comment: `Possessive, meaning "the verifications of {userName}"`,
            }));
    return (_jsxs(Dialog.ScrollableInner, { label: label, style: [
            gtMobile ? { width: 'auto', maxWidth: 400, minWidth: 200 } : a.w_full,
        ], children: [_jsxs(View, { style: [a.gap_sm, a.pb_lg], children: [_jsx(Text, { style: [a.text_2xl, a.font_bold, a.pr_4xl, a.leading_tight], children: label }), _jsx(Text, { style: [a.text_md, a.leading_snug], children: state.profile.isVerified ? (_jsx(Trans, { children: "This account has a checkmark because it's been verified by trusted sources." })) : (_jsx(Trans, { children: "This account has one or more attempted verifications, but it is not currently verified." })) })] }), profile.verification ? (_jsxs(View, { style: [a.pb_xl, a.gap_md], children: [_jsx(Text, { style: [a.text_sm, t.atoms.text_contrast_medium], children: _jsx(Trans, { children: "Verified by:" }) }), _jsx(View, { style: [a.gap_lg], children: profile.verification.verifications.map(v => (_jsx(VerifierCard, { verification: v, subject: profile, outerDialogControl: control }, v.uri))) }), profile.verification.verifications.some(v => !v.isValid) &&
                        state.profile.isViewer && (_jsx(Admonition, { type: "warning", style: [a.mt_xs], children: _jsx(Trans, { children: "Some of your verifications are invalid." }) }))] })) : null, _jsxs(View, { style: [
                    a.w_full,
                    a.gap_sm,
                    a.justify_end,
                    gtMobile
                        ? [a.flex_row, a.flex_row_reverse, a.justify_start]
                        : [a.flex_col],
                ], children: [_jsx(Button, { label: _(msg `Close dialog`), size: "small", variant: "solid", color: "primary", onPress: () => {
                            control.close();
                        }, children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Close" }) }) }), _jsx(Link, { overridePresentation: true, to: urls.website.blog.initialVerificationAnnouncement, label: _(msg({
                            message: `Learn more about verification on Bluesky`,
                            context: `english-only-resource`,
                        })), size: "small", variant: "solid", color: "secondary", style: [a.justify_center], onPress: () => {
                            logger.metric('verification:learn-more', {
                                location: 'verificationsDialog',
                            }, { statsig: true });
                        }, children: _jsx(ButtonText, { children: _jsx(Trans, { context: "english-only-resource", children: "Learn more" }) }) })] }), _jsx(Dialog.Close, {})] }));
}
function VerifierCard({ verification, subject, outerDialogControl, }) {
    const t = useTheme();
    const { _, i18n } = useLingui();
    const { currentAccount } = useSession();
    const moderationOpts = useModerationOpts();
    const { data: profile, error } = useProfileQuery({ did: verification.issuer });
    const verificationRemovePromptControl = useDialogControl();
    const canAdminister = verification.issuer === currentAccount?.did;
    return (_jsxs(View, { style: {
            opacity: verification.isValid ? 1 : 0.5,
        }, children: [_jsx(ProfileCard.Outer, { children: _jsx(ProfileCard.Header, { children: error ? (_jsxs(_Fragment, { children: [_jsx(ProfileCard.AvatarPlaceholder, {}), _jsxs(View, { style: [a.flex_1], children: [_jsx(Text, { style: [a.text_md, a.font_bold, a.leading_snug], numberOfLines: 1, children: _jsx(Trans, { children: "Unknown verifier" }) }), _jsx(Text, { emoji: true, style: [a.leading_snug, t.atoms.text_contrast_medium], numberOfLines: 1, children: verification.issuer })] })] })) : profile && moderationOpts ? (_jsxs(_Fragment, { children: [_jsxs(ProfileCard.Link, { profile: profile, style: [a.flex_row, a.align_center, a.gap_sm, a.flex_1], onPress: () => {
                                    outerDialogControl.close();
                                }, children: [_jsx(ProfileCard.Avatar, { profile: profile, moderationOpts: moderationOpts, disabledPreview: true }), _jsxs(View, { style: [a.flex_1], children: [_jsx(ProfileCard.Name, { profile: profile, moderationOpts: moderationOpts }), _jsx(Text, { emoji: true, style: [a.leading_snug, t.atoms.text_contrast_medium], numberOfLines: 1, children: i18n.date(new Date(verification.createdAt), {
                                                    dateStyle: 'long',
                                                }) })] })] }), canAdminister && (_jsx(View, { children: _jsx(Button, { label: _(msg `Remove verification`), size: "small", variant: "outline", color: "negative", shape: "round", onPress: () => {
                                        verificationRemovePromptControl.open();
                                    }, children: _jsx(ButtonIcon, { icon: TrashIcon }) }) }))] })) : (_jsxs(_Fragment, { children: [_jsx(ProfileCard.AvatarPlaceholder, {}), _jsx(ProfileCard.NameAndHandlePlaceholder, {})] })) }) }), _jsx(VerificationRemovePrompt, { control: verificationRemovePromptControl, profile: subject, verifications: [verification], onConfirm: () => outerDialogControl.close() })] }));
}
//# sourceMappingURL=VerificationsDialog.js.map