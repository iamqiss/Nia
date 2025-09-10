import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useCallback, useLayoutEffect, useMemo, useRef, useState, } from 'react';
import { View, } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { HITSLOP_20 } from '#/lib/constants';
import { HITSLOP_10 } from '#/lib/constants';
import { useNonReactiveCallback } from '#/lib/hooks/useNonReactiveCallback';
import { MagnifyingGlassIcon } from '#/lib/icons';
import {} from '#/lib/routes/types';
import { isWeb } from '#/platform/detection';
import { listenSoftReset } from '#/state/events';
import { useActorAutocompleteQuery } from '#/state/queries/actor-autocomplete';
import { unstableCacheProfileView, useProfilesQuery, } from '#/state/queries/profile';
import { useSession } from '#/state/session';
import { useSetMinimalShellMode } from '#/state/shell';
import { makeSearchQuery, parseSearchQuery, } from '#/screens/Search/utils';
import { atoms as a, tokens, useBreakpoints, useTheme, web } from '#/alf';
import { Button, ButtonText } from '#/components/Button';
import { SearchInput } from '#/components/forms/SearchInput';
import * as Layout from '#/components/Layout';
import { Text } from '#/components/Typography';
import { account, useStorage } from '#/storage';
import { AutocompleteResults } from './components/AutocompleteResults';
import { SearchHistory } from './components/SearchHistory';
import { SearchLanguageDropdown } from './components/SearchLanguageDropdown';
import { Explore } from './Explore';
import { SearchResults } from './SearchResults';
export function SearchScreenShell({ queryParam, testID, fixedParams, navButton = 'menu', inputPlaceholder, isExplore, }) {
    const t = useTheme();
    const { gtMobile } = useBreakpoints();
    const navigation = useNavigation();
    const route = useRoute();
    const textInput = useRef(null);
    const { _ } = useLingui();
    const setMinimalShellMode = useSetMinimalShellMode();
    const { currentAccount } = useSession();
    const queryClient = useQueryClient();
    // Query terms
    const [searchText, setSearchText] = useState(queryParam);
    const { data: autocompleteData, isFetching: isAutocompleteFetching } = useActorAutocompleteQuery(searchText, true);
    const [showAutocomplete, setShowAutocomplete] = useState(false);
    const [termHistory = [], setTermHistory] = useStorage(account, [
        currentAccount?.did ?? 'pwi',
        'searchTermHistory',
    ]);
    const [accountHistory = [], setAccountHistory] = useStorage(account, [
        currentAccount?.did ?? 'pwi',
        'searchAccountHistory',
    ]);
    const { data: accountHistoryProfiles } = useProfilesQuery({
        handles: accountHistory,
        maintainData: true,
    });
    const updateSearchHistory = useCallback(async (item) => {
        if (!item)
            return;
        const newSearchHistory = [
            item,
            ...termHistory.filter(search => search !== item),
        ].slice(0, 6);
        setTermHistory(newSearchHistory);
    }, [termHistory, setTermHistory]);
    const updateProfileHistory = useCallback(async (item) => {
        const newAccountHistory = [
            item.did,
            ...accountHistory.filter(p => p !== item.did),
        ].slice(0, 10);
        setAccountHistory(newAccountHistory);
    }, [accountHistory, setAccountHistory]);
    const deleteSearchHistoryItem = useCallback(async (item) => {
        setTermHistory(termHistory.filter(search => search !== item));
    }, [termHistory, setTermHistory]);
    const deleteProfileHistoryItem = useCallback(async (item) => {
        setAccountHistory(accountHistory.filter(p => p !== item.did));
    }, [accountHistory, setAccountHistory]);
    const { params, query, queryWithParams } = useQueryManager({
        initialQuery: queryParam,
        fixedParams,
    });
    const showFilters = Boolean(queryWithParams && !showAutocomplete);
    // web only - measure header height for sticky positioning
    const [headerHeight, setHeaderHeight] = useState(0);
    const headerRef = useRef(null);
    useLayoutEffect(() => {
        if (isWeb) {
            if (!headerRef.current)
                return;
            const measurement = headerRef.current.getBoundingClientRect();
            setHeaderHeight(measurement.height);
        }
    }, []);
    useFocusEffect(useNonReactiveCallback(() => {
        if (isWeb) {
            setSearchText(queryParam);
        }
    }));
    const onPressClearQuery = useCallback(() => {
        scrollToTopWeb();
        setSearchText('');
        textInput.current?.focus();
    }, []);
    const onChangeText = useCallback(async (text) => {
        scrollToTopWeb();
        setSearchText(text);
    }, []);
    const navigateToItem = useCallback((item) => {
        scrollToTopWeb();
        setShowAutocomplete(false);
        updateSearchHistory(item);
        if (isWeb) {
            // @ts-expect-error route is not typesafe
            navigation.push(route.name, { ...route.params, q: item });
        }
        else {
            textInput.current?.blur();
            navigation.setParams({ q: item });
        }
    }, [updateSearchHistory, navigation, route]);
    const onPressCancelSearch = useCallback(() => {
        scrollToTopWeb();
        textInput.current?.blur();
        setShowAutocomplete(false);
        if (isWeb) {
            // Empty params resets the URL to be /search rather than /search?q=
            const { q: _q, ...parameters } = (route.params ?? {});
            // @ts-expect-error route is not typesafe
            navigation.replace(route.name, parameters);
        }
        else {
            setSearchText('');
            navigation.setParams({ q: '' });
        }
    }, [setShowAutocomplete, setSearchText, navigation, route.params, route.name]);
    const onSubmit = useCallback(() => {
        navigateToItem(searchText);
    }, [navigateToItem, searchText]);
    const onAutocompleteResultPress = useCallback(() => {
        if (isWeb) {
            setShowAutocomplete(false);
        }
        else {
            textInput.current?.blur();
        }
    }, []);
    const handleHistoryItemClick = useCallback((item) => {
        setSearchText(item);
        navigateToItem(item);
    }, [navigateToItem]);
    const handleProfileClick = useCallback((profile) => {
        unstableCacheProfileView(queryClient, profile);
        // Slight delay to avoid updating during push nav animation.
        setTimeout(() => {
            updateProfileHistory(profile);
        }, 400);
    }, [updateProfileHistory, queryClient]);
    const onSoftReset = useCallback(() => {
        if (isWeb) {
            // Empty params resets the URL to be /search rather than /search?q=
            const { q: _q, ...parameters } = (route.params ?? {});
            // @ts-expect-error route is not typesafe
            navigation.replace(route.name, parameters);
        }
        else {
            setSearchText('');
            navigation.setParams({ q: '' });
            textInput.current?.focus();
        }
    }, [navigation, route]);
    useFocusEffect(useCallback(() => {
        setMinimalShellMode(false);
        return listenSoftReset(onSoftReset);
    }, [onSoftReset, setMinimalShellMode]));
    const onSearchInputFocus = useCallback(() => {
        if (isWeb) {
            // Prevent a jump on iPad by ensuring that
            // the initial focused render has no result list.
            requestAnimationFrame(() => {
                setShowAutocomplete(true);
            });
        }
        else {
            setShowAutocomplete(true);
        }
    }, [setShowAutocomplete]);
    const focusSearchInput = useCallback(() => {
        textInput.current?.focus();
    }, []);
    const showHeader = !gtMobile || navButton !== 'menu';
    return (_jsxs(Layout.Screen, { testID: testID, children: [_jsx(View, { ref: headerRef, onLayout: evt => {
                    if (isWeb)
                        setHeaderHeight(evt.nativeEvent.layout.height);
                }, style: [
                    a.relative,
                    a.z_10,
                    web({
                        position: 'sticky',
                        top: 0,
                    }),
                ], children: _jsxs(Layout.Center, { style: t.atoms.bg, children: [showHeader && (_jsx(View
                        // HACK: shift up search input. we can't remove the top padding
                        // on the search input because it messes up the layout animation
                        // if we add it only when the header is hidden
                        , { 
                            // HACK: shift up search input. we can't remove the top padding
                            // on the search input because it messes up the layout animation
                            // if we add it only when the header is hidden
                            style: { marginBottom: tokens.space.xs * -1 }, children: _jsxs(Layout.Header.Outer, { noBottomBorder: true, children: [navButton === 'menu' ? (_jsx(Layout.Header.MenuButton, {})) : (_jsx(Layout.Header.BackButton, {})), _jsx(Layout.Header.Content, { align: "left", children: _jsx(Layout.Header.TitleText, { children: isExplore ? _jsx(Trans, { children: "Explore" }) : _jsx(Trans, { children: "Search" }) }) }), showFilters ? (_jsx(SearchLanguageDropdown, { value: params.lang, onChange: params.setLang })) : (_jsx(Layout.Header.Slot, {}))] }) })), _jsx(View, { style: [a.px_lg, a.pt_sm, a.pb_sm, a.overflow_hidden], children: _jsxs(View, { style: [a.gap_sm], children: [_jsxs(View, { style: [a.w_full, a.flex_row, a.align_stretch, a.gap_xs], children: [_jsx(View, { style: [a.flex_1], children: _jsx(SearchInput, { ref: textInput, value: searchText, onFocus: onSearchInputFocus, onChangeText: onChangeText, onClearText: onPressClearQuery, onSubmitEditing: onSubmit, placeholder: inputPlaceholder ??
                                                        _(msg `Search for posts, users, or feeds`), hitSlop: { ...HITSLOP_20, top: 0 } }) }), showAutocomplete && (_jsx(Button, { label: _(msg `Cancel search`), size: "large", variant: "ghost", color: "secondary", style: [a.px_sm], onPress: onPressCancelSearch, hitSlop: HITSLOP_10, children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Cancel" }) }) }))] }), showFilters && !showHeader && (_jsx(View, { style: [
                                            a.flex_row,
                                            a.align_center,
                                            a.justify_between,
                                            a.gap_sm,
                                        ], children: _jsx(SearchLanguageDropdown, { value: params.lang, onChange: params.setLang }) }))] }) })] }) }), _jsx(View, { style: {
                    display: showAutocomplete && !fixedParams ? 'flex' : 'none',
                    flex: 1,
                }, children: searchText.length > 0 ? (_jsx(AutocompleteResults, { isAutocompleteFetching: isAutocompleteFetching, autocompleteData: autocompleteData, searchText: searchText, onSubmit: onSubmit, onResultPress: onAutocompleteResultPress, onProfileClick: handleProfileClick })) : (_jsx(SearchHistory, { searchHistory: termHistory, selectedProfiles: accountHistoryProfiles?.profiles || [], onItemClick: handleHistoryItemClick, onProfileClick: handleProfileClick, onRemoveItemClick: deleteSearchHistoryItem, onRemoveProfileClick: deleteProfileHistoryItem })) }), _jsx(View, { style: {
                    display: showAutocomplete ? 'none' : 'flex',
                    flex: 1,
                }, children: _jsx(SearchScreenInner, { query: query, queryWithParams: queryWithParams, headerHeight: headerHeight, focusSearchInput: focusSearchInput }) })] }));
}
let SearchScreenInner = ({ query, queryWithParams, headerHeight, focusSearchInput, }) => {
    const t = useTheme();
    const setMinimalShellMode = useSetMinimalShellMode();
    const { hasSession } = useSession();
    const { gtTablet } = useBreakpoints();
    const [activeTab, setActiveTab] = useState(0);
    const { _ } = useLingui();
    const onPageSelected = useCallback((index) => {
        setMinimalShellMode(false);
        setActiveTab(index);
    }, [setMinimalShellMode]);
    return queryWithParams ? (_jsx(SearchResults, { query: query, queryWithParams: queryWithParams, activeTab: activeTab, headerHeight: headerHeight, onPageSelected: onPageSelected })) : hasSession ? (_jsx(Explore, { focusSearchInput: focusSearchInput, headerHeight: headerHeight })) : (_jsx(Layout.Center, { children: _jsxs(View, { style: a.flex_1, children: [gtTablet && (_jsx(View, { style: [
                        a.border_b,
                        t.atoms.border_contrast_low,
                        a.px_lg,
                        a.pt_sm,
                        a.pb_lg,
                    ], children: _jsx(Text, { style: [a.text_2xl, a.font_heavy], children: _jsx(Trans, { children: "Search" }) }) })), _jsxs(View, { style: [a.align_center, a.justify_center, a.py_4xl, a.gap_lg], children: [_jsx(MagnifyingGlassIcon, { strokeWidth: 3, size: 60, style: t.atoms.text_contrast_medium }), _jsx(Text, { style: [t.atoms.text_contrast_medium, a.text_md], children: _jsx(Trans, { children: "Find posts, users, and feeds on Bluesky" }) })] })] }) }));
};
SearchScreenInner = memo(SearchScreenInner);
function useQueryManager({ initialQuery, fixedParams, }) {
    const { query, params: initialParams } = useMemo(() => {
        return parseSearchQuery(initialQuery || '');
    }, [initialQuery]);
    const [prevInitialQuery, setPrevInitialQuery] = useState(initialQuery);
    const [lang, setLang] = useState(initialParams.lang || '');
    if (initialQuery !== prevInitialQuery) {
        // handle new queryParam change (from manual search entry)
        setPrevInitialQuery(initialQuery);
        setLang(initialParams.lang || '');
    }
    const params = useMemo(() => ({
        // default stuff
        ...initialParams,
        // managed stuff
        lang,
        ...fixedParams,
    }), [lang, initialParams, fixedParams]);
    const handlers = useMemo(() => ({
        setLang,
    }), [setLang]);
    return useMemo(() => {
        return {
            query,
            queryWithParams: makeSearchQuery(query, params),
            params: {
                ...params,
                ...handlers,
            },
        };
    }, [query, params, handlers]);
}
function scrollToTopWeb() {
    if (isWeb) {
        window.scrollTo(0, 0);
    }
}
//# sourceMappingURL=Shell.js.map