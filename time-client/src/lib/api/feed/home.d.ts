import { type AppBskyFeedDefs, type BskyAgent } from '@atproto/api';
import { CustomFeedAPI } from './custom';
import { FollowingFeedAPI } from './following';
import { type FeedAPI, type FeedAPIResponse } from './types';
export declare const FALLBACK_MARKER_POST: AppBskyFeedDefs.FeedViewPost;
export declare class HomeFeedAPI implements FeedAPI {
    agent: BskyAgent;
    following: FollowingFeedAPI;
    discover: CustomFeedAPI;
    usingDiscover: boolean;
    itemCursor: number;
    userInterests?: string;
    constructor({ userInterests, agent, }: {
        userInterests?: string;
        agent: BskyAgent;
    });
    reset(): void;
    peekLatest(): Promise<AppBskyFeedDefs.FeedViewPost>;
    fetch({ cursor, limit, }: {
        cursor: string | undefined;
        limit: number;
    }): Promise<FeedAPIResponse>;
}
//# sourceMappingURL=home.d.ts.map