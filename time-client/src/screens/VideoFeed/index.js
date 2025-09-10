import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutAnimation, Pressable, ScrollView, View, } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import { Gesture, GestureDetector, } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, } from 'react-native-reanimated';
import { useSafeAreaFrame, useSafeAreaInsets, } from 'react-native-safe-area-context';
import { useEvent } from 'expo';
import { useEventListener } from 'expo';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { createVideoPlayer, VideoView } from 'expo-video';
import { AppBskyEmbedVideo, AppBskyFeedPost, AtUri, RichText as RichTextAPI, } from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useFocusEffect, useIsFocused, useNavigation, useRoute, } from '@react-navigation/native';
import {} from '@react-navigation/native-stack';
import { HITSLOP_20 } from '#/lib/constants';
import { useHaptics } from '#/lib/haptics';
import { useNonReactiveCallback } from '#/lib/hooks/useNonReactiveCallback';
import { useOpenComposer } from '#/lib/hooks/useOpenComposer';
import {} from '#/lib/routes/types';
import { sanitizeDisplayName } from '#/lib/strings/display-names';
import { cleanError } from '#/lib/strings/errors';
import { sanitizeHandle } from '#/lib/strings/handles';
import { isAndroid } from '#/platform/detection';
import { useA11y } from '#/state/a11y';
import { POST_TOMBSTONE, usePostShadow, } from '#/state/cache/post-shadow';
import { useProfileShadow } from '#/state/cache/profile-shadow';
import { FeedFeedbackProvider, useFeedFeedbackContext, } from '#/state/feed-feedback';
import { useFeedFeedback } from '#/state/feed-feedback';
import { useFeedInfo } from '#/state/queries/feed';
import { usePostLikeMutationQueue } from '#/state/queries/post';
import { usePostFeedQuery, } from '#/state/queries/post-feed';
import { useProfileFollowMutationQueue } from '#/state/queries/profile';
import { useSession } from '#/state/session';
import { useSetMinimalShellMode } from '#/state/shell';
import { useSetLightStatusBar } from '#/state/shell/light-status-bar';
import { List } from '#/view/com/util/List';
import { UserAvatar } from '#/view/com/util/UserAvatar';
import { ThreadComposePrompt } from '#/screens/PostThread/components/ThreadComposePrompt';
import { Header } from '#/screens/VideoFeed/components/Header';
import { atoms as a, ios, platform, ThemeProvider, useTheme } from '#/alf';
import { setSystemUITheme } from '#/alf/util/systemUI';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import { Divider } from '#/components/Divider';
import { ArrowLeft_Stroke2_Corner0_Rounded as ArrowLeftIcon } from '#/components/icons/Arrow';
import { Check_Stroke2_Corner0_Rounded as CheckIcon } from '#/components/icons/Check';
import { EyeSlash_Stroke2_Corner0_Rounded as Eye } from '#/components/icons/EyeSlash';
import { Leaf_Stroke2_Corner0_Rounded as LeafIcon } from '#/components/icons/Leaf';
import * as Layout from '#/components/Layout';
import { Link } from '#/components/Link';
import { ListFooter } from '#/components/Lists';
import * as Hider from '#/components/moderation/Hider';
import { PostControls } from '#/components/PostControls';
import { RichText } from '#/components/RichText';
import { Text } from '#/components/Typography';
import * as bsky from '#/types/bsky';
import { Scrubber, VIDEO_PLAYER_BOTTOM_INSET } from './components/Scrubber';
function createThreeVideoPlayers(sources) {
    // android is typically slower and can't keep up with a 0.1 interval
    const eventInterval = platform({
        ios: 0.2,
        android: 0.5,
        default: 0,
    });
    const p1 = createVideoPlayer(sources?.[0] ?? '');
    p1.loop = true;
    p1.timeUpdateEventInterval = eventInterval;
    const p2 = createVideoPlayer(sources?.[1] ?? '');
    p2.loop = true;
    p2.timeUpdateEventInterval = eventInterval;
    const p3 = createVideoPlayer(sources?.[2] ?? '');
    p3.loop = true;
    p3.timeUpdateEventInterval = eventInterval;
    return [p1, p2, p3];
}
export function VideoFeed({}) {
    const { top } = useSafeAreaInsets();
    const { params } = useRoute();
    const t = useTheme();
    const setMinShellMode = useSetMinimalShellMode();
    useFocusEffect(useCallback(() => {
        setMinShellMode(true);
        setSystemUITheme('lightbox', t);
        return () => {
            setMinShellMode(false);
            setSystemUITheme('theme', t);
        };
    }, [setMinShellMode, t]));
    const isFocused = useIsFocused();
    useSetLightStatusBar(isFocused);
    return (_jsx(ThemeProvider, { theme: "dark", children: _jsxs(Layout.Screen, { noInsetTop: true, style: { backgroundColor: 'black' }, children: [_jsx(SystemBars, { style: { statusBar: 'light', navigationBar: 'light' } }), _jsx(View, { style: [
                        a.absolute,
                        a.z_50,
                        { top: 0, left: 0, right: 0, paddingTop: top },
                    ], children: _jsx(Header, { sourceContext: params }) }), _jsx(Feed, {})] }) }));
}
const viewabilityConfig = {
    itemVisiblePercentThreshold: 100,
    minimumViewTime: 0,
};
function Feed() {
    const { params } = useRoute();
    const isFocused = useIsFocused();
    const { hasSession } = useSession();
    const { height } = useSafeAreaFrame();
    const feedDesc = useMemo(() => {
        switch (params.type) {
            case 'feedgen':
                return `feedgen|${params.uri}`;
            case 'author':
                return `author|${params.did}|${params.filter}`;
            default:
                throw new Error(`Invalid video feed params ${JSON.stringify(params)}`);
        }
    }, [params]);
    const feedUri = params.type === 'feedgen' ? params.uri : undefined;
    const { data: feedInfo } = useFeedInfo(feedUri);
    const feedFeedback = useFeedFeedback(feedInfo, hasSession);
    const { data, error, hasNextPage, isFetchingNextPage, fetchNextPage } = usePostFeedQuery(feedDesc, params.type === 'feedgen' && params.sourceInterstitial !== 'none'
        ? { feedCacheKey: params.sourceInterstitial }
        : undefined);
    const videos = useMemo(() => {
        let vids = data?.pages.flatMap(page => {
            const items = [];
            for (const slice of page.slices) {
                const feedPost = slice.items.find(item => item.uri === slice.feedPostUri);
                if (feedPost && AppBskyEmbedVideo.isView(feedPost.post.embed)) {
                    items.push({
                        _reactKey: feedPost._reactKey,
                        moderation: feedPost.moderation,
                        post: feedPost.post,
                        video: feedPost.post.embed,
                        feedContext: slice.feedContext,
                        reqId: slice.reqId,
                    });
                }
            }
            return items;
        }) ?? [];
        const startingVideoIndex = vids?.findIndex(video => {
            return video.post.uri === params.initialPostUri;
        });
        if (vids && startingVideoIndex && startingVideoIndex > -1) {
            vids = vids.slice(startingVideoIndex);
        }
        return vids;
    }, [data, params.initialPostUri]);
    const [currentSources, setCurrentSources] = useState([null, null, null]);
    const [players, setPlayers] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollGesture = useMemo(() => Gesture.Native(), []);
    const renderItem = useCallback(({ item, index }) => {
        const { post, video } = item;
        const player = players?.[index % 3];
        const currentSource = currentSources[index % 3];
        return (_jsx(VideoItem, { player: player, post: post, embed: video, active: isFocused &&
                index === currentIndex &&
                currentSource?.source === video.playlist, adjacent: index === currentIndex - 1 || index === currentIndex + 1, moderation: item.moderation, scrollGesture: scrollGesture, feedContext: item.feedContext, reqId: item.reqId }));
    }, [players, currentIndex, isFocused, currentSources, scrollGesture]);
    const updateVideoState = useCallback((index) => {
        if (!videos.length)
            return;
        const prevSlice = videos.at(index - 1);
        const prevPost = prevSlice?.post;
        const prevEmbed = prevPost?.embed;
        const prevVideo = prevEmbed && AppBskyEmbedVideo.isView(prevEmbed)
            ? prevEmbed.playlist
            : null;
        const currSlice = videos.at(index);
        const currPost = currSlice?.post;
        const currEmbed = currPost?.embed;
        const currVideo = currEmbed && AppBskyEmbedVideo.isView(currEmbed)
            ? currEmbed.playlist
            : null;
        const currVideoModeration = currSlice?.moderation;
        const nextSlice = videos.at(index + 1);
        const nextPost = nextSlice?.post;
        const nextEmbed = nextPost?.embed;
        const nextVideo = nextEmbed && AppBskyEmbedVideo.isView(nextEmbed)
            ? nextEmbed.playlist
            : null;
        const prevPlayerCurrentSource = currentSources[(index + 2) % 3];
        const currPlayerCurrentSource = currentSources[index % 3];
        const nextPlayerCurrentSource = currentSources[(index + 1) % 3];
        if (!players) {
            const args = ['', '', ''];
            if (prevVideo)
                args[(index + 2) % 3] = prevVideo;
            if (currVideo)
                args[index % 3] = currVideo;
            if (nextVideo)
                args[(index + 1) % 3] = nextVideo;
            const [player1, player2, player3] = createThreeVideoPlayers(args);
            setPlayers([player1, player2, player3]);
            if (currVideo) {
                const currPlayer = [player1, player2, player3][index % 3];
                currPlayer.play();
            }
        }
        else {
            const [player1, player2, player3] = players;
            const prevPlayer = [player1, player2, player3][(index + 2) % 3];
            const currPlayer = [player1, player2, player3][index % 3];
            const nextPlayer = [player1, player2, player3][(index + 1) % 3];
            if (prevVideo && prevVideo !== prevPlayerCurrentSource?.source) {
                prevPlayer.replace(prevVideo);
            }
            prevPlayer.pause();
            if (currVideo) {
                if (currVideo !== currPlayerCurrentSource?.source) {
                    currPlayer.replace(currVideo);
                }
                if (currVideoModeration &&
                    (currVideoModeration.ui('contentView').blur ||
                        currVideoModeration.ui('contentMedia').blur)) {
                    currPlayer.pause();
                }
                else {
                    currPlayer.play();
                }
            }
            if (nextVideo && nextVideo !== nextPlayerCurrentSource?.source) {
                nextPlayer.replace(nextVideo);
            }
            nextPlayer.pause();
        }
        const updatedSources = [
            ...currentSources,
        ];
        if (prevVideo && prevVideo !== prevPlayerCurrentSource?.source) {
            updatedSources[(index + 2) % 3] = {
                source: prevVideo,
            };
        }
        if (currVideo && currVideo !== currPlayerCurrentSource?.source) {
            updatedSources[index % 3] = {
                source: currVideo,
            };
        }
        if (nextVideo && nextVideo !== nextPlayerCurrentSource?.source) {
            updatedSources[(index + 1) % 3] = {
                source: nextVideo,
            };
        }
        if (updatedSources[0]?.source !== currentSources[0]?.source ||
            updatedSources[1]?.source !== currentSources[1]?.source ||
            updatedSources[2]?.source !== currentSources[2]?.source) {
            setCurrentSources(updatedSources);
        }
    }, [videos, currentSources, players]);
    const updateVideoStateInitially = useNonReactiveCallback(() => {
        updateVideoState(currentIndex);
    });
    useFocusEffect(useCallback(() => {
        if (!players) {
            // create players, set sources, start playing
            updateVideoStateInitially();
        }
        return () => {
            if (players) {
                // manually release players when offscreen
                players.forEach(p => p.release());
                setPlayers(null);
            }
        };
    }, [players, updateVideoStateInitially]));
    const onViewableItemsChanged = useCallback(({ viewableItems }) => {
        if (viewableItems[0] && viewableItems[0].index !== null) {
            const newIndex = viewableItems[0].index;
            setCurrentIndex(newIndex);
            updateVideoState(newIndex);
        }
    }, [updateVideoState]);
    const renderEndMessage = useCallback(() => _jsx(EndMessage, {}), []);
    return (_jsx(FeedFeedbackProvider, { value: feedFeedback, children: _jsx(GestureDetector, { gesture: scrollGesture, children: _jsx(List, { data: videos, renderItem: renderItem, keyExtractor: keyExtractor, initialNumToRender: 3, maxToRenderPerBatch: 3, windowSize: 6, pagingEnabled: true, ListFooterComponent: _jsx(ListFooter, { hasNextPage: hasNextPage, isFetchingNextPage: isFetchingNextPage, error: cleanError(error), onRetry: fetchNextPage, height: height, showEndMessage: true, renderEndMessage: renderEndMessage, style: [a.justify_center, a.border_0] }), onEndReached: () => {
                    if (hasNextPage && !isFetchingNextPage) {
                        fetchNextPage();
                    }
                }, showsVerticalScrollIndicator: false, onViewableItemsChanged: onViewableItemsChanged, viewabilityConfig: viewabilityConfig }) }) }));
}
function keyExtractor(item) {
    return item._reactKey;
}
let VideoItem = ({ player, post, embed, active, adjacent, scrollGesture, moderation, feedContext, reqId, }) => {
    const postShadow = usePostShadow(post);
    const { width, height } = useSafeAreaFrame();
    const { sendInteraction } = useFeedFeedbackContext();
    useEffect(() => {
        if (active) {
            sendInteraction({
                item: post.uri,
                event: 'app.bsky.feed.defs#interactionSeen',
                feedContext,
                reqId,
            });
        }
    }, [active, post.uri, feedContext, reqId, sendInteraction]);
    // TODO: high-performance android phones should also
    // be capable of rendering 3 video players, but currently
    // we can't distinguish between them
    const shouldRenderVideo = active || ios(adjacent);
    return (_jsx(View, { style: [a.relative, { height, width }], children: postShadow === POST_TOMBSTONE ? (_jsx(View, { style: [
                a.absolute,
                a.inset_0,
                a.z_20,
                a.align_center,
                a.justify_center,
                { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
            ], children: _jsx(Text, { style: [
                    a.text_2xl,
                    a.font_heavy,
                    a.text_center,
                    a.leading_tight,
                    a.mx_xl,
                ], children: _jsx(Trans, { children: "Post has been deleted" }) }) })) : (_jsxs(_Fragment, { children: [_jsx(VideoItemPlaceholder, { embed: embed }), shouldRenderVideo && player && (_jsx(VideoItemInner, { player: player, embed: embed })), moderation && (_jsx(Overlay, { player: player, post: postShadow, embed: embed, active: active, scrollGesture: scrollGesture, moderation: moderation, feedContext: feedContext, reqId: reqId }))] })) }));
};
VideoItem = memo(VideoItem);
function VideoItemInner({ player, embed, }) {
    const { bottom } = useSafeAreaInsets();
    const [isReady, setIsReady] = useState(!isAndroid);
    useEventListener(player, 'timeUpdate', evt => {
        if (isAndroid && !isReady && evt.currentTime >= 0.05) {
            setIsReady(true);
        }
    });
    return (_jsx(VideoView, { accessible: false, style: [
            a.absolute,
            {
                top: 0,
                left: 0,
                right: 0,
                bottom: bottom + VIDEO_PLAYER_BOTTOM_INSET,
            },
            !isReady && { opacity: 0 },
        ], player: player, nativeControls: false, contentFit: isTallAspectRatio(embed.aspectRatio) ? 'cover' : 'contain', accessibilityIgnoresInvertColors: true }));
}
function ModerationOverlay({ embed, onPressShow, }) {
    const { _ } = useLingui();
    const hider = Hider.useHider();
    const { bottom } = useSafeAreaInsets();
    const onShow = useCallback(() => {
        hider.setIsContentVisible(true);
        onPressShow();
    }, [hider, onPressShow]);
    return (_jsxs(View, { style: [a.absolute, a.inset_0, a.z_20], children: [_jsx(VideoItemPlaceholder, { blur: true, embed: embed }), _jsxs(View, { style: [
                    a.absolute,
                    a.inset_0,
                    a.z_20,
                    a.justify_center,
                    a.align_center,
                    { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
                ], children: [_jsxs(View, { style: [a.align_center, a.gap_sm], children: [_jsx(Eye, { width: 36, fill: "white" }), _jsx(Text, { style: [a.text_center, a.leading_snug, a.pb_xs], children: _jsx(Trans, { children: "Hidden by your moderation settings." }) }), _jsx(Button, { label: _(msg `Show anyway`), size: "small", variant: "solid", color: "secondary_inverted", onPress: onShow, children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Show anyway" }) }) })] }), _jsxs(View, { style: [
                            a.absolute,
                            a.inset_0,
                            a.px_xl,
                            a.pt_4xl,
                            {
                                top: 'auto',
                                paddingBottom: bottom,
                            },
                        ], children: [_jsx(LinearGradient, { colors: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)'], style: [a.absolute, a.inset_0] }), _jsx(Divider, { style: { borderColor: 'white' } }), _jsx(View, { children: _jsx(Button, { label: _(msg `View details`), onPress: () => {
                                        hider.showInfoDialog();
                                    }, style: [
                                        a.w_full,
                                        {
                                            height: 60,
                                        },
                                    ], children: ({ pressed }) => (_jsx(Text, { style: [
                                            a.text_sm,
                                            a.font_bold,
                                            a.text_center,
                                            { opacity: pressed ? 0.5 : 1 },
                                        ], children: _jsx(Trans, { children: "View details" }) })) }) })] })] })] }));
}
function Overlay({ player, post, embed, active, scrollGesture, moderation, feedContext, reqId, }) {
    const { _ } = useLingui();
    const t = useTheme();
    const { openComposer } = useOpenComposer();
    const { currentAccount } = useSession();
    const navigation = useNavigation();
    const seekingAnimationSV = useSharedValue(0);
    const profile = useProfileShadow(post.author);
    const [queueFollow, queueUnfollow] = useProfileFollowMutationQueue(profile, 'ImmersiveVideo');
    const rkey = new AtUri(post.uri).rkey;
    const record = bsky.dangerousIsType(post.record, AppBskyFeedPost.isRecord)
        ? post.record
        : undefined;
    const richText = new RichTextAPI({
        text: record?.text || '',
        facets: record?.facets,
    });
    const handle = sanitizeHandle(post.author.handle, '@');
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: 1 - seekingAnimationSV.get(),
    }));
    const onPressShow = useCallback(() => {
        player?.play();
    }, [player]);
    const mergedModui = useMemo(() => {
        const modui = moderation.ui('contentView');
        const mediaModui = moderation.ui('contentMedia');
        modui.alerts = [...modui.alerts, ...mediaModui.alerts];
        modui.blurs = [...modui.blurs, ...mediaModui.blurs];
        modui.filters = [...modui.filters, ...mediaModui.filters];
        modui.informs = [...modui.informs, ...mediaModui.informs];
        return modui;
    }, [moderation]);
    const onPressReply = useCallback(() => {
        openComposer({
            replyTo: {
                uri: post.uri,
                cid: post.cid,
                text: record?.text || '',
                author: post.author,
                embed: post.embed,
                langs: record?.langs,
            },
        });
    }, [openComposer, post, record]);
    return (_jsxs(Hider.Outer, { modui: mergedModui, children: [_jsx(Hider.Mask, { children: _jsx(ModerationOverlay, { embed: embed, onPressShow: onPressShow }) }), _jsx(Hider.Content, { children: _jsxs(View, { style: [a.absolute, a.inset_0, a.z_20], children: [_jsx(View, { style: [a.flex_1], children: player && (_jsx(PlayPauseTapArea, { player: player, post: post, feedContext: feedContext, reqId: reqId })) }), _jsxs(LinearGradient, { colors: [
                                'rgba(0,0,0,0)',
                                'rgba(0,0,0,0.7)',
                                'rgba(0,0,0,0.95)',
                                'rgba(0,0,0,0.95)',
                            ], style: [a.w_full, a.pt_md], children: [_jsxs(Animated.View, { style: [a.px_md, animatedStyle], children: [_jsxs(View, { style: [a.w_full, a.flex_row, a.align_center, a.gap_md], children: [_jsxs(Link, { label: _(msg `View ${sanitizeDisplayName(post.author.displayName || post.author.handle)}'s profile`), to: {
                                                        screen: 'Profile',
                                                        params: { name: post.author.did },
                                                    }, style: [a.flex_1, a.flex_row, a.gap_md, a.align_center], children: [_jsx(UserAvatar, { type: "user", avatar: post.author.avatar, size: 32 }), _jsxs(View, { style: [a.flex_1], children: [_jsx(Text, { style: [a.text_md, a.font_heavy], emoji: true, numberOfLines: 1, children: sanitizeDisplayName(post.author.displayName || post.author.handle) }), _jsx(Text, { style: [a.text_sm, t.atoms.text_contrast_high], numberOfLines: 1, children: handle })] })] }), post.author.did !== currentAccount?.did &&
                                                    !post.author.viewer?.following && (_jsxs(Button, { label: profile.viewer?.following
                                                        ? _(msg `Following ${handle}`)
                                                        : _(msg `Follow ${handle}`), accessibilityHint: profile.viewer?.following
                                                        ? _(msg `Unfollows the user`)
                                                        : '', size: "small", variant: "solid", color: "secondary_inverted", style: [a.mb_xs], onPress: () => profile.viewer?.following
                                                        ? queueUnfollow()
                                                        : queueFollow(), children: [!!profile.viewer?.following && (_jsx(ButtonIcon, { icon: CheckIcon })), _jsx(ButtonText, { children: profile.viewer?.following ? (_jsx(Trans, { children: "Following" })) : (_jsx(Trans, { children: "Follow" })) })] }))] }), record?.text?.trim() && (_jsx(ExpandableRichTextView, { value: richText, authorHandle: post.author.handle })), record && (_jsx(View, { style: [{ left: -5 }], children: _jsx(PostControls, { richText: richText, post: post, record: record, feedContext: feedContext, logContext: "FeedItem", onPressReply: () => navigation.navigate('PostThread', {
                                                    name: post.author.did,
                                                    rkey,
                                                }), big: true }) }))] }), _jsx(Scrubber, { active: active, player: player, seekingAnimationSV: seekingAnimationSV, scrollGesture: scrollGesture, children: _jsx(ThreadComposePrompt, { onPressCompose: onPressReply, style: [a.pt_md, a.pb_sm] }) })] })] }) })] }));
}
function ExpandableRichTextView({ value, authorHandle, }) {
    const { height: screenHeight } = useSafeAreaFrame();
    const [expanded, setExpanded] = useState(false);
    const [hasBeenExpanded, setHasBeenExpanded] = useState(false);
    const [constrained, setConstrained] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const { _ } = useLingui();
    const { screenReaderEnabled } = useA11y();
    if (expanded && !hasBeenExpanded) {
        setHasBeenExpanded(true);
    }
    return (_jsxs(ScrollView, { scrollEnabled: expanded, onContentSizeChange: (_w, h) => {
            if (hasBeenExpanded) {
                LayoutAnimation.configureNext({
                    duration: 500,
                    update: { type: 'spring', springDamping: 0.6 },
                });
            }
            setContentHeight(h);
        }, style: { height: Math.min(contentHeight, screenHeight * 0.5) }, contentContainerStyle: [
            a.py_sm,
            a.gap_xs,
            expanded ? [a.align_start] : a.flex_row,
        ], children: [_jsx(RichText, { value: value, style: [a.text_sm, a.flex_1, a.leading_normal], authorHandle: authorHandle, enableTags: true, numberOfLines: expanded || screenReaderEnabled ? undefined : constrained ? 2 : 2, onTextLayout: evt => {
                    if (!constrained && evt.nativeEvent.lines.length > 1) {
                        setConstrained(true);
                    }
                } }), constrained && !screenReaderEnabled && (_jsx(Pressable, { accessibilityHint: _(msg `Expands or collapses post text`), accessibilityLabel: expanded ? _(msg `Read less`) : _(msg `Read more`), hitSlop: HITSLOP_20, onPress: () => setExpanded(prev => !prev), style: [a.absolute, a.inset_0] }))] }));
}
function VideoItemPlaceholder({ embed, style, blur, }) {
    const { bottom } = useSafeAreaInsets();
    const src = embed.thumbnail;
    let contentFit = isTallAspectRatio(embed.aspectRatio)
        ? 'cover'
        : 'contain';
    if (blur) {
        contentFit = 'cover';
    }
    return src ? (_jsx(Image, { accessibilityIgnoresInvertColors: true, source: { uri: src }, style: [
            a.absolute,
            blur
                ? a.inset_0
                : {
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: bottom + VIDEO_PLAYER_BOTTOM_INSET,
                },
            style,
        ], contentFit: contentFit, blurRadius: blur ? 100 : 0 })) : null;
}
function PlayPauseTapArea({ player, post, feedContext, reqId, }) {
    const { _ } = useLingui();
    const doubleTapRef = useRef(null);
    const playHaptic = useHaptics();
    // TODO: implement viaRepost -sfn
    const [queueLike] = usePostLikeMutationQueue(post, undefined, undefined, 'ImmersiveVideo');
    const { sendInteraction } = useFeedFeedbackContext();
    const { isPlaying } = useEvent(player, 'playingChange', {
        isPlaying: player.playing,
    });
    const togglePlayPause = () => {
        if (!player)
            return;
        doubleTapRef.current = null;
        if (player.playing) {
            player.pause();
        }
        else {
            player.play();
        }
    };
    const onPress = () => {
        if (doubleTapRef.current) {
            clearTimeout(doubleTapRef.current);
            doubleTapRef.current = null;
            playHaptic('Light');
            queueLike();
            sendInteraction({
                item: post.uri,
                event: 'app.bsky.feed.defs#interactionLike',
                feedContext,
                reqId,
            });
        }
        else {
            doubleTapRef.current = setTimeout(togglePlayPause, 200);
        }
    };
    return (_jsx(Button, { disabled: !player, "aria-valuetext": isPlaying ? _(msg `Video is playing`) : _(msg `Video is paused`), label: _(`Video from ${sanitizeHandle(post.author.handle, '@')}. Tap to play or pause the video`), accessibilityHint: _(msg `Double tap to like`), onPress: onPress, style: [a.absolute, a.inset_0, a.z_10], children: _jsx(View, {}) }));
}
function EndMessage() {
    const navigation = useNavigation();
    const { _ } = useLingui();
    const t = useTheme();
    return (_jsxs(View, { style: [
            a.w_full,
            a.gap_3xl,
            a.px_lg,
            a.mx_auto,
            a.align_center,
            { maxWidth: 350 },
        ], children: [_jsx(View, { style: [
                    { height: 100, width: 100 },
                    a.rounded_full,
                    t.atoms.bg_contrast_700,
                    a.align_center,
                    a.justify_center,
                ], children: _jsx(LeafIcon, { width: 64, fill: "black" }) }), _jsxs(View, { style: [a.w_full, a.gap_md], children: [_jsx(Text, { style: [a.text_3xl, a.text_center, a.font_heavy], children: _jsx(Trans, { children: "That's everything!" }) }), _jsx(Text, { style: [
                            a.text_lg,
                            a.text_center,
                            t.atoms.text_contrast_high,
                            a.leading_snug,
                        ], children: _jsx(Trans, { children: "You've run out of videos to watch. Maybe it's a good time to take a break?" }) })] }), _jsxs(Button, { testID: "videoFeedGoBackButton", onPress: () => {
                    if (navigation.canGoBack()) {
                        navigation.goBack();
                    }
                    else {
                        navigation.navigate('Home');
                    }
                }, variant: "solid", color: "secondary_inverted", size: "small", label: _(msg `Go back`), accessibilityHint: _(msg `Returns to previous page`), children: [_jsx(ButtonIcon, { icon: ArrowLeftIcon }), _jsx(ButtonText, { children: _jsx(Trans, { children: "Go back" }) })] })] }));
}
/*
 * If the video is taller than 9:16
 */
function isTallAspectRatio(aspectRatio) {
    const videoAspectRatio = (aspectRatio?.width ?? 1) / (aspectRatio?.height ?? 1);
    return videoAspectRatio <= 9 / 16;
}
//# sourceMappingURL=index.js.map