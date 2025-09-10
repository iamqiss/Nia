import { AtUri } from '@atproto/api';
import { BSKY_FEED_OWNER_DIDS } from '#/lib/constants';
import { isWeb } from '#/platform/detection';
import {} from '#/state/queries/preferences';
let debugTopics = '';
if (isWeb && typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    debugTopics = params.get('debug_topics') ?? '';
}
export function createBskyTopicsHeader(userInterests) {
    return {
        'X-Bsky-Topics': debugTopics || userInterests || '',
    };
}
export function aggregateUserInterests(preferences) {
    return preferences?.interests?.tags?.join(',') || '';
}
export function isBlueskyOwnedFeed(feedUri) {
    const uri = new AtUri(feedUri);
    return BSKY_FEED_OWNER_DIDS.includes(uri.host);
}
//# sourceMappingURL=utils.js.map