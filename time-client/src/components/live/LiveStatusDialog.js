import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useOpenLink } from '#/lib/hooks/useOpenLink';
import {} from '#/lib/routes/types';
import { sanitizeHandle } from '#/lib/strings/handles';
import { toNiceDomain } from '#/lib/strings/url-helpers';
import { logger } from '#/logger';
import { useModerationOpts } from '#/state/preferences/moderation-opts';
import { unstableCacheProfileView } from '#/state/queries/profile';
import { android, atoms as a, platform, tokens, useTheme, web } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import * as ProfileCard from '#/components/ProfileCard';
import { Text } from '#/components/Typography';
import { Globe_Stroke2_Corner0_Rounded } from '../icons/Globe';
import { SquareArrowTopRight_Stroke2_Corner0_Rounded as SquareArrowTopRightIcon } from '../icons/SquareArrowTopRight';
import { LiveIndicator } from './LiveIndicator';
export function LiveStatusDialog({ control, profile, embed, }) {
    const navigation = useNavigation();
    return (_jsxs(Dialog.Outer, { control: control, nativeOptions: { preventExpansion: true }, children: [_jsx(Dialog.Handle, { difference: !!embed.external.thumb }), _jsx(DialogInner, { profile: profile, embed: embed, navigation: navigation })] }));
}
function DialogInner({ profile, embed, navigation, }) {
    const { _ } = useLingui();
    const control = Dialog.useDialogContext();
    const onPressOpenProfile = useCallback(() => {
        control.close(() => {
            navigation.push('Profile', {
                name: profile.handle,
            });
        });
    }, [navigation, profile.handle, control]);
    return (_jsxs(Dialog.ScrollableInner, { label: _(msg `${sanitizeHandle(profile.handle)} is live`), contentContainerStyle: [a.pt_0, a.px_0], style: [web({ maxWidth: 420 }), a.overflow_hidden], children: [_jsx(LiveStatus, { profile: profile, embed: embed, onPressOpenProfile: onPressOpenProfile }), _jsx(Dialog.Close, {})] }));
}
export function LiveStatus({ profile, embed, padding = 'xl', onPressOpenProfile, }) {
    const { _ } = useLingui();
    const t = useTheme();
    const queryClient = useQueryClient();
    const openLink = useOpenLink();
    const moderationOpts = useModerationOpts();
    return (_jsxs(_Fragment, { children: [embed.external.thumb && (_jsxs(View, { style: [
                    t.atoms.bg_contrast_25,
                    a.w_full,
                    { aspectRatio: 1.91 },
                    android([
                        a.overflow_hidden,
                        {
                            borderTopLeftRadius: a.rounded_md.borderRadius,
                            borderTopRightRadius: a.rounded_md.borderRadius,
                        },
                    ]),
                ], children: [_jsx(Image, { source: embed.external.thumb, contentFit: "cover", style: [a.absolute, a.inset_0], accessibilityIgnoresInvertColors: true }), _jsx(LiveIndicator, { size: "large", style: [
                            a.absolute,
                            { top: tokens.space.lg, left: tokens.space.lg },
                            a.align_start,
                        ] })] })), _jsxs(View, { style: [
                    a.gap_lg,
                    padding === 'xl'
                        ? [a.px_xl, !embed.external.thumb ? a.pt_2xl : a.pt_lg]
                        : a.p_lg,
                ], children: [_jsxs(View, { style: [a.w_full, a.justify_center, a.gap_2xs], children: [_jsx(Text, { numberOfLines: 3, style: [a.leading_snug, a.font_bold, a.text_xl], children: embed.external.title || embed.external.uri }), _jsxs(View, { style: [a.flex_row, a.align_center, a.gap_2xs], children: [_jsx(Globe_Stroke2_Corner0_Rounded, { size: "xs", style: [t.atoms.text_contrast_medium] }), _jsx(Text, { numberOfLines: 1, style: [a.text_sm, a.leading_snug, t.atoms.text_contrast_medium], children: toNiceDomain(embed.external.uri) })] })] }), _jsxs(Button, { label: _(msg `Watch now`), size: platform({ native: 'large', web: 'small' }), color: "primary", variant: "solid", onPress: () => {
                            logger.metric('live:card:watch', { subject: profile.did }, { statsig: true });
                            openLink(embed.external.uri, false);
                        }, children: [_jsx(ButtonText, { children: _jsx(Trans, { children: "Watch now" }) }), _jsx(ButtonIcon, { icon: SquareArrowTopRightIcon })] }), _jsx(View, { style: [t.atoms.border_contrast_low, a.border_t, a.w_full] }), moderationOpts && (_jsxs(ProfileCard.Header, { children: [_jsx(ProfileCard.Avatar, { profile: profile, moderationOpts: moderationOpts, disabledPreview: true }), _jsx(View, { style: [a.flex_1, web({ minWidth: 100 })], children: _jsx(ProfileCard.NameAndHandle, { profile: profile, moderationOpts: moderationOpts }) }), _jsx(Button, { label: _(msg `Open profile`), size: "small", color: "secondary", variant: "solid", onPress: () => {
                                    logger.metric('live:card:openProfile', { subject: profile.did }, { statsig: true });
                                    unstableCacheProfileView(queryClient, profile);
                                    onPressOpenProfile();
                                }, children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Open profile" }) }) })] })), _jsx(Text, { style: [
                            a.w_full,
                            a.text_center,
                            t.atoms.text_contrast_low,
                            a.text_sm,
                        ], children: _jsx(Trans, { children: "Live feature is in beta testing" }) })] })] }));
}
//# sourceMappingURL=LiveStatusDialog.js.map