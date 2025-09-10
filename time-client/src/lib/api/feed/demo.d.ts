import { type AppBskyFeedDefs, type BskyAgent } from '@atproto/api';
import { type FeedAPI, type FeedAPIResponse } from './types';
export declare class DemoFeedAPI implements FeedAPI {
    agent: BskyAgent;
    constructor({ agent }: {
        agent: BskyAgent;
    });
    peekLatest(): Promise<AppBskyFeedDefs.FeedViewPost>;
    fetch(): Promise<FeedAPIResponse>;
}
//# sourceMappingURL=demo.d.ts.map