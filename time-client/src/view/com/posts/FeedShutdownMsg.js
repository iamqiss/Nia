import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { PROD_DEFAULT_FEED } from '#/lib/constants';
import { logger } from '#/logger';
import { usePreferencesQuery, useRemoveFeedMutation, useReplaceForYouWithDiscoverFeedMutation, } from '#/state/queries/preferences';
import { useSetSelectedFeed } from '#/state/shell/selected-feed';
import * as Toast from '#/view/com/util/Toast';
import { atoms as a, useTheme } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import { InlineLinkText } from '#/components/Link';
import { Loader } from '#/components/Loader';
import { Text } from '#/components/Typography';
export function FeedShutdownMsg({ feedUri }) {
    const t = useTheme();
    const { _ } = useLingui();
    const setSelectedFeed = useSetSelectedFeed();
    const { data: preferences } = usePreferencesQuery();
    const { mutateAsync: removeFeed, isPending: isRemovePending } = useRemoveFeedMutation();
    const { mutateAsync: replaceFeedWithDiscover, isPending: isReplacePending } = useReplaceForYouWithDiscoverFeedMutation();
    const feedConfig = preferences?.savedFeeds?.find(f => f.value === feedUri && f.pinned);
    const discoverFeedConfig = preferences?.savedFeeds?.find(f => f.value === PROD_DEFAULT_FEED('whats-hot'));
    const hasFeedPinned = Boolean(feedConfig);
    const hasDiscoverPinned = Boolean(discoverFeedConfig?.pinned);
    const onRemoveFeed = React.useCallback(async () => {
        try {
            if (feedConfig) {
                await removeFeed(feedConfig);
                Toast.show(_(msg `Removed from your feeds`));
            }
            if (hasDiscoverPinned) {
                setSelectedFeed(`feedgen|${PROD_DEFAULT_FEED('whats-hot')}`);
            }
        }
        catch (err) {
            Toast.show(_(msg `There was an issue updating your feeds, please check your internet connection and try again.`), 'exclamation-circle');
            logger.error('Failed to update feeds', { message: err });
        }
    }, [removeFeed, feedConfig, _, hasDiscoverPinned, setSelectedFeed]);
    const onReplaceFeed = React.useCallback(async () => {
        try {
            await replaceFeedWithDiscover({
                forYouFeedConfig: feedConfig,
                discoverFeedConfig,
            });
            setSelectedFeed(`feedgen|${PROD_DEFAULT_FEED('whats-hot')}`);
            Toast.show(_(msg `The feed has been replaced with Discover.`));
        }
        catch (err) {
            Toast.show(_(msg `There was an issue updating your feeds, please check your internet connection and try again.`), 'exclamation-circle');
            logger.error('Failed to update feeds', { message: err });
        }
    }, [
        replaceFeedWithDiscover,
        discoverFeedConfig,
        feedConfig,
        setSelectedFeed,
        _,
    ]);
    const isProcessing = isReplacePending || isRemovePending;
    return (_jsxs(View, { style: [
            a.py_3xl,
            a.px_2xl,
            a.gap_xl,
            t.atoms.border_contrast_low,
            a.border_t,
        ], children: [_jsx(Text, { style: [a.text_5xl, a.font_bold, t.atoms.text, a.text_center], children: ":(" }), _jsx(Text, { style: [a.text_md, a.leading_snug, t.atoms.text, a.text_center], children: _jsxs(Trans, { children: ["This feed is no longer online. We are showing", ' ', _jsx(InlineLinkText, { label: _(msg `The Discover feed`), to: "/profile/bsky.app/feed/whats-hot", style: [a.text_md], children: "Discover" }), ' ', "instead."] }) }), hasFeedPinned ? (_jsxs(View, { style: [a.flex_row, a.justify_center, a.gap_sm], children: [_jsxs(Button, { variant: "outline", color: "primary", size: "small", label: _(msg `Remove feed`), disabled: isProcessing, onPress: onRemoveFeed, children: [_jsx(ButtonText, { children: _jsx(Trans, { children: "Remove feed" }) }), isRemovePending && _jsx(ButtonIcon, { icon: Loader })] }), !hasDiscoverPinned && (_jsxs(Button, { variant: "solid", color: "primary", size: "small", label: _(msg `Replace with Discover`), disabled: isProcessing, onPress: onReplaceFeed, children: [_jsx(ButtonText, { children: _jsx(Trans, { children: "Replace with Discover" }) }), isReplacePending && _jsx(ButtonIcon, { icon: Loader })] }))] })) : undefined] }));
}
//# sourceMappingURL=FeedShutdownMsg.js.map