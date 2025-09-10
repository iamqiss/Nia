import { AppBskyFeedPost, AppBskyFeedThreadgate, AppBskyUnspeccedDefs, AtUri, } from '@atproto/api';
import {} from '#/state/queries/usePostThread/types';
import { isDevMode } from '#/storage/hooks/dev-mode';
import * as bsky from '#/types/bsky';
export function getThreadgateRecord(view) {
    return bsky.dangerousIsType(view?.record, AppBskyFeedThreadgate.isRecord)
        ? view?.record
        : undefined;
}
export function getRootPostAtUri(post) {
    if (bsky.dangerousIsType(post.record, AppBskyFeedPost.isRecord)) {
        /**
         * If the record has no `reply` field, it is a root post.
         */
        if (!post.record.reply) {
            return new AtUri(post.uri);
        }
        if (post.record.reply?.root?.uri) {
            return new AtUri(post.record.reply.root.uri);
        }
    }
}
export function getPostRecord(post) {
    return post.record;
}
export function getTraversalMetadata({ item, prevItem, nextItem, parentMetadata, }) {
    if (!AppBskyUnspeccedDefs.isThreadItemPost(item.value)) {
        throw new Error(`Expected thread item to be a post`);
    }
    const repliesCount = item.value.post.replyCount || 0;
    const repliesUnhydrated = item.value.moreReplies || 0;
    const metadata = {
        depth: item.depth,
        /*
         * Unknown until after traversal
         */
        isLastChild: false,
        /*
         * Unknown until after traversal
         */
        isLastSibling: false,
        /*
         * If it's a top level reply, bc we render each top-level branch as a
         * separate tree, it's implicitly part of the last branch. For subsequent
         * replies, we'll override this after traversal.
         */
        isPartOfLastBranchFromDepth: item.depth === 1 ? 1 : undefined,
        nextItemDepth: nextItem?.depth,
        parentMetadata,
        prevItemDepth: prevItem?.depth,
        /*
         * Unknown until after traversal
         */
        precedesChildReadMore: false,
        /*
         * Unknown until after traversal
         */
        followsReadMoreUp: false,
        postData: {
            uri: item.uri,
            authorHandle: item.value.post.author.handle,
        },
        repliesCount,
        repliesUnhydrated,
        repliesSeenCounter: 0,
        repliesIndexCounter: 0,
        replyIndex: 0,
        skippedIndentIndices: new Set(),
    };
    if (isDevMode()) {
        // @ts-ignore dev only for debugging
        metadata.postData.text = getPostRecord(item.value.post).text;
    }
    return metadata;
}
export function storeTraversalMetadata(metadatas, metadata) {
    metadatas.set(metadata.postData.uri, metadata);
    if (isDevMode()) {
        // @ts-ignore dev only for debugging
        metadatas.set(metadata.postData.text, metadata);
        // @ts-ignore
        window.__thread = metadatas;
    }
}
export function getThreadPostUI({ depth, repliesCount, prevItemDepth, isLastChild, skippedIndentIndices, repliesSeenCounter, repliesUnhydrated, precedesChildReadMore, followsReadMoreUp, }) {
    const isReplyAndHasReplies = depth > 0 &&
        repliesCount > 0 &&
        (repliesCount - repliesUnhydrated === repliesSeenCounter ||
            repliesSeenCounter > 0);
    return {
        isAnchor: depth === 0,
        showParentReplyLine: followsReadMoreUp ||
            (!!prevItemDepth && prevItemDepth !== 0 && prevItemDepth < depth),
        showChildReplyLine: depth < 0 || isReplyAndHasReplies,
        indent: depth,
        /*
         * If there are no slices below this one, or the next slice has a depth <=
         * than the depth of this post, it's the last child of the reply tree. It
         * is not necessarily the last leaf in the parent branch, since it could
         * have another sibling.
         */
        isLastChild,
        skippedIndentIndices,
        precedesChildReadMore: precedesChildReadMore ?? false,
    };
}
export function getThreadPostNoUnauthenticatedUI({ depth, prevItemDepth, }) {
    return {
        showChildReplyLine: depth < 0,
        showParentReplyLine: Boolean(prevItemDepth && prevItemDepth < depth),
    };
}
//# sourceMappingURL=utils.js.map