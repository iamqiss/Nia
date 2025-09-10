import { type Agent, type AppBskyFeedDefs, type AppBskyFeedGetPosts } from '@atproto/api';
import { type FeedAPI, type FeedAPIResponse } from './types';
export declare class PostListFeedAPI implements FeedAPI {
    agent: Agent;
    params: AppBskyFeedGetPosts.QueryParams;
    peek: AppBskyFeedDefs.FeedViewPost | null;
    constructor({ agent, feedParams, }: {
        agent: Agent;
        feedParams: AppBskyFeedGetPosts.QueryParams;
    });
    peekLatest(): Promise<AppBskyFeedDefs.FeedViewPost>;
    fetch({}: {}): Promise<FeedAPIResponse>;
}
//# sourceMappingURL=posts.d.ts.map