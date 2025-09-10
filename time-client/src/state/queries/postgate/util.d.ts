import { type $Typed, AppBskyEmbedRecord, AppBskyEmbedRecordWithMedia, type AppBskyFeedDefs, type AppBskyFeedPostgate } from '@atproto/api';
export declare const POSTGATE_COLLECTION = "app.bsky.feed.postgate";
export declare function createPostgateRecord(postgate: Partial<AppBskyFeedPostgate.Record> & {
    post: AppBskyFeedPostgate.Record['post'];
}): AppBskyFeedPostgate.Record;
export declare function mergePostgateRecords(prev: AppBskyFeedPostgate.Record, next: Partial<AppBskyFeedPostgate.Record>): AppBskyFeedPostgate.Record;
export declare function createEmbedViewDetachedRecord({ uri, }: {
    uri: string;
}): $Typed<AppBskyEmbedRecord.View>;
export declare function createMaybeDetachedQuoteEmbed({ post, quote, quoteUri, detached, }: {
    post: AppBskyFeedDefs.PostView;
    quote: AppBskyFeedDefs.PostView;
    quoteUri: undefined;
    detached: false;
} | {
    post: AppBskyFeedDefs.PostView;
    quote: undefined;
    quoteUri: string;
    detached: true;
}): AppBskyEmbedRecord.View | AppBskyEmbedRecordWithMedia.View | undefined;
export declare function createEmbedViewRecordFromPost(post: AppBskyFeedDefs.PostView): $Typed<AppBskyEmbedRecord.ViewRecord>;
export declare function createEmbedRecordView({ post, }: {
    post: AppBskyFeedDefs.PostView;
}): AppBskyEmbedRecord.View;
export declare function createEmbedRecordWithMediaView({ post, quote, }: {
    post: AppBskyFeedDefs.PostView;
    quote: AppBskyFeedDefs.PostView;
}): AppBskyEmbedRecordWithMedia.View | undefined;
export declare function getMaybeDetachedQuoteEmbed({ viewerDid, post, }: {
    viewerDid: string;
    post: AppBskyFeedDefs.PostView;
}): {
    embed: any;
    uri: any;
    isOwnedByViewer: boolean;
    isDetached: boolean;
} | undefined;
export declare const embeddingRules: {
    disableRule: {
        $type: string;
    };
};
//# sourceMappingURL=util.d.ts.map