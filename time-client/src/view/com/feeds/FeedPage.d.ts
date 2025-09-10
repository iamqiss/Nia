import { type JSX } from 'react';
import { type AppBskyActorDefs } from '@atproto/api';
import { type FeedSourceInfo } from '#/state/queries/feed';
import { type FeedDescriptor, type FeedParams } from '#/state/queries/post-feed';
export declare function FeedPage({ testID, isPageFocused, isPageAdjacent, feed, feedParams, renderEmptyState, renderEndOfFeed, savedFeedConfig, feedInfo, }: {
    testID?: string;
    feed: FeedDescriptor;
    feedParams?: FeedParams;
    isPageFocused: boolean;
    isPageAdjacent: boolean;
    renderEmptyState: () => JSX.Element;
    renderEndOfFeed?: () => JSX.Element;
    savedFeedConfig?: AppBskyActorDefs.SavedFeed;
    feedInfo: FeedSourceInfo;
}): any;
//# sourceMappingURL=FeedPage.d.ts.map