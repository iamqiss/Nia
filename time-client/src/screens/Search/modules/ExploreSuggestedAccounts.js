import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { memo, useEffect } from 'react';
import { View } from 'react-native';
import {} from '@atproto/api';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {} from '@tanstack/react-query';
import { logger } from '#/logger';
import { usePreferencesQuery } from '#/state/queries/preferences';
import { BlockDrawerGesture } from '#/view/shell/BlockDrawerGesture';
import { popularInterests, useInterestsDisplayNames, } from '#/screens/Onboarding/state';
import { useTheme } from '#/alf';
import { atoms as a } from '#/alf';
import { boostInterests, InterestTabs } from '#/components/InterestTabs';
import * as ProfileCard from '#/components/ProfileCard';
import { SubtleHover } from '#/components/SubtleHover';
export function useLoadEnoughProfiles({ interest, data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, }) {
    const profileCount = data?.pages.flatMap(page => page.actors.filter(actor => !actor.viewer?.following)).length || 0;
    const isAnyLoading = isLoading || isFetchingNextPage;
    const isEnoughProfiles = profileCount > 3;
    const shouldFetchMore = !isEnoughProfiles && hasNextPage && !!interest;
    useEffect(() => {
        if (shouldFetchMore && !isAnyLoading) {
            logger.info('Not enough suggested accounts - fetching more');
            fetchNextPage();
        }
    }, [shouldFetchMore, fetchNextPage, isAnyLoading, interest]);
    return {
        isReady: !shouldFetchMore,
    };
}
export function SuggestedAccountsTabBar({ selectedInterest, onSelectInterest, hideDefaultTab, defaultTabLabel, }) {
    const { _ } = useLingui();
    const interestsDisplayNames = useInterestsDisplayNames();
    const { data: preferences } = usePreferencesQuery();
    const personalizedInterests = preferences?.interests?.tags;
    const interests = Object.keys(interestsDisplayNames)
        .sort(boostInterests(popularInterests))
        .sort(boostInterests(personalizedInterests));
    return (_jsx(BlockDrawerGesture, { children: _jsx(InterestTabs, { interests: hideDefaultTab ? interests : ['all', ...interests], selectedInterest: selectedInterest || (hideDefaultTab ? interests[0] : 'all'), onSelectTab: tab => {
                logger.metric('explore:suggestedAccounts:tabPressed', { tab: tab }, { statsig: true });
                onSelectInterest(tab === 'all' ? null : tab);
            }, interestsDisplayNames: hideDefaultTab
                ? interestsDisplayNames
                : {
                    all: defaultTabLabel || _(msg `For You`),
                    ...interestsDisplayNames,
                } }) }));
}
/**
 * Profile card for suggested accounts. Note: border is on the bottom edge
 */
let SuggestedProfileCard = ({ profile, moderationOpts, recId, position, }) => {
    const t = useTheme();
    return (_jsx(ProfileCard.Link, { profile: profile, style: [a.flex_1], onPress: () => {
            logger.metric('suggestedUser:press', {
                logContext: 'Explore',
                recId,
                position,
            }, { statsig: true });
        }, children: s => (_jsxs(_Fragment, { children: [_jsx(SubtleHover, { hover: s.hovered || s.pressed }), _jsx(View, { style: [
                        a.flex_1,
                        a.w_full,
                        a.py_lg,
                        a.px_lg,
                        a.border_t,
                        t.atoms.border_contrast_low,
                    ], children: _jsxs(ProfileCard.Outer, { children: [_jsxs(ProfileCard.Header, { children: [_jsx(ProfileCard.Avatar, { profile: profile, moderationOpts: moderationOpts }), _jsx(ProfileCard.NameAndHandle, { profile: profile, moderationOpts: moderationOpts }), _jsx(ProfileCard.FollowButton, { profile: profile, moderationOpts: moderationOpts, withIcon: false, logContext: "ExploreSuggestedAccounts", onFollow: () => {
                                            logger.metric('suggestedUser:follow', {
                                                logContext: 'Explore',
                                                location: 'Card',
                                                recId,
                                                position,
                                            }, { statsig: true });
                                        } })] }), _jsx(ProfileCard.Description, { profile: profile, numberOfLines: 2 })] }) })] })) }));
};
SuggestedProfileCard = memo(SuggestedProfileCard);
export { SuggestedProfileCard };
//# sourceMappingURL=ExploreSuggestedAccounts.js.map