import { type Agent, type AppBskyFeedDefs, type AppBskyFeedGetListFeed as GetListFeed } from '@atproto/api';
import { type FeedAPI, type FeedAPIResponse } from './types';
export declare class ListFeedAPI implements FeedAPI {
    agent: Agent;
    params: GetListFeed.QueryParams;
    constructor({ agent, feedParams, }: {
        agent: Agent;
        feedParams: GetListFeed.QueryParams;
    });
    peekLatest(): Promise<AppBskyFeedDefs.FeedViewPost>;
    fetch({ cursor, limit, }: {
        cursor: string | undefined;
        limit: number;
    }): Promise<FeedAPIResponse>;
}
//# sourceMappingURL=list.d.ts.map