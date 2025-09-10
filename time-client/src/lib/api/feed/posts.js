import {} from '@atproto/api';
import { logger } from '#/logger';
import {} from './types';
export class PostListFeedAPI {
    agent;
    params;
    peek = null;
    constructor({ agent, feedParams, }) {
        this.agent = agent;
        if (feedParams.uris.length > 25) {
            logger.warn(`Too many URIs provided - expected 25, got ${feedParams.uris.length}`);
        }
        this.params = {
            uris: feedParams.uris.slice(0, 25),
        };
    }
    async peekLatest() {
        if (this.peek)
            return this.peek;
        throw new Error('Has not fetched yet');
    }
    async fetch({}) {
        const res = await this.agent.app.bsky.feed.getPosts({
            ...this.params,
        });
        if (res.success) {
            this.peek = { post: res.data.posts[0] };
            return {
                feed: res.data.posts.map(post => ({ post })),
            };
        }
        return {
            feed: [],
        };
    }
}
//# sourceMappingURL=posts.js.map