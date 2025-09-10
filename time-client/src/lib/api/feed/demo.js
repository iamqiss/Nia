import {} from '@atproto/api';
import { DEMO_FEED } from '#/lib/demo';
import {} from './types';
export class DemoFeedAPI {
    agent;
    constructor({ agent }) {
        this.agent = agent;
    }
    async peekLatest() {
        return DEMO_FEED.feed[0];
    }
    async fetch() {
        return DEMO_FEED;
    }
}
//# sourceMappingURL=demo.js.map