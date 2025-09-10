import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TextInput, useWindowDimensions, View } from 'react-native';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { logEvent } from '#/lib/statsig/statsig';
import { isWeb } from '#/platform/detection';
import { useModerationOpts } from '#/state/preferences/moderation-opts';
import { useActorSearchPaginated } from '#/state/queries/actor-search';
import { usePreferencesQuery } from '#/state/queries/preferences';
import { useGetSuggestedUsersQuery } from '#/state/queries/trending/useGetSuggestedUsersQuery';
import { useSession } from '#/state/session';
import {} from '#/state/shell/progress-guide';
import {} from '#/view/com/util/List';
import { popularInterests, useInterestsDisplayNames, } from '#/screens/Onboarding/state';
import { atoms as a, native, useBreakpoints, useTheme, web, } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { useInteractionState } from '#/components/hooks/useInteractionState';
import { MagnifyingGlass2_Stroke2_Corner0_Rounded as SearchIcon } from '#/components/icons/MagnifyingGlass2';
import { PersonGroup_Stroke2_Corner2_Rounded as PersonGroupIcon } from '#/components/icons/Person';
import { TimesLarge_Stroke2_Corner0_Rounded as X } from '#/components/icons/Times';
import { boostInterests, InterestTabs } from '#/components/InterestTabs';
import * as ProfileCard from '#/components/ProfileCard';
import { Text } from '#/components/Typography';
import { ProgressGuideTask } from './Task';
export function FollowDialog({ guide }) {
    const { _ } = useLingui();
    const control = Dialog.useDialogControl();
    const { gtMobile } = useBreakpoints();
    const { height: minHeight } = useWindowDimensions();
    return (_jsxs(_Fragment, { children: [_jsxs(Button, { label: _(msg `Find people to follow`), onPress: () => {
                    control.open();
                    logEvent('progressGuide:followDialog:open', {});
                }, size: gtMobile ? 'small' : 'large', color: "primary", variant: "solid", children: [_jsx(ButtonIcon, { icon: PersonGroupIcon }), _jsx(ButtonText, { children: _jsx(Trans, { children: "Find people to follow" }) })] }), _jsxs(Dialog.Outer, { control: control, nativeOptions: { minHeight }, children: [_jsx(Dialog.Handle, {}), _jsx(DialogInner, { guide: guide })] })] }));
}
// Fine to keep this top-level.
let lastSelectedInterest = '';
let lastSearchText = '';
function DialogInner({ guide }) {
    const { _ } = useLingui();
    const interestsDisplayNames = useInterestsDisplayNames();
    const { data: preferences } = usePreferencesQuery();
    const personalizedInterests = preferences?.interests?.tags;
    const interests = Object.keys(interestsDisplayNames)
        .sort(boostInterests(popularInterests))
        .sort(boostInterests(personalizedInterests));
    const [selectedInterest, setSelectedInterest] = useState(() => lastSelectedInterest ||
        (personalizedInterests && interests.includes(personalizedInterests[0])
            ? personalizedInterests[0]
            : interests[0]));
    const [searchText, setSearchText] = useState(lastSearchText);
    const moderationOpts = useModerationOpts();
    const listRef = useRef(null);
    const inputRef = useRef(null);
    const [headerHeight, setHeaderHeight] = useState(0);
    const { currentAccount } = useSession();
    useEffect(() => {
        lastSearchText = searchText;
        lastSelectedInterest = selectedInterest;
    }, [searchText, selectedInterest]);
    const { data: suggestions, isFetching: isFetchingSuggestions, error: suggestionsError, } = useGetSuggestedUsersQuery({
        category: selectedInterest,
        limit: 50,
    });
    const { data: searchResults, isFetching: isFetchingSearchResults, error: searchResultsError, isError: isSearchResultsError, } = useActorSearchPaginated({
        enabled: !!searchText,
        query: searchText,
    });
    const hasSearchText = !!searchText;
    const resultsKey = searchText || selectedInterest;
    const items = useMemo(() => {
        const results = hasSearchText
            ? searchResults?.pages.flatMap(p => p.actors)
            : suggestions?.actors;
        let _items = [];
        if (isFetchingSuggestions || isFetchingSearchResults) {
            const placeholders = Array(10)
                .fill(0)
                .map((__, i) => ({
                type: 'placeholder',
                key: i + '',
            }));
            _items.push(...placeholders);
        }
        else if ((hasSearchText && searchResultsError) ||
            (!hasSearchText && suggestionsError) ||
            !results?.length) {
            _items.push({
                type: 'empty',
                key: 'empty',
                message: _(msg `We're having network issues, try again`),
            });
        }
        else {
            const seen = new Set();
            for (const profile of results) {
                if (seen.has(profile.did))
                    continue;
                if (profile.did === currentAccount?.did)
                    continue;
                if (profile.viewer?.following)
                    continue;
                seen.add(profile.did);
                _items.push({
                    type: 'profile',
                    // Don't share identity across tabs or typing attempts
                    key: resultsKey + ':' + profile.did,
                    profile,
                });
            }
        }
        return _items;
    }, [
        _,
        suggestions,
        suggestionsError,
        isFetchingSuggestions,
        searchResults,
        searchResultsError,
        isFetchingSearchResults,
        currentAccount?.did,
        hasSearchText,
        resultsKey,
    ]);
    if (searchText &&
        !isFetchingSearchResults &&
        !items.length &&
        !isSearchResultsError) {
        items.push({ type: 'empty', key: 'empty', message: _(msg `No results`) });
    }
    const renderItems = useCallback(({ item, index }) => {
        switch (item.type) {
            case 'profile': {
                return (_jsx(FollowProfileCard, { profile: item.profile, moderationOpts: moderationOpts, noBorder: index === 0 }));
            }
            case 'placeholder': {
                return _jsx(ProfileCardSkeleton, {}, item.key);
            }
            case 'empty': {
                return _jsx(Empty, { message: item.message }, item.key);
            }
            default:
                return null;
        }
    }, [moderationOpts]);
    const onSelectTab = useCallback((interest) => {
        setSelectedInterest(interest);
        inputRef.current?.clear();
        setSearchText('');
        listRef.current?.scrollToOffset({
            offset: 0,
            animated: false,
        });
    }, [setSelectedInterest, setSearchText]);
    const listHeader = (_jsx(Header, { guide: guide, inputRef: inputRef, listRef: listRef, searchText: searchText, onSelectTab: onSelectTab, setHeaderHeight: setHeaderHeight, setSearchText: setSearchText, interests: interests, selectedInterest: selectedInterest, interestsDisplayNames: interestsDisplayNames }));
    return (_jsx(Dialog.InnerFlatList, { ref: listRef, data: items, renderItem: renderItems, ListHeaderComponent: listHeader, stickyHeaderIndices: [0], keyExtractor: (item) => item.key, style: [
            a.px_0,
            web([a.py_0, { height: '100vh', maxHeight: 600 }]),
            native({ height: '100%' }),
        ], webInnerContentContainerStyle: a.py_0, webInnerStyle: [a.py_0, { maxWidth: 500, minWidth: 200 }], keyboardDismissMode: "on-drag", scrollIndicatorInsets: { top: headerHeight }, initialNumToRender: 8, maxToRenderPerBatch: 8 }));
}
let Header = ({ guide, inputRef, listRef, searchText, onSelectTab, setHeaderHeight, setSearchText, interests, selectedInterest, interestsDisplayNames, }) => {
    const t = useTheme();
    const control = Dialog.useDialogContext();
    return (_jsxs(View, { onLayout: evt => setHeaderHeight(evt.nativeEvent.layout.height), style: [
            a.relative,
            web(a.pt_lg),
            native(a.pt_4xl),
            a.pb_xs,
            a.border_b,
            t.atoms.border_contrast_low,
            t.atoms.bg,
        ], children: [_jsx(HeaderTop, { guide: guide }), _jsxs(View, { style: [web(a.pt_xs), a.pb_xs], children: [_jsx(SearchInput, { inputRef: inputRef, defaultValue: searchText, onChangeText: text => {
                            setSearchText(text);
                            listRef.current?.scrollToOffset({ offset: 0, animated: false });
                        }, onEscape: control.close }), _jsx(InterestTabs, { onSelectTab: onSelectTab, interests: interests, selectedInterest: selectedInterest, disabled: !!searchText, interestsDisplayNames: interestsDisplayNames, TabComponent: Tab })] })] }));
};
Header = memo(Header);
function HeaderTop({ guide }) {
    const { _ } = useLingui();
    const t = useTheme();
    const control = Dialog.useDialogContext();
    return (_jsxs(View, { style: [
            a.px_lg,
            a.relative,
            a.flex_row,
            a.justify_between,
            a.align_center,
        ], children: [_jsx(Text, { style: [
                    a.z_10,
                    a.text_lg,
                    a.font_heavy,
                    a.leading_tight,
                    t.atoms.text_contrast_high,
                ], children: _jsx(Trans, { children: "Find people to follow" }) }), _jsx(View, { style: isWeb && { paddingRight: 36 }, children: _jsx(ProgressGuideTask, { current: guide.numFollows + 1, total: 10 + 1, title: `${guide.numFollows} / 10`, tabularNumsTitle: true }) }), isWeb ? (_jsx(Button, { label: _(msg `Close`), size: "small", shape: "round", variant: isWeb ? 'ghost' : 'solid', color: "secondary", style: [
                    a.absolute,
                    a.z_20,
                    web({ right: -4 }),
                    native({ right: 0 }),
                    native({ height: 32, width: 32, borderRadius: 16 }),
                ], onPress: () => control.close(), children: _jsx(ButtonIcon, { icon: X, size: "md" }) })) : null] }));
}
let Tab = ({ onSelectTab, interest, active, index, interestsDisplayName, onLayout, }) => {
    const t = useTheme();
    const { _ } = useLingui();
    const label = active
        ? _(msg({
            message: `Search for "${interestsDisplayName}" (active)`,
            comment: 'Accessibility label for a tab that searches for accounts in a category (e.g. Art, Video Games, Sports, etc.) that are suggested for the user to follow. The tab is currently selected.',
        }))
        : _(msg({
            message: `Search for "${interestsDisplayName}"`,
            comment: 'Accessibility label for a tab that searches for accounts in a category (e.g. Art, Video Games, Sports, etc.) that are suggested for the user to follow. The tab is not currently active and can be selected.',
        }));
    return (_jsx(View, { onLayout: e => onLayout(index, e.nativeEvent.layout.x, e.nativeEvent.layout.width), children: _jsx(Button, { label: label, onPress: () => onSelectTab(index), children: ({ hovered, pressed }) => (_jsx(View, { style: [
                    a.rounded_full,
                    a.px_lg,
                    a.py_sm,
                    a.border,
                    active || hovered || pressed
                        ? [
                            t.atoms.bg_contrast_25,
                            { borderColor: t.atoms.bg_contrast_25.backgroundColor },
                        ]
                        : [t.atoms.bg, t.atoms.border_contrast_low],
                ], children: _jsx(Text, { style: [
                        a.font_medium,
                        active || hovered || pressed
                            ? t.atoms.text
                            : t.atoms.text_contrast_medium,
                    ], children: interestsDisplayName }) })) }) }, interest));
};
Tab = memo(Tab);
let FollowProfileCard = ({ profile, moderationOpts, noBorder, }) => {
    return (_jsx(FollowProfileCardInner, { profile: profile, moderationOpts: moderationOpts, noBorder: noBorder }));
};
FollowProfileCard = memo(FollowProfileCard);
function FollowProfileCardInner({ profile, moderationOpts, onFollow, noBorder, }) {
    const control = Dialog.useDialogContext();
    const t = useTheme();
    return (_jsx(ProfileCard.Link, { profile: profile, style: [a.flex_1], onPress: () => control.close(), children: ({ hovered, pressed }) => (_jsx(CardOuter, { style: [
                a.flex_1,
                noBorder && a.border_t_0,
                (hovered || pressed) && t.atoms.bg_contrast_25,
            ], children: _jsxs(ProfileCard.Outer, { children: [_jsxs(ProfileCard.Header, { children: [_jsx(ProfileCard.Avatar, { profile: profile, moderationOpts: moderationOpts }), _jsx(ProfileCard.NameAndHandle, { profile: profile, moderationOpts: moderationOpts }), _jsx(ProfileCard.FollowButton, { profile: profile, moderationOpts: moderationOpts, logContext: "PostOnboardingFindFollows", shape: "round", onPress: onFollow, colorInverted: true })] }), _jsx(ProfileCard.Description, { profile: profile, numberOfLines: 2 })] }) })) }));
}
function CardOuter({ children, style, }) {
    const t = useTheme();
    return (_jsx(View, { style: [
            a.w_full,
            a.py_md,
            a.px_lg,
            a.border_t,
            t.atoms.border_contrast_low,
            style,
        ], children: children }));
}
function SearchInput({ onChangeText, onEscape, inputRef, defaultValue, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const { state: hovered, onIn: onMouseEnter, onOut: onMouseLeave, } = useInteractionState();
    const { state: focused, onIn: onFocus, onOut: onBlur } = useInteractionState();
    const interacted = hovered || focused;
    return (_jsxs(View, { ...web({
            onMouseEnter,
            onMouseLeave,
        }), style: [a.flex_row, a.align_center, a.gap_sm, a.px_lg, a.py_xs], children: [_jsx(SearchIcon, { size: "md", fill: interacted ? t.palette.primary_500 : t.palette.contrast_300 }), _jsx(TextInput, { ref: inputRef, placeholder: _(msg `Search by name or interest`), defaultValue: defaultValue, onChangeText: onChangeText, onFocus: onFocus, onBlur: onBlur, style: [a.flex_1, a.py_md, a.text_md, t.atoms.text], placeholderTextColor: t.palette.contrast_500, keyboardAppearance: t.name === 'light' ? 'light' : 'dark', returnKeyType: "search", clearButtonMode: "while-editing", maxLength: 50, onKeyPress: ({ nativeEvent }) => {
                    if (nativeEvent.key === 'Escape') {
                        onEscape();
                    }
                }, autoCorrect: false, autoComplete: "off", autoCapitalize: "none", accessibilityLabel: _(msg `Search profiles`), accessibilityHint: _(msg `Searches for profiles`) })] }));
}
function ProfileCardSkeleton() {
    const t = useTheme();
    return (_jsxs(View, { style: [
            a.flex_1,
            a.py_md,
            a.px_lg,
            a.gap_md,
            a.align_center,
            a.flex_row,
        ], children: [_jsx(View, { style: [
                    a.rounded_full,
                    { width: 42, height: 42 },
                    t.atoms.bg_contrast_25,
                ] }), _jsxs(View, { style: [a.flex_1, a.gap_sm], children: [_jsx(View, { style: [
                            a.rounded_xs,
                            { width: 80, height: 14 },
                            t.atoms.bg_contrast_25,
                        ] }), _jsx(View, { style: [
                            a.rounded_xs,
                            { width: 120, height: 10 },
                            t.atoms.bg_contrast_25,
                        ] })] })] }));
}
function Empty({ message }) {
    const t = useTheme();
    return (_jsxs(View, { style: [a.p_lg, a.py_xl, a.align_center, a.gap_md], children: [_jsx(Text, { style: [a.text_sm, a.italic, t.atoms.text_contrast_high], children: message }), _jsx(Text, { style: [a.text_xs, t.atoms.text_contrast_low], children: "(\u256F\u00B0\u25A1\u00B0)\u256F\uFE35 \u253B\u2501\u253B" })] }));
}
//# sourceMappingURL=FollowDialog.js.map