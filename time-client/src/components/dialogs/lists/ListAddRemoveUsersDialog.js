import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { cleanError } from '#/lib/strings/errors';
import { useModerationOpts } from '#/state/preferences/moderation-opts';
import { getMembership, useDangerousListMembershipsQuery, useListMembershipAddMutation, useListMembershipRemoveMutation, } from '#/state/queries/list-memberships';
import * as Toast from '#/view/com/util/Toast';
import { atoms as a } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { SearchablePeopleList, } from '#/components/dialogs/SearchablePeopleList';
import { Loader } from '#/components/Loader';
import * as ProfileCard from '#/components/ProfileCard';
export function ListAddRemoveUsersDialog({ control, list, onChange, }) {
    return (_jsxs(Dialog.Outer, { control: control, testID: "listAddRemoveUsersDialog", children: [_jsx(Dialog.Handle, {}), _jsx(DialogInner, { list: list, onChange: onChange })] }));
}
function DialogInner({ list, onChange, }) {
    const { _ } = useLingui();
    const moderationOpts = useModerationOpts();
    const { data: memberships } = useDangerousListMembershipsQuery();
    const renderProfileCard = useCallback((item) => {
        return (_jsx(UserResult, { profile: item.profile, onChange: onChange, memberships: memberships, list: list, moderationOpts: moderationOpts }));
    }, [onChange, memberships, list, moderationOpts]);
    return (_jsx(SearchablePeopleList, { title: _(msg `Add people to list`), renderProfileCard: renderProfileCard }));
}
function UserResult({ profile, list, memberships, onChange, moderationOpts, }) {
    const { _ } = useLingui();
    const membership = useMemo(() => getMembership(memberships, list.uri, profile.did), [memberships, list.uri, profile.did]);
    const { mutate: listMembershipAdd, isPending: isAddingPending } = useListMembershipAddMutation({
        onSuccess: () => {
            Toast.show(_(msg `Added to list`));
            onChange?.('add', profile);
        },
        onError: e => Toast.show(cleanError(e), 'xmark'),
    });
    const { mutate: listMembershipRemove, isPending: isRemovingPending } = useListMembershipRemoveMutation({
        onSuccess: () => {
            Toast.show(_(msg `Removed from list`));
            onChange?.('remove', profile);
        },
        onError: e => Toast.show(cleanError(e), 'xmark'),
    });
    const isMutating = isAddingPending || isRemovingPending;
    const onToggleMembership = useCallback(() => {
        if (typeof membership === 'undefined') {
            return;
        }
        if (membership === false) {
            listMembershipAdd({
                listUri: list.uri,
                actorDid: profile.did,
            });
        }
        else {
            listMembershipRemove({
                listUri: list.uri,
                actorDid: profile.did,
                membershipUri: membership,
            });
        }
    }, [list, profile, membership, listMembershipAdd, listMembershipRemove]);
    if (!moderationOpts)
        return null;
    return (_jsx(View, { style: [a.flex_1, a.py_sm, a.px_lg], children: _jsxs(ProfileCard.Header, { children: [_jsx(ProfileCard.Avatar, { profile: profile, moderationOpts: moderationOpts }), _jsxs(View, { style: [a.flex_1], children: [_jsx(ProfileCard.Name, { profile: profile, moderationOpts: moderationOpts }), _jsx(ProfileCard.Handle, { profile: profile })] }), membership !== undefined && (_jsx(Button, { label: membership === false
                        ? _(msg `Add user to list`)
                        : _(msg `Remove user from list`), onPress: onToggleMembership, disabled: isMutating, size: "small", variant: "solid", color: "secondary", children: isMutating ? (_jsx(ButtonIcon, { icon: Loader })) : (_jsx(ButtonText, { children: membership === false ? (_jsx(Trans, { children: "Add" })) : (_jsx(Trans, { children: "Remove" })) })) }))] }) }));
}
//# sourceMappingURL=ListAddRemoveUsersDialog.js.map