import {} from '@atproto/api';
import {} from './types';
export class ListFeedAPI {
    agent;
    params;
    constructor({ agent, feedParams, }) {
        this.agent = agent;
        this.params = feedParams;
    }
    async peekLatest() {
        const res = await this.agent.app.bsky.feed.getListFeed({
            ...this.params,
            limit: 1,
        });
        return res.data.feed[0];
    }
    async fetch({ cursor, limit, }) {
        const res = await this.agent.app.bsky.feed.getListFeed({
            ...this.params,
            cursor,
            limit,
        });
        if (res.success) {
            return {
                cursor: res.data.cursor,
                feed: res.data.feed,
            };
        }
        return {
            feed: [],
        };
    }
}
//# sourceMappingURL=list.js.map