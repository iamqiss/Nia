import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import {} from '@atproto/api';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useFocusEffect } from '@react-navigation/native';
import {} from '@react-navigation/native-stack';
import { HITSLOP_10 } from '#/lib/constants';
import { useInitialNumToRender } from '#/lib/hooks/useInitialNumToRender';
import {} from '#/lib/routes/types';
import { shareUrl } from '#/lib/sharing';
import { cleanError } from '#/lib/strings/errors';
import { sanitizeHandle } from '#/lib/strings/handles';
import { enforceLen } from '#/lib/strings/helpers';
import { useSearchPostsQuery } from '#/state/queries/search-posts';
import { useSetMinimalShellMode } from '#/state/shell';
import { Pager } from '#/view/com/pager/Pager';
import { TabBar } from '#/view/com/pager/TabBar';
import { Post } from '#/view/com/post/Post';
import { List } from '#/view/com/util/List';
import { atoms as a, web } from '#/alf';
import { Button, ButtonIcon } from '#/components/Button';
import { ArrowOutOfBoxModified_Stroke2_Corner2_Rounded as Share } from '#/components/icons/ArrowOutOfBox';
import * as Layout from '#/components/Layout';
import { ListFooter, ListMaybePlaceholder } from '#/components/Lists';
const renderItem = ({ item }) => {
    return _jsx(Post, { post: item });
};
const keyExtractor = (item, index) => {
    return `${item.uri}-${index}`;
};
export default function HashtagScreen({ route, }) {
    const { tag, author } = route.params;
    const { _ } = useLingui();
    const fullTag = React.useMemo(() => {
        return `#${decodeURIComponent(tag)}`;
    }, [tag]);
    const headerTitle = React.useMemo(() => {
        return enforceLen(fullTag.toLowerCase(), 24, true, 'middle');
    }, [fullTag]);
    const sanitizedAuthor = React.useMemo(() => {
        if (!author)
            return;
        return sanitizeHandle(author);
    }, [author]);
    const onShare = React.useCallback(() => {
        const url = new URL('https://bsky.app');
        url.pathname = `/hashtag/${decodeURIComponent(tag)}`;
        if (author) {
            url.searchParams.set('author', author);
        }
        shareUrl(url.toString());
    }, [tag, author]);
    const [activeTab, setActiveTab] = React.useState(0);
    const setMinimalShellMode = useSetMinimalShellMode();
    useFocusEffect(React.useCallback(() => {
        setMinimalShellMode(false);
    }, [setMinimalShellMode]));
    const onPageSelected = React.useCallback((index) => {
        setMinimalShellMode(false);
        setActiveTab(index);
    }, [setMinimalShellMode]);
    const sections = React.useMemo(() => {
        return [
            {
                title: _(msg `Top`),
                component: (_jsx(HashtagScreenTab, { fullTag: fullTag, author: author, sort: "top", active: activeTab === 0 })),
            },
            {
                title: _(msg `Latest`),
                component: (_jsx(HashtagScreenTab, { fullTag: fullTag, author: author, sort: "latest", active: activeTab === 1 })),
            },
        ];
    }, [_, fullTag, author, activeTab]);
    return (_jsx(Layout.Screen, { children: _jsx(Pager, { onPageSelected: onPageSelected, renderTabBar: props => (_jsxs(Layout.Center, { style: [a.z_10, web([a.sticky, { top: 0 }])], children: [_jsxs(Layout.Header.Outer, { noBottomBorder: true, children: [_jsx(Layout.Header.BackButton, {}), _jsxs(Layout.Header.Content, { children: [_jsx(Layout.Header.TitleText, { children: headerTitle }), author && (_jsx(Layout.Header.SubtitleText, { children: _(msg `From @${sanitizedAuthor}`) }))] }), _jsx(Layout.Header.Slot, { children: _jsx(Button, { label: _(msg `Share`), size: "small", variant: "ghost", color: "primary", shape: "round", onPress: onShare, hitSlop: HITSLOP_10, style: [{ right: -3 }], children: _jsx(ButtonIcon, { icon: Share, size: "md" }) }) })] }), _jsx(TabBar, { items: sections.map(section => section.title), ...props })] })), initialPage: 0, children: sections.map((section, i) => (_jsx(View, { children: section.component }, i))) }) }));
}
function HashtagScreenTab({ fullTag, author, sort, active, }) {
    const { _ } = useLingui();
    const initialNumToRender = useInitialNumToRender();
    const [isPTR, setIsPTR] = React.useState(false);
    const queryParam = React.useMemo(() => {
        if (!author)
            return fullTag;
        return `${fullTag} from:${author}`;
    }, [fullTag, author]);
    const { data, isFetched, isFetchingNextPage, isLoading, isError, error, refetch, fetchNextPage, hasNextPage, } = useSearchPostsQuery({ query: queryParam, sort, enabled: active });
    const posts = React.useMemo(() => {
        return data?.pages.flatMap(page => page.posts) || [];
    }, [data]);
    const onRefresh = React.useCallback(async () => {
        setIsPTR(true);
        await refetch();
        setIsPTR(false);
    }, [refetch]);
    const onEndReached = React.useCallback(() => {
        if (isFetchingNextPage || !hasNextPage || error)
            return;
        fetchNextPage();
    }, [isFetchingNextPage, hasNextPage, error, fetchNextPage]);
    return (_jsx(_Fragment, { children: posts.length < 1 ? (_jsx(ListMaybePlaceholder, { isLoading: isLoading || !isFetched, isError: isError, onRetry: refetch, emptyType: "results", emptyMessage: _(msg `We couldn't find any results for that hashtag.`) })) : (_jsx(List, { data: posts, renderItem: renderItem, keyExtractor: keyExtractor, refreshing: isPTR, onRefresh: onRefresh, onEndReached: onEndReached, onEndReachedThreshold: 4, 
            // @ts-ignore web only -prf
            desktopFixedHeight: true, ListFooterComponent: _jsx(ListFooter, { isFetchingNextPage: isFetchingNextPage, error: cleanError(error), onRetry: fetchNextPage }), initialNumToRender: initialNumToRender, windowSize: 11 })) }));
}
//# sourceMappingURL=Hashtag.js.map