import { type AppBskyActorDefs, AppBskyFeedDefs } from '@atproto/api';
import { type QueryClient } from '@tanstack/react-query';
import { type FeedPostSlice } from '#/state/queries/post-feed';
export type FeedPreviewItem = {
    type: 'preview:spacer';
    key: string;
} | {
    type: 'preview:loading';
    key: string;
} | {
    type: 'preview:error';
    key: string;
    message: string;
    error: string;
} | {
    type: 'preview:loadMoreError';
    key: string;
} | {
    type: 'preview:empty';
    key: string;
} | {
    type: 'preview:header';
    key: string;
    feed: AppBskyFeedDefs.GeneratorView;
} | {
    type: 'preview:footer';
    key: string;
} | {
    type: 'preview:sliceItem';
    key: string;
    slice: FeedPostSlice;
    indexInSlice: number;
    feed: AppBskyFeedDefs.GeneratorView;
    showReplyTo: boolean;
    hideTopBorder: boolean;
} | {
    type: 'preview:sliceViewFullThread';
    key: string;
    uri: string;
};
export declare function useFeedPreviews(feedsMaybeWithDuplicates: AppBskyFeedDefs.GeneratorView[], isEnabled?: boolean): {
    query: any;
    data: any;
};
export declare function findAllPostsInQueryData(queryClient: QueryClient, uri: string): Generator<AppBskyFeedDefs.PostView, undefined>;
export declare function findAllProfilesInQueryData(queryClient: QueryClient, did: string): Generator<AppBskyActorDefs.ProfileViewBasic, undefined>;
//# sourceMappingURL=explore-feed-previews.d.ts.map