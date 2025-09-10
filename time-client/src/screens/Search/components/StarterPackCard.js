import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { AppBskyGraphStarterpack, moderateProfile, } from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { sanitizeHandle } from '#/lib/strings/handles';
import { useModerationOpts } from '#/state/preferences/moderation-opts';
import { useSession } from '#/state/session';
import { LoadingPlaceholder } from '#/view/com/util/LoadingPlaceholder';
import { UserAvatar } from '#/view/com/util/UserAvatar';
import { atoms as a, useBreakpoints, useTheme, web } from '#/alf';
import { ButtonText } from '#/components/Button';
import { PlusSmall_Stroke2_Corner0_Rounded as Plus } from '#/components/icons/Plus';
import { Link } from '#/components/Link';
import { MediaInsetBorder } from '#/components/MediaInsetBorder';
import { useStarterPackLink } from '#/components/StarterPack/StarterPackCard';
import { SubtleHover } from '#/components/SubtleHover';
import { Text } from '#/components/Typography';
import * as bsky from '#/types/bsky';
export function StarterPackCard({ view, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const { currentAccount } = useSession();
    const { gtPhone } = useBreakpoints();
    const link = useStarterPackLink({ view });
    const record = view.record;
    if (!bsky.dangerousIsType(record, AppBskyGraphStarterpack.isRecord)) {
        return null;
    }
    const profileCount = gtPhone ? 11 : 8;
    const profiles = view.listItemsSample
        ?.slice(0, profileCount)
        .map(item => item.subject);
    return (_jsx(Link, { to: link.to, label: link.label, onHoverIn: link.precache, onPress: link.precache, children: s => (_jsxs(_Fragment, { children: [_jsx(SubtleHover, { hover: s.hovered || s.pressed }), _jsxs(View, { style: [
                        a.w_full,
                        a.p_lg,
                        a.gap_md,
                        a.border,
                        a.rounded_sm,
                        a.overflow_hidden,
                        t.atoms.border_contrast_low,
                    ], children: [_jsx(AvatarStack, { profiles: profiles ?? [], numPending: profileCount, total: view.list?.listItemCount }), _jsxs(View, { style: [
                                a.w_full,
                                a.flex_row,
                                a.align_start,
                                a.gap_lg,
                                web({
                                    position: 'static',
                                    zIndex: 'unset',
                                }),
                            ], children: [_jsxs(View, { style: [a.flex_1], children: [_jsx(Text, { emoji: true, style: [a.text_md, a.font_bold, a.leading_snug], numberOfLines: 1, children: record.name }), _jsx(Text, { emoji: true, style: [
                                                a.text_sm,
                                                a.leading_snug,
                                                t.atoms.text_contrast_medium,
                                            ], numberOfLines: 1, children: view.creator?.did === currentAccount?.did
                                                ? _(msg `By you`)
                                                : _(msg `By ${sanitizeHandle(view.creator.handle, '@')}`) })] }), _jsx(Link, { to: link.to, label: link.label, onHoverIn: link.precache, onPress: link.precache, variant: "solid", color: "secondary", size: "small", style: [a.z_50], children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Open pack" }) }) })] })] })] })) }));
}
export function AvatarStack({ profiles, numPending, total, }) {
    const t = useTheme();
    const { gtPhone } = useBreakpoints();
    const moderationOpts = useModerationOpts();
    const computedTotal = (total ?? numPending) - numPending;
    const circlesCount = numPending + 1; // add total at end
    const widthPerc = 100 / circlesCount;
    const [size, setSize] = React.useState(null);
    const isPending = (numPending && profiles.length === 0) || !moderationOpts;
    const items = isPending
        ? Array.from({ length: numPending ?? circlesCount }).map((_, i) => ({
            key: i,
            profile: null,
            moderation: null,
        }))
        : profiles.map(item => ({
            key: item.did,
            profile: item,
            moderation: moderateProfile(item, moderationOpts),
        }));
    return (_jsxs(View, { style: [
            a.w_full,
            a.flex_row,
            a.align_center,
            a.relative,
            { width: `${100 - widthPerc * 0.2}%` },
        ], children: [items.map((item, i) => (_jsx(View, { style: [
                    {
                        width: `${widthPerc}%`,
                        zIndex: 100 - i,
                    },
                ], children: _jsx(View, { style: [
                        a.relative,
                        {
                            width: '120%',
                        },
                    ], children: _jsx(View, { onLayout: e => setSize(e.nativeEvent.layout.width), style: [
                            a.rounded_full,
                            t.atoms.bg_contrast_25,
                            {
                                paddingTop: '100%',
                            },
                        ], children: size && item.profile ? (_jsx(UserAvatar, { size: size, avatar: item.profile.avatar, type: item.profile.associated?.labeler ? 'labeler' : 'user', moderation: item.moderation.ui('avatar'), style: [a.absolute, a.inset_0] })) : (_jsx(MediaInsetBorder, { style: [a.rounded_full] })) }) }) }, item.key))), _jsx(View, { style: [
                    {
                        width: `${widthPerc}%`,
                        zIndex: 1,
                    },
                ], children: _jsx(View, { style: [
                        a.relative,
                        {
                            width: '120%',
                        },
                    ], children: _jsx(View, { style: [
                            {
                                paddingTop: '100%',
                            },
                        ], children: _jsx(View, { style: [
                                a.absolute,
                                a.inset_0,
                                a.rounded_full,
                                a.align_center,
                                a.justify_center,
                                {
                                    backgroundColor: t.atoms.text_contrast_low.color,
                                },
                            ], children: computedTotal > 0 ? (_jsx(Text, { style: [
                                    gtPhone ? a.text_md : a.text_xs,
                                    a.font_bold,
                                    a.leading_snug,
                                    { color: 'white' },
                                ], children: _jsxs(Trans, { comment: "Indicates the number of additional profiles are in the Starter Pack e.g. +12", children: ["+", computedTotal] }) })) : (_jsx(Plus, { fill: "white" })) }) }) }) })] }));
}
export function StarterPackCardSkeleton() {
    const t = useTheme();
    const { gtPhone } = useBreakpoints();
    const profileCount = gtPhone ? 11 : 8;
    return (_jsxs(View, { style: [
            a.w_full,
            a.p_lg,
            a.gap_md,
            a.border,
            a.rounded_sm,
            a.overflow_hidden,
            t.atoms.border_contrast_low,
        ], children: [_jsx(AvatarStack, { profiles: [], numPending: profileCount }), _jsxs(View, { style: [
                    a.w_full,
                    a.flex_row,
                    a.align_start,
                    a.gap_lg,
                    web({
                        position: 'static',
                        zIndex: 'unset',
                    }),
                ], children: [_jsxs(View, { style: [a.flex_1, a.gap_xs], children: [_jsx(LoadingPlaceholder, { width: 180, height: 18 }), _jsx(LoadingPlaceholder, { width: 120, height: 14 })] }), _jsx(LoadingPlaceholder, { width: 100, height: 33 })] })] }));
}
//# sourceMappingURL=StarterPackCard.js.map