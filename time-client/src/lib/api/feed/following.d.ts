import { type AppBskyFeedDefs, type BskyAgent } from '@atproto/api';
import { type FeedAPI, type FeedAPIResponse } from './types';
export declare class FollowingFeedAPI implements FeedAPI {
    agent: BskyAgent;
    constructor({ agent }: {
        agent: BskyAgent;
    });
    peekLatest(): Promise<AppBskyFeedDefs.FeedViewPost>;
    fetch({ cursor, limit, }: {
        cursor: string | undefined;
        limit: number;
    }): Promise<FeedAPIResponse>;
}
//# sourceMappingURL=following.d.ts.map