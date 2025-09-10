import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { memo, useMemo } from 'react';
import { Platform, } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { AppBskyFeedPost, AtUri, } from '@atproto/api';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useNavigation } from '@react-navigation/native';
import { DISCOVER_DEBUG_DIDS } from '#/lib/constants';
import { useOpenLink } from '#/lib/hooks/useOpenLink';
import { useTranslate } from '#/lib/hooks/useTranslate';
import { getCurrentRoute } from '#/lib/routes/helpers';
import { makeProfileLink } from '#/lib/routes/links';
import {} from '#/lib/routes/types';
import { logEvent, useGate } from '#/lib/statsig/statsig';
import { richTextToString } from '#/lib/strings/rich-text-helpers';
import { toShareUrl } from '#/lib/strings/url-helpers';
import { logger } from '#/logger';
import {} from '#/state/cache/post-shadow';
import { useProfileShadow } from '#/state/cache/profile-shadow';
import { useFeedFeedbackContext } from '#/state/feed-feedback';
import { useLanguagePrefs } from '#/state/preferences';
import { useHiddenPosts, useHiddenPostsApi } from '#/state/preferences';
import { usePinnedPostMutation } from '#/state/queries/pinned-post';
import { usePostDeleteMutation, useThreadMuteMutationQueue, } from '#/state/queries/post';
import { useToggleQuoteDetachmentMutation } from '#/state/queries/postgate';
import { getMaybeDetachedQuoteEmbed } from '#/state/queries/postgate/util';
import { useProfileBlockMutationQueue, useProfileMuteMutationQueue, } from '#/state/queries/profile';
import { useToggleReplyVisibilityMutation } from '#/state/queries/threadgate';
import { useRequireAuth, useSession } from '#/state/session';
import { useMergedThreadgateHiddenReplies } from '#/state/threadgate-hidden-replies';
import * as Toast from '#/view/com/util/Toast';
import { useDialogControl } from '#/components/Dialog';
import { useGlobalDialogsControlContext } from '#/components/dialogs/Context';
import { PostInteractionSettingsDialog, usePrefetchPostInteractionSettings, } from '#/components/dialogs/PostInteractionSettingsDialog';
import { Atom_Stroke2_Corner0_Rounded as AtomIcon } from '#/components/icons/Atom';
import { BubbleQuestion_Stroke2_Corner0_Rounded as Translate } from '#/components/icons/Bubble';
import { Clipboard_Stroke2_Corner2_Rounded as ClipboardIcon } from '#/components/icons/Clipboard';
import { EmojiSad_Stroke2_Corner0_Rounded as EmojiSad, EmojiSmile_Stroke2_Corner0_Rounded as EmojiSmile, } from '#/components/icons/Emoji';
import { Eye_Stroke2_Corner0_Rounded as Eye } from '#/components/icons/Eye';
import { EyeSlash_Stroke2_Corner0_Rounded as EyeSlash } from '#/components/icons/EyeSlash';
import { Filter_Stroke2_Corner0_Rounded as Filter } from '#/components/icons/Filter';
import { Mute_Stroke2_Corner0_Rounded as MuteIcon } from '#/components/icons/Mute';
import { Mute_Stroke2_Corner0_Rounded as Mute } from '#/components/icons/Mute';
import { PersonX_Stroke2_Corner0_Rounded as PersonX } from '#/components/icons/Person';
import { Pin_Stroke2_Corner0_Rounded as PinIcon } from '#/components/icons/Pin';
import { SettingsGear2_Stroke2_Corner0_Rounded as Gear } from '#/components/icons/SettingsGear2';
import { SpeakerVolumeFull_Stroke2_Corner0_Rounded as UnmuteIcon } from '#/components/icons/Speaker';
import { SpeakerVolumeFull_Stroke2_Corner0_Rounded as Unmute } from '#/components/icons/Speaker';
import { Trash_Stroke2_Corner0_Rounded as Trash } from '#/components/icons/Trash';
import { Warning_Stroke2_Corner0_Rounded as Warning } from '#/components/icons/Warning';
import { Loader } from '#/components/Loader';
import * as Menu from '#/components/Menu';
import { ReportDialog, useReportDialogControl, } from '#/components/moderation/ReportDialog';
import * as Prompt from '#/components/Prompt';
import { IS_INTERNAL } from '#/env';
import * as bsky from '#/types/bsky';
let PostMenuItems = ({ post, postFeedContext, postReqId, record, richText, threadgateRecord, onShowLess, }) => {
    const { hasSession, currentAccount } = useSession();
    const { _ } = useLingui();
    const langPrefs = useLanguagePrefs();
    const { mutateAsync: deletePostMutate } = usePostDeleteMutation();
    const { mutateAsync: pinPostMutate, isPending: isPinPending } = usePinnedPostMutation();
    const requireSignIn = useRequireAuth();
    const hiddenPosts = useHiddenPosts();
    const { hidePost } = useHiddenPostsApi();
    const feedFeedback = useFeedFeedbackContext();
    const openLink = useOpenLink();
    const translate = useTranslate();
    const navigation = useNavigation();
    const { mutedWordsDialogControl } = useGlobalDialogsControlContext();
    const blockPromptControl = useDialogControl();
    const reportDialogControl = useReportDialogControl();
    const deletePromptControl = useDialogControl();
    const hidePromptControl = useDialogControl();
    const postInteractionSettingsDialogControl = useDialogControl();
    const quotePostDetachConfirmControl = useDialogControl();
    const hideReplyConfirmControl = useDialogControl();
    const { mutateAsync: toggleReplyVisibility } = useToggleReplyVisibilityMutation();
    const postUri = post.uri;
    const postCid = post.cid;
    const postAuthor = useProfileShadow(post.author);
    const quoteEmbed = useMemo(() => {
        if (!currentAccount || !post.embed)
            return;
        return getMaybeDetachedQuoteEmbed({
            viewerDid: currentAccount.did,
            post,
        });
    }, [post, currentAccount]);
    const rootUri = record.reply?.root?.uri || postUri;
    const isReply = Boolean(record.reply);
    const [isThreadMuted, muteThread, unmuteThread] = useThreadMuteMutationQueue(post, rootUri);
    const isPostHidden = hiddenPosts && hiddenPosts.includes(postUri);
    const isAuthor = postAuthor.did === currentAccount?.did;
    const isRootPostAuthor = new AtUri(rootUri).host === currentAccount?.did;
    const threadgateHiddenReplies = useMergedThreadgateHiddenReplies({
        threadgateRecord,
    });
    const isReplyHiddenByThreadgate = threadgateHiddenReplies.has(postUri);
    const isPinned = post.viewer?.pinned;
    const { mutateAsync: toggleQuoteDetachment, isPending: isDetachPending } = useToggleQuoteDetachmentMutation();
    const [queueBlock] = useProfileBlockMutationQueue(postAuthor);
    const [queueMute, queueUnmute] = useProfileMuteMutationQueue(postAuthor);
    const prefetchPostInteractionSettings = usePrefetchPostInteractionSettings({
        postUri: post.uri,
        rootPostUri: rootUri,
    });
    const href = useMemo(() => {
        const urip = new AtUri(postUri);
        return makeProfileLink(postAuthor, 'post', urip.rkey);
    }, [postUri, postAuthor]);
    const onDeletePost = () => {
        deletePostMutate({ uri: postUri }).then(() => {
            Toast.show(_(msg({ message: 'Post deleted', context: 'toast' })));
            const route = getCurrentRoute(navigation.getState());
            if (route.name === 'PostThread') {
                const params = route.params;
                if (currentAccount &&
                    isAuthor &&
                    (params.name === currentAccount.handle ||
                        params.name === currentAccount.did)) {
                    const currentHref = makeProfileLink(postAuthor, 'post', params.rkey);
                    if (currentHref === href && navigation.canGoBack()) {
                        navigation.goBack();
                    }
                }
            }
        }, e => {
            logger.error('Failed to delete post', { message: e });
            Toast.show(_(msg `Failed to delete post, please try again`), 'xmark');
        });
    };
    const onToggleThreadMute = () => {
        try {
            if (isThreadMuted) {
                unmuteThread();
                Toast.show(_(msg `You will now receive notifications for this thread`));
            }
            else {
                muteThread();
                Toast.show(_(msg `You will no longer receive notifications for this thread`));
            }
        }
        catch (e) {
            if (e?.name !== 'AbortError') {
                logger.error('Failed to toggle thread mute', { message: e });
                Toast.show(_(msg `Failed to toggle thread mute, please try again`), 'xmark');
            }
        }
    };
    const onCopyPostText = () => {
        const str = richTextToString(richText, true);
        Clipboard.setStringAsync(str);
        Toast.show(_(msg `Copied to clipboard`), 'clipboard-check');
    };
    const onPressTranslate = () => {
        translate(record.text, langPrefs.primaryLanguage);
        if (bsky.dangerousIsType(post.record, AppBskyFeedPost.isRecord)) {
            logger.metric('translate', {
                sourceLanguages: post.record.langs ?? [],
                targetLanguage: langPrefs.primaryLanguage,
                textLength: post.record.text.length,
            }, { statsig: false });
        }
    };
    const onHidePost = () => {
        hidePost({ uri: postUri });
    };
    const hideInPWI = !!postAuthor.labels?.find(label => label.val === '!no-unauthenticated');
    const onPressShowMore = () => {
        feedFeedback.sendInteraction({
            event: 'app.bsky.feed.defs#requestMore',
            item: postUri,
            feedContext: postFeedContext,
            reqId: postReqId,
        });
        Toast.show(_(msg({ message: 'Feedback sent to feed operator', context: 'toast' })));
    };
    const onPressShowLess = () => {
        feedFeedback.sendInteraction({
            event: 'app.bsky.feed.defs#requestLess',
            item: postUri,
            feedContext: postFeedContext,
            reqId: postReqId,
        });
        if (onShowLess) {
            onShowLess({
                item: postUri,
                feedContext: postFeedContext,
            });
        }
        else {
            Toast.show(_(msg({ message: 'Feedback sent to feed operator', context: 'toast' })));
        }
    };
    const onToggleQuotePostAttachment = async () => {
        if (!quoteEmbed)
            return;
        const action = quoteEmbed.isDetached ? 'reattach' : 'detach';
        const isDetach = action === 'detach';
        try {
            await toggleQuoteDetachment({
                post,
                quoteUri: quoteEmbed.uri,
                action: quoteEmbed.isDetached ? 'reattach' : 'detach',
            });
            Toast.show(isDetach
                ? _(msg `Quote post was successfully detached`)
                : _(msg `Quote post was re-attached`));
        }
        catch (e) {
            Toast.show(_(msg({ message: 'Updating quote attachment failed', context: 'toast' })));
            logger.error(`Failed to ${action} quote`, { safeMessage: e.message });
        }
    };
    const canHidePostForMe = !isAuthor && !isPostHidden;
    const canHideReplyForEveryone = !isAuthor && isRootPostAuthor && !isPostHidden && isReply;
    const canDetachQuote = quoteEmbed && quoteEmbed.isOwnedByViewer;
    const onToggleReplyVisibility = async () => {
        // TODO no threadgate?
        if (!canHideReplyForEveryone)
            return;
        const action = isReplyHiddenByThreadgate ? 'show' : 'hide';
        const isHide = action === 'hide';
        try {
            await toggleReplyVisibility({
                postUri: rootUri,
                replyUri: postUri,
                action,
            });
            Toast.show(isHide
                ? _(msg `Reply was successfully hidden`)
                : _(msg({ message: 'Reply visibility updated', context: 'toast' })));
        }
        catch (e) {
            Toast.show(_(msg({ message: 'Updating reply visibility failed', context: 'toast' })));
            logger.error(`Failed to ${action} reply`, { safeMessage: e.message });
        }
    };
    const onPressPin = () => {
        logEvent(isPinned ? 'post:unpin' : 'post:pin', {});
        pinPostMutate({
            postUri,
            postCid,
            action: isPinned ? 'unpin' : 'pin',
        });
    };
    const onBlockAuthor = async () => {
        try {
            await queueBlock();
            Toast.show(_(msg({ message: 'Account blocked', context: 'toast' })));
        }
        catch (e) {
            if (e?.name !== 'AbortError') {
                logger.error('Failed to block account', { message: e });
                Toast.show(_(msg `There was an issue! ${e.toString()}`), 'xmark');
            }
        }
    };
    const onMuteAuthor = async () => {
        if (postAuthor.viewer?.muted) {
            try {
                await queueUnmute();
                Toast.show(_(msg({ message: 'Account unmuted', context: 'toast' })));
            }
            catch (e) {
                if (e?.name !== 'AbortError') {
                    logger.error('Failed to unmute account', { message: e });
                    Toast.show(_(msg `There was an issue! ${e.toString()}`), 'xmark');
                }
            }
        }
        else {
            try {
                await queueMute();
                Toast.show(_(msg({ message: 'Account muted', context: 'toast' })));
            }
            catch (e) {
                if (e?.name !== 'AbortError') {
                    logger.error('Failed to mute account', { message: e });
                    Toast.show(_(msg `There was an issue! ${e.toString()}`), 'xmark');
                }
            }
        }
    };
    const onReportMisclassification = () => {
        const url = `https://docs.google.com/forms/d/e/1FAIpQLSd0QPqhNFksDQf1YyOos7r1ofCLvmrKAH1lU042TaS3GAZaWQ/viewform?entry.1756031717=${toShareUrl(href)}`;
        openLink(url);
    };
    const onSignIn = () => requireSignIn(() => { });
    const gate = useGate();
    const isDiscoverDebugUser = IS_INTERNAL ||
        DISCOVER_DEBUG_DIDS[currentAccount?.did || ''] ||
        gate('debug_show_feedcontext');
    return (_jsxs(_Fragment, { children: [_jsxs(Menu.Outer, { children: [isAuthor && (_jsxs(_Fragment, { children: [_jsx(Menu.Group, { children: _jsxs(Menu.Item, { testID: "pinPostBtn", label: isPinned
                                        ? _(msg `Unpin from profile`)
                                        : _(msg `Pin to your profile`), disabled: isPinPending, onPress: onPressPin, children: [_jsx(Menu.ItemText, { children: isPinned
                                                ? _(msg `Unpin from profile`)
                                                : _(msg `Pin to your profile`) }), _jsx(Menu.ItemIcon, { icon: isPinPending ? Loader : PinIcon, position: "right" })] }) }), _jsx(Menu.Divider, {})] })), _jsx(Menu.Group, { children: !hideInPWI || hasSession ? (_jsxs(_Fragment, { children: [_jsxs(Menu.Item, { testID: "postDropdownTranslateBtn", label: _(msg `Translate`), onPress: onPressTranslate, children: [_jsx(Menu.ItemText, { children: _(msg `Translate`) }), _jsx(Menu.ItemIcon, { icon: Translate, position: "right" })] }), _jsxs(Menu.Item, { testID: "postDropdownCopyTextBtn", label: _(msg `Copy post text`), onPress: onCopyPostText, children: [_jsx(Menu.ItemText, { children: _(msg `Copy post text`) }), _jsx(Menu.ItemIcon, { icon: ClipboardIcon, position: "right" })] })] })) : (_jsxs(Menu.Item, { testID: "postDropdownSignInBtn", label: _(msg `Sign in to view post`), onPress: onSignIn, children: [_jsx(Menu.ItemText, { children: _(msg `Sign in to view post`) }), _jsx(Menu.ItemIcon, { icon: Eye, position: "right" })] })) }), hasSession && feedFeedback.enabled && (_jsxs(_Fragment, { children: [_jsx(Menu.Divider, {}), _jsxs(Menu.Group, { children: [_jsxs(Menu.Item, { testID: "postDropdownShowMoreBtn", label: _(msg `Show more like this`), onPress: onPressShowMore, children: [_jsx(Menu.ItemText, { children: _(msg `Show more like this`) }), _jsx(Menu.ItemIcon, { icon: EmojiSmile, position: "right" })] }), _jsxs(Menu.Item, { testID: "postDropdownShowLessBtn", label: _(msg `Show less like this`), onPress: onPressShowLess, children: [_jsx(Menu.ItemText, { children: _(msg `Show less like this`) }), _jsx(Menu.ItemIcon, { icon: EmojiSad, position: "right" })] })] })] })), isDiscoverDebugUser && (_jsxs(_Fragment, { children: [_jsx(Menu.Divider, {}), _jsxs(Menu.Item, { testID: "postDropdownReportMisclassificationBtn", label: _(msg `Assign topic for algo`), onPress: onReportMisclassification, children: [_jsx(Menu.ItemText, { children: _(msg `Assign topic for algo`) }), _jsx(Menu.ItemIcon, { icon: AtomIcon, position: "right" })] })] })), hasSession && (_jsxs(_Fragment, { children: [_jsx(Menu.Divider, {}), _jsxs(Menu.Group, { children: [_jsxs(Menu.Item, { testID: "postDropdownMuteThreadBtn", label: isThreadMuted ? _(msg `Unmute thread`) : _(msg `Mute thread`), onPress: onToggleThreadMute, children: [_jsx(Menu.ItemText, { children: isThreadMuted ? _(msg `Unmute thread`) : _(msg `Mute thread`) }), _jsx(Menu.ItemIcon, { icon: isThreadMuted ? Unmute : Mute, position: "right" })] }), _jsxs(Menu.Item, { testID: "postDropdownMuteWordsBtn", label: _(msg `Mute words & tags`), onPress: () => mutedWordsDialogControl.open(), children: [_jsx(Menu.ItemText, { children: _(msg `Mute words & tags`) }), _jsx(Menu.ItemIcon, { icon: Filter, position: "right" })] })] })] })), hasSession &&
                        (canHideReplyForEveryone || canDetachQuote || canHidePostForMe) && (_jsxs(_Fragment, { children: [_jsx(Menu.Divider, {}), _jsxs(Menu.Group, { children: [canHidePostForMe && (_jsxs(Menu.Item, { testID: "postDropdownHideBtn", label: isReply
                                            ? _(msg `Hide reply for me`)
                                            : _(msg `Hide post for me`), onPress: () => hidePromptControl.open(), children: [_jsx(Menu.ItemText, { children: isReply
                                                    ? _(msg `Hide reply for me`)
                                                    : _(msg `Hide post for me`) }), _jsx(Menu.ItemIcon, { icon: EyeSlash, position: "right" })] })), canHideReplyForEveryone && (_jsxs(Menu.Item, { testID: "postDropdownHideBtn", label: isReplyHiddenByThreadgate
                                            ? _(msg `Show reply for everyone`)
                                            : _(msg `Hide reply for everyone`), onPress: isReplyHiddenByThreadgate
                                            ? onToggleReplyVisibility
                                            : () => hideReplyConfirmControl.open(), children: [_jsx(Menu.ItemText, { children: isReplyHiddenByThreadgate
                                                    ? _(msg `Show reply for everyone`)
                                                    : _(msg `Hide reply for everyone`) }), _jsx(Menu.ItemIcon, { icon: isReplyHiddenByThreadgate ? Eye : EyeSlash, position: "right" })] })), canDetachQuote && (_jsxs(Menu.Item, { disabled: isDetachPending, testID: "postDropdownHideBtn", label: quoteEmbed.isDetached
                                            ? _(msg `Re-attach quote`)
                                            : _(msg `Detach quote`), onPress: quoteEmbed.isDetached
                                            ? onToggleQuotePostAttachment
                                            : () => quotePostDetachConfirmControl.open(), children: [_jsx(Menu.ItemText, { children: quoteEmbed.isDetached
                                                    ? _(msg `Re-attach quote`)
                                                    : _(msg `Detach quote`) }), _jsx(Menu.ItemIcon, { icon: isDetachPending
                                                    ? Loader
                                                    : quoteEmbed.isDetached
                                                        ? Eye
                                                        : EyeSlash, position: "right" })] }))] })] })), hasSession && (_jsxs(_Fragment, { children: [_jsx(Menu.Divider, {}), _jsxs(Menu.Group, { children: [!isAuthor && (_jsxs(_Fragment, { children: [_jsxs(Menu.Item, { testID: "postDropdownMuteBtn", label: postAuthor.viewer?.muted
                                                    ? _(msg `Unmute account`)
                                                    : _(msg `Mute account`), onPress: onMuteAuthor, children: [_jsx(Menu.ItemText, { children: postAuthor.viewer?.muted
                                                            ? _(msg `Unmute account`)
                                                            : _(msg `Mute account`) }), _jsx(Menu.ItemIcon, { icon: postAuthor.viewer?.muted ? UnmuteIcon : MuteIcon, position: "right" })] }), !postAuthor.viewer?.blocking && (_jsxs(Menu.Item, { testID: "postDropdownBlockBtn", label: _(msg `Block account`), onPress: () => blockPromptControl.open(), children: [_jsx(Menu.ItemText, { children: _(msg `Block account`) }), _jsx(Menu.ItemIcon, { icon: PersonX, position: "right" })] })), _jsxs(Menu.Item, { testID: "postDropdownReportBtn", label: _(msg `Report post`), onPress: () => reportDialogControl.open(), children: [_jsx(Menu.ItemText, { children: _(msg `Report post`) }), _jsx(Menu.ItemIcon, { icon: Warning, position: "right" })] })] })), isAuthor && (_jsxs(_Fragment, { children: [_jsxs(Menu.Item, { testID: "postDropdownEditPostInteractions", label: _(msg `Edit interaction settings`), onPress: () => postInteractionSettingsDialogControl.open(), ...(isAuthor
                                                    ? Platform.select({
                                                        web: {
                                                            onHoverIn: prefetchPostInteractionSettings,
                                                        },
                                                        native: {
                                                            onPressIn: prefetchPostInteractionSettings,
                                                        },
                                                    })
                                                    : {}), children: [_jsx(Menu.ItemText, { children: _(msg `Edit interaction settings`) }), _jsx(Menu.ItemIcon, { icon: Gear, position: "right" })] }), _jsxs(Menu.Item, { testID: "postDropdownDeleteBtn", label: _(msg `Delete post`), onPress: () => deletePromptControl.open(), children: [_jsx(Menu.ItemText, { children: _(msg `Delete post`) }), _jsx(Menu.ItemIcon, { icon: Trash, position: "right" })] })] }))] })] }))] }), _jsx(Prompt.Basic, { control: deletePromptControl, title: _(msg `Delete this post?`), description: _(msg `If you remove this post, you won't be able to recover it.`), onConfirm: onDeletePost, confirmButtonCta: _(msg `Delete`), confirmButtonColor: "negative" }), _jsx(Prompt.Basic, { control: hidePromptControl, title: isReply ? _(msg `Hide this reply?`) : _(msg `Hide this post?`), description: _(msg `This post will be hidden from feeds and threads. This cannot be undone.`), onConfirm: onHidePost, confirmButtonCta: _(msg `Hide`) }), _jsx(ReportDialog, { control: reportDialogControl, subject: {
                    ...post,
                    $type: 'app.bsky.feed.defs#postView',
                } }), _jsx(PostInteractionSettingsDialog, { control: postInteractionSettingsDialogControl, postUri: post.uri, rootPostUri: rootUri, initialThreadgateView: post.threadgate }), _jsx(Prompt.Basic, { control: quotePostDetachConfirmControl, title: _(msg `Detach quote post?`), description: _(msg `This will remove your post from this quote post for all users, and replace it with a placeholder.`), onConfirm: onToggleQuotePostAttachment, confirmButtonCta: _(msg `Yes, detach`) }), _jsx(Prompt.Basic, { control: hideReplyConfirmControl, title: _(msg `Hide this reply?`), description: _(msg `This reply will be sorted into a hidden section at the bottom of your thread and will mute notifications for subsequent replies - both for yourself and others.`), onConfirm: onToggleReplyVisibility, confirmButtonCta: _(msg `Yes, hide`) }), _jsx(Prompt.Basic, { control: blockPromptControl, title: _(msg `Block Account?`), description: _(msg `Blocked accounts cannot reply in your threads, mention you, or otherwise interact with you.`), onConfirm: onBlockAuthor, confirmButtonCta: _(msg `Block`), confirmButtonColor: "negative" })] }));
};
PostMenuItems = memo(PostMenuItems);
export { PostMenuItems };
//# sourceMappingURL=PostMenuItems.js.map