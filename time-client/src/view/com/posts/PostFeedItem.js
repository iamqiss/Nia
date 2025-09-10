import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { memo, useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppBskyFeedDefs, AppBskyFeedPost, AppBskyFeedThreadgate, AtUri, RichText as RichTextAPI, } from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useActorStatus } from '#/lib/actor-status';
import { isReasonFeedSource } from '#/lib/api/feed/types';
import { MAX_POST_LINES } from '#/lib/constants';
import { useOpenComposer } from '#/lib/hooks/useOpenComposer';
import { usePalette } from '#/lib/hooks/usePalette';
import { makeProfileLink } from '#/lib/routes/links';
import { sanitizeDisplayName } from '#/lib/strings/display-names';
import { sanitizeHandle } from '#/lib/strings/handles';
import { countLines } from '#/lib/strings/helpers';
import { POST_TOMBSTONE, usePostShadow, } from '#/state/cache/post-shadow';
import { useFeedFeedbackContext } from '#/state/feed-feedback';
import { unstableCacheProfileView } from '#/state/queries/profile';
import { useSession } from '#/state/session';
import { useMergedThreadgateHiddenReplies } from '#/state/threadgate-hidden-replies';
import { buildPostSourceKey, setUnstablePostSource, } from '#/state/unstable-post-source';
import { FeedNameText } from '#/view/com/util/FeedInfoText';
import { Link, TextLinkOnWebOnly } from '#/view/com/util/Link';
import { PostMeta } from '#/view/com/util/PostMeta';
import { Text } from '#/view/com/util/text/Text';
import { PreviewableUserAvatar } from '#/view/com/util/UserAvatar';
import { atoms as a } from '#/alf';
import { Pin_Stroke2_Corner0_Rounded as PinIcon } from '#/components/icons/Pin';
import { Repost_Stroke2_Corner2_Rounded as RepostIcon } from '#/components/icons/Repost';
import { ContentHider } from '#/components/moderation/ContentHider';
import { LabelsOnMyPost } from '#/components/moderation/LabelsOnMe';
import { PostAlerts } from '#/components/moderation/PostAlerts';
import {} from '#/components/Pills';
import { Embed } from '#/components/Post/Embed';
import { PostEmbedViewContext } from '#/components/Post/Embed/types';
import { PostRepliedTo } from '#/components/Post/PostRepliedTo';
import { ShowMoreTextButton } from '#/components/Post/ShowMoreTextButton';
import { PostControls } from '#/components/PostControls';
import { DiscoverDebug } from '#/components/PostControls/DiscoverDebug';
import { ProfileHoverCard } from '#/components/ProfileHoverCard';
import { RichText } from '#/components/RichText';
import { SubtleWebHover } from '#/components/SubtleWebHover';
import * as bsky from '#/types/bsky';
export function PostFeedItem({ post, record, reason, feedContext, reqId, moderation, parentAuthor, showReplyTo, isThreadChild, isThreadLastChild, isThreadParent, hideTopBorder, isParentBlocked, isParentNotFound, rootPost, onShowLess, }) {
    const postShadowed = usePostShadow(post);
    const richText = useMemo(() => new RichTextAPI({
        text: record.text,
        facets: record.facets,
    }), [record]);
    if (postShadowed === POST_TOMBSTONE) {
        return null;
    }
    if (richText && moderation) {
        return (_jsx(FeedItemInner
        // Safeguard from clobbering per-post state below:
        , { post: postShadowed, record: record, reason: reason, feedContext: feedContext, reqId: reqId, richText: richText, parentAuthor: parentAuthor, showReplyTo: showReplyTo, moderation: moderation, isThreadChild: isThreadChild, isThreadLastChild: isThreadLastChild, isThreadParent: isThreadParent, hideTopBorder: hideTopBorder, isParentBlocked: isParentBlocked, isParentNotFound: isParentNotFound, rootPost: rootPost, onShowLess: onShowLess }, postShadowed.uri));
    }
    return null;
}
let FeedItemInner = ({ post, record, reason, feedContext, reqId, richText, moderation, parentAuthor, showReplyTo, isThreadChild, isThreadLastChild, isThreadParent, hideTopBorder, isParentBlocked, isParentNotFound, rootPost, onShowLess, }) => {
    const queryClient = useQueryClient();
    const { openComposer } = useOpenComposer();
    const pal = usePalette('default');
    const { _ } = useLingui();
    const [hover, setHover] = useState(false);
    const href = useMemo(() => {
        const urip = new AtUri(post.uri);
        return makeProfileLink(post.author, 'post', urip.rkey);
    }, [post.uri, post.author]);
    const { sendInteraction, feedSourceInfo } = useFeedFeedbackContext();
    const onPressReply = () => {
        sendInteraction({
            item: post.uri,
            event: 'app.bsky.feed.defs#interactionReply',
            feedContext,
            reqId,
        });
        openComposer({
            replyTo: {
                uri: post.uri,
                cid: post.cid,
                text: record.text || '',
                author: post.author,
                embed: post.embed,
                moderation,
                langs: record.langs,
            },
        });
    };
    const onOpenAuthor = () => {
        sendInteraction({
            item: post.uri,
            event: 'app.bsky.feed.defs#clickthroughAuthor',
            feedContext,
            reqId,
        });
    };
    const onOpenReposter = () => {
        sendInteraction({
            item: post.uri,
            event: 'app.bsky.feed.defs#clickthroughReposter',
            feedContext,
            reqId,
        });
    };
    const onOpenEmbed = () => {
        sendInteraction({
            item: post.uri,
            event: 'app.bsky.feed.defs#clickthroughEmbed',
            feedContext,
            reqId,
        });
    };
    const onBeforePress = () => {
        sendInteraction({
            item: post.uri,
            event: 'app.bsky.feed.defs#clickthroughItem',
            feedContext,
            reqId,
        });
        unstableCacheProfileView(queryClient, post.author);
        setUnstablePostSource(buildPostSourceKey(post.uri, post.author.handle), {
            feedSourceInfo,
            post: {
                post,
                reason: AppBskyFeedDefs.isReasonRepost(reason) ? reason : undefined,
                feedContext,
                reqId,
            },
        });
    };
    const outerStyles = [
        styles.outer,
        {
            borderColor: pal.colors.border,
            paddingBottom: isThreadLastChild || (!isThreadChild && !isThreadParent)
                ? 8
                : undefined,
            borderTopWidth: hideTopBorder || isThreadChild ? 0 : StyleSheet.hairlineWidth,
        },
    ];
    const { currentAccount } = useSession();
    const isOwner = AppBskyFeedDefs.isReasonRepost(reason) &&
        reason.by.did === currentAccount?.did;
    /**
     * If `post[0]` in this slice is the actual root post (not an orphan thread),
     * then we may have a threadgate record to reference
     */
    const threadgateRecord = bsky.dangerousIsType(rootPost.threadgate?.record, AppBskyFeedThreadgate.isRecord)
        ? rootPost.threadgate.record
        : undefined;
    const { isActive: live } = useActorStatus(post.author);
    const viaRepost = useMemo(() => {
        if (AppBskyFeedDefs.isReasonRepost(reason) && reason.uri && reason.cid) {
            return {
                uri: reason.uri,
                cid: reason.cid,
            };
        }
    }, [reason]);
    return (_jsxs(Link, { testID: `feedItem-by-${post.author.handle}`, style: outerStyles, href: href, noFeedback: true, accessible: false, onBeforePress: onBeforePress, dataSet: { feedContext }, onPointerEnter: () => {
            setHover(true);
        }, onPointerLeave: () => {
            setHover(false);
        }, children: [_jsx(SubtleWebHover, { hover: hover }), _jsxs(View, { style: { flexDirection: 'row', gap: 10, paddingLeft: 8 }, children: [_jsx(View, { style: { width: 42 }, children: isThreadChild && (_jsx(View, { style: [
                                styles.replyLine,
                                {
                                    flexGrow: 1,
                                    backgroundColor: pal.colors.replyLine,
                                    marginBottom: 4,
                                },
                            ] })) }), _jsx(View, { style: { paddingTop: 10, flexShrink: 1 }, children: isReasonFeedSource(reason) ? (_jsx(Link, { href: reason.href, children: _jsx(Text, { type: "sm-bold", style: pal.textLight, lineHeight: 1.2, numberOfLines: 1, children: _jsxs(Trans, { context: "from-feed", children: ["From", ' ', _jsx(FeedNameText, { type: "sm-bold", uri: reason.uri, href: reason.href, lineHeight: 1.2, numberOfLines: 1, style: pal.textLight })] }) }) })) : AppBskyFeedDefs.isReasonRepost(reason) ? (_jsxs(Link, { style: styles.includeReason, href: makeProfileLink(reason.by), title: isOwner
                                ? _(msg `Reposted by you`)
                                : _(msg `Reposted by ${sanitizeDisplayName(reason.by.displayName || reason.by.handle)}`), onBeforePress: onOpenReposter, children: [_jsx(RepostIcon, { style: { color: pal.colors.textLight, marginRight: 3 }, width: 13, height: 13 }), _jsx(Text, { type: "sm-bold", style: pal.textLight, lineHeight: 1.2, numberOfLines: 1, children: isOwner ? (_jsx(Trans, { children: "Reposted by you" })) : (_jsxs(Trans, { children: ["Reposted by", ' ', _jsx(ProfileHoverCard, { did: reason.by.did, children: _jsx(TextLinkOnWebOnly, { type: "sm-bold", style: pal.textLight, lineHeight: 1.2, numberOfLines: 1, text: _jsx(Text, { emoji: true, type: "sm-bold", style: pal.textLight, lineHeight: 1.2, children: sanitizeDisplayName(reason.by.displayName ||
                                                            sanitizeHandle(reason.by.handle), moderation.ui('displayName')) }), href: makeProfileLink(reason.by), onBeforePress: onOpenReposter }) })] })) })] })) : AppBskyFeedDefs.isReasonPin(reason) ? (_jsxs(View, { style: styles.includeReason, children: [_jsx(PinIcon, { style: { color: pal.colors.textLight, marginRight: 3 }, width: 13, height: 13 }), _jsx(Text, { type: "sm-bold", style: pal.textLight, lineHeight: 1.2, numberOfLines: 1, children: _jsx(Trans, { children: "Pinned" }) })] })) : null })] }), _jsxs(View, { style: styles.layout, children: [_jsxs(View, { style: styles.layoutAvi, children: [_jsx(PreviewableUserAvatar, { size: 42, profile: post.author, moderation: moderation.ui('avatar'), type: post.author.associated?.labeler ? 'labeler' : 'user', onBeforePress: onOpenAuthor, live: live }), isThreadParent && (_jsx(View, { style: [
                                    styles.replyLine,
                                    {
                                        flexGrow: 1,
                                        backgroundColor: pal.colors.replyLine,
                                        marginTop: live ? 8 : 4,
                                    },
                                ] }))] }), _jsxs(View, { style: styles.layoutContent, children: [_jsx(PostMeta, { author: post.author, moderation: moderation, timestamp: post.indexedAt, postHref: href, onOpenAuthor: onOpenAuthor }), showReplyTo &&
                                (parentAuthor || isParentBlocked || isParentNotFound) && (_jsx(PostRepliedTo, { parentAuthor: parentAuthor, isParentBlocked: isParentBlocked, isParentNotFound: isParentNotFound })), _jsx(LabelsOnMyPost, { post: post }), _jsx(PostContent, { moderation: moderation, richText: richText, postEmbed: post.embed, postAuthor: post.author, onOpenEmbed: onOpenEmbed, post: post, threadgateRecord: threadgateRecord }), _jsx(PostControls, { post: post, record: record, richText: richText, onPressReply: onPressReply, logContext: "FeedItem", feedContext: feedContext, reqId: reqId, threadgateRecord: threadgateRecord, onShowLess: onShowLess, viaRepost: viaRepost })] }), _jsx(DiscoverDebug, { feedContext: feedContext })] })] }));
};
FeedItemInner = memo(FeedItemInner);
let PostContent = ({ post, moderation, richText, postEmbed, postAuthor, onOpenEmbed, threadgateRecord, }) => {
    const { currentAccount } = useSession();
    const [limitLines, setLimitLines] = useState(() => countLines(richText.text) >= MAX_POST_LINES);
    const threadgateHiddenReplies = useMergedThreadgateHiddenReplies({
        threadgateRecord,
    });
    const additionalPostAlerts = useMemo(() => {
        const isPostHiddenByThreadgate = threadgateHiddenReplies.has(post.uri);
        const rootPostUri = bsky.dangerousIsType(post.record, AppBskyFeedPost.isRecord)
            ? post.record?.reply?.root?.uri || post.uri
            : undefined;
        const isControlledByViewer = rootPostUri && new AtUri(rootPostUri).host === currentAccount?.did;
        return isControlledByViewer && isPostHiddenByThreadgate
            ? [
                {
                    type: 'reply-hidden',
                    source: { type: 'user', did: currentAccount?.did },
                    priority: 6,
                },
            ]
            : [];
    }, [post, currentAccount?.did, threadgateHiddenReplies]);
    const onPressShowMore = useCallback(() => {
        setLimitLines(false);
    }, [setLimitLines]);
    return (_jsxs(ContentHider, { testID: "contentHider-post", modui: moderation.ui('contentList'), ignoreMute: true, childContainerStyle: styles.contentHiderChild, children: [_jsx(PostAlerts, { modui: moderation.ui('contentList'), style: [a.py_2xs], additionalCauses: additionalPostAlerts }), richText.text ? (_jsxs(_Fragment, { children: [_jsx(RichText, { enableTags: true, testID: "postText", value: richText, numberOfLines: limitLines ? MAX_POST_LINES : undefined, style: [a.flex_1, a.text_md], authorHandle: postAuthor.handle, shouldProxyLinks: true }), limitLines && (_jsx(ShowMoreTextButton, { style: [a.text_md], onPress: onPressShowMore }))] })) : undefined, postEmbed ? (_jsx(View, { style: [a.pb_xs], children: _jsx(Embed, { embed: postEmbed, moderation: moderation, onOpen: onOpenEmbed, viewContext: PostEmbedViewContext.Feed }) })) : null] }));
};
PostContent = memo(PostContent);
const styles = StyleSheet.create({
    outer: {
        paddingLeft: 10,
        paddingRight: 15,
        cursor: 'pointer',
    },
    replyLine: {
        width: 2,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    includeReason: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
        marginLeft: -16,
    },
    layout: {
        flexDirection: 'row',
        marginTop: 1,
    },
    layoutAvi: {
        paddingLeft: 8,
        paddingRight: 10,
        position: 'relative',
        zIndex: 999,
    },
    layoutContent: {
        position: 'relative',
        flex: 1,
        zIndex: 0,
    },
    alert: {
        marginTop: 6,
        marginBottom: 6,
    },
    contentHiderChild: {
        marginTop: 6,
    },
    embed: {
        marginBottom: 6,
    },
    translateLink: {
        marginBottom: 6,
    },
});
//# sourceMappingURL=PostFeedItem.js.map