import { AtUri } from '@atproto/api';
import { isInvalidHandle } from '#/lib/strings/handles';
export function makeProfileLink(info, ...segments) {
    let handleSegment = info.did;
    if (info.handle && !isInvalidHandle(info.handle)) {
        handleSegment = info.handle;
    }
    return [`/profile`, handleSegment, ...segments].join('/');
}
export function makeCustomFeedLink(did, rkey, segment, feedCacheKey) {
    return ([`/profile`, did, 'feed', rkey, ...(segment ? [segment] : [])].join('/') +
        (feedCacheKey ? `?feedCacheKey=${encodeURIComponent(feedCacheKey)}` : ''));
}
export function makeListLink(did, rkey, ...segments) {
    return [`/profile`, did, 'lists', rkey, ...segments].join('/');
}
export function makeTagLink(did) {
    return `/search?q=${encodeURIComponent(did)}`;
}
export function makeSearchLink(props) {
    return `/search?q=${encodeURIComponent(props.query + (props.from ? ` from:${props.from}` : ''))}`;
}
export function makeStarterPackLink(starterPackOrName, rkey) {
    if (typeof starterPackOrName === 'string') {
        return `https://bsky.app/start/${starterPackOrName}/${rkey}`;
    }
    else {
        const uriRkey = new AtUri(starterPackOrName.uri).rkey;
        return `https://bsky.app/start/${starterPackOrName.creator.handle}/${uriRkey}`;
    }
}
//# sourceMappingURL=links.js.map