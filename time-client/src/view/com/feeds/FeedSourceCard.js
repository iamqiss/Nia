import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { View } from 'react-native';
import { AppBskyFeedDefs, AtUri, } from '@atproto/api';
import { msg, Plural, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { sanitizeHandle } from '#/lib/strings/handles';
import { hydrateFeedGenerator, hydrateList, useFeedSourceInfoQuery, } from '#/state/queries/feed';
import { FeedLoadingPlaceholder } from '#/view/com/util/LoadingPlaceholder';
import { UserAvatar } from '#/view/com/util/UserAvatar';
import { atoms as a, useTheme } from '#/alf';
import { Link } from '#/components/Link';
import { RichText } from '#/components/RichText';
import { Text } from '#/components/Typography';
import { MissingFeed } from './MissingFeed';
export function FeedSourceCard({ feedUri, feedData, ...props }) {
    if (feedData) {
        let feed;
        if (AppBskyFeedDefs.isGeneratorView(feedData)) {
            feed = hydrateFeedGenerator(feedData);
        }
        else {
            feed = hydrateList(feedData);
        }
        return _jsx(FeedSourceCardLoaded, { feedUri: feedUri, feed: feed, ...props });
    }
    else {
        return _jsx(FeedSourceCardWithoutData, { feedUri: feedUri, ...props });
    }
}
export function FeedSourceCardWithoutData({ feedUri, ...props }) {
    const { data: feed, error } = useFeedSourceInfoQuery({
        uri: feedUri,
    });
    return (_jsx(FeedSourceCardLoaded, { feedUri: feedUri, feed: feed, error: error, ...props }));
}
export function FeedSourceCardLoaded({ feedUri, feed, style, showDescription = false, showLikes = false, showMinimalPlaceholder, hideTopBorder, link = true, error, }) {
    const t = useTheme();
    const { _ } = useLingui();
    /*
     * LOAD STATE
     *
     * This state also captures the scenario where a feed can't load for whatever
     * reason.
     */
    if (!feed) {
        if (error) {
            return (_jsx(MissingFeed, { uri: feedUri, style: style, hideTopBorder: hideTopBorder, error: error }));
        }
        return (_jsx(FeedLoadingPlaceholder, { style: [
                t.atoms.border_contrast_low,
                !(showMinimalPlaceholder || hideTopBorder) && a.border_t,
                a.flex_1,
                style,
            ], showTopBorder: false, showLowerPlaceholder: !showMinimalPlaceholder }));
    }
    const inner = (_jsxs(_Fragment, { children: [_jsxs(View, { style: [a.flex_row, a.align_center], children: [_jsx(View, { style: [a.mr_md], children: _jsx(UserAvatar, { type: "algo", size: 36, avatar: feed.avatar }) }), _jsxs(View, { style: [a.flex_1], children: [_jsx(Text, { emoji: true, style: [a.text_sm, a.font_bold, a.leading_snug], numberOfLines: 1, children: feed.displayName }), _jsx(Text, { style: [a.text_sm, t.atoms.text_contrast_medium, a.leading_snug], numberOfLines: 1, children: feed.type === 'feed' ? (_jsxs(Trans, { children: ["Feed by ", sanitizeHandle(feed.creatorHandle, '@')] })) : (_jsxs(Trans, { children: ["List by ", sanitizeHandle(feed.creatorHandle, '@')] })) })] })] }), showDescription && feed.description ? (_jsx(RichText, { style: [t.atoms.text_contrast_high, a.flex_1, a.flex_wrap], value: feed.description, numberOfLines: 3 })) : null, showLikes && feed.type === 'feed' ? (_jsx(Text, { style: [
                    a.text_sm,
                    a.font_bold,
                    t.atoms.text_contrast_medium,
                    a.leading_snug,
                ], children: _jsxs(Trans, { children: ["Liked by", ' ', _jsx(Plural, { value: feed.likeCount || 0, one: "# user", other: "# users" })] }) })) : null] }));
    if (link) {
        return (_jsx(Link, { testID: `feed-${feed.displayName}`, label: _(feed.type === 'feed'
                ? msg `${feed.displayName}, a feed by ${sanitizeHandle(feed.creatorHandle, '@')}, liked by ${feed.likeCount || 0}`
                : msg `${feed.displayName}, a list by ${sanitizeHandle(feed.creatorHandle, '@')}`), to: {
                screen: feed.type === 'feed' ? 'ProfileFeed' : 'ProfileList',
                params: { name: feed.creatorDid, rkey: new AtUri(feed.uri).rkey },
            }, style: [
                a.flex_1,
                a.p_lg,
                a.gap_md,
                !hideTopBorder && !a.border_t,
                t.atoms.border_contrast_low,
                style,
            ], children: inner }));
    }
    else {
        return (_jsx(View, { style: [
                a.flex_1,
                a.p_lg,
                a.gap_md,
                !hideTopBorder && !a.border_t,
                t.atoms.border_contrast_low,
                style,
            ], children: inner }));
    }
}
//# sourceMappingURL=FeedSourceCard.js.map