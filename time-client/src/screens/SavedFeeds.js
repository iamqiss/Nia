import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import {} from '@atproto/api';
import { TID } from '@atproto/common-web';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import {} from '@react-navigation/native-stack';
import { RECOMMENDED_SAVED_FEEDS, TIMELINE_SAVED_FEED } from '#/lib/constants';
import { useHaptics } from '#/lib/haptics';
import {} from '#/lib/routes/types';
import { logger } from '#/logger';
import { useOverwriteSavedFeedsMutation, usePreferencesQuery, } from '#/state/queries/preferences';
import {} from '#/state/queries/preferences/types';
import { useSetMinimalShellMode } from '#/state/shell';
import { FeedSourceCard } from '#/view/com/feeds/FeedSourceCard';
import * as Toast from '#/view/com/util/Toast';
import { NoFollowingFeed } from '#/screens/Feeds/NoFollowingFeed';
import { NoSavedFeedsOfAnyType } from '#/screens/Feeds/NoSavedFeedsOfAnyType';
import { atoms as a, useBreakpoints, useTheme } from '#/alf';
import { Admonition } from '#/components/Admonition';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import { ArrowBottom_Stroke2_Corner0_Rounded as ArrowDownIcon, ArrowTop_Stroke2_Corner0_Rounded as ArrowUpIcon, } from '#/components/icons/Arrow';
import { FilterTimeline_Stroke2_Corner0_Rounded as FilterTimeline } from '#/components/icons/FilterTimeline';
import { FloppyDisk_Stroke2_Corner0_Rounded as SaveIcon } from '#/components/icons/FloppyDisk';
import { Pin_Filled_Corner0_Rounded as PinIcon } from '#/components/icons/Pin';
import { Trash_Stroke2_Corner0_Rounded as TrashIcon } from '#/components/icons/Trash';
import * as Layout from '#/components/Layout';
import { InlineLinkText } from '#/components/Link';
import { Loader } from '#/components/Loader';
import { Text } from '#/components/Typography';
export function SavedFeeds({}) {
    const { data: preferences } = usePreferencesQuery();
    if (!preferences) {
        return _jsx(View, {});
    }
    return _jsx(SavedFeedsInner, { preferences: preferences });
}
function SavedFeedsInner({ preferences, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const { gtMobile } = useBreakpoints();
    const setMinimalShellMode = useSetMinimalShellMode();
    const { mutateAsync: overwriteSavedFeeds, isPending: isOverwritePending } = useOverwriteSavedFeedsMutation();
    const navigation = useNavigation();
    /*
     * Use optimistic data if exists and no error, otherwise fallback to remote
     * data
     */
    const [currentFeeds, setCurrentFeeds] = useState(() => preferences.savedFeeds || []);
    const hasUnsavedChanges = currentFeeds !== preferences.savedFeeds;
    const pinnedFeeds = currentFeeds.filter(f => f.pinned);
    const unpinnedFeeds = currentFeeds.filter(f => !f.pinned);
    const noSavedFeedsOfAnyType = pinnedFeeds.length + unpinnedFeeds.length === 0;
    const noFollowingFeed = currentFeeds.every(f => f.type !== 'timeline') && !noSavedFeedsOfAnyType;
    useFocusEffect(useCallback(() => {
        setMinimalShellMode(false);
    }, [setMinimalShellMode]));
    const onSaveChanges = async () => {
        try {
            await overwriteSavedFeeds(currentFeeds);
            Toast.show(_(msg({ message: 'Feeds updated!', context: 'toast' })));
            if (navigation.canGoBack()) {
                navigation.goBack();
            }
            else {
                navigation.navigate('Feeds');
            }
        }
        catch (e) {
            Toast.show(_(msg `There was an issue contacting the server`), 'xmark');
            logger.error('Failed to toggle pinned feed', { message: e });
        }
    };
    return (_jsxs(Layout.Screen, { children: [_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, { align: "left", children: _jsx(Layout.Header.TitleText, { children: _jsx(Trans, { children: "Feeds" }) }) }), _jsxs(Button, { testID: "saveChangesBtn", size: "small", color: hasUnsavedChanges ? 'primary' : 'secondary', onPress: onSaveChanges, label: _(msg `Save changes`), disabled: isOverwritePending || !hasUnsavedChanges, children: [_jsx(ButtonIcon, { icon: isOverwritePending ? Loader : SaveIcon }), _jsx(ButtonText, { children: gtMobile ? _jsx(Trans, { children: "Save changes" }) : _jsx(Trans, { children: "Save" }) })] })] }), _jsxs(Layout.Content, { children: [noSavedFeedsOfAnyType && (_jsx(View, { style: [t.atoms.border_contrast_low, a.border_b], children: _jsx(NoSavedFeedsOfAnyType, { onAddRecommendedFeeds: () => setCurrentFeeds(RECOMMENDED_SAVED_FEEDS.map(f => ({
                                ...f,
                                id: TID.nextStr(),
                            }))) }) })), _jsx(SectionHeaderText, { children: _jsx(Trans, { children: "Pinned Feeds" }) }), preferences ? (!pinnedFeeds.length ? (_jsx(View, { style: [a.flex_1, a.p_lg], children: _jsx(Admonition, { type: "info", children: _jsx(Trans, { children: "You don't have any pinned feeds." }) }) })) : (pinnedFeeds.map(f => (_jsx(ListItem, { feed: f, isPinned: true, currentFeeds: currentFeeds, setCurrentFeeds: setCurrentFeeds, preferences: preferences }, f.id))))) : (_jsx(View, { style: [a.w_full, a.py_2xl, a.align_center], children: _jsx(Loader, { size: "xl" }) })), noFollowingFeed && (_jsx(View, { style: [t.atoms.border_contrast_low, a.border_b], children: _jsx(NoFollowingFeed, { onAddFeed: () => setCurrentFeeds(feeds => [
                                ...feeds,
                                { ...TIMELINE_SAVED_FEED, id: TID.next().toString() },
                            ]) }) })), _jsx(SectionHeaderText, { children: _jsx(Trans, { children: "Saved Feeds" }) }), preferences ? (!unpinnedFeeds.length ? (_jsx(View, { style: [a.flex_1, a.p_lg], children: _jsx(Admonition, { type: "info", children: _jsx(Trans, { children: "You don't have any saved feeds." }) }) })) : (unpinnedFeeds.map(f => (_jsx(ListItem, { feed: f, isPinned: false, currentFeeds: currentFeeds, setCurrentFeeds: setCurrentFeeds, preferences: preferences }, f.id))))) : (_jsx(View, { style: [a.w_full, a.py_2xl, a.align_center], children: _jsx(Loader, { size: "xl" }) })), _jsx(View, { style: [a.px_lg, a.py_xl], children: _jsx(Text, { style: [a.text_sm, t.atoms.text_contrast_medium, a.leading_snug], children: _jsxs(Trans, { children: ["Feeds are custom algorithms that users build with a little coding expertise.", ' ', _jsx(InlineLinkText, { to: "https://github.com/bluesky-social/feed-generator", label: _(msg `See this guide`), disableMismatchWarning: true, style: [a.leading_snug], children: "See this guide" }), ' ', "for more information."] }) }) })] })] }));
}
function ListItem({ feed, isPinned, currentFeeds, setCurrentFeeds, }) {
    const { _ } = useLingui();
    const t = useTheme();
    const playHaptic = useHaptics();
    const feedUri = feed.value;
    const onTogglePinned = async () => {
        playHaptic();
        setCurrentFeeds(currentFeeds.map(f => f.id === feed.id ? { ...feed, pinned: !feed.pinned } : f));
    };
    const onPressUp = async () => {
        if (!isPinned)
            return;
        const nextFeeds = currentFeeds.slice();
        const ids = currentFeeds.map(f => f.id);
        const index = ids.indexOf(feed.id);
        const nextIndex = index - 1;
        if (index === -1 || index === 0)
            return;
        [nextFeeds[index], nextFeeds[nextIndex]] = [
            nextFeeds[nextIndex],
            nextFeeds[index],
        ];
        setCurrentFeeds(nextFeeds);
    };
    const onPressDown = async () => {
        if (!isPinned)
            return;
        const nextFeeds = currentFeeds.slice();
        const ids = currentFeeds.map(f => f.id);
        const index = ids.indexOf(feed.id);
        const nextIndex = index + 1;
        if (index === -1 || index >= nextFeeds.filter(f => f.pinned).length - 1)
            return;
        [nextFeeds[index], nextFeeds[nextIndex]] = [
            nextFeeds[nextIndex],
            nextFeeds[index],
        ];
        setCurrentFeeds(nextFeeds);
    };
    const onPressRemove = async () => {
        playHaptic();
        setCurrentFeeds(currentFeeds.filter(f => f.id !== feed.id));
    };
    return (_jsxs(Animated.View, { style: [a.flex_row, a.border_b, t.atoms.border_contrast_low], layout: LinearTransition.duration(100), children: [feed.type === 'timeline' ? (_jsx(FollowingFeedCard, {})) : (_jsx(FeedSourceCard, { feedUri: feedUri, style: [isPinned && a.pr_sm], showMinimalPlaceholder: true, hideTopBorder: true }, feedUri)), _jsxs(View, { style: [a.pr_lg, a.flex_row, a.align_center, a.gap_sm], children: [isPinned ? (_jsxs(_Fragment, { children: [_jsx(Button, { testID: `feed-${feed.type}-moveUp`, label: _(msg `Move feed up`), onPress: onPressUp, size: "small", color: "secondary", shape: "square", children: _jsx(ButtonIcon, { icon: ArrowUpIcon }) }), _jsx(Button, { testID: `feed-${feed.type}-moveDown`, label: _(msg `Move feed down`), onPress: onPressDown, size: "small", color: "secondary", shape: "square", children: _jsx(ButtonIcon, { icon: ArrowDownIcon }) })] })) : (_jsx(Button, { testID: `feed-${feedUri}-toggleSave`, label: _(msg `Remove from my feeds`), onPress: onPressRemove, size: "small", color: "secondary", variant: "ghost", shape: "square", children: _jsx(ButtonIcon, { icon: TrashIcon }) })), _jsx(Button, { testID: `feed-${feed.type}-togglePin`, label: isPinned ? _(msg `Unpin feed`) : _(msg `Pin feed`), onPress: onTogglePinned, size: "small", color: isPinned ? 'primary_subtle' : 'secondary', shape: "square", children: _jsx(ButtonIcon, { icon: PinIcon }) })] })] }));
}
function SectionHeaderText({ children }) {
    const t = useTheme();
    // eslint-disable-next-line bsky-internal/avoid-unwrapped-text
    return (_jsx(View, { style: [
            a.flex_row,
            a.flex_1,
            a.px_lg,
            a.pt_2xl,
            a.pb_md,
            a.border_b,
            t.atoms.border_contrast_low,
        ], children: _jsx(Text, { style: [a.text_xl, a.font_heavy, a.leading_snug], children: children }) }));
}
function FollowingFeedCard() {
    const t = useTheme();
    return (_jsxs(View, { style: [a.flex_row, a.align_center, a.flex_1, a.p_lg], children: [_jsx(View, { style: [
                    a.align_center,
                    a.justify_center,
                    a.rounded_sm,
                    a.mr_md,
                    {
                        width: 36,
                        height: 36,
                        backgroundColor: t.palette.primary_500,
                    },
                ], children: _jsx(FilterTimeline, { style: [
                        {
                            width: 22,
                            height: 22,
                        },
                    ], fill: t.palette.white }) }), _jsx(View, { style: [a.flex_1, a.flex_row, a.gap_sm, a.align_center], children: _jsx(Text, { style: [a.text_sm, a.font_bold, a.leading_snug], children: _jsx(Trans, { context: "feed-name", children: "Following" }) }) })] }));
}
//# sourceMappingURL=SavedFeeds.js.map