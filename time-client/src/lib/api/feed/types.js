import {} from '@atproto/api';
export function isReasonFeedSource(v) {
    return (!!v &&
        typeof v === 'object' &&
        '$type' in v &&
        v.$type === 'reasonFeedSource');
}
//# sourceMappingURL=types.js.map