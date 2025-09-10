import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {} from '#/lib/routes/types';
import { usePreferencesQuery, useSetFeedViewPreferencesMutation, } from '#/state/queries/preferences';
import { atoms as a } from '#/alf';
import { Admonition } from '#/components/Admonition';
import * as Toggle from '#/components/forms/Toggle';
import { Beaker_Stroke2_Corner2_Rounded as BeakerIcon } from '#/components/icons/Beaker';
import { Bubbles_Stroke2_Corner2_Rounded as BubblesIcon } from '#/components/icons/Bubble';
import { CloseQuote_Stroke2_Corner1_Rounded as QuoteIcon } from '#/components/icons/Quote';
import { Repost_Stroke2_Corner2_Rounded as RepostIcon } from '#/components/icons/Repost';
import * as Layout from '#/components/Layout';
import * as SettingsList from './components/SettingsList';
export function FollowingFeedPreferencesScreen({}) {
    const { _ } = useLingui();
    const { data: preferences } = usePreferencesQuery();
    const { mutate: setFeedViewPref, variables } = useSetFeedViewPreferencesMutation();
    const showReplies = !(variables?.hideReplies ?? preferences?.feedViewPrefs?.hideReplies);
    const showReposts = !(variables?.hideReposts ?? preferences?.feedViewPrefs?.hideReposts);
    const showQuotePosts = !(variables?.hideQuotePosts ?? preferences?.feedViewPrefs?.hideQuotePosts);
    const mergeFeedEnabled = Boolean(variables?.lab_mergeFeedEnabled ??
        preferences?.feedViewPrefs?.lab_mergeFeedEnabled);
    return (_jsxs(Layout.Screen, { testID: "followingFeedPreferencesScreen", children: [_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, { children: _jsx(Layout.Header.TitleText, { children: _jsx(Trans, { children: "Following Feed Preferences" }) }) }), _jsx(Layout.Header.Slot, {})] }), _jsx(Layout.Content, { children: _jsxs(SettingsList.Container, { children: [_jsx(SettingsList.Item, { children: _jsx(Admonition, { type: "tip", style: [a.flex_1], children: _jsx(Trans, { children: "These settings only apply to the Following feed." }) }) }), _jsx(Toggle.Item, { type: "checkbox", name: "show-replies", label: _(msg `Show replies`), value: showReplies, onChange: value => setFeedViewPref({
                                hideReplies: !value,
                            }), children: _jsxs(SettingsList.Item, { children: [_jsx(SettingsList.ItemIcon, { icon: BubblesIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Show replies" }) }), _jsx(Toggle.Platform, {})] }) }), _jsx(Toggle.Item, { type: "checkbox", name: "show-reposts", label: _(msg `Show reposts`), value: showReposts, onChange: value => setFeedViewPref({
                                hideReposts: !value,
                            }), children: _jsxs(SettingsList.Item, { children: [_jsx(SettingsList.ItemIcon, { icon: RepostIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Show reposts" }) }), _jsx(Toggle.Platform, {})] }) }), _jsx(Toggle.Item, { type: "checkbox", name: "show-quotes", label: _(msg `Show quote posts`), value: showQuotePosts, onChange: value => setFeedViewPref({
                                hideQuotePosts: !value,
                            }), children: _jsxs(SettingsList.Item, { children: [_jsx(SettingsList.ItemIcon, { icon: QuoteIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Show quote posts" }) }), _jsx(Toggle.Platform, {})] }) }), _jsx(SettingsList.Divider, {}), _jsxs(SettingsList.Group, { children: [_jsx(SettingsList.ItemIcon, { icon: BeakerIcon }), _jsx(SettingsList.ItemText, { children: _jsx(Trans, { children: "Experimental" }) }), _jsxs(Toggle.Item, { type: "checkbox", name: "merge-feed", label: _(msg `Show samples of your saved feeds in your Following feed`), value: mergeFeedEnabled, onChange: value => setFeedViewPref({
                                        lab_mergeFeedEnabled: value,
                                    }), style: [a.w_full, a.gap_md], children: [_jsx(Toggle.LabelText, { style: [a.flex_1], children: _jsx(Trans, { children: "Show samples of your saved feeds in your Following feed" }) }), _jsx(Toggle.Platform, {})] })] })] }) })] }));
}
//# sourceMappingURL=FollowingFeedPreferences.js.map