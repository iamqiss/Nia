import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Pressable, ScrollView, View } from 'react-native';
import { moderateProfile } from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { createHitslop, HITSLOP_10 } from '#/lib/constants';
import { makeProfileLink } from '#/lib/routes/links';
import { sanitizeDisplayName } from '#/lib/strings/display-names';
import { sanitizeHandle } from '#/lib/strings/handles';
import { useModerationOpts } from '#/state/preferences/moderation-opts';
import { UserAvatar } from '#/view/com/util/UserAvatar';
import { BlockDrawerGesture } from '#/view/shell/BlockDrawerGesture';
import { atoms as a } from '#/alf';
import { Button, ButtonIcon } from '#/components/Button';
import { TimesLarge_Stroke2_Corner0_Rounded as XIcon } from '#/components/icons/Times';
import * as Layout from '#/components/Layout';
import { Link } from '#/components/Link';
import { Text } from '#/components/Typography';
import { useSimpleVerificationState } from '#/components/verification';
import { VerificationCheck } from '#/components/verification/VerificationCheck';
export function SearchHistory({ searchHistory, selectedProfiles, onItemClick, onProfileClick, onRemoveItemClick, onRemoveProfileClick, }) {
    const { _ } = useLingui();
    const moderationOpts = useModerationOpts();
    return (_jsx(Layout.Content, { keyboardDismissMode: "interactive", keyboardShouldPersistTaps: "handled", children: _jsxs(View, { style: [a.w_full, a.gap_md], children: [(searchHistory.length > 0 || selectedProfiles.length > 0) && (_jsx(View, { style: [a.px_lg, a.pt_sm], children: _jsx(Text, { style: [a.text_md, a.font_bold], children: _jsx(Trans, { children: "Recent Searches" }) }) })), selectedProfiles.length > 0 && (_jsx(View, { children: _jsx(BlockDrawerGesture, { children: _jsx(ScrollView, { horizontal: true, keyboardShouldPersistTaps: "handled", showsHorizontalScrollIndicator: false, contentContainerStyle: [
                                a.px_lg,
                                a.flex_row,
                                a.flex_nowrap,
                                a.gap_xl,
                            ], children: moderationOpts &&
                                selectedProfiles.map(profile => (_jsx(RecentProfileItem, { profile: profile, moderationOpts: moderationOpts, onPress: () => onProfileClick(profile), onRemove: () => onRemoveProfileClick(profile) }, profile.did))) }) }) })), searchHistory.length > 0 && (_jsx(View, { style: [a.px_lg, a.pt_sm], children: searchHistory.slice(0, 5).map((historyItem, index) => (_jsxs(View, { style: [a.flex_row, a.align_center], children: [_jsx(Pressable, { accessibilityRole: "button", onPress: () => onItemClick(historyItem), hitSlop: HITSLOP_10, style: [a.flex_1, a.py_sm], children: _jsx(Text, { style: [a.text_md], children: historyItem }) }), _jsx(Button, { label: _(msg `Remove ${historyItem}`), onPress: () => onRemoveItemClick(historyItem), size: "small", variant: "ghost", color: "secondary", shape: "round", children: _jsx(ButtonIcon, { icon: XIcon }) })] }, index))) }))] }) }));
}
function RecentProfileItem({ profile, moderationOpts, onPress, onRemove, }) {
    const { _ } = useLingui();
    const width = 80;
    const moderation = moderateProfile(profile, moderationOpts);
    const name = sanitizeDisplayName(profile.displayName || sanitizeHandle(profile.handle), moderation.ui('displayName'));
    const verification = useSimpleVerificationState({ profile });
    return (_jsxs(View, { style: [a.relative], children: [_jsxs(Link, { to: makeProfileLink(profile), label: profile.handle, onPress: onPress, style: [
                    a.flex_col,
                    a.align_center,
                    a.gap_xs,
                    {
                        width,
                    },
                ], children: [_jsx(UserAvatar, { avatar: profile.avatar, type: profile.associated?.labeler ? 'labeler' : 'user', size: width - 8, moderation: moderation.ui('avatar') }), _jsxs(View, { style: [a.flex_row, a.align_center, a.justify_center, a.w_full], children: [_jsx(Text, { emoji: true, style: [a.text_xs, a.leading_snug], numberOfLines: 1, children: name }), verification.showBadge && (_jsx(View, { style: [a.pl_2xs], children: _jsx(VerificationCheck, { width: 10, verifier: verification.role === 'verifier' }) }))] })] }), _jsx(Button, { label: _(msg `Remove profile`), hitSlop: createHitslop(6), size: "tiny", variant: "outline", color: "secondary", shape: "round", onPress: onRemove, style: [
                    a.absolute,
                    {
                        top: 0,
                        right: 0,
                        height: 18,
                        width: 18,
                    },
                ], children: _jsx(ButtonIcon, { icon: XIcon }) })] }));
}
//# sourceMappingURL=SearchHistory.js.map