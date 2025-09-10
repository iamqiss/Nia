import { createContext, useCallback, useContext, useEffect, useMemo, useRef, } from 'react';
import { AppState } from 'react-native';
import {} from '@atproto/api';
import throttle from 'lodash.throttle';
import { PROD_FEEDS, STAGING_FEEDS } from '#/lib/constants';
import { isNetworkError } from '#/lib/hooks/useCleanError';
import { logEvent } from '#/lib/statsig/statsig';
import { Logger } from '#/logger';
import { isFeedSourceFeedInfo, } from '#/state/queries/feed';
import {} from '#/state/queries/post-feed';
import { getItemsForFeedback } from '#/view/com/posts/PostFeed';
import { useAgent } from './session';
export const FEEDBACK_FEEDS = [...PROD_FEEDS, ...STAGING_FEEDS];
export const PASSIVE_FEEDBACK_INTERACTIONS = [
    'app.bsky.feed.defs#clickthroughItem',
    'app.bsky.feed.defs#clickthroughAuthor',
    'app.bsky.feed.defs#clickthroughReposter',
    'app.bsky.feed.defs#clickthroughEmbed',
    'app.bsky.feed.defs#interactionSeen',
];
export const DIRECT_FEEDBACK_INTERACTIONS = [
    'app.bsky.feed.defs#requestLess',
    'app.bsky.feed.defs#requestMore',
];
export const ALL_FEEDBACK_INTERACTIONS = [
    ...PASSIVE_FEEDBACK_INTERACTIONS,
    ...DIRECT_FEEDBACK_INTERACTIONS,
];
export function isFeedbackInteraction(interactionEvent) {
    return ALL_FEEDBACK_INTERACTIONS.includes(interactionEvent);
}
const logger = Logger.create(Logger.Context.FeedFeedback);
const stateContext = createContext({
    enabled: false,
    onItemSeen: (_item) => { },
    sendInteraction: (_interaction) => { },
    feedDescriptor: undefined,
    feedSourceInfo: undefined,
});
stateContext.displayName = 'FeedFeedbackContext';
export function useFeedFeedback(feedSourceInfo, hasSession) {
    const agent = useAgent();
    const feed = !!feedSourceInfo && isFeedSourceFeedInfo(feedSourceInfo)
        ? feedSourceInfo
        : undefined;
    const isDiscover = isDiscoverFeed(feed?.feedDescriptor);
    const acceptsInteractions = Boolean(isDiscover || feed?.acceptsInteractions);
    const proxyDid = feed?.view?.did;
    const enabled = Boolean(feed) && Boolean(proxyDid) && acceptsInteractions && hasSession;
    const enabledInteractions = getEnabledInteractions(enabled, feed, isDiscover);
    const queue = useRef(new Set());
    const history = useRef(new WeakSet());
    const aggregatedStats = useRef(null);
    const throttledFlushAggregatedStats = useMemo(() => throttle(() => flushToStatsig(aggregatedStats.current), 45e3, {
        leading: true, // The outer call is already throttled somewhat.
        trailing: true,
    }), []);
    const sendToFeedNoDelay = useCallback(() => {
        const interactions = Array.from(queue.current).map(toInteraction);
        queue.current.clear();
        const interactionsToSend = interactions.filter(interaction => interaction.event &&
            isFeedbackInteraction(interaction.event) &&
            enabledInteractions.includes(interaction.event));
        if (interactionsToSend.length === 0) {
            return;
        }
        // Send to the feed
        agent.app.bsky.feed
            .sendInteractions({ interactions: interactionsToSend }, {
            encoding: 'application/json',
            headers: {
                'atproto-proxy': `${proxyDid}#bsky_fg`,
            },
        })
            .catch((e) => {
            if (!isNetworkError(e)) {
                logger.warn('Failed to send feed interactions', { error: e });
            }
        });
        // Send to Statsig
        if (aggregatedStats.current === null) {
            aggregatedStats.current = createAggregatedStats();
        }
        sendOrAggregateInteractionsForStats(aggregatedStats.current, interactionsToSend);
        throttledFlushAggregatedStats();
        logger.debug('flushed');
    }, [agent, throttledFlushAggregatedStats, proxyDid, enabledInteractions]);
    const sendToFeed = useMemo(() => throttle(sendToFeedNoDelay, 10e3, {
        leading: false,
        trailing: true,
    }), [sendToFeedNoDelay]);
    useEffect(() => {
        if (!enabled) {
            return;
        }
        const sub = AppState.addEventListener('change', (state) => {
            if (state === 'background') {
                sendToFeed.flush();
            }
        });
        return () => sub.remove();
    }, [enabled, sendToFeed]);
    const onItemSeen = useCallback((feedItem) => {
        if (!enabled) {
            return;
        }
        const items = getItemsForFeedback(feedItem);
        for (const { item: postItem, feedContext, reqId } of items) {
            if (!history.current.has(postItem)) {
                history.current.add(postItem);
                queue.current.add(toString({
                    item: postItem.uri,
                    event: 'app.bsky.feed.defs#interactionSeen',
                    feedContext,
                    reqId,
                }));
                sendToFeed();
            }
        }
    }, [enabled, sendToFeed]);
    const sendInteraction = useCallback((interaction) => {
        if (!enabled) {
            return;
        }
        logger.debug('sendInteraction', {
            ...interaction,
        });
        if (!history.current.has(interaction)) {
            history.current.add(interaction);
            queue.current.add(toString(interaction));
            sendToFeed();
        }
    }, [enabled, sendToFeed]);
    return useMemo(() => {
        return {
            enabled,
            // pass this method to the <List> onItemSeen
            onItemSeen,
            // call on various events
            // queues the event to be sent with the throttled sendToFeed call
            sendInteraction,
            feedDescriptor: feed?.feedDescriptor,
            feedSourceInfo: typeof feed === 'object' ? feed : undefined,
        };
    }, [enabled, onItemSeen, sendInteraction, feed]);
}
export const FeedFeedbackProvider = stateContext.Provider;
export function useFeedFeedbackContext() {
    return useContext(stateContext);
}
// TODO
// We will introduce a permissions framework for 3p feeds to
// take advantage of the feed feedback API. Until that's in
// place, we're hardcoding it to the discover feed.
// -prf
export function isDiscoverFeed(feed) {
    return !!feed && FEEDBACK_FEEDS.includes(feed);
}
function getEnabledInteractions(enabled, feed, isDiscover) {
    if (!enabled || !feed) {
        return [];
    }
    return isDiscover ? ALL_FEEDBACK_INTERACTIONS : DIRECT_FEEDBACK_INTERACTIONS;
}
function toString(interaction) {
    return `${interaction.item}|${interaction.event}|${interaction.feedContext || ''}|${interaction.reqId || ''}`;
}
function toInteraction(str) {
    const [item, event, feedContext, reqId] = str.split('|');
    return { item, event, feedContext, reqId };
}
function createAggregatedStats() {
    return {
        clickthroughCount: 0,
        engagedCount: 0,
        seenCount: 0,
    };
}
function sendOrAggregateInteractionsForStats(stats, interactions) {
    for (let interaction of interactions) {
        switch (interaction.event) {
            // Pressing "Show more" / "Show less" is relatively uncommon so we won't aggregate them.
            // This lets us send the feed context together with them.
            case 'app.bsky.feed.defs#requestLess': {
                logEvent('discover:showLess', {
                    feedContext: interaction.feedContext ?? '',
                });
                break;
            }
            case 'app.bsky.feed.defs#requestMore': {
                logEvent('discover:showMore', {
                    feedContext: interaction.feedContext ?? '',
                });
                break;
            }
            // The rest of the events are aggregated and sent later in batches.
            case 'app.bsky.feed.defs#clickthroughAuthor':
            case 'app.bsky.feed.defs#clickthroughEmbed':
            case 'app.bsky.feed.defs#clickthroughItem':
            case 'app.bsky.feed.defs#clickthroughReposter': {
                stats.clickthroughCount++;
                break;
            }
            case 'app.bsky.feed.defs#interactionLike':
            case 'app.bsky.feed.defs#interactionQuote':
            case 'app.bsky.feed.defs#interactionReply':
            case 'app.bsky.feed.defs#interactionRepost':
            case 'app.bsky.feed.defs#interactionShare': {
                stats.engagedCount++;
                break;
            }
            case 'app.bsky.feed.defs#interactionSeen': {
                stats.seenCount++;
                break;
            }
        }
    }
}
function flushToStatsig(stats) {
    if (stats === null) {
        return;
    }
    if (stats.clickthroughCount > 0) {
        logEvent('discover:clickthrough', {
            count: stats.clickthroughCount,
        });
        stats.clickthroughCount = 0;
    }
    if (stats.engagedCount > 0) {
        logEvent('discover:engaged', {
            count: stats.engagedCount,
        });
        stats.engagedCount = 0;
    }
    if (stats.seenCount > 0) {
        logEvent('discover:seen', {
            count: stats.seenCount,
        });
        stats.seenCount = 0;
    }
}
//# sourceMappingURL=feed-feedback.js.map