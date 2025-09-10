import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useCallback } from 'react';
import { ActivityIndicator, StyleSheet, useWindowDimensions, View, } from 'react-native';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { usePalette } from '#/lib/hooks/usePalette';
import { sanitizeDisplayName } from '#/lib/strings/display-names';
import { cleanError } from '#/lib/strings/errors';
import { sanitizeHandle } from '#/lib/strings/handles';
import { s } from '#/lib/styles';
import { isAndroid, isMobileWeb, isWeb } from '#/platform/detection';
import { useModalControls } from '#/state/modals';
import { getMembership, useDangerousListMembershipsQuery, useListMembershipAddMutation, useListMembershipRemoveMutation, } from '#/state/queries/list-memberships';
import { useSession } from '#/state/session';
import { MyLists } from '../lists/MyLists';
import { Button } from '../util/forms/Button';
import { Text } from '../util/text/Text';
import * as Toast from '../util/Toast';
import { UserAvatar } from '../util/UserAvatar';
export const snapPoints = ['fullscreen'];
export function Component({ subject, handle, displayName, onAdd, onRemove, }) {
    const { closeModal } = useModalControls();
    const pal = usePalette('default');
    const { height: screenHeight } = useWindowDimensions();
    const { _ } = useLingui();
    const { data: memberships } = useDangerousListMembershipsQuery();
    const onPressDone = useCallback(() => {
        closeModal();
    }, [closeModal]);
    const listStyle = React.useMemo(() => {
        if (isMobileWeb) {
            return [pal.border, { height: screenHeight / 2 }];
        }
        else if (isWeb) {
            return [pal.border, { height: screenHeight / 1.5 }];
        }
        return [pal.border, { flex: 1, borderTopWidth: StyleSheet.hairlineWidth }];
    }, [pal.border, screenHeight]);
    const headerStyles = [
        {
            textAlign: 'center',
            fontWeight: '600',
            fontSize: 20,
            marginBottom: 12,
            paddingHorizontal: 12,
        },
        pal.text,
    ];
    return (_jsxs(View, { testID: "userAddRemoveListsModal", style: s.hContentRegion, children: [_jsx(Text, { style: headerStyles, numberOfLines: 1, children: _jsxs(Trans, { children: ["Update", ' ', _jsx(Text, { style: headerStyles, numberOfLines: 1, children: displayName }), ' ', "in Lists"] }) }), _jsx(MyLists, { filter: "all", inline: true, renderItem: (list, index) => (_jsx(ListItem, { index: index, list: list, memberships: memberships, subject: subject, handle: handle, onAdd: onAdd, onRemove: onRemove }, list.uri)), style: listStyle }), _jsx(View, { style: [styles.btns, pal.border], children: _jsx(Button, { testID: "doneBtn", type: "default", onPress: onPressDone, style: styles.footerBtn, accessibilityLabel: _(msg({ message: `Done`, context: 'action' })), accessibilityHint: "", onAccessibilityEscape: onPressDone, label: _(msg({ message: `Done`, context: 'action' })) }) })] }));
}
function ListItem({ index, list, memberships, subject, handle, onAdd, onRemove, }) {
    const pal = usePalette('default');
    const { _ } = useLingui();
    const { currentAccount } = useSession();
    const [isProcessing, setIsProcessing] = React.useState(false);
    const membership = React.useMemo(() => getMembership(memberships, list.uri, subject), [memberships, list.uri, subject]);
    const listMembershipAddMutation = useListMembershipAddMutation();
    const listMembershipRemoveMutation = useListMembershipRemoveMutation();
    const onToggleMembership = useCallback(async () => {
        if (typeof membership === 'undefined') {
            return;
        }
        setIsProcessing(true);
        try {
            if (membership === false) {
                await listMembershipAddMutation.mutateAsync({
                    listUri: list.uri,
                    actorDid: subject,
                });
                Toast.show(_(msg `Added to list`));
                onAdd?.(list.uri);
            }
            else {
                await listMembershipRemoveMutation.mutateAsync({
                    listUri: list.uri,
                    actorDid: subject,
                    membershipUri: membership,
                });
                Toast.show(_(msg `Removed from list`));
                onRemove?.(list.uri);
            }
        }
        catch (e) {
            Toast.show(cleanError(e), 'xmark');
        }
        finally {
            setIsProcessing(false);
        }
    }, [
        _,
        list,
        subject,
        membership,
        setIsProcessing,
        onAdd,
        onRemove,
        listMembershipAddMutation,
        listMembershipRemoveMutation,
    ]);
    return (_jsxs(View, { testID: `toggleBtn-${list.name}`, style: [
            styles.listItem,
            pal.border,
            index !== 0 && { borderTopWidth: StyleSheet.hairlineWidth },
        ], children: [_jsx(View, { style: styles.listItemAvi, children: _jsx(UserAvatar, { size: 40, avatar: list.avatar, type: "list" }) }), _jsxs(View, { style: styles.listItemContent, children: [_jsx(Text, { type: "lg", style: [s.bold, pal.text], numberOfLines: 1, lineHeight: 1.2, children: sanitizeDisplayName(list.name) }), _jsxs(Text, { type: "md", style: [pal.textLight], numberOfLines: 1, children: [list.purpose === 'app.bsky.graph.defs#curatelist' &&
                                (list.creator.did === currentAccount?.did ? (_jsx(Trans, { children: "User list by you" })) : (_jsxs(Trans, { children: ["User list by ", sanitizeHandle(list.creator.handle, '@')] }))), list.purpose === 'app.bsky.graph.defs#modlist' &&
                                (list.creator.did === currentAccount?.did ? (_jsx(Trans, { children: "Moderation list by you" })) : (_jsxs(Trans, { children: ["Moderation list by ", sanitizeHandle(list.creator.handle, '@')] })))] })] }), _jsx(View, { children: isProcessing || typeof membership === 'undefined' ? (_jsx(ActivityIndicator, {})) : (_jsx(Button, { testID: `user-${handle}-addBtn`, type: "default", label: membership === false ? _(msg `Add`) : _(msg `Remove`), onPress: onToggleMembership })) })] }));
}
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: isWeb ? 0 : 16,
    },
    btns: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingTop: 10,
        paddingBottom: isAndroid ? 10 : 0,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    footerBtn: {
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    listItemAvi: {
        width: 54,
        paddingLeft: 4,
        paddingTop: 8,
        paddingBottom: 10,
    },
    listItemContent: {
        flex: 1,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10,
    },
    checkbox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        width: 24,
        height: 24,
        borderRadius: 6,
        marginRight: 8,
    },
    loadingContainer: {
        position: 'absolute',
        top: 10,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
    },
});
//# sourceMappingURL=UserAddRemoveLists.js.map