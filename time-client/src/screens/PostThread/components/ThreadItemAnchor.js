import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { memo, useCallback, useMemo } from 'react';
import { Text as RNText, View } from 'react-native';
import { AppBskyFeedDefs, AppBskyFeedPost, AtUri, RichText as RichTextAPI, } from '@atproto/api';
import { msg, Plural, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useActorStatus } from '#/lib/actor-status';
import { useOpenComposer } from '#/lib/hooks/useOpenComposer';
import { useTranslate } from '#/lib/hooks/useTranslate';
import { makeProfileLink } from '#/lib/routes/links';
import { sanitizeDisplayName } from '#/lib/strings/display-names';
import { sanitizeHandle } from '#/lib/strings/handles';
import { niceDate } from '#/lib/strings/time';
import { getTranslatorLink, isPostInLanguage } from '#/locale/helpers';
import { logger } from '#/logger';
import { POST_TOMBSTONE, usePostShadow, } from '#/state/cache/post-shadow';
import { useProfileShadow } from '#/state/cache/profile-shadow';
import { FeedFeedbackProvider, useFeedFeedback } from '#/state/feed-feedback';
import { useLanguagePrefs } from '#/state/preferences';
import {} from '#/state/queries/usePostThread/types';
import { useSession } from '#/state/session';
import {} from '#/state/shell/composer';
import { useMergedThreadgateHiddenReplies } from '#/state/threadgate-hidden-replies';
import {} from '#/state/unstable-post-source';
import { PreviewableUserAvatar } from '#/view/com/util/UserAvatar';
import { ThreadItemAnchorFollowButton } from '#/screens/PostThread/components/ThreadItemAnchorFollowButton';
import { LINEAR_AVI_WIDTH, OUTER_SPACE, REPLY_LINE_WIDTH, } from '#/screens/PostThread/const';
import { atoms as a, useBreakpoints, useTheme } from '#/alf';
import { colors } from '#/components/Admonition';
import { Button } from '#/components/Button';
import { CalendarClock_Stroke2_Corner0_Rounded as CalendarClockIcon } from '#/components/icons/CalendarClock';
import { Trash_Stroke2_Corner0_Rounded as TrashIcon } from '#/components/icons/Trash';
import { InlineLinkText, Link } from '#/components/Link';
import { LoggedOutCTA } from '#/components/LoggedOutCTA';
import { ContentHider } from '#/components/moderation/ContentHider';
import { LabelsOnMyPost } from '#/components/moderation/LabelsOnMe';
import { PostAlerts } from '#/components/moderation/PostAlerts';
import {} from '#/components/Pills';
import { Embed, PostEmbedViewContext } from '#/components/Post/Embed';
import { PostControls } from '#/components/PostControls';
import { useFormatPostStatCount } from '#/components/PostControls/util';
import { ProfileHoverCard } from '#/components/ProfileHoverCard';
import * as Prompt from '#/components/Prompt';
import { RichText } from '#/components/RichText';
import * as Skele from '#/components/Skeleton';
import { Text } from '#/components/Typography';
import { VerificationCheckButton } from '#/components/verification/VerificationCheckButton';
import { WhoCanReply } from '#/components/WhoCanReply';
import * as bsky from '#/types/bsky';
export function ThreadItemAnchor({ item, onPostSuccess, threadgateRecord, postSource, }) {
    const postShadow = usePostShadow(item.value.post);
    const threadRootUri = item.value.post.record.reply?.root?.uri || item.uri;
    const isRoot = threadRootUri === item.uri;
    if (postShadow === POST_TOMBSTONE) {
        return _jsx(ThreadItemAnchorDeleted, { isRoot: isRoot });
    }
    return (_jsx(ThreadItemAnchorInner
    // Safeguard from clobbering per-post state below:
    , { item: item, isRoot: isRoot, postShadow: postShadow, onPostSuccess: onPostSuccess, threadgateRecord: threadgateRecord, postSource: postSource }, postShadow.uri));
}
function ThreadItemAnchorDeleted({ isRoot }) {
    const t = useTheme();
    return (_jsxs(_Fragment, { children: [_jsx(ThreadItemAnchorParentReplyLine, { isRoot: isRoot }), _jsx(View, { style: [
                    {
                        paddingHorizontal: OUTER_SPACE,
                        paddingBottom: OUTER_SPACE,
                    },
                    isRoot && [a.pt_lg],
                ], children: _jsxs(View, { style: [
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
                            ], children: _jsx(TrashIcon, { style: [t.atoms.text_contrast_medium] }) }), _jsx(Text, { style: [a.text_md, a.font_bold, t.atoms.text_contrast_medium], children: _jsx(Trans, { children: "Post has been deleted" }) })] }) })] }));
}
function ThreadItemAnchorParentReplyLine({ isRoot }) {
    const t = useTheme();
    return !isRoot ? (_jsx(View, { style: [a.pl_lg, a.flex_row, a.pb_xs, { height: a.pt_lg.paddingTop }], children: _jsx(View, { style: { width: 42 }, children: _jsx(View, { style: [
                    {
                        width: REPLY_LINE_WIDTH,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        flexGrow: 1,
                        backgroundColor: t.atoms.border_contrast_low.borderColor,
                    },
                ] }) }) })) : null;
}
const ThreadItemAnchorInner = memo(function ThreadItemAnchorInner({ item, isRoot, postShadow, onPostSuccess, threadgateRecord, postSource, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const { openComposer } = useOpenComposer();
    const { currentAccount, hasSession } = useSession();
    const { gtTablet } = useBreakpoints();
    const feedFeedback = useFeedFeedback(postSource?.feedSourceInfo, hasSession);
    const formatPostStatCount = useFormatPostStatCount();
    const post = postShadow;
    const record = item.value.post.record;
    const moderation = item.moderation;
    const authorShadow = useProfileShadow(post.author);
    const { isActive: live } = useActorStatus(post.author);
    const richText = useMemo(() => new RichTextAPI({
        text: record.text,
        facets: record.facets,
    }), [record]);
    const threadRootUri = record.reply?.root?.uri || post.uri;
    const authorHref = makeProfileLink(post.author);
    const isThreadAuthor = getThreadAuthor(post, record) === currentAccount?.did;
    const likesHref = useMemo(() => {
        const urip = new AtUri(post.uri);
        return makeProfileLink(post.author, 'post', urip.rkey, 'liked-by');
    }, [post.uri, post.author]);
    const repostsHref = useMemo(() => {
        const urip = new AtUri(post.uri);
        return makeProfileLink(post.author, 'post', urip.rkey, 'reposted-by');
    }, [post.uri, post.author]);
    const quotesHref = useMemo(() => {
        const urip = new AtUri(post.uri);
        return makeProfileLink(post.author, 'post', urip.rkey, 'quotes');
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
    const onlyFollowersCanReply = !!threadgateRecord?.allow?.find(rule => rule.$type === 'app.bsky.feed.threadgate#followerRule');
    const showFollowButton = currentAccount?.did !== post.author.did && !onlyFollowersCanReply;
    const viaRepost = useMemo(() => {
        const reason = postSource?.post.reason;
        if (AppBskyFeedDefs.isReasonRepost(reason) && reason.uri && reason.cid) {
            return {
                uri: reason.uri,
                cid: reason.cid,
            };
        }
    }, [postSource]);
    const onPressReply = useCallback(() => {
        openComposer({
            replyTo: {
                uri: post.uri,
                cid: post.cid,
                text: record.text,
                author: post.author,
                embed: post.embed,
                moderation,
                langs: record.langs,
            },
            onPostSuccess: onPostSuccess,
        });
        if (postSource) {
            feedFeedback.sendInteraction({
                item: post.uri,
                event: 'app.bsky.feed.defs#interactionReply',
                feedContext: postSource.post.feedContext,
                reqId: postSource.post.reqId,
            });
        }
    }, [
        openComposer,
        post,
        record,
        onPostSuccess,
        moderation,
        postSource,
        feedFeedback,
    ]);
    const onOpenAuthor = () => {
        if (postSource) {
            feedFeedback.sendInteraction({
                item: post.uri,
                event: 'app.bsky.feed.defs#clickthroughAuthor',
                feedContext: postSource.post.feedContext,
                reqId: postSource.post.reqId,
            });
        }
    };
    const onOpenEmbed = () => {
        if (postSource) {
            feedFeedback.sendInteraction({
                item: post.uri,
                event: 'app.bsky.feed.defs#clickthroughEmbed',
                feedContext: postSource.post.feedContext,
                reqId: postSource.post.reqId,
            });
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(ThreadItemAnchorParentReplyLine, { isRoot: isRoot }), _jsxs(View, { testID: `postThreadItem-by-${post.author.handle}`, style: [
                    {
                        paddingHorizontal: OUTER_SPACE,
                    },
                    isRoot && [a.pt_lg],
                ], children: [!gtTablet && _jsx(LoggedOutCTA, { gateName: "cta_above_post_heading" }), _jsxs(View, { style: [a.flex_row, a.gap_md, a.pb_md], children: [_jsx(View, { collapsable: false, children: _jsx(PreviewableUserAvatar, { size: 42, profile: post.author, moderation: moderation.ui('avatar'), type: post.author.associated?.labeler ? 'labeler' : 'user', live: live, onBeforePress: onOpenAuthor }) }), _jsx(Link, { to: authorHref, style: [a.flex_1], label: sanitizeDisplayName(post.author.displayName || sanitizeHandle(post.author.handle), moderation.ui('displayName')), onPress: onOpenAuthor, children: _jsx(View, { style: [a.flex_1, a.align_start], children: _jsxs(ProfileHoverCard, { did: post.author.did, style: [a.w_full], children: [_jsxs(View, { style: [a.flex_row, a.align_center], children: [_jsx(Text, { emoji: true, style: [
                                                            a.flex_shrink,
                                                            a.text_lg,
                                                            a.font_bold,
                                                            a.leading_snug,
                                                        ], numberOfLines: 1, children: sanitizeDisplayName(post.author.displayName ||
                                                            sanitizeHandle(post.author.handle), moderation.ui('displayName')) }), _jsx(View, { style: [a.pl_xs], children: _jsx(VerificationCheckButton, { profile: authorShadow, size: "md" }) })] }), _jsx(Text, { style: [
                                                    a.text_md,
                                                    a.leading_snug,
                                                    t.atoms.text_contrast_medium,
                                                ], numberOfLines: 1, children: sanitizeHandle(post.author.handle, '@') })] }) }) }), showFollowButton && (_jsx(View, { collapsable: false, children: _jsx(ThreadItemAnchorFollowButton, { did: post.author.did }) }))] }), _jsxs(View, { style: [a.pb_sm], children: [_jsx(LabelsOnMyPost, { post: post, style: [a.pb_sm] }), _jsxs(ContentHider, { modui: moderation.ui('contentView'), ignoreMute: true, childContainerStyle: [a.pt_sm], children: [_jsx(PostAlerts, { modui: moderation.ui('contentView'), size: "lg", includeMute: true, style: [a.pb_sm], additionalCauses: additionalPostAlerts }), richText?.text ? (_jsx(RichText, { enableTags: true, selectable: true, value: richText, style: [a.flex_1, a.text_xl], authorHandle: post.author.handle, shouldProxyLinks: true })) : undefined, post.embed && (_jsx(View, { style: [a.py_xs], children: _jsx(Embed, { embed: post.embed, moderation: moderation, viewContext: PostEmbedViewContext.ThreadHighlighted, onOpen: onOpenEmbed }) }))] }), _jsx(ExpandedPostDetails, { post: item.value.post, isThreadAuthor: isThreadAuthor }), post.repostCount !== 0 ||
                                post.likeCount !== 0 ||
                                post.quoteCount !== 0 ||
                                post.bookmarkCount !== 0 ? (
                            // Show this section unless we're *sure* it has no engagement.
                            _jsxs(View, { style: [
                                    a.flex_row,
                                    a.flex_wrap,
                                    a.align_center,
                                    {
                                        rowGap: a.gap_sm.gap,
                                        columnGap: a.gap_lg.gap,
                                    },
                                    a.border_t,
                                    a.border_b,
                                    a.mt_md,
                                    a.py_md,
                                    t.atoms.border_contrast_low,
                                ], children: [post.repostCount != null && post.repostCount !== 0 ? (_jsx(Link, { to: repostsHref, label: _(msg `Reposts of this post`), children: _jsxs(Text, { testID: "repostCount-expanded", style: [a.text_md, t.atoms.text_contrast_medium], children: [_jsx(Text, { style: [a.text_md, a.font_bold, t.atoms.text], children: formatPostStatCount(post.repostCount) }), ' ', _jsx(Plural, { value: post.repostCount, one: "repost", other: "reposts" })] }) })) : null, post.quoteCount != null &&
                                        post.quoteCount !== 0 &&
                                        !post.viewer?.embeddingDisabled ? (_jsx(Link, { to: quotesHref, label: _(msg `Quotes of this post`), children: _jsxs(Text, { testID: "quoteCount-expanded", style: [a.text_md, t.atoms.text_contrast_medium], children: [_jsx(Text, { style: [a.text_md, a.font_bold, t.atoms.text], children: formatPostStatCount(post.quoteCount) }), ' ', _jsx(Plural, { value: post.quoteCount, one: "quote", other: "quotes" })] }) })) : null, post.likeCount != null && post.likeCount !== 0 ? (_jsx(Link, { to: likesHref, label: _(msg `Likes on this post`), children: _jsxs(Text, { testID: "likeCount-expanded", style: [a.text_md, t.atoms.text_contrast_medium], children: [_jsx(Text, { style: [a.text_md, a.font_bold, t.atoms.text], children: formatPostStatCount(post.likeCount) }), ' ', _jsx(Plural, { value: post.likeCount, one: "like", other: "likes" })] }) })) : null, post.bookmarkCount != null && post.bookmarkCount !== 0 ? (_jsxs(Text, { testID: "bookmarkCount-expanded", style: [a.text_md, t.atoms.text_contrast_medium], children: [_jsx(Text, { style: [a.text_md, a.font_bold, t.atoms.text], children: formatPostStatCount(post.bookmarkCount) }), ' ', _jsx(Plural, { value: post.bookmarkCount, one: "save", other: "saves" })] })) : null] })) : null, _jsx(View, { style: [
                                    a.pt_sm,
                                    a.pb_2xs,
                                    {
                                        marginLeft: -5,
                                    },
                                ], children: _jsx(FeedFeedbackProvider, { value: feedFeedback, children: _jsx(PostControls, { big: true, post: postShadow, record: record, richText: richText, onPressReply: onPressReply, logContext: "PostThreadItem", threadgateRecord: threadgateRecord, feedContext: postSource?.post?.feedContext, reqId: postSource?.post?.reqId, viaRepost: viaRepost }) }) })] })] })] }));
});
function ExpandedPostDetails({ post, isThreadAuthor, }) {
    const t = useTheme();
    const { _, i18n } = useLingui();
    const translate = useTranslate();
    const isRootPost = !('reply' in post.record);
    const langPrefs = useLanguagePrefs();
    const needsTranslation = useMemo(() => Boolean(langPrefs.primaryLanguage &&
        !isPostInLanguage(post, [langPrefs.primaryLanguage])), [post, langPrefs.primaryLanguage]);
    const onTranslatePress = useCallback((e) => {
        e.preventDefault();
        translate(post.record.text || '', langPrefs.primaryLanguage);
        if (bsky.dangerousIsType(post.record, AppBskyFeedPost.isRecord)) {
            logger.metric('translate', {
                sourceLanguages: post.record.langs ?? [],
                targetLanguage: langPrefs.primaryLanguage,
                textLength: post.record.text.length,
            });
        }
        return false;
    }, [translate, langPrefs, post]);
    return (_jsxs(View, { style: [a.gap_md, a.pt_md, a.align_start], children: [_jsx(BackdatedPostIndicator, { post: post }), _jsxs(View, { style: [a.flex_row, a.align_center, a.flex_wrap, a.gap_sm], children: [_jsx(Text, { style: [a.text_sm, t.atoms.text_contrast_medium], children: niceDate(i18n, post.indexedAt) }), isRootPost && (_jsx(WhoCanReply, { post: post, isThreadAuthor: isThreadAuthor })), needsTranslation && (_jsxs(_Fragment, { children: [_jsx(Text, { style: [a.text_sm, t.atoms.text_contrast_medium], children: "\u00B7" }), _jsx(InlineLinkText
                            // overridden to open an intent on android, but keep
                            // as anchor tag for accessibility
                            , { 
                                // overridden to open an intent on android, but keep
                                // as anchor tag for accessibility
                                to: getTranslatorLink(post.record.text, langPrefs.primaryLanguage), label: _(msg `Translate`), style: [a.text_sm], onPress: onTranslatePress, children: _jsx(Trans, { children: "Translate" }) })] }))] })] }));
}
function BackdatedPostIndicator({ post }) {
    const t = useTheme();
    const { _, i18n } = useLingui();
    const control = Prompt.usePromptControl();
    const indexedAt = new Date(post.indexedAt);
    const createdAt = bsky.dangerousIsType(post.record, AppBskyFeedPost.isRecord)
        ? new Date(post.record.createdAt)
        : new Date(post.indexedAt);
    // backdated if createdAt is 24 hours or more before indexedAt
    const isBackdated = indexedAt.getTime() - createdAt.getTime() > 24 * 60 * 60 * 1000;
    if (!isBackdated)
        return null;
    const orange = t.name === 'light' ? colors.warning.dark : colors.warning.light;
    return (_jsxs(_Fragment, { children: [_jsx(Button, { label: _(msg `Archived post`), accessibilityHint: _(msg `Shows information about when this post was created`), onPress: e => {
                    e.preventDefault();
                    e.stopPropagation();
                    control.open();
                }, children: ({ hovered, pressed }) => (_jsxs(View, { style: [
                        a.flex_row,
                        a.align_center,
                        a.rounded_full,
                        t.atoms.bg_contrast_25,
                        (hovered || pressed) && t.atoms.bg_contrast_50,
                        {
                            gap: 3,
                            paddingHorizontal: 6,
                            paddingVertical: 3,
                        },
                    ], children: [_jsx(CalendarClockIcon, { fill: orange, size: "sm", "aria-hidden": true }), _jsx(Text, { style: [
                                a.text_xs,
                                a.font_bold,
                                a.leading_tight,
                                t.atoms.text_contrast_medium,
                            ], children: _jsxs(Trans, { children: ["Archived from ", niceDate(i18n, createdAt)] }) })] })) }), _jsxs(Prompt.Outer, { control: control, children: [_jsx(Prompt.TitleText, { children: _jsx(Trans, { children: "Archived post" }) }), _jsx(Prompt.DescriptionText, { children: _jsxs(Trans, { children: ["This post claims to have been created on", ' ', _jsx(RNText, { style: [a.font_bold], children: niceDate(i18n, createdAt) }), ", but was first seen by Bluesky on", ' ', _jsx(RNText, { style: [a.font_bold], children: niceDate(i18n, indexedAt) }), "."] }) }), _jsx(Text, { style: [
                            a.text_md,
                            a.leading_snug,
                            t.atoms.text_contrast_high,
                            a.pb_xl,
                        ], children: _jsx(Trans, { children: "Bluesky cannot confirm the authenticity of the claimed date." }) }), _jsx(Prompt.Actions, { children: _jsx(Prompt.Action, { cta: _(msg `Okay`), onPress: () => { } }) })] })] }));
}
function getThreadAuthor(post, record) {
    if (!record.reply) {
        return post.author.did;
    }
    try {
        return new AtUri(record.reply.root.uri).host;
    }
    catch {
        return '';
    }
}
export function ThreadItemAnchorSkeleton() {
    return (_jsxs(View, { style: [a.p_lg, a.gap_md], children: [_jsxs(Skele.Row, { style: [a.align_center, a.gap_md], children: [_jsx(Skele.Circle, { size: 42 }), _jsxs(Skele.Col, { children: [_jsx(Skele.Text, { style: [a.text_lg, { width: '20%' }] }), _jsx(Skele.Text, { blend: true, style: [a.text_md, { width: '40%' }] })] })] }), _jsxs(View, { children: [_jsx(Skele.Text, { style: [a.text_xl, { width: '100%' }] }), _jsx(Skele.Text, { style: [a.text_xl, { width: '60%' }] })] }), _jsx(Skele.Text, { style: [a.text_sm, { width: '50%' }] }), _jsxs(Skele.Row, { style: [a.justify_between], children: [_jsx(Skele.Pill, { blend: true, size: 24 }), _jsx(Skele.Pill, { blend: true, size: 24 }), _jsx(Skele.Pill, { blend: true, size: 24 }), _jsx(Skele.Circle, { blend: true, size: 24 }), _jsx(Skele.Circle, { blend: true, size: 24 })] })] }));
}
//# sourceMappingURL=ThreadItemAnchor.js.map