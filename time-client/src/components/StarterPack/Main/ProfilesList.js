import { jsx as _jsx } from "react/jsx-runtime";
import React, { useCallback } from 'react';
import { View } from 'react-native';
import { AtUri, } from '@atproto/api';
import {} from '@tanstack/react-query';
import { useBottomBarOffset } from '#/lib/hooks/useBottomBarOffset';
import { useInitialNumToRender } from '#/lib/hooks/useInitialNumToRender';
import { isBlockedOrBlocking } from '#/lib/moderation/blocked-and-muted';
import { isNative, isWeb } from '#/platform/detection';
import { useAllListMembersQuery } from '#/state/queries/list-members';
import { useSession } from '#/state/session';
import { List } from '#/view/com/util/List';
import {} from '#/screens/Profile/Sections/types';
import { atoms as a, useTheme } from '#/alf';
import { ListFooter, ListMaybePlaceholder } from '#/components/Lists';
import { Default as ProfileCard } from '#/components/ProfileCard';
function keyExtractor(item, index) {
    return `${item.did}-${index}`;
}
export const ProfilesList = React.forwardRef(function ProfilesListImpl({ listUri, moderationOpts, headerHeight, scrollElRef }, ref) {
    const t = useTheme();
    const bottomBarOffset = useBottomBarOffset(headerHeight);
    const initialNumToRender = useInitialNumToRender();
    const { currentAccount } = useSession();
    const { data, refetch, isError } = useAllListMembersQuery(listUri);
    const [isPTRing, setIsPTRing] = React.useState(false);
    // The server returns these sorted by descending creation date, so we want to invert
    const profiles = data
        ?.filter(p => !isBlockedOrBlocking(p.subject) && !p.subject.associated?.labeler)
        .map(p => p.subject)
        .reverse();
    const isOwn = new AtUri(listUri).host === currentAccount?.did;
    const getSortedProfiles = () => {
        if (!profiles)
            return;
        if (!isOwn)
            return profiles;
        const myIndex = profiles.findIndex(p => p.did === currentAccount?.did);
        return myIndex !== -1
            ? [
                profiles[myIndex],
                ...profiles.slice(0, myIndex),
                ...profiles.slice(myIndex + 1),
            ]
            : profiles;
    };
    const onScrollToTop = useCallback(() => {
        scrollElRef.current?.scrollToOffset({
            animated: isNative,
            offset: -headerHeight,
        });
    }, [scrollElRef, headerHeight]);
    React.useImperativeHandle(ref, () => ({
        scrollToTop: onScrollToTop,
    }));
    const renderItem = ({ item, index, }) => {
        return (_jsx(View, { style: [
                a.p_lg,
                t.atoms.border_contrast_low,
                (isWeb || index !== 0) && a.border_t,
            ], children: _jsx(ProfileCard, { profile: item, moderationOpts: moderationOpts, logContext: "StarterPackProfilesList" }) }));
    };
    if (!data) {
        return (_jsx(View, { style: [
                a.h_full_vh,
                { marginTop: headerHeight, marginBottom: bottomBarOffset },
            ], children: _jsx(ListMaybePlaceholder, { isLoading: true, isError: isError, onRetry: refetch }) }));
    }
    if (data)
        return (_jsx(List, { data: getSortedProfiles(), renderItem: renderItem, keyExtractor: keyExtractor, ref: scrollElRef, headerOffset: headerHeight, ListFooterComponent: _jsx(ListFooter, { style: { paddingBottom: bottomBarOffset, borderTopWidth: 0 } }), showsVerticalScrollIndicator: false, desktopFixedHeight: true, initialNumToRender: initialNumToRender, refreshing: isPTRing, onRefresh: async () => {
                setIsPTRing(true);
                await refetch();
                setIsPTRing(false);
            } }));
});
//# sourceMappingURL=ProfilesList.js.map