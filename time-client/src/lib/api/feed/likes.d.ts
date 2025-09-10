import { type AppBskyFeedDefs, type AppBskyFeedGetActorLikes as GetActorLikes, type BskyAgent } from '@atproto/api';
import { type FeedAPI, type FeedAPIResponse } from './types';
export declare class LikesFeedAPI implements FeedAPI {
    agent: BskyAgent;
    params: GetActorLikes.QueryParams;
    constructor({ agent, feedParams, }: {
        agent: BskyAgent;
        feedParams: GetActorLikes.QueryParams;
    });
    peekLatest(): Promise<AppBskyFeedDefs.FeedViewPost>;
    fetch({ cursor, limit, }: {
        cursor: string | undefined;
        limit: number;
    }): Promise<FeedAPIResponse>;
}
//# sourceMappingURL=likes.d.ts.map