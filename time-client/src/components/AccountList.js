import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useCallback } from 'react';
import { View } from 'react-native';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useActorStatus } from '#/lib/actor-status';
import { sanitizeDisplayName } from '#/lib/strings/display-names';
import { sanitizeHandle } from '#/lib/strings/handles';
import { useProfilesQuery } from '#/state/queries/profile';
import { useSession } from '#/state/session';
import { UserAvatar } from '#/view/com/util/UserAvatar';
import { atoms as a, useTheme } from '#/alf';
import { Check_Stroke2_Corner0_Rounded as Check } from '#/components/icons/Check';
import { ChevronRight_Stroke2_Corner0_Rounded as Chevron } from '#/components/icons/Chevron';
import { useSimpleVerificationState } from '#/components/verification';
import { VerificationCheck } from '#/components/verification/VerificationCheck';
import { Button } from './Button';
import { Text } from './Typography';
export function AccountList({ onSelectAccount, onSelectOther, otherLabel, pendingDid, }) {
    const { currentAccount, accounts } = useSession();
    const t = useTheme();
    const { _ } = useLingui();
    const { data: profiles } = useProfilesQuery({
        handles: accounts.map(acc => acc.did),
    });
    const onPressAddAccount = useCallback(() => {
        onSelectOther();
    }, [onSelectOther]);
    return (_jsxs(View, { pointerEvents: pendingDid ? 'none' : 'auto', style: [
            a.rounded_md,
            a.overflow_hidden,
            { borderWidth: 1 },
            t.atoms.border_contrast_low,
        ], children: [accounts.map(account => (_jsxs(React.Fragment, { children: [_jsx(AccountItem, { profile: profiles?.profiles.find(p => p.did === account.did), account: account, onSelect: onSelectAccount, isCurrentAccount: account.did === currentAccount?.did, isPendingAccount: account.did === pendingDid }), _jsx(View, { style: [{ borderBottomWidth: 1 }, t.atoms.border_contrast_low] })] }, account.did))), _jsx(Button, { testID: "chooseAddAccountBtn", style: [a.flex_1], onPress: pendingDid ? undefined : onPressAddAccount, label: _(msg `Sign in to account that is not listed`), children: ({ hovered, pressed }) => (_jsxs(View, { style: [
                        a.flex_1,
                        a.flex_row,
                        a.align_center,
                        { height: 48 },
                        (hovered || pressed) && t.atoms.bg_contrast_25,
                    ], children: [_jsx(Text, { style: [
                                a.font_bold,
                                a.flex_1,
                                a.flex_row,
                                a.py_sm,
                                a.leading_tight,
                                t.atoms.text_contrast_medium,
                                { paddingLeft: 56 },
                            ], children: otherLabel ?? _jsx(Trans, { children: "Other account" }) }), _jsx(Chevron, { size: "sm", style: [t.atoms.text, a.mr_md] })] })) })] }));
}
function AccountItem({ profile, account, onSelect, isCurrentAccount, isPendingAccount, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const verification = useSimpleVerificationState({ profile });
    const { isActive: live } = useActorStatus(profile);
    const onPress = useCallback(() => {
        onSelect(account);
    }, [account, onSelect]);
    return (_jsx(Button, { testID: `chooseAccountBtn-${account.handle}`, style: [a.w_full], onPress: onPress, label: isCurrentAccount
            ? _(msg `Continue as ${account.handle} (currently signed in)`)
            : _(msg `Sign in as ${account.handle}`), children: ({ hovered, pressed }) => (_jsxs(View, { style: [
                a.flex_1,
                a.flex_row,
                a.align_center,
                a.px_md,
                a.gap_sm,
                { height: 56 },
                (hovered || pressed || isPendingAccount) && t.atoms.bg_contrast_25,
            ], children: [_jsx(UserAvatar, { avatar: profile?.avatar, size: 36, type: profile?.associated?.labeler ? 'labeler' : 'user', live: live, hideLiveBadge: true }), _jsxs(View, { style: [a.flex_1, a.gap_2xs, a.pr_2xl], children: [_jsxs(View, { style: [a.flex_row, a.align_center, a.gap_xs], children: [_jsx(Text, { emoji: true, style: [a.font_bold, a.leading_tight], numberOfLines: 1, children: sanitizeDisplayName(profile?.displayName || profile?.handle || account.handle) }), verification.showBadge && (_jsx(View, { children: _jsx(VerificationCheck, { width: 12, verifier: verification.role === 'verifier' }) }))] }), _jsx(Text, { style: [a.leading_tight, t.atoms.text_contrast_medium], children: sanitizeHandle(account.handle, '@') })] }), isCurrentAccount ? (_jsx(Check, { size: "sm", style: [{ color: t.palette.positive_600 }] })) : (_jsx(Chevron, { size: "sm", style: [t.atoms.text] }))] })) }, account.did));
}
//# sourceMappingURL=AccountList.js.map