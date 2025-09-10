import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { memo } from 'react';
import { ActivityIndicator, View } from 'react-native';
import {} from '@atproto/api';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { isNative } from '#/platform/detection';
import { useModerationOpts } from '#/state/preferences/moderation-opts';
import { SearchLinkCard } from '#/view/shell/desktop/Search';
import { SearchProfileCard } from '#/screens/Search/components/SearchProfileCard';
import { atoms as a, native } from '#/alf';
import * as Layout from '#/components/Layout';
let AutocompleteResults = ({ isAutocompleteFetching, autocompleteData, searchText, onSubmit, onResultPress, onProfileClick, }) => {
    const { _ } = useLingui();
    const moderationOpts = useModerationOpts();
    return (_jsx(_Fragment, { children: (isAutocompleteFetching && !autocompleteData?.length) ||
            !moderationOpts ? (_jsx(Layout.Content, { children: _jsx(View, { style: [a.py_xl], children: _jsx(ActivityIndicator, {}) }) })) : (_jsxs(Layout.Content, { keyboardShouldPersistTaps: "handled", keyboardDismissMode: "on-drag", children: [_jsx(SearchLinkCard, { label: _(msg `Search for "${searchText}"`), onPress: native(onSubmit), to: isNative
                        ? undefined
                        : `/search?q=${encodeURIComponent(searchText)}`, style: a.border_b }), autocompleteData?.map(item => (_jsx(SearchProfileCard, { profile: item, moderationOpts: moderationOpts, onPress: () => {
                        onProfileClick(item);
                        onResultPress();
                    } }, item.did))), _jsx(View, { style: { height: 200 } })] })) }));
};
AutocompleteResults = memo(AutocompleteResults);
export { AutocompleteResults };
//# sourceMappingURL=AutocompleteResults.js.map