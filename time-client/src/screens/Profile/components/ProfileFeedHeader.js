import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { AtUri } from '@atproto/api';
import { msg, Plural, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useHaptics } from '#/lib/haptics';
import { makeProfileLink } from '#/lib/routes/links';
import { makeCustomFeedLink } from '#/lib/routes/links';
import { shareUrl } from '#/lib/sharing';
import { sanitizeHandle } from '#/lib/strings/handles';
import { toShareUrl } from '#/lib/strings/url-helpers';
import { logger } from '#/logger';
import { isWeb } from '#/platform/detection';
import {} from '#/state/queries/feed';
import { useLikeMutation, useUnlikeMutation } from '#/state/queries/like';
import { useAddSavedFeedsMutation, usePreferencesQuery, useRemoveFeedMutation, useUpdateSavedFeedsMutation, } from '#/state/queries/preferences';
import { useSession } from '#/state/session';
import { formatCount } from '#/view/com/util/numeric/format';
import * as Toast from '#/view/com/util/Toast';
import { UserAvatar } from '#/view/com/util/UserAvatar';
import { atoms as a, useBreakpoints, useTheme, web } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { Divider } from '#/components/Divider';
import { useRichText } from '#/components/hooks/useRichText';
import { ArrowOutOfBoxModified_Stroke2_Corner2_Rounded as Share } from '#/components/icons/ArrowOutOfBox';
import { CircleInfo_Stroke2_Corner0_Rounded as CircleInfo } from '#/components/icons/CircleInfo';
import { DotGrid_Stroke2_Corner0_Rounded as Ellipsis } from '#/components/icons/DotGrid';
import { Heart2_Filled_Stroke2_Corner0_Rounded as HeartFilled, Heart2_Stroke2_Corner0_Rounded as Heart, } from '#/components/icons/Heart2';
import { Pin_Filled_Corner0_Rounded as PinFilled, Pin_Stroke2_Corner0_Rounded as Pin, } from '#/components/icons/Pin';
import { PlusLarge_Stroke2_Corner0_Rounded as Plus } from '#/components/icons/Plus';
import { TimesLarge_Stroke2_Corner0_Rounded as X } from '#/components/icons/Times';
import { Trash_Stroke2_Corner0_Rounded as Trash } from '#/components/icons/Trash';
import * as Layout from '#/components/Layout';
import { InlineLinkText } from '#/components/Link';
import * as Menu from '#/components/Menu';
import { ReportDialog, useReportDialogControl, } from '#/components/moderation/ReportDialog';
import { RichText } from '#/components/RichText';
import { Text } from '#/components/Typography';
export function ProfileFeedHeaderSkeleton() {
    const t = useTheme();
    return (_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, { children: _jsx(View, { style: [a.w_full, a.rounded_sm, t.atoms.bg_contrast_25, { height: 40 }] }) }), _jsx(Layout.Header.Slot, { children: _jsx(View, { style: [
                        a.justify_center,
                        a.align_center,
                        a.rounded_full,
                        t.atoms.bg_contrast_25,
                        {
                            height: 34,
                            width: 34,
                        },
                    ], children: _jsx(Pin, { size: "lg", fill: t.atoms.text_contrast_low.color }) }) })] }));
}
export function ProfileFeedHeader({ info }) {
    const t = useTheme();
    const { _, i18n } = useLingui();
    const { hasSession } = useSession();
    const { gtMobile } = useBreakpoints();
    const infoControl = Dialog.useDialogControl();
    const playHaptic = useHaptics();
    const { data: preferences } = usePreferencesQuery();
    const [likeUri, setLikeUri] = React.useState(info.likeUri || '');
    const likeCount = (info.likeCount || 0) +
        (likeUri && !info.likeUri ? 1 : !likeUri && info.likeUri ? -1 : 0);
    const { mutateAsync: addSavedFeeds, isPending: isAddSavedFeedPending } = useAddSavedFeedsMutation();
    const { mutateAsync: removeFeed, isPending: isRemovePending } = useRemoveFeedMutation();
    const { mutateAsync: updateSavedFeeds, isPending: isUpdateFeedPending } = useUpdateSavedFeedsMutation();
    const isFeedStateChangePending = isAddSavedFeedPending || isRemovePending || isUpdateFeedPending;
    const savedFeedConfig = preferences?.savedFeeds?.find(f => f.value === info.uri);
    const isSaved = Boolean(savedFeedConfig);
    const isPinned = Boolean(savedFeedConfig?.pinned);
    const onToggleSaved = async () => {
        try {
            playHaptic();
            if (savedFeedConfig) {
                await removeFeed(savedFeedConfig);
                Toast.show(_(msg `Removed from your feeds`));
                logger.metric('feed:unsave', { feedUrl: info.uri });
            }
            else {
                await addSavedFeeds([
                    {
                        type: 'feed',
                        value: info.uri,
                        pinned: false,
                    },
                ]);
                Toast.show(_(msg `Saved to your feeds`));
                logger.metric('feed:save', { feedUrl: info.uri });
            }
        }
        catch (err) {
            Toast.show(_(msg `There was an issue updating your feeds, please check your internet connection and try again.`), 'xmark');
            logger.error('Failed to update feeds', { message: err });
        }
    };
    const onTogglePinned = async () => {
        try {
            playHaptic();
            if (savedFeedConfig) {
                const pinned = !savedFeedConfig.pinned;
                await updateSavedFeeds([
                    {
                        ...savedFeedConfig,
                        pinned,
                    },
                ]);
                if (pinned) {
                    Toast.show(_(msg `Pinned ${info.displayName} to Home`));
                    logger.metric('feed:pin', { feedUrl: info.uri });
                }
                else {
                    Toast.show(_(msg `Unpinned ${info.displayName} from Home`));
                    logger.metric('feed:unpin', { feedUrl: info.uri });
                }
            }
            else {
                await addSavedFeeds([
                    {
                        type: 'feed',
                        value: info.uri,
                        pinned: true,
                    },
                ]);
                Toast.show(_(msg `Pinned ${info.displayName} to Home`));
                logger.metric('feed:pin', { feedUrl: info.uri });
            }
        }
        catch (e) {
            Toast.show(_(msg `There was an issue contacting the server`), 'xmark');
            logger.error('Failed to toggle pinned feed', { message: e });
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(Layout.Center, { style: [t.atoms.bg, a.z_10, web([a.sticky, a.z_10, { top: 0 }])], children: _jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, { align: "left", children: _jsx(Button, { label: _(msg `Open feed info screen`), style: [
                                    a.justify_start,
                                    {
                                        paddingVertical: isWeb ? 2 : 4,
                                        paddingRight: 8,
                                    },
                                ], onPress: () => {
                                    playHaptic();
                                    infoControl.open();
                                }, children: ({ hovered, pressed }) => (_jsxs(_Fragment, { children: [_jsx(View, { style: [
                                                a.absolute,
                                                a.inset_0,
                                                a.rounded_sm,
                                                a.transition_all,
                                                t.atoms.bg_contrast_25,
                                                {
                                                    opacity: 0,
                                                    left: isWeb ? -2 : -4,
                                                    right: 0,
                                                },
                                                pressed && {
                                                    opacity: 1,
                                                },
                                                hovered && {
                                                    opacity: 1,
                                                    transform: [{ scaleX: 1.01 }, { scaleY: 1.1 }],
                                                },
                                            ] }), _jsxs(View, { style: [a.flex_1, a.flex_row, a.align_center, a.gap_sm], children: [info.avatar && (_jsx(UserAvatar, { size: 36, type: "algo", avatar: info.avatar })), _jsxs(View, { style: [a.flex_1], children: [_jsx(Text, { style: [
                                                                a.text_md,
                                                                a.font_heavy,
                                                                a.leading_tight,
                                                                gtMobile && a.text_lg,
                                                            ], numberOfLines: 2, children: info.displayName }), _jsxs(View, { style: [a.flex_row, { gap: 6 }], children: [_jsx(Text, { style: [
                                                                        a.flex_shrink,
                                                                        a.text_sm,
                                                                        a.leading_snug,
                                                                        t.atoms.text_contrast_medium,
                                                                    ], numberOfLines: 1, children: sanitizeHandle(info.creatorHandle, '@') }), _jsxs(View, { style: [a.flex_row, a.align_center, { gap: 2 }], children: [_jsx(HeartFilled, { size: "xs", fill: likeUri
                                                                                ? t.palette.like
                                                                                : t.atoms.text_contrast_low.color }), _jsx(Text, { style: [
                                                                                a.text_sm,
                                                                                a.leading_snug,
                                                                                t.atoms.text_contrast_medium,
                                                                            ], numberOfLines: 1, children: formatCount(i18n, likeCount) })] })] })] }), _jsx(Ellipsis, { size: "md", fill: t.atoms.text_contrast_low.color })] })] })) }) }), hasSession && (_jsx(Layout.Header.Slot, { children: isPinned ? (_jsxs(Menu.Root, { children: [_jsx(Menu.Trigger, { label: _(msg `Open feed options menu`), children: ({ props }) => {
                                            return (_jsx(Button, { ...props, label: _(msg `Open feed options menu`), size: "small", variant: "ghost", shape: "square", color: "secondary", children: _jsx(PinFilled, { size: "lg", fill: t.palette.primary_500 }) }));
                                        } }), _jsxs(Menu.Outer, { children: [_jsxs(Menu.Item, { disabled: isFeedStateChangePending, label: _(msg `Unpin from home`), onPress: onTogglePinned, children: [_jsx(Menu.ItemText, { children: _(msg `Unpin from home`) }), _jsx(Menu.ItemIcon, { icon: X, position: "right" })] }), _jsxs(Menu.Item, { disabled: isFeedStateChangePending, label: isSaved
                                                    ? _(msg `Remove from my feeds`)
                                                    : _(msg `Save to my feeds`), onPress: onToggleSaved, children: [_jsx(Menu.ItemText, { children: isSaved
                                                            ? _(msg `Remove from my feeds`)
                                                            : _(msg `Save to my feeds`) }), _jsx(Menu.ItemIcon, { icon: isSaved ? Trash : Plus, position: "right" })] })] })] })) : (_jsx(Button, { label: _(msg `Pin to Home`), size: "small", variant: "ghost", shape: "square", color: "secondary", onPress: onTogglePinned, children: _jsx(ButtonIcon, { icon: Pin, size: "lg" }) })) }))] }) }), _jsxs(Dialog.Outer, { control: infoControl, children: [_jsx(Dialog.Handle, {}), _jsx(Dialog.ScrollableInner, { label: _(msg `Feed menu`), style: [gtMobile ? { width: 'auto', minWidth: 450 } : a.w_full], children: _jsx(DialogInner, { info: info, likeUri: likeUri, setLikeUri: setLikeUri, likeCount: likeCount, isPinned: isPinned, onTogglePinned: onTogglePinned, isFeedStateChangePending: isFeedStateChangePending }) })] })] }));
}
function DialogInner({ info, likeUri, setLikeUri, likeCount, isPinned, onTogglePinned, isFeedStateChangePending, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const { hasSession } = useSession();
    const playHaptic = useHaptics();
    const control = Dialog.useDialogContext();
    const reportDialogControl = useReportDialogControl();
    const [rt] = useRichText(info.description.text);
    const { mutateAsync: likeFeed, isPending: isLikePending } = useLikeMutation();
    const { mutateAsync: unlikeFeed, isPending: isUnlikePending } = useUnlikeMutation();
    const isLiked = !!likeUri;
    const feedRkey = React.useMemo(() => new AtUri(info.uri).rkey, [info.uri]);
    const onToggleLiked = async () => {
        try {
            playHaptic();
            if (isLiked && likeUri) {
                await unlikeFeed({ uri: likeUri });
                setLikeUri('');
                logger.metric('feed:unlike', { feedUrl: info.uri });
            }
            else {
                const res = await likeFeed({ uri: info.uri, cid: info.cid });
                setLikeUri(res.uri);
                logger.metric('feed:like', { feedUrl: info.uri });
            }
        }
        catch (err) {
            Toast.show(_(msg `There was an issue contacting the server, please check your internet connection and try again.`), 'xmark');
            logger.error('Failed to toggle like', { message: err });
        }
    };
    const onPressShare = React.useCallback(() => {
        playHaptic();
        const url = toShareUrl(info.route.href);
        shareUrl(url);
        logger.metric('feed:share', { feedUrl: info.uri });
    }, [info, playHaptic]);
    const onPressReport = React.useCallback(() => {
        reportDialogControl.open();
    }, [reportDialogControl]);
    return (_jsxs(View, { style: [a.gap_md], children: [_jsxs(View, { style: [a.flex_row, a.align_center, a.gap_md], children: [_jsx(UserAvatar, { type: "algo", size: 48, avatar: info.avatar }), _jsxs(View, { style: [a.flex_1, a.gap_2xs], children: [_jsx(Text, { style: [a.text_2xl, a.font_heavy, a.leading_tight], numberOfLines: 2, children: info.displayName }), _jsx(Text, { style: [a.text_sm, a.leading_tight, t.atoms.text_contrast_medium], numberOfLines: 1, children: _jsxs(Trans, { children: ["By", ' ', _jsx(InlineLinkText, { label: _(msg `View ${info.creatorHandle}'s profile`), to: makeProfileLink({
                                                did: info.creatorDid,
                                                handle: info.creatorHandle,
                                            }), style: [
                                                a.text_sm,
                                                a.leading_tight,
                                                a.underline,
                                                t.atoms.text_contrast_medium,
                                            ], numberOfLines: 1, onPress: () => control.close(), children: sanitizeHandle(info.creatorHandle, '@') })] }) })] }), _jsx(Button, { label: _(msg `Share this feed`), size: "small", variant: "ghost", color: "secondary", shape: "round", onPress: onPressShare, children: _jsx(ButtonIcon, { icon: Share, size: "lg" }) })] }), _jsx(RichText, { value: rt, style: [a.text_md, a.leading_snug] }), _jsx(View, { style: [a.flex_row, a.gap_sm, a.align_center], children: typeof likeCount === 'number' && (_jsx(InlineLinkText, { label: _(msg `View users who like this feed`), to: makeCustomFeedLink(info.creatorDid, feedRkey, 'liked-by'), style: [a.underline, t.atoms.text_contrast_medium], onPress: () => control.close(), children: _jsxs(Trans, { children: ["Liked by ", _jsx(Plural, { value: likeCount, one: "# user", other: "# users" })] }) })) }), hasSession && (_jsxs(_Fragment, { children: [_jsxs(View, { style: [a.flex_row, a.gap_sm, a.align_center, a.pt_sm], children: [_jsxs(Button, { disabled: isLikePending || isUnlikePending, label: _(msg `Like this feed`), size: "small", variant: "solid", color: "secondary", onPress: onToggleLiked, style: [a.flex_1], children: [isLiked ? (_jsx(HeartFilled, { size: "sm", fill: t.palette.like })) : (_jsx(ButtonIcon, { icon: Heart, position: "left" })), _jsx(ButtonText, { children: isLiked ? _jsx(Trans, { children: "Unlike" }) : _jsx(Trans, { children: "Like" }) })] }), _jsxs(Button, { disabled: isFeedStateChangePending, label: isPinned ? _(msg `Unpin feed`) : _(msg `Pin feed`), size: "small", variant: "solid", color: isPinned ? 'secondary' : 'primary', onPress: onTogglePinned, style: [a.flex_1], children: [_jsx(ButtonText, { children: isPinned ? _jsx(Trans, { children: "Unpin feed" }) : _jsx(Trans, { children: "Pin feed" }) }), _jsx(ButtonIcon, { icon: Pin, position: "right" })] })] }), _jsxs(View, { style: [a.pt_xs, a.gap_lg], children: [_jsx(Divider, {}), _jsxs(View, { style: [a.flex_row, a.align_center, a.gap_sm, a.justify_between], children: [_jsx(Text, { style: [a.italic, t.atoms.text_contrast_medium], children: _jsx(Trans, { children: "Something wrong? Let us know." }) }), _jsxs(Button, { label: _(msg `Report feed`), size: "small", variant: "solid", color: "secondary", onPress: onPressReport, children: [_jsx(ButtonText, { children: _jsx(Trans, { children: "Report feed" }) }), _jsx(ButtonIcon, { icon: CircleInfo, position: "right" })] })] }), info.view && (_jsx(ReportDialog, { control: reportDialogControl, subject: {
                                    ...info.view,
                                    $type: 'app.bsky.feed.defs#generatorView',
                                } }))] })] }))] }));
}
//# sourceMappingURL=ProfileFeedHeader.js.map