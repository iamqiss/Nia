import { AtUri, moderatePost, } from '@atproto/api';
import { makeProfileLink } from '#/lib/routes/links';
import {} from '#/state/queries/usePostThread/types';
export function threadPostNoUnauthenticated({ uri, depth, value, }) {
    return {
        type: 'threadPostNoUnauthenticated',
        key: uri,
        uri,
        depth,
        value: value,
        // @ts-ignore populated by the traversal
        ui: {},
    };
}
export function threadPostNotFound({ uri, depth, value, }) {
    return {
        type: 'threadPostNotFound',
        key: uri,
        uri,
        depth,
        value: value,
    };
}
export function threadPostBlocked({ uri, depth, value, }) {
    return {
        type: 'threadPostBlocked',
        key: uri,
        uri,
        depth,
        value: value,
    };
}
export function threadPost({ uri, depth, value, moderationOpts, threadgateHiddenReplies, }) {
    const moderation = moderatePost(value.post, moderationOpts);
    const modui = moderation.ui('contentList');
    const blurred = modui.blur || modui.filter;
    const muted = (modui.blurs[0] || modui.filters[0])?.type === 'muted';
    const hiddenByThreadgate = threadgateHiddenReplies.has(uri);
    const isOwnPost = value.post.author.did === moderationOpts.userDid;
    const isBlurred = (hiddenByThreadgate || blurred || muted) && !isOwnPost;
    return {
        type: 'threadPost',
        key: uri,
        uri,
        depth,
        value: {
            ...value,
            /*
             * Do not spread anything here, load bearing for post shadow strict
             * equality reference checks.
             */
            post: value.post,
        },
        isBlurred,
        moderation,
        // @ts-ignore populated by the traversal
        ui: {},
    };
}
export function readMore({ depth, repliesUnhydrated, skippedIndentIndices, postData, }) {
    const urip = new AtUri(postData.uri);
    const href = makeProfileLink({
        did: urip.host,
        handle: postData.authorHandle,
    }, 'post', urip.rkey);
    return {
        type: 'readMore',
        key: `readMore:${postData.uri}`,
        href,
        moreReplies: repliesUnhydrated,
        depth,
        skippedIndentIndices,
    };
}
export function readMoreUp({ postData, }) {
    const urip = new AtUri(postData.uri);
    const href = makeProfileLink({
        did: urip.host,
        handle: postData.authorHandle,
    }, 'post', urip.rkey);
    return {
        type: 'readMoreUp',
        key: `readMoreUp:${postData.uri}`,
        href,
    };
}
export function skeleton({ key, item, }) {
    return {
        type: 'skeleton',
        key,
        item,
    };
}
export function postViewToThreadPlaceholder(post) {
    return {
        $type: 'app.bsky.unspecced.getPostThreadV2#threadItem',
        uri: post.uri,
        depth: 0, // reset to 0 for highlighted post
        value: {
            $type: 'app.bsky.unspecced.defs#threadItemPost',
            post,
            opThread: false,
            moreParents: false,
            moreReplies: 0,
            hiddenByThreadgate: false,
            mutedByViewer: false,
        },
    };
}
//# sourceMappingURL=views.js.map