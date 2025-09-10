import { AppBskyEmbedRecord, AppBskyEmbedRecordWithMedia, AtUri, } from '@atproto/api';
export const POSTGATE_COLLECTION = 'app.bsky.feed.postgate';
export function createPostgateRecord(postgate) {
    return {
        $type: POSTGATE_COLLECTION,
        createdAt: new Date().toISOString(),
        post: postgate.post,
        detachedEmbeddingUris: postgate.detachedEmbeddingUris || [],
        embeddingRules: postgate.embeddingRules || [],
    };
}
export function mergePostgateRecords(prev, next) {
    const detachedEmbeddingUris = Array.from(new Set([
        ...(prev.detachedEmbeddingUris || []),
        ...(next.detachedEmbeddingUris || []),
    ]));
    const embeddingRules = [
        ...(prev.embeddingRules || []),
        ...(next.embeddingRules || []),
    ].filter((rule, i, all) => all.findIndex(_rule => _rule.$type === rule.$type) === i);
    return createPostgateRecord({
        post: prev.post,
        detachedEmbeddingUris,
        embeddingRules,
    });
}
export function createEmbedViewDetachedRecord({ uri, }) {
    const record = {
        $type: 'app.bsky.embed.record#viewDetached',
        uri,
        detached: true,
    };
    return {
        $type: 'app.bsky.embed.record#view',
        record,
    };
}
export function createMaybeDetachedQuoteEmbed({ post, quote, quoteUri, detached, }) {
    if (AppBskyEmbedRecord.isView(post.embed)) {
        if (detached) {
            return createEmbedViewDetachedRecord({ uri: quoteUri });
        }
        else {
            return createEmbedRecordView({ post: quote });
        }
    }
    else if (AppBskyEmbedRecordWithMedia.isView(post.embed)) {
        if (detached) {
            return {
                ...post.embed,
                record: createEmbedViewDetachedRecord({ uri: quoteUri }),
            };
        }
        else {
            return createEmbedRecordWithMediaView({ post, quote });
        }
    }
}
export function createEmbedViewRecordFromPost(post) {
    return {
        $type: 'app.bsky.embed.record#viewRecord',
        uri: post.uri,
        cid: post.cid,
        author: post.author,
        value: post.record,
        labels: post.labels,
        replyCount: post.replyCount,
        repostCount: post.repostCount,
        likeCount: post.likeCount,
        quoteCount: post.quoteCount,
        indexedAt: post.indexedAt,
        embeds: post.embed ? [post.embed] : [],
    };
}
export function createEmbedRecordView({ post, }) {
    return {
        $type: 'app.bsky.embed.record#view',
        record: createEmbedViewRecordFromPost(post),
    };
}
export function createEmbedRecordWithMediaView({ post, quote, }) {
    if (!AppBskyEmbedRecordWithMedia.isView(post.embed))
        return;
    return {
        ...(post.embed || {}),
        record: {
            record: createEmbedViewRecordFromPost(quote),
        },
    };
}
export function getMaybeDetachedQuoteEmbed({ viewerDid, post, }) {
    if (AppBskyEmbedRecord.isView(post.embed)) {
        // detached
        if (AppBskyEmbedRecord.isViewDetached(post.embed.record)) {
            const urip = new AtUri(post.embed.record.uri);
            return {
                embed: post.embed,
                uri: urip.toString(),
                isOwnedByViewer: urip.host === viewerDid,
                isDetached: true,
            };
        }
        // post
        if (AppBskyEmbedRecord.isViewRecord(post.embed.record)) {
            const urip = new AtUri(post.embed.record.uri);
            return {
                embed: post.embed,
                uri: urip.toString(),
                isOwnedByViewer: urip.host === viewerDid,
                isDetached: false,
            };
        }
    }
    else if (AppBskyEmbedRecordWithMedia.isView(post.embed)) {
        // detached
        if (AppBskyEmbedRecord.isViewDetached(post.embed.record.record)) {
            const urip = new AtUri(post.embed.record.record.uri);
            return {
                embed: post.embed,
                uri: urip.toString(),
                isOwnedByViewer: urip.host === viewerDid,
                isDetached: true,
            };
        }
        // post
        if (AppBskyEmbedRecord.isViewRecord(post.embed.record.record)) {
            const urip = new AtUri(post.embed.record.record.uri);
            return {
                embed: post.embed,
                uri: urip.toString(),
                isOwnedByViewer: urip.host === viewerDid,
                isDetached: false,
            };
        }
    }
}
export const embeddingRules = {
    disableRule: { $type: 'app.bsky.feed.postgate#disableRule' },
};
//# sourceMappingURL=util.js.map