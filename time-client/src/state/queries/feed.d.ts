import { type AppBskyActorDefs, type AppBskyFeedDefs, type AppBskyGraphDefs, RichText } from '@atproto/api';
import { type QueryClient } from '@tanstack/react-query';
import { type FeedDescriptor } from './post-feed';
export type FeedSourceFeedInfo = {
    type: 'feed';
    view?: AppBskyFeedDefs.GeneratorView;
    uri: string;
    feedDescriptor: FeedDescriptor;
    route: {
        href: string;
        name: string;
        params: Record<string, string>;
    };
    cid: string;
    avatar: string | undefined;
    displayName: string;
    description: RichText;
    creatorDid: string;
    creatorHandle: string;
    likeCount: number | undefined;
    acceptsInteractions?: boolean;
    likeUri: string | undefined;
    contentMode: AppBskyFeedDefs.GeneratorView['contentMode'];
};
export type FeedSourceListInfo = {
    type: 'list';
    view?: AppBskyGraphDefs.ListView;
    uri: string;
    feedDescriptor: FeedDescriptor;
    route: {
        href: string;
        name: string;
        params: Record<string, string>;
    };
    cid: string;
    avatar: string | undefined;
    displayName: string;
    description: RichText;
    creatorDid: string;
    creatorHandle: string;
    contentMode: undefined;
};
export type FeedSourceInfo = FeedSourceFeedInfo | FeedSourceListInfo;
export declare function isFeedSourceFeedInfo(feed: FeedSourceInfo): feed is FeedSourceFeedInfo;
export declare const feedSourceInfoQueryKey: ({ uri }: {
    uri: string;
}) => string[];
export declare function hydrateFeedGenerator(view: AppBskyFeedDefs.GeneratorView): FeedSourceInfo;
export declare function hydrateList(view: AppBskyGraphDefs.ListView): FeedSourceInfo;
export declare function getFeedTypeFromUri(uri: string): "feed" | "list";
export declare function getAvatarTypeFromUri(uri: string): "list" | "algo";
export declare function useFeedSourceInfoQuery({ uri }: {
    uri: string;
}): any;
export declare const KNOWN_AUTHED_ONLY_FEEDS: string[];
type GetPopularFeedsOptions = {
    limit?: number;
    enabled?: boolean;
};
export declare function createGetPopularFeedsQueryKey(options?: GetPopularFeedsOptions): (string | number | undefined)[];
export declare function useGetPopularFeedsQuery(options?: GetPopularFeedsOptions): any;
export declare function useSearchPopularFeedsMutation(): any;
export declare const createPopularFeedsSearchQueryKey: (query: string) => string[];
export declare function usePopularFeedsSearch({ query, enabled, }: {
    query: string;
    enabled?: boolean;
}): any;
export type SavedFeedSourceInfo = FeedSourceInfo & {
    savedFeed: AppBskyActorDefs.SavedFeed;
};
export declare function usePinnedFeedsInfos(): any;
export type SavedFeedItem = {
    type: 'feed';
    config: AppBskyActorDefs.SavedFeed;
    view: AppBskyFeedDefs.GeneratorView;
} | {
    type: 'list';
    config: AppBskyActorDefs.SavedFeed;
    view: AppBskyGraphDefs.ListView;
} | {
    type: 'timeline';
    config: AppBskyActorDefs.SavedFeed;
    view: undefined;
};
export declare function useSavedFeeds(): any;
export declare function useFeedInfo(feedUri: string | undefined): any;
export declare function precacheList(queryClient: QueryClient, list: AppBskyGraphDefs.ListView): void;
export declare function precacheFeedFromGeneratorView(queryClient: QueryClient, view: AppBskyFeedDefs.GeneratorView): void;
export {};
//# sourceMappingURL=feed.d.ts.map