import { type AppBskyGraphDefs } from '@atproto/api';
export declare function makeProfileLink(info: {
    did: string;
    handle: string;
}, ...segments: string[]): string;
export declare function makeCustomFeedLink(did: string, rkey: string, segment?: string | undefined, feedCacheKey?: 'discover' | 'explore' | undefined): string;
export declare function makeListLink(did: string, rkey: string, ...segments: string[]): string;
export declare function makeTagLink(did: string): string;
export declare function makeSearchLink(props: {
    query: string;
    from?: 'me' | string;
}): string;
export declare function makeStarterPackLink(starterPackOrName: AppBskyGraphDefs.StarterPackViewBasic | AppBskyGraphDefs.StarterPackView | string, rkey?: string): string;
//# sourceMappingURL=links.d.ts.map