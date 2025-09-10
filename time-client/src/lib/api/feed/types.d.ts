import { type AppBskyFeedDefs } from '@atproto/api';
export interface FeedAPIResponse {
    cursor?: string;
    feed: AppBskyFeedDefs.FeedViewPost[];
}
export interface FeedAPI {
    peekLatest(): Promise<AppBskyFeedDefs.FeedViewPost>;
    fetch({ cursor, limit, }: {
        cursor: string | undefined;
        limit: number;
    }): Promise<FeedAPIResponse>;
}
export interface ReasonFeedSource {
    $type: 'reasonFeedSource';
    uri: string;
    href: string;
}
export declare function isReasonFeedSource(v: unknown): v is ReasonFeedSource;
//# sourceMappingURL=types.d.ts.map