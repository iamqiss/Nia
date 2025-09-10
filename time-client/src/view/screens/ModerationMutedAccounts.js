import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import {} from '@atproto/api';
import { Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useFocusEffect } from '@react-navigation/native';
import {} from '@react-navigation/native-stack';
import {} from '#/lib/routes/types';
import { cleanError } from '#/lib/strings/errors';
import { logger } from '#/logger';
import { useModerationOpts } from '#/state/preferences/moderation-opts';
import { useMyMutedAccountsQuery } from '#/state/queries/my-muted-accounts';
import { useSetMinimalShellMode } from '#/state/shell';
import { ErrorScreen } from '#/view/com/util/error/ErrorScreen';
import { List } from '#/view/com/util/List';
import { atoms as a, useTheme } from '#/alf';
import * as Layout from '#/components/Layout';
import { ListFooter } from '#/components/Lists';
import * as ProfileCard from '#/components/ProfileCard';
import { Text } from '#/components/Typography';
export function ModerationMutedAccounts({}) {
    const t = useTheme();
    const moderationOpts = useModerationOpts();
    const { _ } = useLingui();
    const setMinimalShellMode = useSetMinimalShellMode();
    const [isPTRing, setIsPTRing] = useState(false);
    const { data, isFetching, isError, error, refetch, hasNextPage, fetchNextPage, isFetchingNextPage, } = useMyMutedAccountsQuery();
    const isEmpty = !isFetching && !data?.pages[0]?.mutes.length;
    const profiles = useMemo(() => {
        if (data?.pages) {
            return data.pages.flatMap(page => page.mutes);
        }
        return [];
    }, [data]);
    useFocusEffect(useCallback(() => {
        setMinimalShellMode(false);
    }, [setMinimalShellMode]));
    const onRefresh = useCallback(async () => {
        setIsPTRing(true);
        try {
            await refetch();
        }
        catch (err) {
            logger.error('Failed to refresh my muted accounts', { message: err });
        }
        setIsPTRing(false);
    }, [refetch, setIsPTRing]);
    const onEndReached = useCallback(async () => {
        if (isFetching || !hasNextPage || isError)
            return;
        try {
            await fetchNextPage();
        }
        catch (err) {
            logger.error('Failed to load more of my muted accounts', { message: err });
        }
    }, [isFetching, hasNextPage, isError, fetchNextPage]);
    const renderItem = ({ item, index, }) => {
        if (!moderationOpts)
            return null;
        return (_jsx(View, { style: [a.py_md, a.px_xl, a.border_t, t.atoms.border_contrast_low], children: _jsx(ProfileCard.Link, { profile: item, testID: `mutedAccount-${index}`, children: _jsxs(ProfileCard.Outer, { children: [_jsxs(ProfileCard.Header, { children: [_jsx(ProfileCard.Avatar, { profile: item, moderationOpts: moderationOpts }), _jsx(ProfileCard.NameAndHandle, { profile: item, moderationOpts: moderationOpts })] }), _jsx(ProfileCard.Labels, { profile: item, moderationOpts: moderationOpts }), _jsx(ProfileCard.Description, { profile: item })] }) }) }, item.did));
    };
    return (_jsxs(Layout.Screen, { testID: "mutedAccountsScreen", children: [_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, { children: _jsx(Layout.Header.TitleText, { children: _jsx(Trans, { children: "Muted Accounts" }) }) }), _jsx(Layout.Header.Slot, {})] }), _jsx(Layout.Center, { children: isEmpty ? (_jsxs(View, { children: [_jsx(Info, { style: [a.border_b] }), isError ? (_jsx(ErrorScreen, { title: "Oops!", message: cleanError(error), onPressTryAgain: refetch })) : (_jsx(Empty, {}))] })) : (_jsx(List, { data: profiles, keyExtractor: item => item.did, refreshing: isPTRing, onRefresh: onRefresh, onEndReached: onEndReached, renderItem: renderItem, initialNumToRender: 15, 
                    // FIXME(dan)
                    ListHeaderComponent: Info, ListFooterComponent: _jsx(ListFooter, { isFetchingNextPage: isFetchingNextPage, hasNextPage: hasNextPage, error: cleanError(error), onRetry: fetchNextPage }) })) })] }));
}
function Empty() {
    const t = useTheme();
    return (_jsx(View, { style: [a.pt_2xl, a.px_xl, a.align_center], children: _jsx(View, { style: [
                a.py_md,
                a.px_lg,
                a.rounded_sm,
                t.atoms.bg_contrast_25,
                a.border,
                t.atoms.border_contrast_low,
                { maxWidth: 400 },
            ], children: _jsx(Text, { style: [a.text_sm, a.text_center, t.atoms.text_contrast_high], children: _jsx(Trans, { children: "You have not muted any accounts yet. To mute an account, go to their profile and select \"Mute account\" from the menu on their account." }) }) }) }));
}
function Info({ style }) {
    const t = useTheme();
    return (_jsx(View, { style: [
            a.w_full,
            t.atoms.bg_contrast_25,
            a.py_md,
            a.px_xl,
            a.border_t,
            { marginTop: a.border.borderWidth * -1 },
            t.atoms.border_contrast_low,
            style,
        ], children: _jsx(Text, { style: [a.text_center, a.text_sm, t.atoms.text_contrast_high], children: _jsx(Trans, { children: "Muted accounts have their posts removed from your feed and from your notifications. Mutes are completely private." }) }) }));
}
//# sourceMappingURL=ModerationMutedAccounts.js.map