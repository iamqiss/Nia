import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useState } from 'react';
import { View } from 'react-native';
import {} from '@atproto/api';
import { msg, plural } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { CountWheel } from '#/lib/custom-animations/CountWheel';
import { AnimatedLikeIcon } from '#/lib/custom-animations/LikeIcon';
import { useHaptics } from '#/lib/haptics';
import { useOpenComposer } from '#/lib/hooks/useOpenComposer';
import {} from '#/state/cache/types';
import { useFeedFeedbackContext } from '#/state/feed-feedback';
import { usePostLikeMutationQueue, usePostRepostMutationQueue, } from '#/state/queries/post';
import { useRequireAuth } from '#/state/session';
import { ProgressGuideAction, useProgressGuideControls, } from '#/state/shell/progress-guide';
import * as Toast from '#/view/com/util/Toast';
import { atoms as a, flatten, useBreakpoints } from '#/alf';
import { Reply as Bubble } from '#/components/icons/Reply';
import { useFormatPostStatCount } from '#/components/PostControls/util';
import { BookmarkButton } from './BookmarkButton';
import { PostControlButton, PostControlButtonIcon, PostControlButtonText, } from './PostControlButton';
import { PostMenuButton } from './PostMenu';
import { RepostButton } from './RepostButton';
import { ShareMenuButton } from './ShareMenu';
let PostControls = ({ big, post, record, richText, feedContext, reqId, style, onPressReply, onPostReply, logContext, threadgateRecord, onShowLess, viaRepost, variant, }) => {
    const { _ } = useLingui();
    const { openComposer } = useOpenComposer();
    const { feedDescriptor } = useFeedFeedbackContext();
    const [queueLike, queueUnlike] = usePostLikeMutationQueue(post, viaRepost, feedDescriptor, logContext);
    const [queueRepost, queueUnrepost] = usePostRepostMutationQueue(post, viaRepost, feedDescriptor, logContext);
    const requireAuth = useRequireAuth();
    const { sendInteraction } = useFeedFeedbackContext();
    const { captureAction } = useProgressGuideControls();
    const playHaptic = useHaptics();
    const isBlocked = Boolean(post.author.viewer?.blocking ||
        post.author.viewer?.blockedBy ||
        post.author.viewer?.blockingByList);
    const replyDisabled = post.viewer?.replyDisabled;
    const { gtPhone } = useBreakpoints();
    const formatPostStatCount = useFormatPostStatCount();
    const [hasLikeIconBeenToggled, setHasLikeIconBeenToggled] = useState(false);
    const onPressToggleLike = async () => {
        if (isBlocked) {
            Toast.show(_(msg `Cannot interact with a blocked user`), 'exclamation-circle');
            return;
        }
        try {
            setHasLikeIconBeenToggled(true);
            if (!post.viewer?.like) {
                playHaptic('Light');
                sendInteraction({
                    item: post.uri,
                    event: 'app.bsky.feed.defs#interactionLike',
                    feedContext,
                    reqId,
                });
                captureAction(ProgressGuideAction.Like);
                await queueLike();
            }
            else {
                await queueUnlike();
            }
        }
        catch (e) {
            if (e?.name !== 'AbortError') {
                throw e;
            }
        }
    };
    const onRepost = async () => {
        if (isBlocked) {
            Toast.show(_(msg `Cannot interact with a blocked user`), 'exclamation-circle');
            return;
        }
        try {
            if (!post.viewer?.repost) {
                sendInteraction({
                    item: post.uri,
                    event: 'app.bsky.feed.defs#interactionRepost',
                    feedContext,
                    reqId,
                });
                await queueRepost();
            }
            else {
                await queueUnrepost();
            }
        }
        catch (e) {
            if (e?.name !== 'AbortError') {
                throw e;
            }
        }
    };
    const onQuote = () => {
        if (isBlocked) {
            Toast.show(_(msg `Cannot interact with a blocked user`), 'exclamation-circle');
            return;
        }
        sendInteraction({
            item: post.uri,
            event: 'app.bsky.feed.defs#interactionQuote',
            feedContext,
            reqId,
        });
        openComposer({
            quote: post,
            onPost: onPostReply,
        });
    };
    const onShare = () => {
        sendInteraction({
            item: post.uri,
            event: 'app.bsky.feed.defs#interactionShare',
            feedContext,
            reqId,
        });
    };
    const secondaryControlSpacingStyles = flatten([
        { gap: 0 }, // default, we want `gap` to be defined on the resulting object
        variant !== 'compact' && a.gap_xs,
        (big || gtPhone) && a.gap_sm,
    ]);
    return (_jsxs(View, { style: [
            a.flex_row,
            a.justify_between,
            a.align_center,
            !big && a.pt_2xs,
            a.gap_md,
            style,
        ], children: [_jsxs(View, { style: [a.flex_row, a.flex_1, { maxWidth: 320 }], children: [_jsx(View, { style: [
                            a.flex_1,
                            a.align_start,
                            { marginLeft: big ? -2 : -6 },
                            replyDisabled ? { opacity: 0.5 } : undefined,
                        ], children: _jsxs(PostControlButton, { testID: "replyBtn", onPress: !replyDisabled
                                ? () => requireAuth(() => onPressReply())
                                : undefined, label: _(msg({
                                message: `Reply (${plural(post.replyCount || 0, {
                                    one: '# reply',
                                    other: '# replies',
                                })})`,
                                comment: 'Accessibility label for the reply button, verb form followed by number of replies and noun form',
                            })), big: big, children: [_jsx(PostControlButtonIcon, { icon: Bubble }), typeof post.replyCount !== 'undefined' && post.replyCount > 0 && (_jsx(PostControlButtonText, { children: formatPostStatCount(post.replyCount) }))] }) }), _jsx(View, { style: [a.flex_1, a.align_start], children: _jsx(RepostButton, { isReposted: !!post.viewer?.repost, repostCount: (post.repostCount ?? 0) + (post.quoteCount ?? 0), onRepost: onRepost, onQuote: onQuote, big: big, embeddingDisabled: Boolean(post.viewer?.embeddingDisabled) }) }), _jsx(View, { style: [a.flex_1, a.align_start], children: _jsxs(PostControlButton, { testID: "likeBtn", big: big, onPress: () => requireAuth(() => onPressToggleLike()), label: post.viewer?.like
                                ? _(msg({
                                    message: `Unlike (${plural(post.likeCount || 0, {
                                        one: '# like',
                                        other: '# likes',
                                    })})`,
                                    comment: 'Accessibility label for the like button when the post has been liked, verb followed by number of likes and noun',
                                }))
                                : _(msg({
                                    message: `Like (${plural(post.likeCount || 0, {
                                        one: '# like',
                                        other: '# likes',
                                    })})`,
                                    comment: 'Accessibility label for the like button when the post has not been liked, verb form followed by number of likes and noun form',
                                })), children: [_jsx(AnimatedLikeIcon, { isLiked: Boolean(post.viewer?.like), big: big, hasBeenToggled: hasLikeIconBeenToggled }), _jsx(CountWheel, { likeCount: post.likeCount ?? 0, big: big, isLiked: Boolean(post.viewer?.like), hasBeenToggled: hasLikeIconBeenToggled })] }) }), _jsx(View, {})] }), _jsxs(View, { style: [a.flex_row, a.justify_end, secondaryControlSpacingStyles], children: [_jsx(BookmarkButton, { post: post, big: big, logContext: logContext, hitSlop: {
                            right: secondaryControlSpacingStyles.gap / 2,
                        } }), _jsx(ShareMenuButton, { testID: "postShareBtn", post: post, big: big, record: record, richText: richText, timestamp: post.indexedAt, threadgateRecord: threadgateRecord, onShare: onShare, hitSlop: {
                            left: secondaryControlSpacingStyles.gap / 2,
                            right: secondaryControlSpacingStyles.gap / 2,
                        } }), _jsx(PostMenuButton, { testID: "postDropdownBtn", post: post, postFeedContext: feedContext, postReqId: reqId, big: big, record: record, richText: richText, timestamp: post.indexedAt, threadgateRecord: threadgateRecord, onShowLess: onShowLess, hitSlop: {
                            left: secondaryControlSpacingStyles.gap / 2,
                        } })] })] }));
};
PostControls = memo(PostControls);
export { PostControls };
//# sourceMappingURL=index.js.map