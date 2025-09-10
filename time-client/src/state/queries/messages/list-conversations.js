import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { ChatBskyConvoDefs, moderateProfile, } from '@atproto/api';
import { useInfiniteQuery, useQueryClient, } from '@tanstack/react-query';
import throttle from 'lodash.throttle';
import { DM_SERVICE_HEADERS } from '#/lib/constants';
import { useCurrentConvoId } from '#/state/messages/current-convo-id';
import { useMessagesEventBus } from '#/state/messages/events';
import { useModerationOpts } from '#/state/preferences/moderation-opts';
import { useAgent, useSession } from '#/state/session';
import { useLeftConvos } from './leave-conversation';
export const RQKEY_ROOT = 'convo-list';
export const RQKEY = (status, readState = 'all') => [RQKEY_ROOT, status, readState];
export function useListConvosQuery({ enabled, status, readState = 'all', } = {}) {
    const agent = useAgent();
    return useInfiniteQuery({
        enabled,
        queryKey: RQKEY(status ?? 'all', readState),
        queryFn: async ({ pageParam }) => {
            const { data } = await agent.chat.bsky.convo.listConvos({
                limit: 20,
                cursor: pageParam,
                readState: readState === 'unread' ? 'unread' : undefined,
                status,
            }, { headers: DM_SERVICE_HEADERS });
            return data;
        },
        initialPageParam: undefined,
        getNextPageParam: lastPage => lastPage.cursor,
    });
}
const ListConvosContext = createContext(null);
ListConvosContext.displayName = 'ListConvosContext';
export function useListConvos() {
    const ctx = useContext(ListConvosContext);
    if (!ctx) {
        throw new Error('useListConvos must be used within a ListConvosProvider');
    }
    return ctx;
}
const empty = { accepted: [], request: [] };
export function ListConvosProvider({ children }) {
    const { hasSession } = useSession();
    if (!hasSession) {
        return (_jsx(ListConvosContext.Provider, { value: empty, children: children }));
    }
    return _jsx(ListConvosProviderInner, { children: children });
}
export function ListConvosProviderInner({ children, }) {
    const { refetch, data } = useListConvosQuery({ readState: 'unread' });
    const messagesBus = useMessagesEventBus();
    const queryClient = useQueryClient();
    const { currentConvoId } = useCurrentConvoId();
    const { currentAccount } = useSession();
    const leftConvos = useLeftConvos();
    const debouncedRefetch = useMemo(() => {
        const refetchAndInvalidate = () => {
            refetch();
            queryClient.invalidateQueries({ queryKey: [RQKEY_ROOT] });
        };
        return throttle(refetchAndInvalidate, 500, {
            leading: true,
            trailing: true,
        });
    }, [refetch, queryClient]);
    useEffect(() => {
        const unsub = messagesBus.on(events => {
            if (events.type !== 'logs')
                return;
            for (const log of events.logs) {
                if (ChatBskyConvoDefs.isLogBeginConvo(log)) {
                    debouncedRefetch();
                }
                else if (ChatBskyConvoDefs.isLogLeaveConvo(log)) {
                    queryClient.setQueriesData({ queryKey: [RQKEY_ROOT] }, (old) => optimisticDelete(log.convoId, old));
                }
                else if (ChatBskyConvoDefs.isLogDeleteMessage(log)) {
                    queryClient.setQueriesData({ queryKey: [RQKEY_ROOT] }, (old) => optimisticUpdate(log.convoId, old, convo => {
                        if ((ChatBskyConvoDefs.isDeletedMessageView(log.message) ||
                            ChatBskyConvoDefs.isMessageView(log.message)) &&
                            (ChatBskyConvoDefs.isDeletedMessageView(convo.lastMessage) ||
                                ChatBskyConvoDefs.isMessageView(convo.lastMessage))) {
                            return log.message.id === convo.lastMessage.id
                                ? {
                                    ...convo,
                                    rev: log.rev,
                                    lastMessage: log.message,
                                }
                                : convo;
                        }
                        else {
                            return convo;
                        }
                    }));
                }
                else if (ChatBskyConvoDefs.isLogCreateMessage(log)) {
                    // Store in a new var to avoid TS errors due to closures.
                    const logRef = log;
                    // Get all matching queries
                    const queries = queryClient.getQueriesData({
                        queryKey: [RQKEY_ROOT],
                    });
                    // Check if convo exists in any query
                    let foundConvo = null;
                    for (const [_key, query] of queries) {
                        if (!query)
                            continue;
                        const convo = getConvoFromQueryData(logRef.convoId, query);
                        if (convo) {
                            foundConvo = convo;
                            break;
                        }
                    }
                    if (!foundConvo) {
                        // Convo not found, trigger refetch
                        debouncedRefetch();
                        return;
                    }
                    // Update the convo
                    const updatedConvo = {
                        ...foundConvo,
                        rev: logRef.rev,
                        lastMessage: logRef.message,
                        unreadCount: foundConvo.id !== currentConvoId
                            ? (ChatBskyConvoDefs.isMessageView(logRef.message) ||
                                ChatBskyConvoDefs.isDeletedMessageView(logRef.message)) &&
                                logRef.message.sender.did !== currentAccount?.did
                                ? foundConvo.unreadCount + 1
                                : foundConvo.unreadCount
                            : 0,
                    };
                    function filterConvoFromPage(convo) {
                        return convo.filter(c => c.id !== logRef.convoId);
                    }
                    // Update all matching queries
                    function updateFn(old) {
                        if (!old)
                            return old;
                        return {
                            ...old,
                            pages: old.pages.map((page, i) => {
                                if (i === 0) {
                                    return {
                                        ...page,
                                        convos: [
                                            updatedConvo,
                                            ...filterConvoFromPage(page.convos),
                                        ],
                                    };
                                }
                                return {
                                    ...page,
                                    convos: filterConvoFromPage(page.convos),
                                };
                            }),
                        };
                    }
                    // always update the unread one
                    queryClient.setQueriesData({ queryKey: RQKEY('all', 'unread') }, (old) => old
                        ? updateFn(old)
                        : {
                            pageParams: [undefined],
                            pages: [{ convos: [updatedConvo], cursor: undefined }],
                        });
                    // update the other ones based on status of the incoming message
                    if (updatedConvo.status === 'accepted') {
                        queryClient.setQueriesData({ queryKey: RQKEY('accepted') }, updateFn);
                    }
                    else if (updatedConvo.status === 'request') {
                        queryClient.setQueriesData({ queryKey: RQKEY('request') }, updateFn);
                    }
                }
                else if (ChatBskyConvoDefs.isLogReadMessage(log)) {
                    const logRef = log;
                    queryClient.setQueriesData({ queryKey: [RQKEY_ROOT] }, (old) => optimisticUpdate(logRef.convoId, old, convo => ({
                        ...convo,
                        unreadCount: 0,
                        rev: logRef.rev,
                    })));
                }
                else if (ChatBskyConvoDefs.isLogAcceptConvo(log)) {
                    const logRef = log;
                    const requests = queryClient.getQueryData(RQKEY('request'));
                    if (!requests) {
                        debouncedRefetch();
                        return;
                    }
                    const acceptedConvo = getConvoFromQueryData(log.convoId, requests);
                    if (!acceptedConvo) {
                        debouncedRefetch();
                        return;
                    }
                    queryClient.setQueryData(RQKEY('request'), (old) => optimisticDelete(logRef.convoId, old));
                    queryClient.setQueriesData({ queryKey: RQKEY('accepted') }, (old) => {
                        if (!old) {
                            debouncedRefetch();
                            return old;
                        }
                        return {
                            ...old,
                            pages: old.pages.map((page, i) => {
                                if (i === 0) {
                                    return {
                                        ...page,
                                        convos: [
                                            { ...acceptedConvo, status: 'accepted' },
                                            ...page.convos,
                                        ],
                                    };
                                }
                                return page;
                            }),
                        };
                    });
                }
                else if (ChatBskyConvoDefs.isLogMuteConvo(log)) {
                    const logRef = log;
                    queryClient.setQueriesData({ queryKey: [RQKEY_ROOT] }, (old) => optimisticUpdate(logRef.convoId, old, convo => ({
                        ...convo,
                        muted: true,
                        rev: logRef.rev,
                    })));
                }
                else if (ChatBskyConvoDefs.isLogUnmuteConvo(log)) {
                    const logRef = log;
                    queryClient.setQueriesData({ queryKey: [RQKEY_ROOT] }, (old) => optimisticUpdate(logRef.convoId, old, convo => ({
                        ...convo,
                        muted: false,
                        rev: logRef.rev,
                    })));
                }
                else if (ChatBskyConvoDefs.isLogAddReaction(log)) {
                    const logRef = log;
                    queryClient.setQueriesData({ queryKey: [RQKEY_ROOT] }, (old) => optimisticUpdate(logRef.convoId, old, convo => ({
                        ...convo,
                        lastReaction: {
                            $type: 'chat.bsky.convo.defs#messageAndReactionView',
                            reaction: logRef.reaction,
                            message: logRef.message,
                        },
                        rev: logRef.rev,
                    })));
                }
                else if (ChatBskyConvoDefs.isLogRemoveReaction(log)) {
                    const logRef = log;
                    queryClient.setQueriesData({ queryKey: [RQKEY_ROOT] }, (old) => optimisticUpdate(logRef.convoId, old, convo => {
                        if (
                        // if the convo is the same
                        logRef.convoId === convo.id &&
                            ChatBskyConvoDefs.isMessageAndReactionView(convo.lastReaction) &&
                            ChatBskyConvoDefs.isMessageView(logRef.message) &&
                            // ...and the message is the same
                            convo.lastReaction.message.id === logRef.message.id &&
                            // ...and the reaction is the same
                            convo.lastReaction.reaction.sender.did ===
                                logRef.reaction.sender.did &&
                            convo.lastReaction.reaction.value === logRef.reaction.value) {
                            return {
                                ...convo,
                                // ...remove the reaction. hopefully they didn't react twice in a row!
                                lastReaction: undefined,
                                rev: logRef.rev,
                            };
                        }
                        else {
                            return convo;
                        }
                    }));
                }
            }
        }, {
            // get events for all chats
            convoId: undefined,
        });
        return () => unsub();
    }, [
        messagesBus,
        currentConvoId,
        queryClient,
        currentAccount?.did,
        debouncedRefetch,
    ]);
    const ctx = useMemo(() => {
        const convos = data?.pages
            .flatMap(page => page.convos)
            .filter(convo => !leftConvos.includes(convo.id)) ?? [];
        return {
            accepted: convos.filter(conv => conv.status === 'accepted'),
            request: convos.filter(conv => conv.status === 'request'),
        };
    }, [data, leftConvos]);
    return (_jsx(ListConvosContext.Provider, { value: ctx, children: children }));
}
export function useUnreadMessageCount() {
    const { currentConvoId } = useCurrentConvoId();
    const { currentAccount } = useSession();
    const { accepted, request } = useListConvos();
    const moderationOpts = useModerationOpts();
    return useMemo(() => {
        const acceptedCount = calculateCount(accepted, currentAccount?.did, currentConvoId, moderationOpts);
        const requestCount = calculateCount(request, currentAccount?.did, currentConvoId, moderationOpts);
        if (acceptedCount > 0) {
            const total = acceptedCount + Math.min(requestCount, 1);
            return {
                count: total,
                numUnread: total > 10 ? '10+' : String(total),
                // only needed when numUnread is undefined
                hasNew: false,
            };
        }
        else if (requestCount > 0) {
            return {
                count: 1,
                numUnread: undefined,
                hasNew: true,
            };
        }
        else {
            return {
                count: 0,
                numUnread: undefined,
                hasNew: false,
            };
        }
    }, [accepted, request, currentAccount?.did, currentConvoId, moderationOpts]);
}
function calculateCount(convos, currentAccountDid, currentConvoId, moderationOpts) {
    return (convos
        .filter(convo => convo.id !== currentConvoId)
        .reduce((acc, convo) => {
        const otherMember = convo.members.find(member => member.did !== currentAccountDid);
        if (!otherMember || !moderationOpts)
            return acc;
        const moderation = moderateProfile(otherMember, moderationOpts);
        const shouldIgnore = convo.muted ||
            moderation.blocked ||
            otherMember.handle === 'missing.invalid';
        const unreadCount = !shouldIgnore && convo.unreadCount > 0 ? 1 : 0;
        return acc + unreadCount;
    }, 0) ?? 0);
}
export function useOnMarkAsRead() {
    const queryClient = useQueryClient();
    return useCallback((chatId) => {
        queryClient.setQueriesData({ queryKey: [RQKEY_ROOT] }, (old) => {
            if (!old)
                return old;
            return optimisticUpdate(chatId, old, convo => ({
                ...convo,
                unreadCount: 0,
            }));
        });
    }, [queryClient]);
}
function optimisticUpdate(chatId, old, updateFn) {
    if (!old || !updateFn)
        return old;
    return {
        ...old,
        pages: old.pages.map(page => ({
            ...page,
            convos: page.convos.map(convo => chatId === convo.id ? updateFn(convo) : convo),
        })),
    };
}
function optimisticDelete(chatId, old) {
    if (!old)
        return old;
    return {
        ...old,
        pages: old.pages.map(page => ({
            ...page,
            convos: page.convos.filter(convo => chatId !== convo.id),
        })),
    };
}
export function getConvoFromQueryData(chatId, old) {
    for (const page of old.pages) {
        for (const convo of page.convos) {
            if (convo.id === chatId) {
                return convo;
            }
        }
    }
    return null;
}
export function* findAllProfilesInQueryData(queryClient, did) {
    const queryDatas = queryClient.getQueriesData({
        queryKey: [RQKEY_ROOT],
    });
    for (const [_queryKey, queryData] of queryDatas) {
        if (!queryData?.pages) {
            continue;
        }
        for (const page of queryData.pages) {
            for (const convo of page.convos) {
                for (const member of convo.members) {
                    if (member.did === did) {
                        yield member;
                    }
                }
            }
        }
    }
}
//# sourceMappingURL=list-conversations.js.map