import { type AppBskyFeedDefs, type AppBskyFeedGetTimeline, type BskyAgent } from '@atproto/api';
import { type FeedParams } from '#/state/queries/post-feed';
import { FeedTuner } from '../feed-manip';
import { type FeedTunerFn } from '../feed-manip';
import { type FeedAPI, type FeedAPIResponse, type ReasonFeedSource } from './types';
export declare class MergeFeedAPI implements FeedAPI {
    userInterests?: string;
    agent: BskyAgent;
    params: FeedParams;
    feedTuners: FeedTunerFn[];
    following: MergeFeedSource_Following;
    customFeeds: MergeFeedSource_Custom[];
    feedCursor: number;
    itemCursor: number;
    sampleCursor: number;
    constructor({ agent, feedParams, feedTuners, userInterests, }: {
        agent: BskyAgent;
        feedParams: FeedParams;
        feedTuners: FeedTunerFn[];
        userInterests?: string;
    });
    reset(): void;
    peekLatest(): Promise<AppBskyFeedDefs.FeedViewPost>;
    fetch({ cursor, limit, }: {
        cursor: string | undefined;
        limit: number;
    }): Promise<FeedAPIResponse>;
    sampleItem(): AppBskyFeedDefs.FeedViewPost[];
}
declare class MergeFeedSource {
    agent: BskyAgent;
    feedTuners: FeedTunerFn[];
    sourceInfo: ReasonFeedSource | undefined;
    cursor: string | undefined;
    queue: AppBskyFeedDefs.FeedViewPost[];
    hasMore: boolean;
    constructor({ agent, feedTuners, }: {
        agent: BskyAgent;
        feedTuners: FeedTunerFn[];
    });
    get numReady(): number;
    get needsFetch(): boolean;
    take(n: number): AppBskyFeedDefs.FeedViewPost[];
    fetchNext(n: number): Promise<void>;
    _fetchNextInner: any;
    protected _getFeed(_cursor: string | undefined, _limit: number): Promise<AppBskyFeedGetTimeline.Response>;
}
declare class MergeFeedSource_Following extends MergeFeedSource {
    tuner: FeedTuner;
    fetchNext(n: number): Promise<any>;
    protected _getFeed(cursor: string | undefined, limit: number): Promise<AppBskyFeedGetTimeline.Response>;
}
declare class MergeFeedSource_Custom extends MergeFeedSource {
    agent: BskyAgent;
    minDate: Date;
    feedUri: string;
    userInterests?: string;
    constructor({ agent, feedUri, feedTuners, userInterests, }: {
        agent: BskyAgent;
        feedUri: string;
        feedTuners: FeedTunerFn[];
        userInterests?: string;
    });
    protected _getFeed(cursor: string | undefined, limit: number): Promise<AppBskyFeedGetTimeline.Response>;
}
export {};
//# sourceMappingURL=merge.d.ts.map