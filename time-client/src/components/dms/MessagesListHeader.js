import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo } from 'react';
import { View } from 'react-native';
import {} from '@atproto/api';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { makeProfileLink } from '#/lib/routes/links';
import { sanitizeDisplayName } from '#/lib/strings/display-names';
import { isWeb } from '#/platform/detection';
import {} from '#/state/cache/profile-shadow';
import { isConvoActive, useConvo } from '#/state/messages/convo';
import {} from '#/state/messages/convo/types';
import { PreviewableUserAvatar } from '#/view/com/util/UserAvatar';
import { atoms as a, useTheme, web } from '#/alf';
import { ConvoMenu } from '#/components/dms/ConvoMenu';
import { Bell2Off_Filled_Corner0_Rounded as BellStroke } from '#/components/icons/Bell2';
import * as Layout from '#/components/Layout';
import { Link } from '#/components/Link';
import { PostAlerts } from '#/components/moderation/PostAlerts';
import { Text } from '#/components/Typography';
import { useSimpleVerificationState } from '#/components/verification';
import { VerificationCheck } from '#/components/verification/VerificationCheck';
const PFP_SIZE = isWeb ? 40 : Layout.HEADER_SLOT_SIZE;
export function MessagesListHeader({ profile, moderation, }) {
    const t = useTheme();
    const blockInfo = useMemo(() => {
        if (!moderation)
            return;
        const modui = moderation.ui('profileView');
        const blocks = modui.alerts.filter(alert => alert.type === 'blocking');
        const listBlocks = blocks.filter(alert => alert.source.type === 'list');
        const userBlock = blocks.find(alert => alert.source.type === 'user');
        return {
            listBlocks,
            userBlock,
        };
    }, [moderation]);
    return (_jsx(Layout.Header.Outer, { children: _jsxs(View, { style: [a.w_full, a.flex_row, a.gap_xs, a.align_start], children: [_jsx(View, { style: [{ minHeight: PFP_SIZE }, a.justify_center], children: _jsx(Layout.Header.BackButton, {}) }), profile && moderation && blockInfo ? (_jsx(HeaderReady, { profile: profile, moderation: moderation, blockInfo: blockInfo })) : (_jsxs(_Fragment, { children: [_jsxs(View, { style: [a.flex_row, a.align_center, a.gap_md, a.flex_1], children: [_jsx(View, { style: [
                                        { width: PFP_SIZE, height: PFP_SIZE },
                                        a.rounded_full,
                                        t.atoms.bg_contrast_25,
                                    ] }), _jsxs(View, { style: a.gap_xs, children: [_jsx(View, { style: [
                                                { width: 120, height: 16 },
                                                a.rounded_xs,
                                                t.atoms.bg_contrast_25,
                                                a.mt_xs,
                                            ] }), _jsx(View, { style: [
                                                { width: 175, height: 12 },
                                                a.rounded_xs,
                                                t.atoms.bg_contrast_25,
                                            ] })] })] }), _jsx(Layout.Header.Slot, {})] }))] }) }));
}
function HeaderReady({ profile, moderation, blockInfo, }) {
    const { _ } = useLingui();
    const t = useTheme();
    const convoState = useConvo();
    const verification = useSimpleVerificationState({
        profile,
    });
    const isDeletedAccount = profile?.handle === 'missing.invalid';
    const displayName = isDeletedAccount
        ? _(msg `Deleted Account`)
        : sanitizeDisplayName(profile.displayName || profile.handle, moderation.ui('displayName'));
    // @ts-ignore findLast is polyfilled - esb
    const latestMessageFromOther = convoState.items.findLast((item) => item.type === 'message' && item.message.sender.did === profile.did);
    const latestReportableMessage = latestMessageFromOther?.type === 'message'
        ? latestMessageFromOther.message
        : undefined;
    return (_jsxs(View, { style: [a.flex_1], children: [_jsxs(View, { style: [a.w_full, a.flex_row, a.align_center, a.justify_between], children: [_jsxs(Link, { label: _(msg `View ${displayName}'s profile`), style: [a.flex_row, a.align_start, a.gap_md, a.flex_1, a.pr_md], to: makeProfileLink(profile), children: [_jsx(PreviewableUserAvatar, { size: PFP_SIZE, profile: profile, moderation: moderation.ui('avatar'), disableHoverCard: moderation.blocked }), _jsxs(View, { style: [a.flex_1], children: [_jsxs(View, { style: [a.flex_row, a.align_center], children: [_jsx(Text, { emoji: true, style: [
                                                    a.text_md,
                                                    a.font_bold,
                                                    a.self_start,
                                                    web(a.leading_normal),
                                                ], numberOfLines: 1, children: displayName }), verification.showBadge && (_jsx(View, { style: [a.pl_xs], children: _jsx(VerificationCheck, { width: 14, verifier: verification.role === 'verifier' }) }))] }), !isDeletedAccount && (_jsxs(Text, { style: [
                                            t.atoms.text_contrast_medium,
                                            a.text_xs,
                                            web([a.leading_normal, { marginTop: -2 }]),
                                        ], numberOfLines: 1, children: ["@", profile.handle, convoState.convo?.muted && (_jsxs(_Fragment, { children: [' ', "\u00B7", ' ', _jsx(BellStroke, { size: "xs", style: t.atoms.text_contrast_medium })] }))] }))] })] }), _jsx(View, { style: [{ minHeight: PFP_SIZE }, a.justify_center], children: _jsx(Layout.Header.Slot, { children: isConvoActive(convoState) && (_jsx(ConvoMenu, { convo: convoState.convo, profile: profile, currentScreen: "conversation", blockInfo: blockInfo, latestReportableMessage: latestReportableMessage })) }) })] }), _jsx(View, { style: [
                    {
                        paddingLeft: PFP_SIZE + a.gap_md.gap,
                    },
                ], children: _jsx(PostAlerts, { modui: moderation.ui('contentList'), size: "lg", style: [a.pt_xs] }) })] }));
}
//# sourceMappingURL=MessagesListHeader.js.map