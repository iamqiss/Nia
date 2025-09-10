import { type AppBskyActorDefs } from '@atproto/api';
import { type FeedDescriptor } from '#/state/queries/post-feed';
export declare enum KnownError {
    Block = "Block",
    FeedgenDoesNotExist = "FeedgenDoesNotExist",
    FeedgenMisconfigured = "FeedgenMisconfigured",
    FeedgenBadResponse = "FeedgenBadResponse",
    FeedgenOffline = "FeedgenOffline",
    FeedgenUnknown = "FeedgenUnknown",
    FeedSignedInOnly = "FeedSignedInOnly",
    FeedTooManyRequests = "FeedTooManyRequests",
    Unknown = "Unknown"
}
export declare function PostFeedErrorMessage({ feedDesc, error, onPressTryAgain, savedFeedConfig, }: {
    feedDesc: FeedDescriptor;
    error?: Error;
    onPressTryAgain: () => void;
    savedFeedConfig?: AppBskyActorDefs.SavedFeed;
}): any;
//# sourceMappingURL=PostFeedErrorMessage.d.ts.map