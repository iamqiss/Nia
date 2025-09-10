import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import {} from '@atproto/api';
import { Trans } from '@lingui/macro';
import { isNative } from '#/platform/detection';
import { useA11y } from '#/state/a11y';
import { useActorAutocompleteQuery } from '#/state/queries/actor-autocomplete';
import { useActorSearchPaginated } from '#/state/queries/actor-search';
import { List } from '#/view/com/util/List';
import { useWizardState } from '#/screens/StarterPack/Wizard/State';
import { atoms as a, useTheme } from '#/alf';
import { SearchInput } from '#/components/forms/SearchInput';
import { Loader } from '#/components/Loader';
import { ScreenTransition } from '#/components/StarterPack/Wizard/ScreenTransition';
import { WizardProfileCard } from '#/components/StarterPack/Wizard/WizardListCard';
import { Text } from '#/components/Typography';
function keyExtractor(item) {
    return item?.did ?? '';
}
export function StepProfiles({ moderationOpts, }) {
    const t = useTheme();
    const [state, dispatch] = useWizardState();
    const [query, setQuery] = useState('');
    const { screenReaderEnabled } = useA11y();
    const { data: topPages, fetchNextPage, isLoading: isLoadingTopPages, } = useActorSearchPaginated({
        query: encodeURIComponent('*'),
    });
    const topFollowers = topPages?.pages
        .flatMap(p => p.actors)
        .filter(p => !p.associated?.labeler);
    const { data: resultsUnfiltered, isFetching: isFetchingResults } = useActorAutocompleteQuery(query, true, 12);
    const results = resultsUnfiltered?.filter(p => !p.associated?.labeler);
    const isLoading = isLoadingTopPages || isFetchingResults;
    const renderItem = ({ item, }) => {
        return (_jsx(WizardProfileCard, { profile: item, btnType: "checkbox", state: state, dispatch: dispatch, moderationOpts: moderationOpts }));
    };
    return (_jsxs(ScreenTransition, { style: [a.flex_1], direction: state.transitionDirection, children: [_jsx(View, { style: [a.border_b, t.atoms.border_contrast_medium], children: _jsx(View, { style: [a.py_sm, a.px_md, { height: 60 }], children: _jsx(SearchInput, { value: query, onChangeText: setQuery, onClearText: () => setQuery('') }) }) }), _jsx(List, { data: query ? results : topFollowers, renderItem: renderItem, keyExtractor: keyExtractor, renderScrollComponent: props => _jsx(KeyboardAwareScrollView, { ...props }), keyboardShouldPersistTaps: "handled", disableFullWindowScroll: true, sideBorders: false, style: [a.flex_1], onEndReached: !query && !screenReaderEnabled ? () => fetchNextPage() : undefined, onEndReachedThreshold: isNative ? 2 : 0.25, keyboardDismissMode: "on-drag", ListEmptyComponent: _jsx(View, { style: [a.flex_1, a.align_center, a.mt_lg, a.px_lg], children: isLoading ? (_jsx(Loader, { size: "lg" })) : (_jsx(Text, { style: [
                            a.font_bold,
                            a.text_lg,
                            a.text_center,
                            a.mt_lg,
                            a.leading_snug,
                        ], children: _jsx(Trans, { children: "Nobody was found. Try searching for someone else." }) })) }) })] }));
}
//# sourceMappingURL=StepProfiles.js.map