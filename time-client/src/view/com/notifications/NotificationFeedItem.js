import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { memo, useCallback, useEffect, useMemo, useState, } from 'react';
import { Animated, Pressable, StyleSheet, TouchableOpacity, View, } from 'react-native';
import { AppBskyFeedPost, AppBskyGraphFollow, moderateProfile, } from '@atproto/api';
import { AtUri } from '@atproto/api';
import { TID } from '@atproto/common-web';
import { msg, Plural, plural, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { MAX_POST_LINES } from '#/lib/constants';
import { DM_SERVICE_HEADERS } from '#/lib/constants';
import { useAnimatedValue } from '#/lib/hooks/useAnimatedValue';
import { usePalette } from '#/lib/hooks/usePalette';
import { makeProfileLink } from '#/lib/routes/links';
import {} from '#/lib/routes/types';
import { forceLTR } from '#/lib/strings/bidi';
import { sanitizeDisplayName } from '#/lib/strings/display-names';
import { sanitizeHandle } from '#/lib/strings/handles';
import { niceDate } from '#/lib/strings/time';
import { s } from '#/lib/styles';
import { logger } from '#/logger';
import {} from '#/state/queries/notifications/feed';
import { unstableCacheProfileView } from '#/state/queries/unstable-profile-cache';
import { useAgent } from '#/state/session';
import { FeedSourceCard } from '#/view/com/feeds/FeedSourceCard';
import { Post } from '#/view/com/post/Post';
import { formatCount } from '#/view/com/util/numeric/format';
import { TimeElapsed } from '#/view/com/util/TimeElapsed';
import { PreviewableUserAvatar, UserAvatar } from '#/view/com/util/UserAvatar';
import { atoms as a, platform, useTheme } from '#/alf';
import { Button, ButtonText } from '#/components/Button';
import { BellRinging_Filled_Corner0_Rounded as BellRingingIcon } from '#/components/icons/BellRinging';
import { ChevronBottom_Stroke2_Corner0_Rounded as ChevronDownIcon, ChevronTop_Stroke2_Corner0_Rounded as ChevronUpIcon, } from '#/components/icons/Chevron';
import { Heart2_Filled_Stroke2_Corner0_Rounded as HeartIconFilled } from '#/components/icons/Heart2';
import { PersonPlus_Filled_Stroke2_Corner0_Rounded as PersonPlusIcon } from '#/components/icons/Person';
import { Repost_Stroke2_Corner2_Rounded as RepostIcon } from '#/components/icons/Repost';
import { StarterPack } from '#/components/icons/StarterPack';
import { VerifiedCheck } from '#/components/icons/VerifiedCheck';
import { InlineLinkText, Link } from '#/components/Link';
import * as MediaPreview from '#/components/MediaPreview';
import { ProfileHoverCard } from '#/components/ProfileHoverCard';
import { Notification as StarterPackCard } from '#/components/StarterPack/StarterPackCard';
import { SubtleWebHover } from '#/components/SubtleWebHover';
import { Text } from '#/components/Typography';
import { useSimpleVerificationState } from '#/components/verification';
import { VerificationCheck } from '#/components/verification/VerificationCheck';
import * as bsky from '#/types/bsky';
const MAX_AUTHORS = 5;
const EXPANDED_AUTHOR_EL_HEIGHT = 35;
let NotificationFeedItem = ({ item, moderationOpts, highlightUnread, hideTopBorder, }) => {
    const queryClient = useQueryClient();
    const pal = usePalette('default');
    const t = useTheme();
    const { _, i18n } = useLingui();
    const [isAuthorsExpanded, setAuthorsExpanded] = useState(false);
    const itemHref = useMemo(() => {
        switch (item.type) {
            case 'post-like':
            case 'repost':
            case 'like-via-repost':
            case 'repost-via-repost': {
                if (item.subjectUri) {
                    const urip = new AtUri(item.subjectUri);
                    return `/profile/${urip.host}/post/${urip.rkey}`;
                }
                break;
            }
            case 'follow':
            case 'verified':
            case 'unverified': {
                return makeProfileLink(item.notification.author);
            }
            case 'reply':
            case 'mention':
            case 'quote': {
                const uripReply = new AtUri(item.notification.uri);
                return `/profile/${uripReply.host}/post/${uripReply.rkey}`;
            }
            case 'feedgen-like':
            case 'starterpack-joined': {
                if (item.subjectUri) {
                    const urip = new AtUri(item.subjectUri);
                    return `/profile/${urip.host}/feed/${urip.rkey}`;
                }
                break;
            }
            case 'subscribed-post': {
                const posts = [];
                for (const post of [item.notification, ...(item.additional ?? [])]) {
                    posts.push(post.uri);
                }
                return `/notifications/activity?posts=${encodeURIComponent(posts.slice(0, 25).join(','))}`;
            }
        }
        return '';
    }, [item]);
    const onToggleAuthorsExpanded = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setAuthorsExpanded(currentlyExpanded => !currentlyExpanded);
    };
    const onBeforePress = useCallback(() => {
        unstableCacheProfileView(queryClient, item.notification.author);
    }, [queryClient, item.notification.author]);
    const authors = useMemo(() => {
        return [
            {
                profile: item.notification.author,
                href: makeProfileLink(item.notification.author),
                moderation: moderateProfile(item.notification.author, moderationOpts),
            },
            ...(item.additional?.map(({ author }) => ({
                profile: author,
                href: makeProfileLink(author),
                moderation: moderateProfile(author, moderationOpts),
            })) || []),
        ].filter((author, index, arr) => arr.findIndex(au => au.profile.did === author.profile.did) === index);
    }, [item, moderationOpts]);
    const niceTimestamp = niceDate(i18n, item.notification.indexedAt);
    const firstAuthor = authors[0];
    const firstAuthorVerification = useSimpleVerificationState({
        profile: firstAuthor.profile,
    });
    const firstAuthorName = sanitizeDisplayName(firstAuthor.profile.displayName || firstAuthor.profile.handle);
    if (item.subjectUri && !item.subject && item.type !== 'feedgen-like') {
        // don't render anything if the target post was deleted or unfindable
        return _jsx(View, {});
    }
    if (item.type === 'reply' ||
        item.type === 'mention' ||
        item.type === 'quote') {
        if (!item.subject) {
            return null;
        }
        const isHighlighted = highlightUnread && !item.notification.isRead;
        return (_jsx(View, { testID: `feedItem-by-${item.notification.author.handle}`, children: _jsx(Post, { post: item.subject, style: isHighlighted && {
                    backgroundColor: pal.colors.unreadNotifBg,
                    borderColor: pal.colors.unreadNotifBorder,
                }, hideTopBorder: hideTopBorder }) }));
    }
    const firstAuthorLink = (_jsx(ProfileHoverCard, { did: firstAuthor.profile.did, inline: true, children: _jsxs(InlineLinkText, { style: [t.atoms.text, a.font_bold, a.text_md, a.leading_tight], to: firstAuthor.href, disableMismatchWarning: true, emoji: true, label: _(msg `Go to ${firstAuthorName}'s profile`), children: [forceLTR(firstAuthorName), firstAuthorVerification.showBadge && (_jsx(View, { style: [
                        a.relative,
                        {
                            paddingTop: platform({ android: 2 }),
                            marginBottom: platform({ ios: -7 }),
                            top: platform({ web: 1 }),
                            paddingLeft: 3,
                            paddingRight: 2,
                        },
                    ], children: _jsx(VerificationCheck, { width: 14, verifier: firstAuthorVerification.role === 'verifier' }) }))] }, firstAuthor.href) }));
    const additionalAuthorsCount = authors.length - 1;
    const hasMultipleAuthors = additionalAuthorsCount > 0;
    const formattedAuthorsCount = hasMultipleAuthors
        ? formatCount(i18n, additionalAuthorsCount)
        : '';
    let a11yLabel = '';
    let notificationContent;
    let icon = (_jsx(HeartIconFilled, { size: "xl", style: [
            s.likeColor,
            // {position: 'relative', top: -4}
        ] }));
    if (item.type === 'post-like') {
        a11yLabel = hasMultipleAuthors
            ? _(msg `${firstAuthorName} and ${plural(additionalAuthorsCount, {
                one: `${formattedAuthorsCount} other`,
                other: `${formattedAuthorsCount} others`,
            })} liked your post`)
            : _(msg `${firstAuthorName} liked your post`);
        notificationContent = hasMultipleAuthors ? (_jsxs(Trans, { children: [firstAuthorLink, " and", ' ', _jsx(Text, { style: [a.text_md, a.font_bold, a.leading_snug], children: _jsx(Plural, { value: additionalAuthorsCount, one: `${formattedAuthorsCount} other`, other: `${formattedAuthorsCount} others` }) }), ' ', "liked your post"] })) : (_jsxs(Trans, { children: [firstAuthorLink, " liked your post"] }));
    }
    else if (item.type === 'repost') {
        a11yLabel = hasMultipleAuthors
            ? _(msg `${firstAuthorName} and ${plural(additionalAuthorsCount, {
                one: `${formattedAuthorsCount} other`,
                other: `${formattedAuthorsCount} others`,
            })} reposted your post`)
            : _(msg `${firstAuthorName} reposted your post`);
        notificationContent = hasMultipleAuthors ? (_jsxs(Trans, { children: [firstAuthorLink, " and", ' ', _jsx(Text, { style: [a.text_md, a.font_bold, a.leading_snug], children: _jsx(Plural, { value: additionalAuthorsCount, one: `${formattedAuthorsCount} other`, other: `${formattedAuthorsCount} others` }) }), ' ', "reposted your post"] })) : (_jsxs(Trans, { children: [firstAuthorLink, " reposted your post"] }));
        icon = _jsx(RepostIcon, { size: "xl", style: { color: t.palette.positive_600 } });
    }
    else if (item.type === 'follow') {
        let isFollowBack = false;
        if (item.notification.author.viewer?.following &&
            bsky.dangerousIsType(item.notification.record, AppBskyGraphFollow.isRecord)) {
            let followingTimestamp;
            try {
                const rkey = new AtUri(item.notification.author.viewer.following).rkey;
                followingTimestamp = TID.fromStr(rkey).timestamp();
            }
            catch (e) {
                // For some reason the following URI was invalid. Default to it not being a follow back.
                console.error('Invalid following URI');
            }
            if (followingTimestamp) {
                const followedTimestamp = new Date(item.notification.record.createdAt).getTime() * 1000;
                isFollowBack = followedTimestamp > followingTimestamp;
            }
        }
        if (isFollowBack && !hasMultipleAuthors) {
            /*
             * Follow-backs are ungrouped, grouped follow-backs not supported atm,
             * see `src/state/queries/notifications/util.ts`
             */
            a11yLabel = _(msg `${firstAuthorName} followed you back`);
            notificationContent = _jsxs(Trans, { children: [firstAuthorLink, " followed you back"] });
        }
        else {
            a11yLabel = hasMultipleAuthors
                ? _(msg `${firstAuthorName} and ${plural(additionalAuthorsCount, {
                    one: `${formattedAuthorsCount} other`,
                    other: `${formattedAuthorsCount} others`,
                })} followed you`)
                : _(msg `${firstAuthorName} followed you`);
            notificationContent = hasMultipleAuthors ? (_jsxs(Trans, { children: [firstAuthorLink, " and", ' ', _jsx(Text, { style: [a.text_md, a.font_bold, a.leading_snug], children: _jsx(Plural, { value: additionalAuthorsCount, one: `${formattedAuthorsCount} other`, other: `${formattedAuthorsCount} others` }) }), ' ', "followed you"] })) : (_jsxs(Trans, { children: [firstAuthorLink, " followed you"] }));
        }
        icon = _jsx(PersonPlusIcon, { size: "xl", style: { color: t.palette.primary_500 } });
    }
    else if (item.type === 'feedgen-like') {
        a11yLabel = hasMultipleAuthors
            ? _(msg `${firstAuthorName} and ${plural(additionalAuthorsCount, {
                one: `${formattedAuthorsCount} other`,
                other: `${formattedAuthorsCount} others`,
            })} liked your custom feed`)
            : _(msg `${firstAuthorName} liked your custom feed`);
        notificationContent = hasMultipleAuthors ? (_jsxs(Trans, { children: [firstAuthorLink, " and", ' ', _jsx(Text, { style: [a.text_md, a.font_bold, a.leading_snug], children: _jsx(Plural, { value: additionalAuthorsCount, one: `${formattedAuthorsCount} other`, other: `${formattedAuthorsCount} others` }) }), ' ', "liked your custom feed"] })) : (_jsxs(Trans, { children: [firstAuthorLink, " liked your custom feed"] }));
    }
    else if (item.type === 'starterpack-joined') {
        a11yLabel = hasMultipleAuthors
            ? _(msg `${firstAuthorName} and ${plural(additionalAuthorsCount, {
                one: `${formattedAuthorsCount} other`,
                other: `${formattedAuthorsCount} others`,
            })} signed up with your starter pack`)
            : _(msg `${firstAuthorName} signed up with your starter pack`);
        notificationContent = hasMultipleAuthors ? (_jsxs(Trans, { children: [firstAuthorLink, " and", ' ', _jsx(Text, { style: [a.text_md, a.font_bold, a.leading_snug], children: _jsx(Plural, { value: additionalAuthorsCount, one: `${formattedAuthorsCount} other`, other: `${formattedAuthorsCount} others` }) }), ' ', "signed up with your starter pack"] })) : (_jsxs(Trans, { children: [firstAuthorLink, " signed up with your starter pack"] }));
        icon = (_jsx(View, { style: { height: 30, width: 30 }, children: _jsx(StarterPack, { width: 30, gradient: "sky" }) }));
    }
    else if (item.type === 'verified') {
        a11yLabel = hasMultipleAuthors
            ? _(msg `${firstAuthorName} and ${plural(additionalAuthorsCount, {
                one: `${formattedAuthorsCount} other`,
                other: `${formattedAuthorsCount} others`,
            })} verified you`)
            : _(msg `${firstAuthorName} verified you`);
        notificationContent = hasMultipleAuthors ? (_jsxs(Trans, { children: [firstAuthorLink, " and", ' ', _jsx(Text, { style: [pal.text, s.bold], children: _jsx(Plural, { value: additionalAuthorsCount, one: `${formattedAuthorsCount} other`, other: `${formattedAuthorsCount} others` }) }), ' ', "verified you"] })) : (_jsxs(Trans, { children: [firstAuthorLink, " verified you"] }));
        icon = _jsx(VerifiedCheck, { size: "xl" });
    }
    else if (item.type === 'unverified') {
        a11yLabel = hasMultipleAuthors
            ? _(msg `${firstAuthorName} and ${plural(additionalAuthorsCount, {
                one: `${formattedAuthorsCount} other`,
                other: `${formattedAuthorsCount} others`,
            })} removed their verifications from your account`)
            : _(msg `${firstAuthorName} removed their verification from your account`);
        notificationContent = hasMultipleAuthors ? (_jsxs(Trans, { children: [firstAuthorLink, " and", ' ', _jsx(Text, { style: [pal.text, s.bold], children: _jsx(Plural, { value: additionalAuthorsCount, one: `${formattedAuthorsCount} other`, other: `${formattedAuthorsCount} others` }) }), ' ', "removed their verifications from your account"] })) : (_jsxs(Trans, { children: [firstAuthorLink, " removed their verification from your account"] }));
        icon = _jsx(VerifiedCheck, { size: "xl", fill: t.palette.contrast_500 });
    }
    else if (item.type === 'like-via-repost') {
        a11yLabel = hasMultipleAuthors
            ? _(msg `${firstAuthorName} and ${plural(additionalAuthorsCount, {
                one: `${formattedAuthorsCount} other`,
                other: `${formattedAuthorsCount} others`,
            })} liked your repost`)
            : _(msg `${firstAuthorName} liked your repost`);
        notificationContent = hasMultipleAuthors ? (_jsxs(Trans, { children: [firstAuthorLink, " and", ' ', _jsx(Text, { style: [a.text_md, a.font_bold, a.leading_snug], children: _jsx(Plural, { value: additionalAuthorsCount, one: `${formattedAuthorsCount} other`, other: `${formattedAuthorsCount} others` }) }), ' ', "liked your repost"] })) : (_jsxs(Trans, { children: [firstAuthorLink, " liked your repost"] }));
    }
    else if (item.type === 'repost-via-repost') {
        a11yLabel = hasMultipleAuthors
            ? _(msg `${firstAuthorName} and ${plural(additionalAuthorsCount, {
                one: `${formattedAuthorsCount} other`,
                other: `${formattedAuthorsCount} others`,
            })} reposted your repost`)
            : _(msg `${firstAuthorName} reposted your repost`);
        notificationContent = hasMultipleAuthors ? (_jsxs(Trans, { children: [firstAuthorLink, " and", ' ', _jsx(Text, { style: [a.text_md, a.font_bold, a.leading_snug], children: _jsx(Plural, { value: additionalAuthorsCount, one: `${formattedAuthorsCount} other`, other: `${formattedAuthorsCount} others` }) }), ' ', "reposted your repost"] })) : (_jsxs(Trans, { children: [firstAuthorLink, " reposted your repost"] }));
        icon = _jsx(RepostIcon, { size: "xl", style: { color: t.palette.positive_600 } });
    }
    else if (item.type === 'subscribed-post') {
        const postsCount = 1 + (item.additional?.length || 0);
        a11yLabel = hasMultipleAuthors
            ? _(msg `New posts from ${firstAuthorName} and ${plural(additionalAuthorsCount, {
                one: `${formattedAuthorsCount} other`,
                other: `${formattedAuthorsCount} others`,
            })}`)
            : _(msg `New ${plural(postsCount, {
                one: 'post',
                other: 'posts',
            })} from ${firstAuthorName}`);
        notificationContent = hasMultipleAuthors ? (_jsxs(Trans, { children: ["New posts from ", firstAuthorLink, " and", ' ', _jsx(Text, { style: [a.text_md, a.font_bold, a.leading_snug], children: _jsx(Plural, { value: additionalAuthorsCount, one: `${formattedAuthorsCount} other`, other: `${formattedAuthorsCount} others` }) }), ' '] })) : (_jsxs(Trans, { children: ["New ", _jsx(Plural, { value: postsCount, one: "post", other: "posts" }), " from", ' ', firstAuthorLink] }));
        icon = _jsx(BellRingingIcon, { size: "xl", style: { color: t.palette.primary_500 } });
    }
    else {
        return null;
    }
    a11yLabel += ` · ${niceTimestamp}`;
    return (_jsx(Link, { label: a11yLabel, testID: `feedItem-by-${item.notification.author.handle}`, style: [
            a.flex_row,
            a.align_start,
            { padding: 10 },
            a.pr_lg,
            t.atoms.border_contrast_low,
            item.notification.isRead
                ? undefined
                : {
                    backgroundColor: pal.colors.unreadNotifBg,
                    borderColor: pal.colors.unreadNotifBorder,
                },
            !hideTopBorder && a.border_t,
            a.overflow_hidden,
        ], to: itemHref, accessible: !isAuthorsExpanded, accessibilityActions: hasMultipleAuthors
            ? [
                {
                    name: 'toggleAuthorsExpanded',
                    label: isAuthorsExpanded
                        ? _(msg `Collapse list of users`)
                        : _(msg `Expand list of users`),
                },
            ]
            : [
                {
                    name: 'viewProfile',
                    label: _(msg `View ${authors[0].profile.displayName || authors[0].profile.handle}'s profile`),
                },
            ], onAccessibilityAction: e => {
            if (e.nativeEvent.actionName === 'activate') {
                onBeforePress();
            }
            if (e.nativeEvent.actionName === 'toggleAuthorsExpanded') {
                onToggleAuthorsExpanded();
            }
        }, children: ({ hovered }) => (_jsxs(_Fragment, { children: [_jsx(SubtleWebHover, { hover: hovered }), _jsx(View, { style: [styles.layoutIcon, a.pr_sm], children: icon }), _jsxs(View, { style: [a.flex_1], children: [_jsxs(ExpandListPressable, { hasMultipleAuthors: hasMultipleAuthors, onToggleAuthorsExpanded: onToggleAuthorsExpanded, children: [_jsx(CondensedAuthorsList, { visible: !isAuthorsExpanded, authors: authors, onToggleAuthorsExpanded: onToggleAuthorsExpanded, showDmButton: item.type === 'starterpack-joined' }), _jsx(ExpandedAuthorsList, { visible: isAuthorsExpanded, authors: authors }), _jsxs(Text, { style: [
                                        a.flex_row,
                                        a.flex_wrap,
                                        { paddingTop: 6 },
                                        a.self_start,
                                        a.text_md,
                                        a.leading_snug,
                                    ], accessibilityHint: "", accessibilityLabel: a11yLabel, children: [notificationContent, _jsx(TimeElapsed, { timestamp: item.notification.indexedAt, children: ({ timeElapsed }) => (_jsxs(_Fragment, { children: [_jsxs(Text, { style: [a.text_md, t.atoms.text_contrast_medium], children: [' ', "\u00B7", ' '] }), _jsx(Text, { style: [a.text_md, t.atoms.text_contrast_medium], title: niceTimestamp, children: timeElapsed })] })) })] })] }), item.type === 'post-like' ||
                            item.type === 'repost' ||
                            item.type === 'like-via-repost' ||
                            item.type === 'repost-via-repost' ||
                            item.type === 'subscribed-post' ? (_jsx(View, { style: [a.pt_2xs], children: _jsx(AdditionalPostText, { post: item.subject }) })) : null, item.type === 'feedgen-like' && item.subjectUri ? (_jsx(FeedSourceCard, { feedUri: item.subjectUri, link: false, style: [
                                t.atoms.bg,
                                t.atoms.border_contrast_low,
                                a.border,
                                a.p_md,
                                styles.feedcard,
                            ], showLikes: true })) : null, item.type === 'starterpack-joined' ? (_jsx(View, { children: _jsx(View, { style: [
                                    a.border,
                                    a.p_sm,
                                    a.rounded_sm,
                                    a.mt_sm,
                                    t.atoms.border_contrast_low,
                                ], children: _jsx(StarterPackCard, { starterPack: item.subject }) }) })) : null] })] })) }));
};
NotificationFeedItem = memo(NotificationFeedItem);
export { NotificationFeedItem };
function ExpandListPressable({ hasMultipleAuthors, children, onToggleAuthorsExpanded, }) {
    if (hasMultipleAuthors) {
        return (_jsx(Pressable, { onPress: onToggleAuthorsExpanded, style: [styles.expandedAuthorsTrigger], accessible: false, children: children }));
    }
    else {
        return _jsx(_Fragment, { children: children });
    }
}
function SayHelloBtn({ profile }) {
    const { _ } = useLingui();
    const agent = useAgent();
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    if (profile.associated?.chat?.allowIncoming === 'none' ||
        (profile.associated?.chat?.allowIncoming === 'following' &&
            !profile.viewer?.followedBy)) {
        return null;
    }
    return (_jsx(Button, { label: _(msg `Say hello!`), variant: "ghost", color: "primary", size: "small", style: [a.self_center, { marginLeft: 'auto' }], disabled: isLoading, onPress: async () => {
            try {
                setIsLoading(true);
                const res = await agent.api.chat.bsky.convo.getConvoForMembers({
                    members: [profile.did, agent.session.did],
                }, { headers: DM_SERVICE_HEADERS });
                navigation.navigate('MessagesConversation', {
                    conversation: res.data.convo.id,
                });
            }
            catch (e) {
                logger.error('Failed to get conversation', { safeMessage: e });
            }
            finally {
                setIsLoading(false);
            }
        }, children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Say hello!" }) }) }));
}
function CondensedAuthorsList({ visible, authors, onToggleAuthorsExpanded, showDmButton = true, }) {
    const t = useTheme();
    const { _ } = useLingui();
    if (!visible) {
        return (_jsx(View, { style: [a.flex_row, a.align_center], children: _jsxs(TouchableOpacity, { style: styles.expandedAuthorsCloseBtn, onPress: onToggleAuthorsExpanded, accessibilityRole: "button", accessibilityLabel: _(msg `Hide user list`), accessibilityHint: _(msg `Collapses list of users for a given notification`), children: [_jsx(ChevronUpIcon, { size: "md", style: [a.ml_xs, a.mr_md, t.atoms.text_contrast_high] }), _jsx(Text, { style: [a.text_md, t.atoms.text_contrast_high], children: _jsx(Trans, { context: "action", children: "Hide" }) })] }) }));
    }
    if (authors.length === 1) {
        return (_jsxs(View, { style: [a.flex_row, a.align_center], children: [_jsx(PreviewableUserAvatar, { size: 35, profile: authors[0].profile, moderation: authors[0].moderation.ui('avatar'), type: authors[0].profile.associated?.labeler ? 'labeler' : 'user' }), showDmButton ? _jsx(SayHelloBtn, { profile: authors[0].profile }) : null] }));
    }
    return (_jsx(TouchableOpacity, { accessibilityRole: "none", onPress: onToggleAuthorsExpanded, children: _jsxs(View, { style: [a.flex_row, a.align_center], children: [authors.slice(0, MAX_AUTHORS).map(author => (_jsx(View, { style: s.mr5, children: _jsx(PreviewableUserAvatar, { size: 35, profile: author.profile, moderation: author.moderation.ui('avatar'), type: author.profile.associated?.labeler ? 'labeler' : 'user' }) }, author.href))), authors.length > MAX_AUTHORS ? (_jsxs(Text, { style: [
                        a.font_bold,
                        { paddingLeft: 6 },
                        t.atoms.text_contrast_medium,
                    ], children: ["+", authors.length - MAX_AUTHORS] })) : undefined, _jsx(ChevronDownIcon, { size: "md", style: [a.mx_xs, t.atoms.text_contrast_medium] })] }) }));
}
function ExpandedAuthorsList({ visible, authors, }) {
    const heightInterp = useAnimatedValue(visible ? 1 : 0);
    const targetHeight = authors.length * (EXPANDED_AUTHOR_EL_HEIGHT + 10); /*10=margin*/
    const heightStyle = {
        height: Animated.multiply(heightInterp, targetHeight),
    };
    useEffect(() => {
        Animated.timing(heightInterp, {
            toValue: visible ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [heightInterp, visible]);
    return (_jsx(Animated.View, { style: [a.overflow_hidden, heightStyle], children: visible &&
            authors.map(author => (_jsx(ExpandedAuthorCard, { author: author }, author.profile.did))) }));
}
function ExpandedAuthorCard({ author }) {
    const t = useTheme();
    const { _ } = useLingui();
    const verification = useSimpleVerificationState({
        profile: author.profile,
    });
    return (_jsxs(Link, { label: author.profile.displayName || author.profile.handle, accessibilityHint: _(msg `Opens this profile`), to: makeProfileLink({
            did: author.profile.did,
            handle: author.profile.handle,
        }), style: styles.expandedAuthor, children: [_jsx(View, { style: [a.mr_sm], children: _jsx(ProfileHoverCard, { did: author.profile.did, children: _jsx(UserAvatar, { size: 35, avatar: author.profile.avatar, moderation: author.moderation.ui('avatar'), type: author.profile.associated?.labeler ? 'labeler' : 'user' }) }) }), _jsx(View, { style: [a.flex_1], children: _jsxs(View, { style: [a.flex_row, a.align_end], children: [_jsx(Text, { numberOfLines: 1, emoji: true, style: [
                                a.text_md,
                                a.font_bold,
                                a.leading_tight,
                                { maxWidth: '70%' },
                            ], children: sanitizeDisplayName(author.profile.displayName || author.profile.handle) }), verification.showBadge && (_jsx(View, { style: [a.pl_xs, a.self_center], children: _jsx(VerificationCheck, { width: 14, verifier: verification.role === 'verifier' }) })), _jsx(Text, { numberOfLines: 1, style: [
                                a.pl_xs,
                                a.text_md,
                                a.leading_tight,
                                a.flex_shrink,
                                t.atoms.text_contrast_medium,
                            ], children: sanitizeHandle(author.profile.handle, '@') })] }) })] }, author.profile.did));
}
function AdditionalPostText({ post }) {
    const t = useTheme();
    if (post &&
        bsky.dangerousIsType(post?.record, AppBskyFeedPost.isRecord)) {
        const text = post.record.text;
        return (_jsxs(_Fragment, { children: [text?.length > 0 && (_jsx(Text, { emoji: true, style: [a.text_sm, a.leading_snug, t.atoms.text_contrast_medium], numberOfLines: MAX_POST_LINES, children: text })), _jsx(MediaPreview.Embed, { embed: post.embed, style: styles.additionalPostImages })] }));
    }
}
const styles = StyleSheet.create({
    layoutIcon: {
        width: 60,
        alignItems: 'flex-end',
        paddingTop: 2,
    },
    icon: {
        marginRight: 10,
        marginTop: 4,
    },
    additionalPostImages: {
        marginTop: 5,
        marginLeft: 2,
        opacity: 0.8,
    },
    feedcard: {
        borderRadius: 8,
        marginTop: 6,
    },
    addedContainer: {
        paddingTop: 4,
        paddingLeft: 36,
    },
    expandedAuthorsTrigger: {
        zIndex: 1,
    },
    expandedAuthorsCloseBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 6,
    },
    expandedAuthor: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        height: EXPANDED_AUTHOR_EL_HEIGHT,
    },
});
//# sourceMappingURL=NotificationFeedItem.js.map