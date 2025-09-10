import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View, } from 'react-native';
import { setStringAsync } from 'expo-clipboard';
import {} from '@atproto/api';
import { FontAwesomeIcon, } from '@fortawesome/react-native-fontawesome';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { usePalette } from '#/lib/hooks/usePalette';
import { useWebMediaQueries } from '#/lib/hooks/useWebMediaQueries';
import { makeProfileLink } from '#/lib/routes/links';
import { cleanError } from '#/lib/strings/errors';
import { isWeb } from '#/platform/detection';
import { useInvitesAPI, useInvitesState } from '#/state/invites';
import { useModalControls } from '#/state/modals';
import { useInviteCodesQuery, } from '#/state/queries/invites';
import { ErrorMessage } from '../util/error/ErrorMessage';
import { Button } from '../util/forms/Button';
import { Link } from '../util/Link';
import { Text } from '../util/text/Text';
import * as Toast from '../util/Toast';
import { UserInfoText } from '../util/UserInfoText';
import { ScrollView } from './util';
export const snapPoints = ['70%'];
export function Component() {
    const { isLoading, data: invites, error } = useInviteCodesQuery();
    return error ? (_jsx(ErrorMessage, { message: cleanError(error) })) : isLoading || !invites ? (_jsx(View, { style: { padding: 18 }, children: _jsx(ActivityIndicator, {}) })) : (_jsx(Inner, { invites: invites }));
}
export function Inner({ invites }) {
    const pal = usePalette('default');
    const { _ } = useLingui();
    const { closeModal } = useModalControls();
    const { isTabletOrDesktop } = useWebMediaQueries();
    const onClose = React.useCallback(() => {
        closeModal();
    }, [closeModal]);
    if (invites.all.length === 0) {
        return (_jsxs(View, { style: [styles.container, pal.view], testID: "inviteCodesModal", children: [_jsx(View, { style: [styles.empty, pal.viewLight], children: _jsx(Text, { type: "lg", style: [pal.text, styles.emptyText], children: _jsx(Trans, { children: "You don't have any invite codes yet! We'll send you some when you've been on Bluesky for a little longer." }) }) }), _jsx(View, { style: styles.flex1 }), _jsx(View, { style: [
                        styles.btnContainer,
                        isTabletOrDesktop && styles.btnContainerDesktop,
                    ], children: _jsx(Button, { type: "primary", label: _(msg `Done`), style: styles.btn, labelStyle: styles.btnLabel, onPress: onClose }) })] }));
    }
    return (_jsxs(View, { style: [styles.container, pal.view], testID: "inviteCodesModal", children: [_jsx(Text, { type: "title-xl", style: [styles.title, pal.text], children: _jsx(Trans, { children: "Invite a Friend" }) }), _jsx(Text, { type: "lg", style: [styles.description, pal.text], children: _jsx(Trans, { children: "Each code works once. You'll receive more invite codes periodically." }) }), _jsxs(ScrollView, { style: [styles.scrollContainer, pal.border], children: [invites.available.map((invite, i) => (_jsx(InviteCode, { testID: `inviteCode-${i}`, invite: invite, invites: invites }, invite.code))), invites.used.map((invite, i) => (_jsx(InviteCode, { used: true, testID: `inviteCode-${i}`, invite: invite, invites: invites }, invite.code)))] }), _jsx(View, { style: styles.btnContainer, children: _jsx(Button, { testID: "closeBtn", type: "primary", label: _(msg `Done`), style: styles.btn, labelStyle: styles.btnLabel, onPress: onClose }) })] }));
}
function InviteCode({ testID, invite, used, invites, }) {
    const pal = usePalette('default');
    const { _ } = useLingui();
    const invitesState = useInvitesState();
    const { setInviteCopied } = useInvitesAPI();
    const uses = invite.uses;
    const onPress = React.useCallback(() => {
        setStringAsync(invite.code);
        Toast.show(_(msg `Copied to clipboard`), 'clipboard-check');
        setInviteCopied(invite.code);
    }, [setInviteCopied, invite, _]);
    return (_jsxs(View, { style: [
            pal.border,
            { borderBottomWidth: 1, paddingHorizontal: 20, paddingVertical: 14 },
        ], children: [_jsxs(TouchableOpacity, { testID: testID, style: [styles.inviteCode], onPress: onPress, accessibilityRole: "button", accessibilityLabel: invites.available.length === 1
                    ? _(msg `Invite codes: 1 available`)
                    : _(msg `Invite codes: ${invites.available.length} available`), accessibilityHint: _(msg `Opens list of invite codes`), children: [_jsx(Text, { testID: `${testID}-code`, type: used ? 'md' : 'md-bold', style: used ? [pal.textLight, styles.strikeThrough] : pal.text, children: invite.code }), _jsx(View, { style: styles.flex1 }), !used && invitesState.copiedInvites.includes(invite.code) && (_jsx(Text, { style: [pal.textLight, styles.codeCopied], children: _jsx(Trans, { children: "Copied" }) })), !used && (_jsx(FontAwesomeIcon, { icon: ['far', 'clone'], style: pal.text }))] }), uses.length > 0 ? (_jsx(View, { style: {
                    flexDirection: 'column',
                    gap: 8,
                    paddingTop: 6,
                }, children: _jsxs(Text, { style: pal.text, children: [_jsx(Trans, { children: "Used by:" }), ' ', uses.map((use, i) => (_jsxs(Link, { href: makeProfileLink({ handle: use.usedBy, did: '' }), style: {
                                flexDirection: 'row',
                            }, children: [_jsx(UserInfoText, { did: use.usedBy, style: pal.link }), i !== uses.length - 1 && _jsx(Text, { style: pal.text, children: ", " })] }, use.usedBy)))] }) })) : null] }));
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: isWeb ? 0 : 50,
    },
    title: {
        textAlign: 'center',
        marginTop: 12,
        marginBottom: 12,
    },
    description: {
        textAlign: 'center',
        paddingHorizontal: 42,
        marginBottom: 14,
    },
    scrollContainer: {
        flex: 1,
        borderTopWidth: 1,
        marginTop: 4,
        marginBottom: 16,
    },
    flex1: {
        flex: 1,
    },
    empty: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderRadius: 16,
        marginHorizontal: 24,
        marginTop: 10,
    },
    emptyText: {
        textAlign: 'center',
    },
    inviteCode: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    codeCopied: {
        marginRight: 8,
    },
    strikeThrough: {
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    btnContainerDesktop: {
        marginTop: 14,
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 32,
        paddingHorizontal: 60,
        paddingVertical: 14,
    },
    btnLabel: {
        fontSize: 18,
    },
});
//# sourceMappingURL=InviteCodes.js.map