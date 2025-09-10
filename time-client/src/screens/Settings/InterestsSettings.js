import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {} from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import debounce from 'lodash.debounce';
import {} from '#/lib/routes/types';
import { preferencesQueryKey, usePreferencesQuery, } from '#/state/queries/preferences';
import {} from '#/state/queries/preferences/types';
import { createGetSuggestedFeedsQueryKey } from '#/state/queries/trending/useGetSuggestedFeedsQuery';
import { createGetSuggestedUsersQueryKey } from '#/state/queries/trending/useGetSuggestedUsersQuery';
import { createSuggestedStarterPacksQueryKey } from '#/state/queries/useSuggestedStarterPacksQuery';
import { useAgent } from '#/state/session';
import * as Toast from '#/view/com/util/Toast';
import { useInterestsDisplayNames } from '#/screens/Onboarding/state';
import { atoms as a, useGutters, useTheme } from '#/alf';
import { Admonition } from '#/components/Admonition';
import { Divider } from '#/components/Divider';
import * as Toggle from '#/components/forms/Toggle';
import * as Layout from '#/components/Layout';
import { Loader } from '#/components/Loader';
import { Text } from '#/components/Typography';
export function InterestsSettingsScreen({}) {
    const t = useTheme();
    const gutters = useGutters(['base']);
    const { data: preferences } = usePreferencesQuery();
    const [isSaving, setIsSaving] = useState(false);
    return (_jsxs(Layout.Screen, { children: [_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, { children: _jsx(Layout.Header.TitleText, { children: _jsx(Trans, { children: "Your interests" }) }) }), _jsx(Layout.Header.Slot, { children: isSaving && _jsx(Loader, {}) })] }), _jsx(Layout.Content, { children: _jsxs(View, { style: [gutters, a.gap_lg], children: [_jsx(Text, { style: [
                                a.flex_1,
                                a.text_sm,
                                a.leading_snug,
                                t.atoms.text_contrast_medium,
                            ], children: _jsx(Trans, { children: "Your selected interests help us serve you content you care about." }) }), _jsx(Divider, {}), preferences ? (_jsx(Inner, { preferences: preferences, setIsSaving: setIsSaving })) : (_jsx(View, { style: [a.flex_row, a.justify_center, a.p_lg], children: _jsx(Loader, { size: "xl" }) }))] }) })] }));
}
function Inner({ preferences, setIsSaving, }) {
    const { _ } = useLingui();
    const agent = useAgent();
    const qc = useQueryClient();
    const interestsDisplayNames = useInterestsDisplayNames();
    const preselectedInterests = useMemo(() => preferences.interests.tags || [], [preferences.interests.tags]);
    const [interests, setInterests] = useState(preselectedInterests);
    const saveInterests = useMemo(() => {
        return debounce(async (interests) => {
            const noEdits = interests.length === preselectedInterests.length &&
                preselectedInterests.every(pre => {
                    return interests.find(int => int === pre);
                });
            if (noEdits)
                return;
            setIsSaving(true);
            try {
                await agent.setInterestsPref({ tags: interests });
                qc.setQueriesData({ queryKey: preferencesQueryKey }, (old) => {
                    if (!old)
                        return old;
                    old.interests.tags = interests;
                    return old;
                });
                await Promise.all([
                    qc.resetQueries({ queryKey: createSuggestedStarterPacksQueryKey() }),
                    qc.resetQueries({ queryKey: createGetSuggestedFeedsQueryKey() }),
                    qc.resetQueries({ queryKey: createGetSuggestedUsersQueryKey({}) }),
                ]);
                Toast.show(_(msg({
                    message: 'Your interests have been updated!',
                    context: 'toast',
                })));
            }
            catch (error) {
                Toast.show(_(msg({
                    message: 'Failed to save your interests.',
                    context: 'toast',
                })), 'xmark');
            }
            finally {
                setIsSaving(false);
            }
        }, 1500);
    }, [_, agent, setIsSaving, qc, preselectedInterests]);
    const onChangeInterests = async (interests) => {
        setInterests(interests);
        saveInterests(interests);
    };
    return (_jsxs(_Fragment, { children: [interests.length === 0 && (_jsx(Admonition, { type: "tip", children: _jsx(Trans, { children: "We recommend selecting at least two interests." }) })), _jsx(Toggle.Group, { values: interests, onChange: onChangeInterests, label: _(msg `Select your interests from the options below`), children: _jsx(View, { style: [a.flex_row, a.flex_wrap, a.gap_sm], children: INTERESTS.map(interest => {
                        const name = interestsDisplayNames[interest];
                        if (!name)
                            return null;
                        return (_jsx(Toggle.Item, { name: interest, label: interestsDisplayNames[interest], children: _jsx(InterestButton, { interest: interest }) }, interest));
                    }) }) })] }));
}
export function InterestButton({ interest }) {
    const t = useTheme();
    const interestsDisplayNames = useInterestsDisplayNames();
    const ctx = Toggle.useItemContext();
    const styles = useMemo(() => {
        const hovered = [t.atoms.bg_contrast_100];
        const focused = [];
        const pressed = [];
        const selected = [t.atoms.bg_contrast_900];
        const selectedHover = [t.atoms.bg_contrast_975];
        const textSelected = [t.atoms.text_inverted];
        return {
            hovered,
            focused,
            pressed,
            selected,
            selectedHover,
            textSelected,
        };
    }, [t]);
    return (_jsx(View, { style: [
            a.rounded_full,
            a.py_md,
            a.px_xl,
            t.atoms.bg_contrast_50,
            ctx.hovered ? styles.hovered : {},
            ctx.focused ? styles.hovered : {},
            ctx.pressed ? styles.hovered : {},
            ctx.selected ? styles.selected : {},
            ctx.selected && (ctx.hovered || ctx.focused || ctx.pressed)
                ? styles.selectedHover
                : {},
        ], children: _jsx(Text, { selectable: false, style: [
                {
                    color: t.palette.contrast_900,
                },
                a.font_bold,
                ctx.selected ? styles.textSelected : {},
            ], children: interestsDisplayNames[interest] }) }));
}
const INTERESTS = [
    'animals',
    'art',
    'books',
    'comedy',
    'comics',
    'culture',
    'dev',
    'education',
    'food',
    'gaming',
    'journalism',
    'movies',
    'music',
    'nature',
    'news',
    'pets',
    'photography',
    'politics',
    'science',
    'sports',
    'tech',
    'tv',
    'writers',
];
//# sourceMappingURL=InterestsSettings.js.map