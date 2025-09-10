import { AppBskyFeedDefs, type AppBskyFeedGetAuthorFeed as GetAuthorFeed, type BskyAgent } from '@atproto/api';
import { type FeedAPI, type FeedAPIResponse } from './types';
export declare class AuthorFeedAPI implements FeedAPI {
    agent: BskyAgent;
    _params: GetAuthorFeed.QueryParams;
    constructor({ agent, feedParams, }: {
        agent: BskyAgent;
        feedParams: GetAuthorFeed.QueryParams;
    });
    get params(): any;
    peekLatest(): Promise<AppBskyFeedDefs.FeedViewPost>;
    fetch({ cursor, limit, }: {
        cursor: string | undefined;
        limit: number;
    }): Promise<FeedAPIResponse>;
    _filter(feed: AppBskyFeedDefs.FeedViewPost[]): AppBskyFeedDefs.FeedViewPost[];
}
//# sourceMappingURL=author.d.ts.map