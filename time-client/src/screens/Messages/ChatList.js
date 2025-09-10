import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useAnimatedRef } from 'react-native-reanimated';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import {} from '@react-navigation/native-stack';
import { useAppState } from '#/lib/hooks/useAppState';
import { useInitialNumToRender } from '#/lib/hooks/useInitialNumToRender';
import { useRequireEmailVerification } from '#/lib/hooks/useRequireEmailVerification';
import {} from '#/lib/routes/types';
import { cleanError } from '#/lib/strings/errors';
import { logger } from '#/logger';
import { isNative } from '#/platform/detection';
import { listenSoftReset } from '#/state/events';
import { MESSAGE_SCREEN_POLL_INTERVAL } from '#/state/messages/convo/const';
import { useMessagesEventBus } from '#/state/messages/events';
import { useLeftConvos } from '#/state/queries/messages/leave-conversation';
import { useListConvosQuery } from '#/state/queries/messages/list-conversations';
import { useSession } from '#/state/session';
import { List } from '#/view/com/util/List';
import { ChatListLoadingPlaceholder } from '#/view/com/util/LoadingPlaceholder';
import { atoms as a, useBreakpoints, useTheme } from '#/alf';
import { AgeRestrictedScreen } from '#/components/ageAssurance/AgeRestrictedScreen';
import { useAgeAssuranceCopy } from '#/components/ageAssurance/useAgeAssuranceCopy';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import { useDialogControl } from '#/components/Dialog';
import { NewChat } from '#/components/dms/dialogs/NewChatDialog';
import { useRefreshOnFocus } from '#/components/hooks/useRefreshOnFocus';
import { ArrowRotateCounterClockwise_Stroke2_Corner0_Rounded as RetryIcon } from '#/components/icons/ArrowRotateCounterClockwise';
import { CircleInfo_Stroke2_Corner0_Rounded as CircleInfoIcon } from '#/components/icons/CircleInfo';
import { Message_Stroke2_Corner0_Rounded as MessageIcon } from '#/components/icons/Message';
import { PlusLarge_Stroke2_Corner0_Rounded as PlusIcon } from '#/components/icons/Plus';
import { SettingsGear2_Stroke2_Corner0_Rounded as SettingsIcon } from '#/components/icons/SettingsGear2';
import * as Layout from '#/components/Layout';
import { Link } from '#/components/Link';
import { ListFooter } from '#/components/Lists';
import { Text } from '#/components/Typography';
import { ChatListItem } from './components/ChatListItem';
import { InboxPreview } from './components/InboxPreview';
function renderItem({ item }) {
    switch (item.type) {
        case 'INBOX':
            return _jsx(InboxPreview, { profiles: item.profiles });
        case 'CONVERSATION':
            return _jsx(ChatListItem, { convo: item.conversation });
    }
}
function keyExtractor(item) {
    return item.type === 'INBOX' ? 'INBOX' : item.conversation.id;
}
export function MessagesScreen(props) {
    const { _ } = useLingui();
    const aaCopy = useAgeAssuranceCopy();
    return (_jsx(AgeRestrictedScreen, { screenTitle: _(msg `Chats`), infoText: aaCopy.chatsInfoText, rightHeaderSlot: _jsx(Link, { to: "/messages/settings", label: _(msg `Chat settings`), size: "small", color: "secondary", children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Chat settings" }) }) }), children: _jsx(MessagesScreenInner, { ...props }) }));
}
export function MessagesScreenInner({ navigation, route }) {
    const { _ } = useLingui();
    const t = useTheme();
    const { currentAccount } = useSession();
    const newChatControl = useDialogControl();
    const scrollElRef = useAnimatedRef();
    const pushToConversation = route.params?.pushToConversation;
    // Whenever we have `pushToConversation` set, it means we pressed a notification for a chat without being on
    // this tab. We should immediately push to the conversation after pressing the notification.
    // After we push, reset with `setParams` so that this effect will fire next time we press a notification, even if
    // the conversation is the same as before
    useEffect(() => {
        if (pushToConversation) {
            navigation.navigate('MessagesConversation', {
                conversation: pushToConversation,
            });
            navigation.setParams({ pushToConversation: undefined });
        }
    }, [navigation, pushToConversation]);
    // Request the poll interval to be 10s (or whatever the MESSAGE_SCREEN_POLL_INTERVAL is set to in the future)
    // but only when the screen is active
    const messagesBus = useMessagesEventBus();
    const state = useAppState();
    const isActive = state === 'active';
    useFocusEffect(useCallback(() => {
        if (isActive) {
            const unsub = messagesBus.requestPollInterval(MESSAGE_SCREEN_POLL_INTERVAL);
            return () => unsub();
        }
    }, [messagesBus, isActive]));
    const initialNumToRender = useInitialNumToRender({ minItemHeight: 80 });
    const [isPTRing, setIsPTRing] = useState(false);
    const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, isError, error, refetch, } = useListConvosQuery({ status: 'accepted' });
    const { data: inboxData, refetch: refetchInbox } = useListConvosQuery({
        status: 'request',
    });
    useRefreshOnFocus(refetch);
    useRefreshOnFocus(refetchInbox);
    const leftConvos = useLeftConvos();
    const inboxAllConvos = inboxData?.pages
        .flatMap(page => page.convos)
        .filter(convo => !leftConvos.includes(convo.id) &&
        !convo.muted &&
        convo.members.every(member => member.handle !== 'missing.invalid')) ?? [];
    const hasInboxConvos = inboxAllConvos?.length > 0;
    const inboxUnreadConvos = inboxAllConvos.filter(convo => convo.unreadCount > 0);
    const inboxUnreadConvoMembers = inboxUnreadConvos
        .map(x => x.members.find(y => y.did !== currentAccount?.did))
        .filter(x => !!x);
    const conversations = useMemo(() => {
        if (data?.pages) {
            const conversations = data.pages
                .flatMap(page => page.convos)
                // filter out convos that are actively being left
                .filter(convo => !leftConvos.includes(convo.id));
            return [
                ...(hasInboxConvos
                    ? [
                        {
                            type: 'INBOX',
                            count: inboxUnreadConvoMembers.length,
                            profiles: inboxUnreadConvoMembers.slice(0, 3),
                        },
                    ]
                    : []),
                ...conversations.map(convo => ({ type: 'CONVERSATION', conversation: convo })),
            ];
        }
        return [];
    }, [data, leftConvos, hasInboxConvos, inboxUnreadConvoMembers]);
    const onRefresh = useCallback(async () => {
        setIsPTRing(true);
        try {
            await Promise.all([refetch(), refetchInbox()]);
        }
        catch (err) {
            logger.error('Failed to refresh conversations', { message: err });
        }
        setIsPTRing(false);
    }, [refetch, refetchInbox, setIsPTRing]);
    const onEndReached = useCallback(async () => {
        if (isFetchingNextPage || !hasNextPage || isError)
            return;
        try {
            await fetchNextPage();
        }
        catch (err) {
            logger.error('Failed to load more conversations', { message: err });
        }
    }, [isFetchingNextPage, hasNextPage, isError, fetchNextPage]);
    const onNewChat = useCallback((conversation) => navigation.navigate('MessagesConversation', { conversation }), [navigation]);
    const onSoftReset = useCallback(async () => {
        scrollElRef.current?.scrollToOffset({
            animated: isNative,
            offset: 0,
        });
        try {
            await refetch();
        }
        catch (err) {
            logger.error('Failed to refresh conversations', { message: err });
        }
    }, [scrollElRef, refetch]);
    const isScreenFocused = useIsFocused();
    useEffect(() => {
        if (!isScreenFocused) {
            return;
        }
        return listenSoftReset(onSoftReset);
    }, [onSoftReset, isScreenFocused]);
    // NOTE(APiligrim)
    // Show empty state only if there are no conversations at all
    const activeConversations = conversations.filter(item => item.type === 'CONVERSATION');
    if (activeConversations.length === 0) {
        return (_jsxs(Layout.Screen, { children: [_jsx(Header, { newChatControl: newChatControl }), _jsxs(Layout.Center, { children: [!isLoading && hasInboxConvos && (_jsx(InboxPreview, { profiles: inboxUnreadConvoMembers })), isLoading ? (_jsx(ChatListLoadingPlaceholder, {})) : (_jsx(_Fragment, { children: isError ? (_jsx(_Fragment, { children: _jsxs(View, { style: [a.pt_3xl, a.align_center], children: [_jsx(CircleInfoIcon, { width: 48, fill: t.atoms.text_contrast_low.color }), _jsx(Text, { style: [a.pt_md, a.pb_sm, a.text_2xl, a.font_bold], children: _jsx(Trans, { children: "Whoops!" }) }), _jsx(Text, { style: [
                                                a.text_md,
                                                a.pb_xl,
                                                a.text_center,
                                                a.leading_snug,
                                                t.atoms.text_contrast_medium,
                                                { maxWidth: 360 },
                                            ], children: cleanError(error) ||
                                                _(msg `Failed to load conversations`) }), _jsxs(Button, { label: _(msg `Reload conversations`), size: "small", color: "secondary_inverted", variant: "solid", onPress: () => refetch(), children: [_jsx(ButtonText, { children: _jsx(Trans, { children: "Retry" }) }), _jsx(ButtonIcon, { icon: RetryIcon, position: "right" })] })] }) })) : (_jsx(_Fragment, { children: _jsxs(View, { style: [a.pt_3xl, a.align_center], children: [_jsx(MessageIcon, { width: 48, fill: t.palette.primary_500 }), _jsx(Text, { style: [a.pt_md, a.pb_sm, a.text_2xl, a.font_bold], children: _jsx(Trans, { children: "Nothing here" }) }), _jsx(Text, { style: [
                                                a.text_md,
                                                a.pb_xl,
                                                a.text_center,
                                                a.leading_snug,
                                                t.atoms.text_contrast_medium,
                                            ], children: _jsx(Trans, { children: "You have no conversations yet. Start one!" }) })] }) })) }))] }), !isLoading && !isError && (_jsx(NewChat, { onNewChat: onNewChat, control: newChatControl }))] }));
    }
    return (_jsxs(Layout.Screen, { testID: "messagesScreen", children: [_jsx(Header, { newChatControl: newChatControl }), _jsx(NewChat, { onNewChat: onNewChat, control: newChatControl }), _jsx(List, { ref: scrollElRef, data: conversations, renderItem: renderItem, keyExtractor: keyExtractor, refreshing: isPTRing, onRefresh: onRefresh, onEndReached: onEndReached, ListFooterComponent: _jsx(ListFooter, { isFetchingNextPage: isFetchingNextPage, error: cleanError(error), onRetry: fetchNextPage, style: { borderColor: 'transparent' }, hasNextPage: hasNextPage }), onEndReachedThreshold: isNative ? 1.5 : 0, initialNumToRender: initialNumToRender, windowSize: 11, desktopFixedHeight: true, sideBorders: false })] }));
}
function Header({ newChatControl }) {
    const { _ } = useLingui();
    const { gtMobile } = useBreakpoints();
    const requireEmailVerification = useRequireEmailVerification();
    const openChatControl = useCallback(() => {
        newChatControl.open();
    }, [newChatControl]);
    const wrappedOpenChatControl = requireEmailVerification(openChatControl, {
        instructions: [
            _jsx(Trans, { children: "Before you can message another user, you must first verify your email." }, "new-chat"),
        ],
    });
    const settingsLink = (_jsx(Link, { to: "/messages/settings", label: _(msg `Chat settings`), size: "small", variant: "ghost", color: "secondary", shape: "round", style: [a.justify_center], children: _jsx(ButtonIcon, { icon: SettingsIcon, size: "lg" }) }));
    return (_jsx(Layout.Header.Outer, { children: gtMobile ? (_jsxs(_Fragment, { children: [_jsx(Layout.Header.Content, { children: _jsx(Layout.Header.TitleText, { children: _jsx(Trans, { children: "Chats" }) }) }), _jsxs(View, { style: [a.flex_row, a.align_center, a.gap_sm], children: [settingsLink, _jsxs(Button, { label: _(msg `New chat`), color: "primary", size: "small", variant: "solid", onPress: wrappedOpenChatControl, children: [_jsx(ButtonIcon, { icon: PlusIcon, position: "left" }), _jsx(ButtonText, { children: _jsx(Trans, { children: "New chat" }) })] })] })] })) : (_jsxs(_Fragment, { children: [_jsx(Layout.Header.MenuButton, {}), _jsx(Layout.Header.Content, { children: _jsx(Layout.Header.TitleText, { children: _jsx(Trans, { children: "Chats" }) }) }), _jsx(Layout.Header.Slot, { children: settingsLink })] })) }));
}
//# sourceMappingURL=ChatList.js.map