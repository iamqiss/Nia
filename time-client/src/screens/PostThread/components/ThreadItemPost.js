import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { memo, useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { AtUri, RichText as RichTextAPI, } from '@atproto/api';
import { Trans } from '@lingui/macro';
import { useActorStatus } from '#/lib/actor-status';
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
import { PreviewableUserAvatar } from '#/view/com/util/UserAvatar';
import { LINEAR_AVI_WIDTH, OUTER_SPACE, REPLY_LINE_WIDTH, } from '#/screens/PostThread/const';
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
export function ThreadItemPost({ item, overrides, onPostSuccess, threadgateRecord, }) {
    const postShadow = usePostShadow(item.value.post);
    if (postShadow === POST_TOMBSTONE) {
        return _jsx(ThreadItemPostDeleted, { item: item, overrides: overrides });
    }
    return (_jsx(ThreadItemPostInner, { item: item, postShadow: postShadow, threadgateRecord: threadgateRecord, overrides: overrides, onPostSuccess: onPostSuccess }));
}
function ThreadItemPostDeleted({ item, overrides, }) {
    const t = useTheme();
    return (_jsxs(ThreadItemPostOuterWrapper, { item: item, overrides: overrides, children: [_jsx(ThreadItemPostParentReplyLine, { item: item }), _jsxs(View, { style: [
                    a.flex_row,
                    a.align_center,
                    a.py_md,
                    a.rounded_sm,
                    t.atoms.bg_contrast_25,
                ], children: [_jsx(View, { style: [
                            a.flex_row,
                            a.align_center,
                            a.justify_center,
                            {
                                width: LINEAR_AVI_WIDTH,
                            },
                        ], children: _jsx(TrashIcon, { style: [t.atoms.text_contrast_medium] }) }), _jsx(Text, { style: [a.text_md, a.font_bold, t.atoms.text_contrast_medium], children: _jsx(Trans, { children: "Post has been deleted" }) })] }), _jsx(View, { style: [{ height: 4 }] })] }));
}
const ThreadItemPostOuterWrapper = memo(function ThreadItemPostOuterWrapper({ item, overrides, children, }) {
    const t = useTheme();
    const showTopBorder = !item.ui.showParentReplyLine && overrides?.topBorder !== true;
    return (_jsx(View, { style: [
            showTopBorder && [a.border_t, t.atoms.border_contrast_low],
            {
                paddingHorizontal: OUTER_SPACE,
            },
            // If there's no next child, add a little padding to bottom
            !item.ui.showChildReplyLine &&
                !item.ui.precedesChildReadMore && {
                paddingBottom: OUTER_SPACE / 2,
            },
        ], children: children }));
});
/**
 * Provides some space between posts as well as contains the reply line
 */
const ThreadItemPostParentReplyLine = memo(function ThreadItemPostParentReplyLine({ item, }) {
    const t = useTheme();
    return (_jsx(View, { style: [a.flex_row, { height: 12 }], children: _jsx(View, { style: { width: LINEAR_AVI_WIDTH }, children: item.ui.showParentReplyLine && (_jsx(View, { style: [
                    a.mx_auto,
                    a.flex_1,
                    a.mb_xs,
                    {
                        width: REPLY_LINE_WIDTH,
                        backgroundColor: t.atoms.border_contrast_low.borderColor,
                    },
                ] })) }) }));
});
const ThreadItemPostInner = memo(function ThreadItemPostInner({ item, postShadow, overrides, onPostSuccess, threadgateRecord, }) {
    const t = useTheme();
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
    const { isActive: live } = useActorStatus(post.author);
    return (_jsx(SubtleHover, { children: _jsx(ThreadItemPostOuterWrapper, { item: item, overrides: overrides, children: _jsxs(PostHider, { testID: `postThreadItem-by-${post.author.handle}`, href: postHref, disabled: overrides?.moderation === true, modui: moderation.ui('contentList'), iconSize: LINEAR_AVI_WIDTH, iconStyles: { marginLeft: 2, marginRight: 2 }, profile: post.author, interpretFilterAsBlur: true, children: [_jsx(ThreadItemPostParentReplyLine, { item: item }), _jsxs(View, { style: [a.flex_row, a.gap_md], children: [_jsxs(View, { children: [_jsx(PreviewableUserAvatar, { size: LINEAR_AVI_WIDTH, profile: post.author, moderation: moderation.ui('avatar'), type: post.author.associated?.labeler ? 'labeler' : 'user', live: live }), (item.ui.showChildReplyLine ||
                                        item.ui.precedesChildReadMore) && (_jsx(View, { style: [
                                            a.mx_auto,
                                            a.mt_xs,
                                            a.flex_1,
                                            {
                                                width: REPLY_LINE_WIDTH,
                                                backgroundColor: t.atoms.border_contrast_low.borderColor,
                                            },
                                        ] }))] }), _jsxs(View, { style: [a.flex_1], children: [_jsx(PostMeta, { author: post.author, moderation: moderation, timestamp: post.indexedAt, postHref: postHref, style: [a.pb_xs] }), _jsx(LabelsOnMyPost, { post: post, style: [a.pb_xs] }), _jsx(PostAlerts, { modui: moderation.ui('contentList'), style: [a.pb_2xs], additionalCauses: additionalPostAlerts }), richText?.text ? (_jsxs(_Fragment, { children: [_jsx(RichText, { enableTags: true, value: richText, style: [a.flex_1, a.text_md], numberOfLines: limitLines ? MAX_POST_LINES : undefined, authorHandle: post.author.handle, shouldProxyLinks: true }), limitLines && (_jsx(ShowMoreTextButton, { style: [a.text_md], onPress: onPressShowMore }))] })) : undefined, post.embed && (_jsx(View, { style: [a.pb_xs], children: _jsx(Embed, { embed: post.embed, moderation: moderation, viewContext: PostEmbedViewContext.Feed }) })), _jsx(PostControls, { post: postShadow, record: record, richText: richText, onPressReply: onPressReply, logContext: "PostThreadItem", threadgateRecord: threadgateRecord })] })] })] }) }) }));
});
function SubtleHover({ children }) {
    const { state: hover, onIn: onHoverIn, onOut: onHoverOut, } = useInteractionState();
    return (_jsxs(View, { onPointerEnter: onHoverIn, onPointerLeave: onHoverOut, style: a.pointer, children: [_jsx(SubtleWebHover, { hover: hover }), children] }));
}
export function ThreadItemPostSkeleton({ index }) {
    const even = index % 2 === 0;
    return (_jsx(View, { style: [
            { paddingHorizontal: OUTER_SPACE, paddingVertical: OUTER_SPACE / 1.5 },
            a.gap_md,
        ], children: _jsxs(Skele.Row, { style: [a.align_start, a.gap_md], children: [_jsx(Skele.Circle, { size: LINEAR_AVI_WIDTH }), _jsxs(Skele.Col, { style: [a.gap_xs], children: [_jsxs(Skele.Row, { style: [a.gap_sm], children: [_jsx(Skele.Text, { style: [a.text_md, { width: '20%' }] }), _jsx(Skele.Text, { blend: true, style: [a.text_md, { width: '30%' }] })] }), _jsx(Skele.Col, { children: even ? (_jsxs(_Fragment, { children: [_jsx(Skele.Text, { blend: true, style: [a.text_md, { width: '100%' }] }), _jsx(Skele.Text, { blend: true, style: [a.text_md, { width: '60%' }] })] })) : (_jsx(Skele.Text, { blend: true, style: [a.text_md, { width: '60%' }] })) }), _jsxs(Skele.Row, { style: [a.justify_between, a.pt_xs], children: [_jsx(Skele.Pill, { blend: true, size: 16 }), _jsx(Skele.Pill, { blend: true, size: 16 }), _jsx(Skele.Pill, { blend: true, size: 16 }), _jsx(Skele.Circle, { blend: true, size: 16 }), _jsx(View, {})] })] })] }) }));
}
//# sourceMappingURL=ThreadItemPost.js.map