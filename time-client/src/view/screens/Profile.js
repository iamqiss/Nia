import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateProfile, RichText as RichTextAPI, } from '@atproto/api';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useFocusEffect } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useOpenComposer } from '#/lib/hooks/useOpenComposer';
import { useSetTitle } from '#/lib/hooks/useSetTitle';
import { ComposeIcon2 } from '#/lib/icons';
import {} from '#/lib/routes/types';
import { combinedDisplayName } from '#/lib/strings/display-names';
import { cleanError } from '#/lib/strings/errors';
import { isInvalidHandle } from '#/lib/strings/handles';
import { colors, s } from '#/lib/styles';
import { useProfileShadow } from '#/state/cache/profile-shadow';
import { listenSoftReset } from '#/state/events';
import { useModerationOpts } from '#/state/preferences/moderation-opts';
import { useLabelerInfoQuery } from '#/state/queries/labeler';
import { resetProfilePostsQueries } from '#/state/queries/post-feed';
import { useProfileQuery } from '#/state/queries/profile';
import { useResolveDidQuery } from '#/state/queries/resolve-uri';
import { useAgent, useSession } from '#/state/session';
import { useSetMinimalShellMode } from '#/state/shell';
import { ProfileFeedgens } from '#/view/com/feeds/ProfileFeedgens';
import { ProfileLists } from '#/view/com/lists/ProfileLists';
import { PagerWithHeader } from '#/view/com/pager/PagerWithHeader';
import { ErrorScreen } from '#/view/com/util/error/ErrorScreen';
import { FAB } from '#/view/com/util/fab/FAB';
import {} from '#/view/com/util/List';
import { ProfileHeader, ProfileHeaderLoading } from '#/screens/Profile/Header';
import { ProfileFeedSection } from '#/screens/Profile/Sections/Feed';
import { ProfileLabelsSection } from '#/screens/Profile/Sections/Labels';
import { atoms as a } from '#/alf';
import * as Layout from '#/components/Layout';
import { ScreenHider } from '#/components/moderation/ScreenHider';
import { ProfileStarterPacks } from '#/components/StarterPack/ProfileStarterPacks';
import { navigate } from '#/Navigation';
import { ExpoScrollForwarderView } from '../../../modules/expo-scroll-forwarder';
export function ProfileScreen(props) {
    return (_jsx(Layout.Screen, { testID: "profileScreen", style: [a.pt_0], children: _jsx(ProfileScreenInner, { ...props }) }));
}
function ProfileScreenInner({ route }) {
    const { _ } = useLingui();
    const { currentAccount } = useSession();
    const queryClient = useQueryClient();
    const name = route.params.name === 'me' ? currentAccount?.did : route.params.name;
    const moderationOpts = useModerationOpts();
    const { data: resolvedDid, error: resolveError, refetch: refetchDid, isLoading: isLoadingDid, } = useResolveDidQuery(name);
    const { data: profile, error: profileError, refetch: refetchProfile, isLoading: isLoadingProfile, isPlaceholderData: isPlaceholderProfile, } = useProfileQuery({
        did: resolvedDid,
    });
    const onPressTryAgain = React.useCallback(() => {
        if (resolveError) {
            refetchDid();
        }
        else {
            refetchProfile();
        }
    }, [resolveError, refetchDid, refetchProfile]);
    // Apply hard-coded redirects as need
    React.useEffect(() => {
        if (resolveError) {
            if (name === 'lulaoficial.bsky.social') {
                console.log('Applying redirect to lula.com.br');
                navigate('Profile', { name: 'lula.com.br' });
            }
        }
    }, [name, resolveError]);
    // When we open the profile, we want to reset the posts query if we are blocked.
    React.useEffect(() => {
        if (resolvedDid && profile?.viewer?.blockedBy) {
            resetProfilePostsQueries(queryClient, resolvedDid);
        }
    }, [queryClient, profile?.viewer?.blockedBy, resolvedDid]);
    // Most pushes will happen here, since we will have only placeholder data
    if (isLoadingDid || isLoadingProfile) {
        return (_jsx(Layout.Content, { children: _jsx(ProfileHeaderLoading, {}) }));
    }
    if (resolveError || profileError) {
        return (_jsx(SafeAreaView, { style: [a.flex_1], children: _jsx(ErrorScreen, { testID: "profileErrorScreen", title: profileError ? _(msg `Not Found`) : _(msg `Oops!`), message: cleanError(resolveError || profileError), onPressTryAgain: onPressTryAgain, showHeader: true }) }));
    }
    if (profile && moderationOpts) {
        return (_jsx(ProfileScreenLoaded, { profile: profile, moderationOpts: moderationOpts, isPlaceholderProfile: isPlaceholderProfile, hideBackButton: !!route.params.hideBackButton }));
    }
    // should never happen
    return (_jsx(SafeAreaView, { style: [a.flex_1], children: _jsx(ErrorScreen, { testID: "profileErrorScreen", title: "Oops!", message: "Something went wrong and we're not sure what.", onPressTryAgain: onPressTryAgain, showHeader: true }) }));
}
function ProfileScreenLoaded({ profile: profileUnshadowed, isPlaceholderProfile, moderationOpts, hideBackButton, }) {
    const profile = useProfileShadow(profileUnshadowed);
    const { hasSession, currentAccount } = useSession();
    const setMinimalShellMode = useSetMinimalShellMode();
    const { openComposer } = useOpenComposer();
    const { data: labelerInfo, error: labelerError, isLoading: isLabelerLoading, } = useLabelerInfoQuery({
        did: profile.did,
        enabled: !!profile.associated?.labeler,
    });
    const [currentPage, setCurrentPage] = React.useState(0);
    const { _ } = useLingui();
    const [scrollViewTag, setScrollViewTag] = React.useState(null);
    const postsSectionRef = React.useRef(null);
    const repliesSectionRef = React.useRef(null);
    const mediaSectionRef = React.useRef(null);
    const videosSectionRef = React.useRef(null);
    const likesSectionRef = React.useRef(null);
    const feedsSectionRef = React.useRef(null);
    const listsSectionRef = React.useRef(null);
    const starterPacksSectionRef = React.useRef(null);
    const labelsSectionRef = React.useRef(null);
    useSetTitle(combinedDisplayName(profile));
    const description = profile.description ?? '';
    const hasDescription = description !== '';
    const [descriptionRT, isResolvingDescriptionRT] = useRichText(description);
    const showPlaceholder = isPlaceholderProfile || isResolvingDescriptionRT;
    const moderation = useMemo(() => moderateProfile(profile, moderationOpts), [profile, moderationOpts]);
    const isMe = profile.did === currentAccount?.did;
    const hasLabeler = !!profile.associated?.labeler;
    const showFiltersTab = hasLabeler;
    const showPostsTab = true;
    const showRepliesTab = hasSession;
    const showMediaTab = !hasLabeler;
    const showVideosTab = !hasLabeler;
    const showLikesTab = isMe;
    const feedGenCount = profile.associated?.feedgens || 0;
    const showFeedsTab = isMe || feedGenCount > 0;
    const starterPackCount = profile.associated?.starterPacks || 0;
    const showStarterPacksTab = isMe || starterPackCount > 0;
    // subtract starterpack count from list count, since starterpacks are a type of list
    const listCount = (profile.associated?.lists || 0) - starterPackCount;
    const showListsTab = hasSession && (isMe || listCount > 0);
    const sectionTitles = [
        showFiltersTab ? _(msg `Labels`) : undefined,
        showListsTab && hasLabeler ? _(msg `Lists`) : undefined,
        showPostsTab ? _(msg `Posts`) : undefined,
        showRepliesTab ? _(msg `Replies`) : undefined,
        showMediaTab ? _(msg `Media`) : undefined,
        showVideosTab ? _(msg `Videos`) : undefined,
        showLikesTab ? _(msg `Likes`) : undefined,
        showFeedsTab ? _(msg `Feeds`) : undefined,
        showStarterPacksTab ? _(msg `Starter Packs`) : undefined,
        showListsTab && !hasLabeler ? _(msg `Lists`) : undefined,
    ].filter(Boolean);
    let nextIndex = 0;
    let filtersIndex = null;
    let postsIndex = null;
    let repliesIndex = null;
    let mediaIndex = null;
    let videosIndex = null;
    let likesIndex = null;
    let feedsIndex = null;
    let starterPacksIndex = null;
    let listsIndex = null;
    if (showFiltersTab) {
        filtersIndex = nextIndex++;
    }
    if (showPostsTab) {
        postsIndex = nextIndex++;
    }
    if (showRepliesTab) {
        repliesIndex = nextIndex++;
    }
    if (showMediaTab) {
        mediaIndex = nextIndex++;
    }
    if (showVideosTab) {
        videosIndex = nextIndex++;
    }
    if (showLikesTab) {
        likesIndex = nextIndex++;
    }
    if (showFeedsTab) {
        feedsIndex = nextIndex++;
    }
    if (showStarterPacksTab) {
        starterPacksIndex = nextIndex++;
    }
    if (showListsTab) {
        listsIndex = nextIndex++;
    }
    const scrollSectionToTop = useCallback((index) => {
        if (index === filtersIndex) {
            labelsSectionRef.current?.scrollToTop();
        }
        else if (index === postsIndex) {
            postsSectionRef.current?.scrollToTop();
        }
        else if (index === repliesIndex) {
            repliesSectionRef.current?.scrollToTop();
        }
        else if (index === mediaIndex) {
            mediaSectionRef.current?.scrollToTop();
        }
        else if (index === videosIndex) {
            videosSectionRef.current?.scrollToTop();
        }
        else if (index === likesIndex) {
            likesSectionRef.current?.scrollToTop();
        }
        else if (index === feedsIndex) {
            feedsSectionRef.current?.scrollToTop();
        }
        else if (index === starterPacksIndex) {
            starterPacksSectionRef.current?.scrollToTop();
        }
        else if (index === listsIndex) {
            listsSectionRef.current?.scrollToTop();
        }
    }, [
        filtersIndex,
        postsIndex,
        repliesIndex,
        mediaIndex,
        videosIndex,
        likesIndex,
        feedsIndex,
        listsIndex,
        starterPacksIndex,
    ]);
    useFocusEffect(React.useCallback(() => {
        setMinimalShellMode(false);
        return listenSoftReset(() => {
            scrollSectionToTop(currentPage);
        });
    }, [setMinimalShellMode, currentPage, scrollSectionToTop]));
    // events
    // =
    const onPressCompose = () => {
        const mention = profile.handle === currentAccount?.handle ||
            isInvalidHandle(profile.handle)
            ? undefined
            : profile.handle;
        openComposer({ mention });
    };
    const onPageSelected = (i) => {
        setCurrentPage(i);
    };
    const onCurrentPageSelected = (index) => {
        scrollSectionToTop(index);
    };
    // rendering
    // =
    const renderHeader = ({ setMinimumHeight, }) => {
        return (_jsx(ExpoScrollForwarderView, { scrollViewTag: scrollViewTag, children: _jsx(ProfileHeader, { profile: profile, labeler: labelerInfo, descriptionRT: hasDescription ? descriptionRT : null, moderationOpts: moderationOpts, hideBackButton: hideBackButton, isPlaceholderProfile: showPlaceholder, setMinimumHeight: setMinimumHeight }) }));
    };
    return (_jsxs(ScreenHider, { testID: "profileView", style: styles.container, screenDescription: _(msg `profile`), modui: moderation.ui('profileView'), children: [_jsxs(PagerWithHeader, { testID: "profilePager", isHeaderReady: !showPlaceholder, items: sectionTitles, onPageSelected: onPageSelected, onCurrentPageSelected: onCurrentPageSelected, renderHeader: renderHeader, allowHeaderOverScroll: true, children: [showFiltersTab
                        ? ({ headerHeight, isFocused, scrollElRef }) => (_jsx(ProfileLabelsSection, { ref: labelsSectionRef, labelerInfo: labelerInfo, labelerError: labelerError, isLabelerLoading: isLabelerLoading, moderationOpts: moderationOpts, scrollElRef: scrollElRef, headerHeight: headerHeight, isFocused: isFocused, setScrollViewTag: setScrollViewTag }))
                        : null, showListsTab && !!profile.associated?.labeler
                        ? ({ headerHeight, isFocused, scrollElRef }) => (_jsx(ProfileLists, { ref: listsSectionRef, did: profile.did, scrollElRef: scrollElRef, headerOffset: headerHeight, enabled: isFocused, setScrollViewTag: setScrollViewTag }))
                        : null, showPostsTab
                        ? ({ headerHeight, isFocused, scrollElRef }) => (_jsx(ProfileFeedSection, { ref: postsSectionRef, feed: `author|${profile.did}|posts_and_author_threads`, headerHeight: headerHeight, isFocused: isFocused, scrollElRef: scrollElRef, ignoreFilterFor: profile.did, setScrollViewTag: setScrollViewTag }))
                        : null, showRepliesTab
                        ? ({ headerHeight, isFocused, scrollElRef }) => (_jsx(ProfileFeedSection, { ref: repliesSectionRef, feed: `author|${profile.did}|posts_with_replies`, headerHeight: headerHeight, isFocused: isFocused, scrollElRef: scrollElRef, ignoreFilterFor: profile.did, setScrollViewTag: setScrollViewTag }))
                        : null, showMediaTab
                        ? ({ headerHeight, isFocused, scrollElRef }) => (_jsx(ProfileFeedSection, { ref: mediaSectionRef, feed: `author|${profile.did}|posts_with_media`, headerHeight: headerHeight, isFocused: isFocused, scrollElRef: scrollElRef, ignoreFilterFor: profile.did, setScrollViewTag: setScrollViewTag }))
                        : null, showVideosTab
                        ? ({ headerHeight, isFocused, scrollElRef }) => (_jsx(ProfileFeedSection, { ref: videosSectionRef, feed: `author|${profile.did}|posts_with_video`, headerHeight: headerHeight, isFocused: isFocused, scrollElRef: scrollElRef, ignoreFilterFor: profile.did, setScrollViewTag: setScrollViewTag }))
                        : null, showLikesTab
                        ? ({ headerHeight, isFocused, scrollElRef }) => (_jsx(ProfileFeedSection, { ref: likesSectionRef, feed: `likes|${profile.did}`, headerHeight: headerHeight, isFocused: isFocused, scrollElRef: scrollElRef, ignoreFilterFor: profile.did, setScrollViewTag: setScrollViewTag }))
                        : null, showFeedsTab
                        ? ({ headerHeight, isFocused, scrollElRef }) => (_jsx(ProfileFeedgens, { ref: feedsSectionRef, did: profile.did, scrollElRef: scrollElRef, headerOffset: headerHeight, enabled: isFocused, setScrollViewTag: setScrollViewTag }))
                        : null, showStarterPacksTab
                        ? ({ headerHeight, isFocused, scrollElRef }) => (_jsx(ProfileStarterPacks, { ref: starterPacksSectionRef, did: profile.did, isMe: isMe, scrollElRef: scrollElRef, headerOffset: headerHeight, enabled: isFocused, setScrollViewTag: setScrollViewTag }))
                        : null, showListsTab && !profile.associated?.labeler
                        ? ({ headerHeight, isFocused, scrollElRef }) => (_jsx(ProfileLists, { ref: listsSectionRef, did: profile.did, scrollElRef: scrollElRef, headerOffset: headerHeight, enabled: isFocused, setScrollViewTag: setScrollViewTag }))
                        : null] }), hasSession && (_jsx(FAB, { testID: "composeFAB", onPress: onPressCompose, icon: _jsx(ComposeIcon2, { strokeWidth: 1.5, size: 29, style: s.white }), accessibilityRole: "button", accessibilityLabel: _(msg `New post`), accessibilityHint: "" }))] }));
}
function useRichText(text) {
    const agent = useAgent();
    const [prevText, setPrevText] = React.useState(text);
    const [rawRT, setRawRT] = React.useState(() => new RichTextAPI({ text }));
    const [resolvedRT, setResolvedRT] = React.useState(null);
    if (text !== prevText) {
        setPrevText(text);
        setRawRT(new RichTextAPI({ text }));
        setResolvedRT(null);
        // This will queue an immediate re-render
    }
    React.useEffect(() => {
        let ignore = false;
        async function resolveRTFacets() {
            // new each time
            const resolvedRT = new RichTextAPI({ text });
            await resolvedRT.detectFacets(agent);
            if (!ignore) {
                setResolvedRT(resolvedRT);
            }
        }
        resolveRTFacets();
        return () => {
            ignore = true;
        };
    }, [text, agent]);
    const isResolving = resolvedRT === null;
    return [resolvedRT ?? rawRT, isResolving];
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        height: '100%',
        // @ts-ignore Web-only.
        overflowAnchor: 'none', // Fixes jumps when switching tabs while scrolled down.
    },
    loading: {
        paddingVertical: 10,
        paddingHorizontal: 14,
    },
    emptyState: {
        paddingVertical: 40,
    },
    loadingMoreFooter: {
        paddingVertical: 20,
    },
    endItem: {
        paddingTop: 20,
        paddingBottom: 30,
        color: colors.gray5,
        textAlign: 'center',
    },
});
//# sourceMappingURL=Profile.js.map