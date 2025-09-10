import { type UsePreferencesQueryResponse } from '#/state/queries/preferences';
export declare function createBskyTopicsHeader(userInterests?: string): {
    'X-Bsky-Topics': string;
};
export declare function aggregateUserInterests(preferences?: UsePreferencesQueryResponse): any;
export declare function isBlueskyOwnedFeed(feedUri: string): any;
//# sourceMappingURL=utils.d.ts.map