import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { memo, useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { usePalette } from '#/lib/hooks/usePalette';
import { augmentSearchQuery } from '#/lib/strings/helpers';
import { useActorSearch } from '#/state/queries/actor-search';
import { usePopularFeedsSearch } from '#/state/queries/feed';
import { useSearchPostsQuery } from '#/state/queries/search-posts';
import { useSession } from '#/state/session';
import { useLoggedOutViewControls } from '#/state/shell/logged-out';
import { useCloseAllActiveElements } from '#/state/util';
import { Pager } from '#/view/com/pager/Pager';
import { TabBar } from '#/view/com/pager/TabBar';
import { Post } from '#/view/com/post/Post';
import { ProfileCardWithFollowBtn } from '#/view/com/profile/ProfileCard';
import { List } from '#/view/com/util/List';
import { atoms as a, useTheme, web } from '#/alf';
import * as FeedCard from '#/components/FeedCard';
import * as Layout from '#/components/Layout';
import { InlineLinkText } from '#/components/Link';
import { SearchError } from '#/components/SearchError';
import { Text } from '#/components/Typography';
let SearchResults = ({ query, queryWithParams, activeTab, onPageSelected, headerHeight, }) => {
    const { _ } = useLingui();
    const sections = useMemo(() => {
        if (!queryWithParams)
            return [];
        const noParams = queryWithParams === query;
        return [
            {
                title: _(msg `Top`),
                component: (_jsx(SearchScreenPostResults, { query: queryWithParams, sort: "top", active: activeTab === 0 })),
            },
            {
                title: _(msg `Latest`),
                component: (_jsx(SearchScreenPostResults, { query: queryWithParams, sort: "latest", active: activeTab === 1 })),
            },
            noParams && {
                title: _(msg `People`),
                component: (_jsx(SearchScreenUserResults, { query: query, active: activeTab === 2 })),
            },
            noParams && {
                title: _(msg `Feeds`),
                component: (_jsx(SearchScreenFeedsResults, { query: query, active: activeTab === 3 })),
            },
        ].filter(Boolean);
    }, [_, query, queryWithParams, activeTab]);
    return (_jsx(Pager, { onPageSelected: onPageSelected, renderTabBar: props => (_jsx(Layout.Center, { style: [a.z_10, web([a.sticky, { top: headerHeight }])], children: _jsx(TabBar, { items: sections.map(section => section.title), ...props }) })), initialPage: 0, children: sections.map((section, i) => (_jsx(View, { children: section.component }, i))) }));
};
SearchResults = memo(SearchResults);
export { SearchResults };
function Loader() {
    return (_jsx(Layout.Content, { children: _jsx(View, { style: [a.py_xl], children: _jsx(ActivityIndicator, {}) }) }));
}
function EmptyState({ message, error, children, }) {
    const t = useTheme();
    return (_jsx(Layout.Content, { children: _jsx(View, { style: [a.p_xl], children: _jsxs(View, { style: [t.atoms.bg_contrast_25, a.rounded_sm, a.p_lg], children: [_jsx(Text, { style: [a.text_md], children: message }), error && (_jsxs(_Fragment, { children: [_jsx(View, { style: [
                                    {
                                        marginVertical: 12,
                                        height: 1,
                                        width: '100%',
                                        backgroundColor: t.atoms.text.color,
                                        opacity: 0.2,
                                    },
                                ] }), _jsx(Text, { style: [t.atoms.text_contrast_medium], children: _jsxs(Trans, { children: ["Error: ", error] }) })] })), children] }) }) }));
}
let SearchScreenPostResults = ({ query, sort, active, }) => {
    const { _ } = useLingui();
    const { currentAccount } = useSession();
    const [isPTR, setIsPTR] = useState(false);
    const isLoggedin = Boolean(currentAccount?.did);
    const augmentedQuery = useMemo(() => {
        return augmentSearchQuery(query || '', { did: currentAccount?.did });
    }, [query, currentAccount]);
    const { isFetched, data: results, isFetching, error, refetch, fetchNextPage, isFetchingNextPage, hasNextPage, } = useSearchPostsQuery({ query: augmentedQuery, sort, enabled: active });
    const pal = usePalette('default');
    const t = useTheme();
    const onPullToRefresh = useCallback(async () => {
        setIsPTR(true);
        await refetch();
        setIsPTR(false);
    }, [setIsPTR, refetch]);
    const onEndReached = useCallback(() => {
        if (isFetching || !hasNextPage || error)
            return;
        fetchNextPage();
    }, [isFetching, error, hasNextPage, fetchNextPage]);
    const posts = useMemo(() => {
        return results?.pages.flatMap(page => page.posts) || [];
    }, [results]);
    const items = useMemo(() => {
        let temp = [];
        const seenUris = new Set();
        for (const post of posts) {
            if (seenUris.has(post.uri)) {
                continue;
            }
            temp.push({
                type: 'post',
                key: post.uri,
                post,
            });
            seenUris.add(post.uri);
        }
        if (isFetchingNextPage) {
            temp.push({
                type: 'loadingMore',
                key: 'loadingMore',
            });
        }
        return temp;
    }, [posts, isFetchingNextPage]);
    const closeAllActiveElements = useCloseAllActiveElements();
    const { requestSwitchToAccount } = useLoggedOutViewControls();
    const showSignIn = () => {
        closeAllActiveElements();
        requestSwitchToAccount({ requestedAccount: 'none' });
    };
    const showCreateAccount = () => {
        closeAllActiveElements();
        requestSwitchToAccount({ requestedAccount: 'new' });
    };
    if (!isLoggedin) {
        return (_jsx(SearchError, { title: _(msg `Search is currently unavailable when logged out`), children: _jsx(Text, { style: [a.text_md, a.text_center, a.leading_snug], children: _jsxs(Trans, { children: [_jsx(InlineLinkText, { style: [pal.link], label: _(msg `Sign in`), to: '#', onPress: showSignIn, children: "Sign in" }), _jsx(Text, { style: t.atoms.text_contrast_medium, children: " or " }), _jsx(InlineLinkText, { style: [pal.link], label: _(msg `Create an account`), to: '#', onPress: showCreateAccount, children: "create an account" }), _jsx(Text, { children: " " }), _jsx(Text, { style: t.atoms.text_contrast_medium, children: "to search for news, sports, politics, and everything else happening on Bluesky." })] }) }) }));
    }
    return error ? (_jsx(EmptyState, { message: _(msg `We're sorry, but your search could not be completed. Please try again in a few minutes.`), error: error.toString() })) : (_jsx(_Fragment, { children: isFetched ? (_jsx(_Fragment, { children: posts.length ? (_jsx(List, { data: items, renderItem: ({ item }) => {
                    if (item.type === 'post') {
                        return _jsx(Post, { post: item.post });
                    }
                    else {
                        return null;
                    }
                }, keyExtractor: item => item.key, refreshing: isPTR, onRefresh: onPullToRefresh, onEndReached: onEndReached, desktopFixedHeight: true, contentContainerStyle: { paddingBottom: 100 } })) : (_jsx(EmptyState, { message: _(msg `No results found for ${query}`) })) })) : (_jsx(Loader, {})) }));
};
SearchScreenPostResults = memo(SearchScreenPostResults);
let SearchScreenUserResults = ({ query, active, }) => {
    const { _ } = useLingui();
    const { data: results, isFetched } = useActorSearch({
        query,
        enabled: active,
    });
    return isFetched && results ? (_jsx(_Fragment, { children: results.length ? (_jsx(List, { data: results, renderItem: ({ item }) => _jsx(ProfileCardWithFollowBtn, { profile: item }), keyExtractor: item => item.did, desktopFixedHeight: true, contentContainerStyle: { paddingBottom: 100 } })) : (_jsx(EmptyState, { message: _(msg `No results found for ${query}`) })) })) : (_jsx(Loader, {}));
};
SearchScreenUserResults = memo(SearchScreenUserResults);
let SearchScreenFeedsResults = ({ query, active, }) => {
    const t = useTheme();
    const { _ } = useLingui();
    const { data: results, isFetched } = usePopularFeedsSearch({
        query,
        enabled: active,
    });
    return isFetched && results ? (_jsx(_Fragment, { children: results.length ? (_jsx(List, { data: results, renderItem: ({ item }) => (_jsx(View, { style: [
                    a.border_b,
                    t.atoms.border_contrast_low,
                    a.px_lg,
                    a.py_lg,
                ], children: _jsx(FeedCard.Default, { view: item }) })), keyExtractor: item => item.uri, desktopFixedHeight: true, contentContainerStyle: { paddingBottom: 100 } })) : (_jsx(EmptyState, { message: _(msg `No results found for ${query}`) })) })) : (_jsx(Loader, {}));
};
SearchScreenFeedsResults = memo(SearchScreenFeedsResults);
//# sourceMappingURL=SearchResults.js.map