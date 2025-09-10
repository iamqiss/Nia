import { type AppBskyFeedDefs, type AppBskyFeedGetFeed as GetCustomFeed, BskyAgent } from '@atproto/api';
import { type FeedAPI, type FeedAPIResponse } from './types';
export declare class CustomFeedAPI implements FeedAPI {
    agent: BskyAgent;
    params: GetCustomFeed.QueryParams;
    userInterests?: string;
    constructor({ agent, feedParams, userInterests, }: {
        agent: BskyAgent;
        feedParams: GetCustomFeed.QueryParams;
        userInterests?: string;
    });
    peekLatest(): Promise<AppBskyFeedDefs.FeedViewPost>;
    fetch({ cursor, limit, }: {
        cursor: string | undefined;
        limit: number;
    }): Promise<FeedAPIResponse>;
}
//# sourceMappingURL=custom.d.ts.map