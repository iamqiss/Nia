import { type JSX } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { type AppBskyActorDefs } from '@atproto/api';
import { type FeedDescriptor, type FeedParams, type FeedPostSlice, type FeedPostSliceItem } from '#/state/queries/post-feed';
import { type ListRef } from '#/view/com/util/List';
type FeedRow = {
    type: 'loading';
    key: string;
} | {
    type: 'empty';
    key: string;
} | {
    type: 'error';
    key: string;
} | {
    type: 'loadMoreError';
    key: string;
} | {
    type: 'feedShutdownMsg';
    key: string;
} | {
    type: 'fallbackMarker';
    key: string;
} | {
    type: 'sliceItem';
    key: string;
    slice: FeedPostSlice;
    indexInSlice: number;
    showReplyTo: boolean;
} | {
    type: 'videoGridRowPlaceholder';
    key: string;
} | {
    type: 'videoGridRow';
    key: string;
    items: FeedPostSliceItem[];
    sourceFeedUri: string;
    feedContexts: (string | undefined)[];
    reqIds: (string | undefined)[];
} | {
    type: 'sliceViewFullThread';
    key: string;
    uri: string;
} | {
    type: 'interstitialFollows';
    key: string;
} | {
    type: 'interstitialProgressGuide';
    key: string;
} | {
    type: 'interstitialTrending';
    key: string;
} | {
    type: 'interstitialTrendingVideos';
    key: string;
} | {
    type: 'showLessFollowup';
    key: string;
} | {
    type: 'ageAssuranceBanner';
    key: string;
};
export declare function getItemsForFeedback(feedRow: FeedRow): {
    item: FeedPostSliceItem;
    feedContext: string | undefined;
    reqId: string | undefined;
}[];
declare let PostFeed: ({ feed, feedParams, ignoreFilterFor, style, enabled, pollInterval, disablePoll, scrollElRef, onScrolledDownChange, onHasNew, renderEmptyState, renderEndOfFeed, testID, headerOffset, progressViewOffset, desktopFixedHeightOffset, ListHeaderComponent, extraData, savedFeedConfig, initialNumToRender: initialNumToRenderOverride, isVideoFeed, }: {
    feed: FeedDescriptor;
    feedParams?: FeedParams;
    ignoreFilterFor?: string;
    style?: StyleProp<ViewStyle>;
    enabled?: boolean;
    pollInterval?: number;
    disablePoll?: boolean;
    scrollElRef?: ListRef;
    onHasNew?: (v: boolean) => void;
    onScrolledDownChange?: (isScrolledDown: boolean) => void;
    renderEmptyState: () => JSX.Element;
    renderEndOfFeed?: () => JSX.Element;
    testID?: string;
    headerOffset?: number;
    progressViewOffset?: number;
    desktopFixedHeightOffset?: number;
    ListHeaderComponent?: () => JSX.Element;
    extraData?: any;
    savedFeedConfig?: AppBskyActorDefs.SavedFeed;
    initialNumToRender?: number;
    isVideoFeed?: boolean;
}) => React.ReactNode;
export { PostFeed };
export declare function isThreadParentAt<T>(arr: Array<T>, i: number): boolean;
export declare function isThreadChildAt<T>(arr: Array<T>, i: number): boolean;
//# sourceMappingURL=PostFeed.d.ts.map