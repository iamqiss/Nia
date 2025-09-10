import {} from '@atproto/api';
import {} from './types';
export class LikesFeedAPI {
    agent;
    params;
    constructor({ agent, feedParams, }) {
        this.agent = agent;
        this.params = feedParams;
    }
    async peekLatest() {
        const res = await this.agent.getActorLikes({
            ...this.params,
            limit: 1,
        });
        return res.data.feed[0];
    }
    async fetch({ cursor, limit, }) {
        const res = await this.agent.getActorLikes({
            ...this.params,
            cursor,
            limit,
        });
        if (res.success) {
            // HACKFIX: the API incorrectly returns a cursor when there are no items -sfn
            const isEmptyPage = res.data.feed.length === 0;
            return {
                cursor: isEmptyPage ? undefined : res.data.cursor,
                feed: res.data.feed,
            };
        }
        return {
            feed: [],
        };
    }
}
//# sourceMappingURL=likes.js.map