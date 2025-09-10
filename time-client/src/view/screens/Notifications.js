import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useNonReactiveCallback } from '#/lib/hooks/useNonReactiveCallback';
import { useOpenComposer } from '#/lib/hooks/useOpenComposer';
import { ComposeIcon2 } from '#/lib/icons';
import {} from '#/lib/routes/types';
import { s } from '#/lib/styles';
import { logger } from '#/logger';
import { isNative } from '#/platform/detection';
import { emitSoftReset, listenSoftReset } from '#/state/events';
import { RQKEY as NOTIFS_RQKEY } from '#/state/queries/notifications/feed';
import { useNotificationSettingsQuery } from '#/state/queries/notifications/settings';
import { useUnreadNotifications, useUnreadNotificationsApi, } from '#/state/queries/notifications/unread';
import { truncateAndInvalidate } from '#/state/queries/util';
import { useSetMinimalShellMode } from '#/state/shell';
import { NotificationFeed } from '#/view/com/notifications/NotificationFeed';
import { Pager } from '#/view/com/pager/Pager';
import { TabBar } from '#/view/com/pager/TabBar';
import { FAB } from '#/view/com/util/fab/FAB';
import {} from '#/view/com/util/List';
import { LoadLatestBtn } from '#/view/com/util/load-latest/LoadLatestBtn';
import { MainScrollProvider } from '#/view/com/util/MainScrollProvider';
import { atoms as a, useTheme } from '#/alf';
import { web } from '#/alf';
import { Admonition } from '#/components/Admonition';
import { ButtonIcon } from '#/components/Button';
import { SettingsGear2_Stroke2_Corner0_Rounded as SettingsIcon } from '#/components/icons/SettingsGear2';
import * as Layout from '#/components/Layout';
import { InlineLinkText, Link } from '#/components/Link';
import { Loader } from '#/components/Loader';
// We don't currently persist this across reloads since
// you gotta visit All to clear the badge anyway.
// But let's at least persist it during the sesssion.
let lastActiveTab = 0;
export function NotificationsScreen({}) {
    const { _ } = useLingui();
    const { openComposer } = useOpenComposer();
    const unreadNotifs = useUnreadNotifications();
    const hasNew = !!unreadNotifs;
    const { checkUnread: checkUnreadAll } = useUnreadNotificationsApi();
    const [isLoadingAll, setIsLoadingAll] = useState(false);
    const [isLoadingMentions, setIsLoadingMentions] = useState(false);
    const initialActiveTab = lastActiveTab;
    const [activeTab, setActiveTab] = useState(initialActiveTab);
    const isLoading = activeTab === 0 ? isLoadingAll : isLoadingMentions;
    const onPageSelected = useCallback((index) => {
        setActiveTab(index);
        lastActiveTab = index;
    }, [setActiveTab]);
    const queryClient = useQueryClient();
    const checkUnreadMentions = useCallback(async ({ invalidate }) => {
        if (invalidate) {
            return truncateAndInvalidate(queryClient, NOTIFS_RQKEY('mentions'));
        }
        else {
            // Background polling is not implemented for the mentions tab.
            // Just ignore it.
        }
    }, [queryClient]);
    const sections = useMemo(() => {
        return [
            {
                title: _(msg `All`),
                component: (_jsx(NotificationsTab, { filter: "all", isActive: activeTab === 0, isLoading: isLoadingAll, hasNew: hasNew, setIsLoadingLatest: setIsLoadingAll, checkUnread: checkUnreadAll })),
            },
            {
                title: _(msg `Mentions`),
                component: (_jsx(NotificationsTab, { filter: "mentions", isActive: activeTab === 1, isLoading: isLoadingMentions, hasNew: false /* We don't know for sure */, setIsLoadingLatest: setIsLoadingMentions, checkUnread: checkUnreadMentions })),
            },
        ];
    }, [
        _,
        hasNew,
        checkUnreadAll,
        checkUnreadMentions,
        activeTab,
        isLoadingAll,
        isLoadingMentions,
    ]);
    return (_jsxs(Layout.Screen, { testID: "notificationsScreen", children: [_jsxs(Layout.Header.Outer, { noBottomBorder: true, sticky: false, children: [_jsx(Layout.Header.MenuButton, {}), _jsx(Layout.Header.Content, { children: _jsx(Layout.Header.TitleText, { children: _jsx(Trans, { children: "Notifications" }) }) }), _jsx(Layout.Header.Slot, { children: _jsx(Link, { to: { screen: 'NotificationSettings' }, label: _(msg `Notification settings`), size: "small", variant: "ghost", color: "secondary", shape: "round", style: [a.justify_center], children: _jsx(ButtonIcon, { icon: isLoading ? Loader : SettingsIcon, size: "lg" }) }) })] }), _jsx(Pager, { onPageSelected: onPageSelected, renderTabBar: props => (_jsx(Layout.Center, { style: [a.z_10, web([a.sticky, { top: 0 }])], children: _jsx(TabBar, { ...props, items: sections.map(section => section.title), onPressSelected: () => emitSoftReset() }) })), initialPage: initialActiveTab, children: sections.map((section, i) => (_jsx(View, { children: section.component }, i))) }), _jsx(FAB, { testID: "composeFAB", onPress: () => openComposer({}), icon: _jsx(ComposeIcon2, { strokeWidth: 1.5, size: 29, style: s.white }), accessibilityRole: "button", accessibilityLabel: _(msg `New post`), accessibilityHint: "" })] }));
}
function NotificationsTab({ filter, isActive, isLoading, hasNew, checkUnread, setIsLoadingLatest, }) {
    const { _ } = useLingui();
    const setMinimalShellMode = useSetMinimalShellMode();
    const [isScrolledDown, setIsScrolledDown] = useState(false);
    const scrollElRef = useRef(null);
    const queryClient = useQueryClient();
    const isScreenFocused = useIsFocused();
    const isFocusedAndActive = isScreenFocused && isActive;
    // event handlers
    // =
    const scrollToTop = useCallback(() => {
        scrollElRef.current?.scrollToOffset({ animated: isNative, offset: 0 });
        setMinimalShellMode(false);
    }, [scrollElRef, setMinimalShellMode]);
    const onPressLoadLatest = useCallback(() => {
        scrollToTop();
        if (hasNew) {
            // render what we have now
            truncateAndInvalidate(queryClient, NOTIFS_RQKEY(filter));
        }
        else if (!isLoading) {
            // check with the server
            setIsLoadingLatest(true);
            checkUnread({ invalidate: true })
                .catch(() => undefined)
                .then(() => setIsLoadingLatest(false));
        }
    }, [
        scrollToTop,
        queryClient,
        checkUnread,
        hasNew,
        isLoading,
        setIsLoadingLatest,
        filter,
    ]);
    const onFocusCheckLatest = useNonReactiveCallback(() => {
        // on focus, check for latest, but only invalidate if the user
        // isnt scrolled down to avoid moving content underneath them
        let currentIsScrolledDown;
        if (isNative) {
            currentIsScrolledDown = isScrolledDown;
        }
        else {
            // On the web, this isn't always updated in time so
            // we're just going to look it up synchronously.
            currentIsScrolledDown = window.scrollY > 200;
        }
        checkUnread({ invalidate: !currentIsScrolledDown });
    });
    // on-visible setup
    // =
    useFocusEffect(useCallback(() => {
        if (isFocusedAndActive) {
            setMinimalShellMode(false);
            logger.debug('NotificationsScreen: Focus');
            onFocusCheckLatest();
        }
    }, [setMinimalShellMode, onFocusCheckLatest, isFocusedAndActive]));
    useEffect(() => {
        if (!isFocusedAndActive) {
            return;
        }
        return listenSoftReset(onPressLoadLatest);
    }, [onPressLoadLatest, isFocusedAndActive]);
    return (_jsxs(_Fragment, { children: [_jsx(MainScrollProvider, { children: _jsx(NotificationFeed, { enabled: isFocusedAndActive, filter: filter, refreshNotifications: () => checkUnread({ invalidate: true }), onScrolledDownChange: setIsScrolledDown, scrollElRef: scrollElRef, ListHeaderComponent: filter === 'mentions' ? (_jsx(DisabledNotificationsWarning, { active: isFocusedAndActive })) : null }) }), (isScrolledDown || hasNew) && (_jsx(LoadLatestBtn, { onPress: onPressLoadLatest, label: _(msg `Load new notifications`), showIndicator: hasNew }))] }));
}
function DisabledNotificationsWarning({ active }) {
    const t = useTheme();
    const { _ } = useLingui();
    const { data } = useNotificationSettingsQuery({ enabled: active });
    if (!data)
        return null;
    if (!data.reply.list && !data.quote.list && !data.mention.list) {
        // mention tab notifications are disabled
        return (_jsx(View, { style: [a.py_md, a.px_lg, a.border_b, t.atoms.border_contrast_low], children: _jsx(Admonition, { type: "warning", children: _jsxs(Trans, { children: ["You have completely disabled reply, quote, and mention notifications, so this tab will no longer update. To adjust this, visit your", ' ', _jsx(InlineLinkText, { label: _(msg `Visit your notification settings`), to: { screen: 'NotificationSettings' }, children: "notification settings" }), "."] }) }) }));
    }
    return null;
}
//# sourceMappingURL=Notifications.js.map