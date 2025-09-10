import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {} from '@tanstack/react-query';
import { useAppState } from '#/lib/hooks/useAppState';
import { useInitialNumToRender } from '#/lib/hooks/useInitialNumToRender';
import {} from '#/lib/routes/types';
import { cleanError } from '#/lib/strings/errors';
import { logger } from '#/logger';
import { isNative } from '#/platform/detection';
import { MESSAGE_SCREEN_POLL_INTERVAL } from '#/state/messages/convo/const';
import { useMessagesEventBus } from '#/state/messages/events';
import { useLeftConvos } from '#/state/queries/messages/leave-conversation';
import { useListConvosQuery } from '#/state/queries/messages/list-conversations';
import { useUpdateAllRead } from '#/state/queries/messages/update-all-read';
import { FAB } from '#/view/com/util/fab/FAB';
import { List } from '#/view/com/util/List';
import { ChatListLoadingPlaceholder } from '#/view/com/util/LoadingPlaceholder';
import * as Toast from '#/view/com/util/Toast';
import { atoms as a, useBreakpoints, useTheme } from '#/alf';
import { AgeRestrictedScreen } from '#/components/ageAssurance/AgeRestrictedScreen';
import { useAgeAssuranceCopy } from '#/components/ageAssurance/useAgeAssuranceCopy';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import { useRefreshOnFocus } from '#/components/hooks/useRefreshOnFocus';
import { ArrowLeft_Stroke2_Corner0_Rounded as ArrowLeftIcon } from '#/components/icons/Arrow';
import { ArrowRotateCounterClockwise_Stroke2_Corner0_Rounded as RetryIcon } from '#/components/icons/ArrowRotateCounterClockwise';
import { Check_Stroke2_Corner0_Rounded as CheckIcon } from '#/components/icons/Check';
import { CircleInfo_Stroke2_Corner0_Rounded as CircleInfoIcon } from '#/components/icons/CircleInfo';
import { Message_Stroke2_Corner0_Rounded as MessageIcon } from '#/components/icons/Message';
import * as Layout from '#/components/Layout';
import { ListFooter } from '#/components/Lists';
import { Text } from '#/components/Typography';
import { RequestListItem } from './components/RequestListItem';
export function MessagesInboxScreen(props) {
    const { _ } = useLingui();
    const aaCopy = useAgeAssuranceCopy();
    return (_jsx(AgeRestrictedScreen, { screenTitle: _(msg `Chat requests`), infoText: aaCopy.chatsInfoText, children: _jsx(MessagesInboxScreenInner, { ...props }) }));
}
export function MessagesInboxScreenInner({}) {
    const { gtTablet } = useBreakpoints();
    const listConvosQuery = useListConvosQuery({ status: 'request' });
    const { data } = listConvosQuery;
    const leftConvos = useLeftConvos();
    const conversations = useMemo(() => {
        if (data?.pages) {
            const convos = data.pages
                .flatMap(page => page.convos)
                // filter out convos that are actively being left
                .filter(convo => !leftConvos.includes(convo.id));
            return convos;
        }
        return [];
    }, [data, leftConvos]);
    const hasUnreadConvos = useMemo(() => {
        return conversations.some(conversation => conversation.members.every(member => member.handle !== 'missing.invalid') && conversation.unreadCount > 0);
    }, [conversations]);
    return (_jsxs(Layout.Screen, { testID: "messagesInboxScreen", children: [_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, { align: gtTablet ? 'left' : 'platform', children: _jsx(Layout.Header.TitleText, { children: _jsx(Trans, { children: "Chat requests" }) }) }), hasUnreadConvos && gtTablet ? (_jsx(MarkAsReadHeaderButton, {})) : (_jsx(Layout.Header.Slot, {}))] }), _jsx(RequestList, { listConvosQuery: listConvosQuery, conversations: conversations, hasUnreadConvos: hasUnreadConvos })] }));
}
function RequestList({ listConvosQuery, conversations, hasUnreadConvos, }) {
    const { _ } = useLingui();
    const t = useTheme();
    const navigation = useNavigation();
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
    const initialNumToRender = useInitialNumToRender({ minItemHeight: 130 });
    const [isPTRing, setIsPTRing] = useState(false);
    const { isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, isError, error, refetch, } = listConvosQuery;
    useRefreshOnFocus(refetch);
    const onRefresh = useCallback(async () => {
        setIsPTRing(true);
        try {
            await refetch();
        }
        catch (err) {
            logger.error('Failed to refresh conversations', { message: err });
        }
        setIsPTRing(false);
    }, [refetch, setIsPTRing]);
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
    if (conversations.length < 1) {
        return (_jsx(Layout.Center, { children: isLoading ? (_jsx(ChatListLoadingPlaceholder, {})) : (_jsx(_Fragment, { children: isError ? (_jsx(_Fragment, { children: _jsxs(View, { style: [a.pt_3xl, a.align_center], children: [_jsx(CircleInfoIcon, { width: 48, fill: t.atoms.text_contrast_low.color }), _jsx(Text, { style: [a.pt_md, a.pb_sm, a.text_2xl, a.font_bold], children: _jsx(Trans, { children: "Whoops!" }) }), _jsx(Text, { style: [
                                    a.text_md,
                                    a.pb_xl,
                                    a.text_center,
                                    a.leading_snug,
                                    t.atoms.text_contrast_medium,
                                    { maxWidth: 360 },
                                ], children: cleanError(error) || _(msg `Failed to load conversations`) }), _jsxs(Button, { label: _(msg `Reload conversations`), size: "small", color: "secondary_inverted", variant: "solid", onPress: () => refetch(), children: [_jsx(ButtonText, { children: _jsx(Trans, { children: "Retry" }) }), _jsx(ButtonIcon, { icon: RetryIcon, position: "right" })] })] }) })) : (_jsx(_Fragment, { children: _jsxs(View, { style: [a.pt_3xl, a.align_center], children: [_jsx(MessageIcon, { width: 48, fill: t.palette.primary_500 }), _jsx(Text, { style: [a.pt_md, a.pb_sm, a.text_2xl, a.font_bold], children: _jsx(Trans, { comment: "Title message shown in chat requests inbox when it's empty", children: "Inbox zero!" }) }), _jsx(Text, { style: [
                                    a.text_md,
                                    a.pb_xl,
                                    a.text_center,
                                    a.leading_snug,
                                    t.atoms.text_contrast_medium,
                                ], children: _jsx(Trans, { children: "You don't have any chat requests at the moment." }) }), _jsxs(Button, { variant: "solid", color: "secondary", size: "small", label: _(msg `Go back`), onPress: () => {
                                    if (navigation.canGoBack()) {
                                        navigation.goBack();
                                    }
                                    else {
                                        navigation.navigate('Messages', { animation: 'pop' });
                                    }
                                }, children: [_jsx(ButtonIcon, { icon: ArrowLeftIcon }), _jsx(ButtonText, { children: _jsx(Trans, { children: "Back to Chats" }) })] })] }) })) })) }));
    }
    return (_jsxs(_Fragment, { children: [_jsx(List, { data: conversations, renderItem: renderItem, keyExtractor: keyExtractor, refreshing: isPTRing, onRefresh: onRefresh, onEndReached: onEndReached, ListFooterComponent: _jsx(ListFooter, { isFetchingNextPage: isFetchingNextPage, error: cleanError(error), onRetry: fetchNextPage, style: { borderColor: 'transparent' }, hasNextPage: hasNextPage }), onEndReachedThreshold: isNative ? 1.5 : 0, initialNumToRender: initialNumToRender, windowSize: 11, desktopFixedHeight: true, sideBorders: false }), hasUnreadConvos && _jsx(MarkAllReadFAB, {})] }));
}
function keyExtractor(item) {
    return item.id;
}
function renderItem({ item }) {
    return _jsx(RequestListItem, { convo: item });
}
function MarkAllReadFAB() {
    const { _ } = useLingui();
    const t = useTheme();
    const { mutate: markAllRead } = useUpdateAllRead('request', {
        onMutate: () => {
            Toast.show(_(msg `Marked all as read`), 'check');
        },
        onError: () => {
            Toast.show(_(msg `Failed to mark all requests as read`), 'xmark');
        },
    });
    return (_jsx(FAB, { testID: "markAllAsReadFAB", onPress: () => markAllRead(), icon: _jsx(CheckIcon, { size: "lg", fill: t.palette.white }), accessibilityRole: "button", accessibilityLabel: _(msg `Mark all as read`), accessibilityHint: "" }));
}
function MarkAsReadHeaderButton() {
    const { _ } = useLingui();
    const { mutate: markAllRead } = useUpdateAllRead('request', {
        onMutate: () => {
            Toast.show(_(msg `Marked all as read`), 'check');
        },
        onError: () => {
            Toast.show(_(msg `Failed to mark all requests as read`), 'xmark');
        },
    });
    return (_jsxs(Button, { label: _(msg `Mark all as read`), size: "small", color: "secondary", variant: "solid", onPress: () => markAllRead(), children: [_jsx(ButtonIcon, { icon: CheckIcon }), _jsx(ButtonText, { children: _jsx(Trans, { children: "Mark all as read" }) })] }));
}
//# sourceMappingURL=Inbox.js.map