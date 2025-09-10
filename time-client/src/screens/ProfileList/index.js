import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useMemo, useRef } from 'react';
import { View } from 'react-native';
import { useAnimatedRef } from 'react-native-reanimated';
import { AppBskyGraphDefs, AtUri, moderateUserList, } from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useOpenComposer } from '#/lib/hooks/useOpenComposer';
import { useSetTitle } from '#/lib/hooks/useSetTitle';
import { ComposeIcon2 } from '#/lib/icons';
import {} from '#/lib/routes/types';
import { cleanError } from '#/lib/strings/errors';
import { useModerationOpts } from '#/state/preferences/moderation-opts';
import { useListQuery } from '#/state/queries/list';
import { RQKEY as FEED_RQKEY } from '#/state/queries/post-feed';
import { usePreferencesQuery, } from '#/state/queries/preferences';
import { useResolveUriQuery } from '#/state/queries/resolve-uri';
import { truncateAndInvalidate } from '#/state/queries/util';
import { useSession } from '#/state/session';
import { useSetMinimalShellMode } from '#/state/shell';
import { PagerWithHeader } from '#/view/com/pager/PagerWithHeader';
import { FAB } from '#/view/com/util/fab/FAB';
import {} from '#/view/com/util/List';
import { ListHiddenScreen } from '#/screens/List/ListHiddenScreen';
import { atoms as a, platform } from '#/alf';
import { useDialogControl } from '#/components/Dialog';
import { ListAddRemoveUsersDialog } from '#/components/dialogs/lists/ListAddRemoveUsersDialog';
import * as Layout from '#/components/Layout';
import { Loader } from '#/components/Loader';
import * as Hider from '#/components/moderation/Hider';
import { AboutSection } from './AboutSection';
import { ErrorScreen } from './components/ErrorScreen';
import { Header } from './components/Header';
import { FeedSection } from './FeedSection';
export function ProfileListScreen(props) {
    return (_jsx(Layout.Screen, { testID: "profileListScreen", children: _jsx(ProfileListScreenInner, { ...props }) }));
}
function ProfileListScreenInner(props) {
    const { _ } = useLingui();
    const { name: handleOrDid, rkey } = props.route.params;
    const { data: resolvedUri, error: resolveError } = useResolveUriQuery(AtUri.make(handleOrDid, 'app.bsky.graph.list', rkey).toString());
    const { data: preferences } = usePreferencesQuery();
    const { data: list, error: listError } = useListQuery(resolvedUri?.uri);
    const moderationOpts = useModerationOpts();
    if (resolveError) {
        return (_jsxs(_Fragment, { children: [_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, { children: _jsx(Layout.Header.TitleText, { children: _jsx(Trans, { children: "Could not load list" }) }) }), _jsx(Layout.Header.Slot, {})] }), _jsx(Layout.Content, { centerContent: true, children: _jsx(ErrorScreen, { error: _(msg `We're sorry, but we were unable to resolve this list. If this persists, please contact the list creator, @${handleOrDid}.`) }) })] }));
    }
    if (listError) {
        return (_jsxs(_Fragment, { children: [_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, { children: _jsx(Layout.Header.TitleText, { children: _jsx(Trans, { children: "Could not load list" }) }) }), _jsx(Layout.Header.Slot, {})] }), _jsx(Layout.Content, { centerContent: true, children: _jsx(ErrorScreen, { error: cleanError(listError) }) })] }));
    }
    return resolvedUri && list && moderationOpts && preferences ? (_jsx(ProfileListScreenLoaded, { ...props, uri: resolvedUri.uri, list: list, moderationOpts: moderationOpts, preferences: preferences })) : (_jsxs(_Fragment, { children: [_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, {}), _jsx(Layout.Header.Slot, {})] }), _jsx(Layout.Content, { centerContent: true, contentContainerStyle: platform({
                    web: [a.mx_auto],
                    native: [a.align_center],
                }), children: _jsx(Loader, { size: "2xl" }) })] }));
}
function ProfileListScreenLoaded({ route, uri, list, moderationOpts, preferences, }) {
    const { _ } = useLingui();
    const queryClient = useQueryClient();
    const { openComposer } = useOpenComposer();
    const setMinimalShellMode = useSetMinimalShellMode();
    const { currentAccount } = useSession();
    const { rkey } = route.params;
    const feedSectionRef = useRef(null);
    const aboutSectionRef = useRef(null);
    const isCurateList = list.purpose === AppBskyGraphDefs.CURATELIST;
    const isScreenFocused = useIsFocused();
    const isHidden = list.labels?.findIndex(l => l.val === '!hide') !== -1;
    const isOwner = currentAccount?.did === list.creator.did;
    const scrollElRef = useAnimatedRef();
    const addUserDialogControl = useDialogControl();
    const sectionTitlesCurate = [_(msg `Posts`), _(msg `People`)];
    const moderation = useMemo(() => {
        return moderateUserList(list, moderationOpts);
    }, [list, moderationOpts]);
    useSetTitle(isHidden ? _(msg `List Hidden`) : list.name);
    useFocusEffect(useCallback(() => {
        setMinimalShellMode(false);
    }, [setMinimalShellMode]));
    const onChangeMembers = () => {
        if (isCurateList) {
            truncateAndInvalidate(queryClient, FEED_RQKEY(`list|${list.uri}`));
        }
    };
    const onCurrentPageSelected = useCallback((index) => {
        if (index === 0) {
            feedSectionRef.current?.scrollToTop();
        }
        else if (index === 1) {
            aboutSectionRef.current?.scrollToTop();
        }
    }, [feedSectionRef]);
    const renderHeader = useCallback(() => {
        return _jsx(Header, { rkey: rkey, list: list, preferences: preferences });
    }, [rkey, list, preferences]);
    if (isCurateList) {
        return (_jsxs(Hider.Outer, { modui: moderation.ui('contentView'), allowOverride: isOwner, children: [_jsx(Hider.Mask, { children: _jsx(ListHiddenScreen, { list: list, preferences: preferences }) }), _jsxs(Hider.Content, { children: [_jsxs(View, { style: [a.util_screen_outer], children: [_jsxs(PagerWithHeader, { items: sectionTitlesCurate, isHeaderReady: true, renderHeader: renderHeader, onCurrentPageSelected: onCurrentPageSelected, children: [({ headerHeight, scrollElRef, isFocused }) => (_jsx(FeedSection, { ref: feedSectionRef, feed: `list|${uri}`, scrollElRef: scrollElRef, headerHeight: headerHeight, isFocused: isScreenFocused && isFocused, isOwner: isOwner, onPressAddUser: addUserDialogControl.open })), ({ headerHeight, scrollElRef }) => (_jsx(AboutSection, { ref: aboutSectionRef, scrollElRef: scrollElRef, list: list, onPressAddUser: addUserDialogControl.open, headerHeight: headerHeight }))] }), _jsx(FAB, { testID: "composeFAB", onPress: () => openComposer({}), icon: _jsx(ComposeIcon2, { strokeWidth: 1.5, size: 29, style: { color: 'white' } }), accessibilityRole: "button", accessibilityLabel: _(msg `New post`), accessibilityHint: "" })] }), _jsx(ListAddRemoveUsersDialog, { control: addUserDialogControl, list: list, onChange: onChangeMembers })] })] }));
    }
    return (_jsxs(Hider.Outer, { modui: moderation.ui('contentView'), allowOverride: isOwner, children: [_jsx(Hider.Mask, { children: _jsx(ListHiddenScreen, { list: list, preferences: preferences }) }), _jsxs(Hider.Content, { children: [_jsxs(View, { style: [a.util_screen_outer], children: [_jsx(Layout.Center, { children: renderHeader() }), _jsx(AboutSection, { list: list, scrollElRef: scrollElRef, onPressAddUser: addUserDialogControl.open, headerHeight: 0 }), _jsx(FAB, { testID: "composeFAB", onPress: () => openComposer({}), icon: _jsx(ComposeIcon2, { strokeWidth: 1.5, size: 29, style: { color: 'white' } }), accessibilityRole: "button", accessibilityLabel: _(msg `New post`), accessibilityHint: "" })] }), _jsx(ListAddRemoveUsersDialog, { control: addUserDialogControl, list: list, onChange: onChangeMembers })] })] }));
}
//# sourceMappingURL=index.js.map