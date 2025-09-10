import { type AppBskyFeedDefs } from '@atproto/api';
import { type FeedSourceInfo } from '#/state/queries/feed';
import { type FeedDescriptor } from '#/state/queries/post-feed';
export declare const FEEDBACK_FEEDS: any[];
export declare const PASSIVE_FEEDBACK_INTERACTIONS: readonly ["app.bsky.feed.defs#clickthroughItem", "app.bsky.feed.defs#clickthroughAuthor", "app.bsky.feed.defs#clickthroughReposter", "app.bsky.feed.defs#clickthroughEmbed", "app.bsky.feed.defs#interactionSeen"];
export type PassiveFeedbackInteraction = (typeof PASSIVE_FEEDBACK_INTERACTIONS)[number];
export declare const DIRECT_FEEDBACK_INTERACTIONS: readonly ["app.bsky.feed.defs#requestLess", "app.bsky.feed.defs#requestMore"];
export type DirectFeedbackInteraction = (typeof DIRECT_FEEDBACK_INTERACTIONS)[number];
export declare const ALL_FEEDBACK_INTERACTIONS: readonly ["app.bsky.feed.defs#clickthroughItem", "app.bsky.feed.defs#clickthroughAuthor", "app.bsky.feed.defs#clickthroughReposter", "app.bsky.feed.defs#clickthroughEmbed", "app.bsky.feed.defs#interactionSeen", "app.bsky.feed.defs#requestLess", "app.bsky.feed.defs#requestMore"];
export type FeedbackInteraction = (typeof ALL_FEEDBACK_INTERACTIONS)[number];
export declare function isFeedbackInteraction(interactionEvent: string): interactionEvent is FeedbackInteraction;
export type StateContext = {
    enabled: boolean;
    onItemSeen: (item: any) => void;
    sendInteraction: (interaction: AppBskyFeedDefs.Interaction) => void;
    feedDescriptor: FeedDescriptor | undefined;
    feedSourceInfo: FeedSourceInfo | undefined;
};
export declare function useFeedFeedback(feedSourceInfo: FeedSourceInfo | undefined, hasSession: boolean): any;
export declare const FeedFeedbackProvider: any;
export declare function useFeedFeedbackContext(): any;
export declare function isDiscoverFeed(feed?: FeedDescriptor): boolean;
//# sourceMappingURL=feed-feedback.d.ts.map