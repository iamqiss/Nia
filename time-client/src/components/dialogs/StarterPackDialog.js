import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { AppBskyGraphStarterpack, } from '@atproto/api';
import { msg, Plural, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useRequireEmailVerification } from '#/lib/hooks/useRequireEmailVerification';
import {} from '#/lib/routes/types';
import { isWeb } from '#/platform/detection';
import { invalidateActorStarterPacksWithMembershipQuery, useActorStarterPacksWithMembershipsQuery, } from '#/state/queries/actor-starter-packs';
import { useListMembershipAddMutation, useListMembershipRemoveMutation, } from '#/state/queries/list-memberships';
import * as Toast from '#/view/com/util/Toast';
import { atoms as a, useTheme } from '#/alf';
import { AvatarStack } from '#/components/AvatarStack';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { Divider } from '#/components/Divider';
import { PlusLarge_Stroke2_Corner0_Rounded as PlusIcon } from '#/components/icons/Plus';
import { StarterPack } from '#/components/icons/StarterPack';
import { TimesLarge_Stroke2_Corner0_Rounded as XIcon } from '#/components/icons/Times';
import { Loader } from '#/components/Loader';
import { Text } from '#/components/Typography';
import * as bsky from '#/types/bsky';
export function StarterPackDialog({ control, targetDid, enabled, }) {
    const { _ } = useLingui();
    const navigation = useNavigation();
    const requireEmailVerification = useRequireEmailVerification();
    const navToWizard = useCallback(() => {
        control.close();
        navigation.navigate('StarterPackWizard', {
            fromDialog: true,
            targetDid: targetDid,
            onSuccess: () => {
                setTimeout(() => {
                    if (!control.isOpen) {
                        control.open();
                    }
                }, 0);
            },
        });
    }, [navigation, control, targetDid]);
    const wrappedNavToWizard = requireEmailVerification(navToWizard, {
        instructions: [
            _jsx(Trans, { children: "Before creating a starter pack, you must first verify your email." }, "nav"),
        ],
    });
    return (_jsxs(Dialog.Outer, { control: control, children: [_jsx(Dialog.Handle, {}), _jsx(StarterPackList, { onStartWizard: wrappedNavToWizard, targetDid: targetDid, enabled: enabled })] }));
}
function Empty({ onStartWizard }) {
    const { _ } = useLingui();
    const t = useTheme();
    return (_jsxs(View, { style: [a.gap_2xl, { paddingTop: isWeb ? 100 : 64 }], children: [_jsxs(View, { style: [a.gap_xs, a.align_center], children: [_jsx(StarterPack, { width: 48, fill: t.atoms.border_contrast_medium.borderColor }), _jsx(Text, { style: [a.text_center], children: _jsx(Trans, { children: "You have no starter packs." }) })] }), _jsx(View, { style: [a.align_center], children: _jsxs(Button, { label: _(msg `Create starter pack`), color: "secondary_inverted", size: "small", onPress: onStartWizard, children: [_jsx(ButtonText, { children: _jsx(Trans, { comment: "Text on button to create a new starter pack", children: "Create" }) }), _jsx(ButtonIcon, { icon: PlusIcon })] }) })] }));
}
function StarterPackList({ onStartWizard, targetDid, enabled, }) {
    const control = Dialog.useDialogContext();
    const { _ } = useLingui();
    const { data, isError, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage, } = useActorStarterPacksWithMembershipsQuery({ did: targetDid, enabled });
    const membershipItems = data?.pages.flatMap(page => page.starterPacksWithMembership) || [];
    const onEndReached = useCallback(async () => {
        if (isFetchingNextPage || !hasNextPage || isError)
            return;
        try {
            await fetchNextPage();
        }
        catch (err) {
            // Error handling is optional since this is just pagination
        }
    }, [isFetchingNextPage, hasNextPage, isError, fetchNextPage]);
    const renderItem = useCallback(({ item }) => (_jsx(StarterPackItem, { starterPackWithMembership: item, targetDid: targetDid })), [targetDid]);
    const onClose = useCallback(() => {
        control.close();
    }, [control]);
    const listHeader = (_jsxs(_Fragment, { children: [_jsxs(View, { style: [
                    { justifyContent: 'space-between', flexDirection: 'row' },
                    isWeb ? a.mb_2xl : a.my_lg,
                    a.align_center,
                ], children: [_jsx(Text, { style: [a.text_lg, a.font_bold], children: _jsx(Trans, { children: "Add to starter packs" }) }), _jsx(Button, { label: _(msg `Close`), onPress: onClose, variant: "ghost", color: "secondary", size: "small", shape: "round", children: _jsx(ButtonIcon, { icon: XIcon }) })] }), membershipItems.length > 0 && (_jsxs(_Fragment, { children: [_jsxs(View, { style: [a.flex_row, a.justify_between, a.align_center, a.py_md], children: [_jsx(Text, { style: [a.text_md, a.font_bold], children: _jsx(Trans, { children: "New starter pack" }) }), _jsxs(Button, { label: _(msg `Create starter pack`), color: "secondary_inverted", size: "small", onPress: onStartWizard, children: [_jsx(ButtonText, { children: _jsx(Trans, { comment: "Text on button to create a new starter pack", children: "Create" }) }), _jsx(ButtonIcon, { icon: PlusIcon })] })] }), _jsx(Divider, {})] }))] }));
    return (_jsx(Dialog.InnerFlatList, { data: isLoading ? [{}] : membershipItems, renderItem: isLoading
            ? () => (_jsx(View, { style: [a.align_center, a.py_2xl], children: _jsx(Loader, { size: "xl" }) }))
            : renderItem, keyExtractor: isLoading
            ? () => 'starter_pack_dialog_loader'
            : (item) => item.starterPack.uri, onEndReached: onEndReached, onEndReachedThreshold: 0.1, ListHeaderComponent: listHeader, ListEmptyComponent: _jsx(Empty, { onStartWizard: onStartWizard }), style: isWeb ? [a.px_md, { minHeight: 500 }] : [a.px_2xl, a.pt_lg] }));
}
function StarterPackItem({ starterPackWithMembership, targetDid, }) {
    const { _ } = useLingui();
    const t = useTheme();
    const queryClient = useQueryClient();
    const starterPack = starterPackWithMembership.starterPack;
    const isInPack = !!starterPackWithMembership.listItem;
    const [isPendingRefresh, setIsPendingRefresh] = useState(false);
    const { mutate: addMembership } = useListMembershipAddMutation({
        onSuccess: () => {
            Toast.show(_(msg `Added to starter pack`));
            // Use a timeout to wait for the appview to update, matching the pattern
            // in list-memberships.ts
            setTimeout(() => {
                invalidateActorStarterPacksWithMembershipQuery({
                    queryClient,
                    did: targetDid,
                });
                setIsPendingRefresh(false);
            }, 1e3);
        },
        onError: () => {
            Toast.show(_(msg `Failed to add to starter pack`), 'xmark');
            setIsPendingRefresh(false);
        },
    });
    const { mutate: removeMembership } = useListMembershipRemoveMutation({
        onSuccess: () => {
            Toast.show(_(msg `Removed from starter pack`));
            // Use a timeout to wait for the appview to update, matching the pattern
            // in list-memberships.ts
            setTimeout(() => {
                invalidateActorStarterPacksWithMembershipQuery({
                    queryClient,
                    did: targetDid,
                });
                setIsPendingRefresh(false);
            }, 1e3);
        },
        onError: () => {
            Toast.show(_(msg `Failed to remove from starter pack`), 'xmark');
            setIsPendingRefresh(false);
        },
    });
    const handleToggleMembership = () => {
        if (!starterPack.list?.uri || isPendingRefresh)
            return;
        const listUri = starterPack.list.uri;
        setIsPendingRefresh(true);
        if (!isInPack) {
            addMembership({
                listUri: listUri,
                actorDid: targetDid,
            });
        }
        else {
            if (!starterPackWithMembership.listItem?.uri) {
                console.error('Cannot remove: missing membership URI');
                setIsPendingRefresh(false);
                return;
            }
            removeMembership({
                listUri: listUri,
                actorDid: targetDid,
                membershipUri: starterPackWithMembership.listItem.uri,
            });
        }
    };
    const { record } = starterPack;
    if (!bsky.dangerousIsType(record, AppBskyGraphStarterpack.isRecord)) {
        return null;
    }
    return (_jsxs(View, { style: [a.flex_row, a.justify_between, a.align_center, a.py_md], children: [_jsxs(View, { children: [_jsx(Text, { emoji: true, style: [a.text_md, a.font_bold], numberOfLines: 1, children: record.name }), _jsx(View, { style: [a.flex_row, a.align_center, a.mt_xs], children: starterPack.listItemsSample &&
                            starterPack.listItemsSample.length > 0 && (_jsxs(_Fragment, { children: [_jsx(AvatarStack, { size: 32, profiles: starterPack.listItemsSample
                                        ?.slice(0, 4)
                                        .map(p => p.subject) }), starterPack.list?.listItemCount &&
                                    starterPack.list.listItemCount > 4 && (_jsx(Text, { style: [
                                        a.text_sm,
                                        t.atoms.text_contrast_medium,
                                        a.ml_xs,
                                    ], children: _jsx(Trans, { children: _jsx(Plural, { value: starterPack.list.listItemCount - 4, other: "+# more" }) }) }))] })) })] }), _jsx(Button, { label: isInPack ? _(msg `Remove`) : _(msg `Add`), color: isInPack ? 'secondary' : 'primary_subtle', size: "tiny", disabled: isPendingRefresh, onPress: handleToggleMembership, children: _jsx(ButtonText, { children: isInPack ? _jsx(Trans, { children: "Remove" }) : _jsx(Trans, { children: "Add" }) }) })] }));
}
//# sourceMappingURL=StarterPackDialog.js.map