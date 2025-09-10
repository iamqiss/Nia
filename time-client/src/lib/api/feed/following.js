import {} from '@atproto/api';
import {} from './types';
export class FollowingFeedAPI {
    agent;
    constructor({ agent }) {
        this.agent = agent;
    }
    async peekLatest() {
        const res = await this.agent.getTimeline({
            limit: 1,
        });
        return res.data.feed[0];
    }
    async fetch({ cursor, limit, }) {
        const res = await this.agent.getTimeline({
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
//# sourceMappingURL=following.js.map