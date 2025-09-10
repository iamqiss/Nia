import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import {} from '@atproto/api';
import { Trans } from '@lingui/macro';
import { DISCOVER_FEED_URI } from '#/lib/constants';
import { useA11y } from '#/state/a11y';
import { useGetPopularFeedsQuery, usePopularFeedsSearch, useSavedFeeds, } from '#/state/queries/feed';
import { List } from '#/view/com/util/List';
import { useWizardState } from '#/screens/StarterPack/Wizard/State';
import { atoms as a, useTheme } from '#/alf';
import { SearchInput } from '#/components/forms/SearchInput';
import { useThrottledValue } from '#/components/hooks/useThrottledValue';
import { Loader } from '#/components/Loader';
import { ScreenTransition } from '#/components/StarterPack/Wizard/ScreenTransition';
import { WizardFeedCard } from '#/components/StarterPack/Wizard/WizardListCard';
import { Text } from '#/components/Typography';
function keyExtractor(item) {
    return item.uri;
}
export function StepFeeds({ moderationOpts }) {
    const t = useTheme();
    const [state, dispatch] = useWizardState();
    const [query, setQuery] = useState('');
    const throttledQuery = useThrottledValue(query, 500);
    const { screenReaderEnabled } = useA11y();
    const { data: savedFeedsAndLists, isFetchedAfterMount: isFetchedSavedFeeds } = useSavedFeeds();
    const savedFeeds = savedFeedsAndLists?.feeds
        .filter(f => f.type === 'feed' && f.view.uri !== DISCOVER_FEED_URI)
        .map(f => f.view);
    const { data: popularFeedsPages, fetchNextPage, isLoading: isLoadingPopularFeeds, } = useGetPopularFeedsQuery({
        limit: 30,
    });
    const popularFeeds = popularFeedsPages?.pages.flatMap(p => p.feeds) ?? [];
    // If we have saved feeds already loaded, display them immediately
    // Then, when popular feeds have loaded we can concat them to the saved feeds
    const suggestedFeeds = savedFeeds || isFetchedSavedFeeds
        ? popularFeeds
            ? savedFeeds.concat(popularFeeds.filter(f => !savedFeeds.some(sf => sf.uri === f.uri)))
            : savedFeeds
        : undefined;
    const { data: searchedFeeds, isFetching: isFetchingSearchedFeeds } = usePopularFeedsSearch({ query: throttledQuery });
    const isLoading = !isFetchedSavedFeeds || isLoadingPopularFeeds || isFetchingSearchedFeeds;
    const renderItem = ({ item, }) => {
        return (_jsx(WizardFeedCard, { generator: item, btnType: "checkbox", state: state, dispatch: dispatch, moderationOpts: moderationOpts }));
    };
    return (_jsxs(ScreenTransition, { style: [a.flex_1], direction: state.transitionDirection, children: [_jsx(View, { style: [a.border_b, t.atoms.border_contrast_medium], children: _jsx(View, { style: [a.py_sm, a.px_md, { height: 60 }], children: _jsx(SearchInput, { value: query, onChangeText: t => setQuery(t), onClearText: () => setQuery('') }) }) }), _jsx(List, { data: query ? searchedFeeds : suggestedFeeds, renderItem: renderItem, keyExtractor: keyExtractor, onEndReached: !query && !screenReaderEnabled ? () => fetchNextPage() : undefined, onEndReachedThreshold: 2, keyboardDismissMode: "on-drag", renderScrollComponent: props => _jsx(KeyboardAwareScrollView, { ...props }), keyboardShouldPersistTaps: "handled", disableFullWindowScroll: true, sideBorders: false, style: { flex: 1 }, ListEmptyComponent: _jsx(View, { style: [a.flex_1, a.align_center, a.mt_lg, a.px_lg], children: isLoading ? (_jsx(Loader, { size: "lg" })) : (_jsx(Text, { style: [
                            a.font_bold,
                            a.text_lg,
                            a.text_center,
                            a.mt_lg,
                            a.leading_snug,
                        ], children: _jsx(Trans, { children: "No feeds found. Try searching for something else." }) })) }) })] }));
}
//# sourceMappingURL=StepFeeds.js.map