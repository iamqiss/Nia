import { type AppBskyActorDefs, AppBskyFeedDefs, AppBskyFeedPost } from '@atproto/api';
type FeedViewPost = AppBskyFeedDefs.FeedViewPost;
export type FeedTunerFn = (tuner: FeedTuner, slices: FeedViewPostsSlice[], dryRun: boolean) => FeedViewPostsSlice[];
type FeedSliceItem = {
    post: AppBskyFeedDefs.PostView;
    record: AppBskyFeedPost.Record;
    parentAuthor: AppBskyActorDefs.ProfileViewBasic | undefined;
    isParentBlocked: boolean;
    isParentNotFound: boolean;
};
type AuthorContext = {
    author: AppBskyActorDefs.ProfileViewBasic;
    parentAuthor: AppBskyActorDefs.ProfileViewBasic | undefined;
    grandparentAuthor: AppBskyActorDefs.ProfileViewBasic | undefined;
    rootAuthor: AppBskyActorDefs.ProfileViewBasic | undefined;
};
export declare class FeedViewPostsSlice {
    _reactKey: string;
    _feedPost: FeedViewPost;
    items: FeedSliceItem[];
    isIncompleteThread: boolean;
    isFallbackMarker: boolean;
    isOrphan: boolean;
    isThreadMuted: boolean;
    rootUri: string;
    feedPostUri: string;
    constructor(feedPost: FeedViewPost);
    get isQuotePost(): any;
    get isReply(): any;
    get reason(): any;
    get feedContext(): any;
    get reqId(): any;
    get isRepost(): any;
    get likeCount(): any;
    containsUri(uri: string): boolean;
    getAuthors(): AuthorContext;
}
export declare class FeedTuner {
    tunerFns: FeedTunerFn[];
    seenKeys: Set<string>;
    seenUris: Set<string>;
    seenRootUris: Set<string>;
    constructor(tunerFns: FeedTunerFn[]);
    tune(feed: FeedViewPost[], { dryRun }?: {
        dryRun: boolean;
    }): FeedViewPostsSlice[];
    static removeReplies(tuner: FeedTuner, slices: FeedViewPostsSlice[], _dryRun: boolean): FeedViewPostsSlice[];
    static removeReposts(tuner: FeedTuner, slices: FeedViewPostsSlice[], _dryRun: boolean): FeedViewPostsSlice[];
    static removeQuotePosts(tuner: FeedTuner, slices: FeedViewPostsSlice[], _dryRun: boolean): FeedViewPostsSlice[];
    static removeOrphans(tuner: FeedTuner, slices: FeedViewPostsSlice[], _dryRun: boolean): FeedViewPostsSlice[];
    static removeMutedThreads(tuner: FeedTuner, slices: FeedViewPostsSlice[], _dryRun: boolean): FeedViewPostsSlice[];
    static dedupThreads(tuner: FeedTuner, slices: FeedViewPostsSlice[], dryRun: boolean): FeedViewPostsSlice[];
    static followedRepliesOnly({ userDid }: {
        userDid: string;
    }): (tuner: FeedTuner, slices: FeedViewPostsSlice[], _dryRun: boolean) => FeedViewPostsSlice[];
    /**
     * This function filters a list of FeedViewPostsSlice items based on whether they contain text in a
     * preferred language.
     * @param {string[]} preferredLangsCode2 - An array of preferred language codes in ISO 639-1 or ISO 639-2 format.
     * @returns A function that takes in a `FeedTuner` and an array of `FeedViewPostsSlice` objects and
     * returns an array of `FeedViewPostsSlice` objects.
     */
    static preferredLangOnly(preferredLangsCode2: string[]): (tuner: FeedTuner, slices: FeedViewPostsSlice[], _dryRun: boolean) => FeedViewPostsSlice[];
}
export {};
//# sourceMappingURL=feed-manip.d.ts.map