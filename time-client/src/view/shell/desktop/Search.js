import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View, } from 'react-native';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { StackActions, useNavigation } from '@react-navigation/native';
import { usePalette } from '#/lib/hooks/usePalette';
import {} from '#/lib/routes/types';
import { useModerationOpts } from '#/state/preferences/moderation-opts';
import { useActorAutocompleteQuery } from '#/state/queries/actor-autocomplete';
import { Link } from '#/view/com/util/Link';
import { Text } from '#/view/com/util/text/Text';
import { SearchProfileCard } from '#/screens/Search/components/SearchProfileCard';
import { atoms as a } from '#/alf';
import { SearchInput } from '#/components/forms/SearchInput';
let SearchLinkCard = ({ label, to, onPress, style, }) => {
    const pal = usePalette('default');
    const inner = (_jsx(View, { style: [pal.border, { paddingVertical: 16, paddingHorizontal: 12 }, style], children: _jsx(Text, { type: "md", style: [pal.text], children: label }) }));
    if (onPress) {
        return (_jsx(TouchableOpacity, { onPress: onPress, accessibilityLabel: label, accessibilityHint: "", children: inner }));
    }
    return (_jsx(Link, { href: to, asAnchor: true, anchorNoUnderline: true, children: _jsx(View, { style: [
                pal.border,
                { paddingVertical: 16, paddingHorizontal: 12 },
                style,
            ], children: _jsx(Text, { type: "md", style: [pal.text], children: label }) }) }));
};
SearchLinkCard = React.memo(SearchLinkCard);
export { SearchLinkCard };
export function DesktopSearch() {
    const { _ } = useLingui();
    const pal = usePalette('default');
    const navigation = useNavigation();
    const [isActive, setIsActive] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const { data: autocompleteData, isFetching } = useActorAutocompleteQuery(query, true);
    const moderationOpts = useModerationOpts();
    const onChangeText = React.useCallback((text) => {
        setQuery(text);
        setIsActive(text.length > 0);
    }, []);
    const onPressCancelSearch = React.useCallback(() => {
        setQuery('');
        setIsActive(false);
    }, [setQuery]);
    const onSubmit = React.useCallback(() => {
        setIsActive(false);
        if (!query.length)
            return;
        navigation.dispatch(StackActions.push('Search', { q: query }));
    }, [query, navigation]);
    const onSearchProfileCardPress = React.useCallback(() => {
        setQuery('');
        setIsActive(false);
    }, []);
    return (_jsxs(View, { style: [styles.container, pal.view], children: [_jsx(SearchInput, { value: query, onChangeText: onChangeText, onClearText: onPressCancelSearch, onSubmitEditing: onSubmit }), query !== '' && isActive && moderationOpts && (_jsx(View, { style: [
                    pal.view,
                    pal.borderDark,
                    styles.resultsContainer,
                    a.overflow_hidden,
                ], children: isFetching && !autocompleteData?.length ? (_jsx(View, { style: { padding: 8 }, children: _jsx(ActivityIndicator, {}) })) : (_jsxs(_Fragment, { children: [_jsx(SearchLinkCard, { label: _(msg `Search for "${query}"`), to: `/search?q=${encodeURIComponent(query)}`, style: (autocompleteData?.length ?? 0) > 0
                                ? { borderBottomWidth: 1 }
                                : undefined }), autocompleteData?.map(item => (_jsx(SearchProfileCard, { profile: item, moderationOpts: moderationOpts, onPress: onSearchProfileCardPress }, item.did)))] })) }))] }));
}
const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: '100%',
    },
    resultsContainer: {
        marginTop: 10,
        flexDirection: 'column',
        width: '100%',
        borderWidth: 1,
        borderRadius: 6,
    },
});
//# sourceMappingURL=Search.js.map