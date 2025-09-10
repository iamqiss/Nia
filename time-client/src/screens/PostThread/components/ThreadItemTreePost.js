import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { memo, useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { AtUri, RichText as RichTextAPI, } from '@atproto/api';
import { Trans } from '@lingui/macro';
import { MAX_POST_LINES } from '#/lib/constants';
import { useOpenComposer } from '#/lib/hooks/useOpenComposer';
import { makeProfileLink } from '#/lib/routes/links';
import { countLines } from '#/lib/strings/helpers';
import { POST_TOMBSTONE, usePostShadow, } from '#/state/cache/post-shadow';
import {} from '#/state/queries/usePostThread/types';
import { useSession } from '#/state/session';
import {} from '#/state/shell/composer';
import { useMergedThreadgateHiddenReplies } from '#/state/threadgate-hidden-replies';
import { PostMeta } from '#/view/com/util/PostMeta';
import { OUTER_SPACE, REPLY_LINE_WIDTH, TREE_AVI_WIDTH, TREE_INDENT, } from '#/screens/PostThread/const';
import { atoms as a, useTheme } from '#/alf';
import { useInteractionState } from '#/components/hooks/useInteractionState';
import { Trash_Stroke2_Corner0_Rounded as TrashIcon } from '#/components/icons/Trash';
import { LabelsOnMyPost } from '#/components/moderation/LabelsOnMe';
import { PostAlerts } from '#/components/moderation/PostAlerts';
import { PostHider } from '#/components/moderation/PostHider';
import {} from '#/components/Pills';
import { Embed, PostEmbedViewContext } from '#/components/Post/Embed';
import { ShowMoreTextButton } from '#/components/Post/ShowMoreTextButton';
import { PostControls } from '#/components/PostControls';
import { RichText } from '#/components/RichText';
import * as Skele from '#/components/Skeleton';
import { SubtleWebHover } from '#/components/SubtleWebHover';
import { Text } from '#/components/Typography';
/**
 * Mimic the space in PostMeta
 */
const TREE_AVI_PLUS_SPACE = TREE_AVI_WIDTH + a.gap_xs.gap;
export function ThreadItemTreePost({ item, overrides, onPostSuccess, threadgateRecord, }) {
    const postShadow = usePostShadow(item.value.post);
    if (postShadow === POST_TOMBSTONE) {
        return _jsx(ThreadItemTreePostDeleted, { item: item });
    }
    return (_jsx(ThreadItemTreePostInner
    // Safeguard from clobbering per-post state below:
    , { item: item, postShadow: postShadow, threadgateRecord: threadgateRecord, overrides: overrides, onPostSuccess: onPostSuccess }, postShadow.uri));
}
function ThreadItemTreePostDeleted({ item, }) {
    const t = useTheme();
    return (_jsx(ThreadItemTreePostOuterWrapper, { item: item, children: _jsxs(ThreadItemTreePostInnerWrapper, { item: item, children: [_jsxs(View, { style: [
                        a.flex_row,
                        a.align_center,
                        a.rounded_sm,
                        t.atoms.bg_contrast_25,
                        {
                            gap: 6,
                            paddingHorizontal: OUTER_SPACE / 2,
                            height: TREE_AVI_WIDTH,
                        },
                    ], children: [_jsx(TrashIcon, { style: [t.atoms.text], width: 14 }), _jsx(Text, { style: [t.atoms.text_contrast_medium, a.mt_2xs], children: _jsx(Trans, { children: "Post has been deleted" }) })] }), item.ui.isLastChild && !item.ui.precedesChildReadMore && (_jsx(View, { style: { height: OUTER_SPACE / 2 } }))] }) }));
}
const ThreadItemTreePostOuterWrapper = memo(function ThreadItemTreePostOuterWrapper({ item, children, }) {
    const t = useTheme();
    const indents = Math.max(0, item.ui.indent - 1);
    return (_jsxs(View, { style: [
            a.flex_row,
            item.ui.indent === 1 &&
                !item.ui.showParentReplyLine && [
                a.border_t,
                t.atoms.border_contrast_low,
            ],
        ], children: [Array.from(Array(indents)).map((_, n) => {
                const isSkipped = item.ui.skippedIndentIndices.has(n);
                return (_jsx(View, { style: [
                        t.atoms.border_contrast_low,
                        {
                            borderRightWidth: isSkipped ? 0 : REPLY_LINE_WIDTH,
                            width: TREE_INDENT + TREE_AVI_WIDTH / 2,
                            left: 1,
                        },
                    ] }, `${item.value.post.uri}-padding-${n}`));
            }), children] }));
});
const ThreadItemTreePostInnerWrapper = memo(function ThreadItemTreePostInnerWrapper({ item, children, }) {
    const t = useTheme();
    return (_jsxs(View, { style: [
            a.flex_1, // TODO check on ios
            {
                paddingHorizontal: OUTER_SPACE,
                paddingTop: OUTER_SPACE / 2,
            },
            item.ui.indent === 1 && [
                !item.ui.showParentReplyLine && a.pt_lg,
                !item.ui.showChildReplyLine && a.pb_sm,
            ],
            item.ui.isLastChild &&
                !item.ui.precedesChildReadMore && [
                {
                    paddingBottom: OUTER_SPACE / 2,
                },
            ],
        ], children: [item.ui.indent > 1 && (_jsx(View, { style: [
                    a.absolute,
                    t.atoms.border_contrast_low,
                    {
                        left: -1,
                        top: 0,
                        height: TREE_AVI_WIDTH / 2 + REPLY_LINE_WIDTH / 2 + OUTER_SPACE / 2,
                        width: OUTER_SPACE,
                        borderLeftWidth: REPLY_LINE_WIDTH,
                        borderBottomWidth: REPLY_LINE_WIDTH,
                        borderBottomLeftRadius: a.rounded_sm.borderRadius,
                    },
                ] })), children] }));
});
const ThreadItemTreeReplyChildReplyLine = memo(function ThreadItemTreeReplyChildReplyLine({ item, }) {
    const t = useTheme();
    return (_jsx(View, { style: [a.relative, a.pt_2xs, { width: TREE_AVI_PLUS_SPACE }], children: item.ui.showChildReplyLine && (_jsx(View, { style: [
                a.flex_1,
                t.atoms.border_contrast_low,
                { borderRightWidth: 2, width: '50%', left: -1 },
            ] })) }));
});
const ThreadItemTreePostInner = memo(function ThreadItemTreePostInner({ item, postShadow, overrides, onPostSuccess, threadgateRecord, }) {
    const { openComposer } = useOpenComposer();
    const { currentAccount } = useSession();
    const post = item.value.post;
    const record = item.value.post.record;
    const moderation = item.moderation;
    const richText = useMemo(() => new RichTextAPI({
        text: record.text,
        facets: record.facets,
    }), [record]);
    const [limitLines, setLimitLines] = useState(() => countLines(richText?.text) >= MAX_POST_LINES);
    const threadRootUri = record.reply?.root?.uri || post.uri;
    const postHref = useMemo(() => {
        const urip = new AtUri(post.uri);
        return makeProfileLink(post.author, 'post', urip.rkey);
    }, [post.uri, post.author]);
    const threadgateHiddenReplies = useMergedThreadgateHiddenReplies({
        threadgateRecord,
    });
    const additionalPostAlerts = useMemo(() => {
        const isPostHiddenByThreadgate = threadgateHiddenReplies.has(post.uri);
        const isControlledByViewer = new AtUri(threadRootUri).host === currentAccount?.did;
        return isControlledByViewer && isPostHiddenByThreadgate
            ? [
                {
                    type: 'reply-hidden',
                    source: { type: 'user', did: currentAccount?.did },
                    priority: 6,
                },
            ]
            : [];
    }, [post, currentAccount?.did, threadgateHiddenReplies, threadRootUri]);
    const onPressReply = useCallback(() => {
        openComposer({
            replyTo: {
                uri: post.uri,
                cid: post.cid,
                text: record.text,
                author: post.author,
                embed: post.embed,
                moderation,
                langs: post.record.langs,
            },
            onPostSuccess: onPostSuccess,
        });
    }, [openComposer, post, record, onPostSuccess, moderation]);
    const onPressShowMore = useCallback(() => {
        setLimitLines(false);
    }, [setLimitLines]);
    return (_jsx(ThreadItemTreePostOuterWrapper, { item: item, children: _jsx(SubtleHover, { children: _jsx(PostHider, { testID: `postThreadItem-by-${post.author.handle}`, href: postHref, disabled: overrides?.moderation === true, modui: moderation.ui('contentList'), iconSize: 42, iconStyles: { marginLeft: 2, marginRight: 2 }, profile: post.author, interpretFilterAsBlur: true, children: _jsx(ThreadItemTreePostInnerWrapper, { item: item, children: _jsxs(View, { style: [a.flex_1], children: [_jsx(PostMeta, { author: post.author, moderation: moderation, timestamp: post.indexedAt, postHref: postHref, avatarSize: TREE_AVI_WIDTH, style: [a.pb_0], showAvatar: true }), _jsxs(View, { style: [a.flex_row], children: [_jsx(ThreadItemTreeReplyChildReplyLine, { item: item }), _jsxs(View, { style: [a.flex_1, a.pl_2xs], children: [_jsx(LabelsOnMyPost, { post: post, style: [a.pb_2xs] }), _jsx(PostAlerts, { modui: moderation.ui('contentList'), style: [a.pb_2xs], additionalCauses: additionalPostAlerts }), richText?.text ? (_jsxs(_Fragment, { children: [_jsx(RichText, { enableTags: true, value: richText, style: [a.flex_1, a.text_md], numberOfLines: limitLines ? MAX_POST_LINES : undefined, authorHandle: post.author.handle, shouldProxyLinks: true }), limitLines && (_jsx(ShowMoreTextButton, { style: [a.text_md], onPress: onPressShowMore }))] })) : null, post.embed && (_jsx(View, { style: [a.pb_xs], children: _jsx(Embed, { embed: post.embed, moderation: moderation, viewContext: PostEmbedViewContext.Feed }) })), _jsx(PostControls, { variant: "compact", post: postShadow, record: record, richText: richText, onPressReply: onPressReply, logContext: "PostThreadItem", threadgateRecord: threadgateRecord })] })] })] }) }) }) }) }));
});
function SubtleHover({ children }) {
    const { state: hover, onIn: onHoverIn, onOut: onHoverOut, } = useInteractionState();
    return (_jsxs(View, { onPointerEnter: onHoverIn, onPointerLeave: onHoverOut, style: [a.flex_1, a.pointer], children: [_jsx(SubtleWebHover, { hover: hover }), children] }));
}
export function ThreadItemTreePostSkeleton({ index }) {
    const t = useTheme();
    const even = index % 2 === 0;
    return (_jsx(View, { style: [
            { paddingHorizontal: OUTER_SPACE, paddingVertical: OUTER_SPACE / 1.5 },
            a.gap_md,
            a.border_t,
            t.atoms.border_contrast_low,
        ], children: _jsxs(Skele.Row, { style: [a.align_start, a.gap_md], children: [_jsx(Skele.Circle, { size: TREE_AVI_WIDTH }), _jsxs(Skele.Col, { style: [a.gap_xs], children: [_jsxs(Skele.Row, { style: [a.gap_sm], children: [_jsx(Skele.Text, { style: [a.text_md, { width: '20%' }] }), _jsx(Skele.Text, { blend: true, style: [a.text_md, { width: '30%' }] })] }), _jsx(Skele.Col, { children: even ? (_jsxs(_Fragment, { children: [_jsx(Skele.Text, { blend: true, style: [a.text_md, { width: '100%' }] }), _jsx(Skele.Text, { blend: true, style: [a.text_md, { width: '60%' }] })] })) : (_jsx(Skele.Text, { blend: true, style: [a.text_md, { width: '60%' }] })) }), _jsxs(Skele.Row, { style: [a.justify_between, a.pt_xs], children: [_jsx(Skele.Pill, { blend: true, size: 16 }), _jsx(Skele.Pill, { blend: true, size: 16 }), _jsx(Skele.Pill, { blend: true, size: 16 }), _jsx(Skele.Circle, { blend: true, size: 16 }), _jsx(View, {})] })] })] }) }));
}
//# sourceMappingURL=ThreadItemTreePost.js.map