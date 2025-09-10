import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { sanitizeMutedWordValue } from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { logger } from '#/logger';
import { isNative } from '#/platform/detection';
import { usePreferencesQuery, useRemoveMutedWordMutation, useUpsertMutedWordsMutation, } from '#/state/queries/preferences';
import { atoms as a, native, useBreakpoints, useTheme, web, } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { useGlobalDialogsControlContext } from '#/components/dialogs/Context';
import { Divider } from '#/components/Divider';
import * as Toggle from '#/components/forms/Toggle';
import { useFormatDistance } from '#/components/hooks/dates';
import { Hashtag_Stroke2_Corner0_Rounded as Hashtag } from '#/components/icons/Hashtag';
import { PageText_Stroke2_Corner0_Rounded as PageText } from '#/components/icons/PageText';
import { PlusLarge_Stroke2_Corner0_Rounded as Plus } from '#/components/icons/Plus';
import { TimesLarge_Stroke2_Corner0_Rounded as X } from '#/components/icons/Times';
import { Loader } from '#/components/Loader';
import * as Prompt from '#/components/Prompt';
import { Text } from '#/components/Typography';
const ONE_DAY = 24 * 60 * 60 * 1000;
export function MutedWordsDialog() {
    const { mutedWordsDialogControl: control } = useGlobalDialogsControlContext();
    return (_jsxs(Dialog.Outer, { control: control, children: [_jsx(Dialog.Handle, {}), _jsx(MutedWordsInner, {})] }));
}
function MutedWordsInner() {
    const t = useTheme();
    const { _ } = useLingui();
    const { gtMobile } = useBreakpoints();
    const { isLoading: isPreferencesLoading, data: preferences, error: preferencesError, } = usePreferencesQuery();
    const { isPending, mutateAsync: addMutedWord } = useUpsertMutedWordsMutation();
    const [field, setField] = React.useState('');
    const [targets, setTargets] = React.useState(['content']);
    const [error, setError] = React.useState('');
    const [durations, setDurations] = React.useState(['forever']);
    const [excludeFollowing, setExcludeFollowing] = React.useState(false);
    const submit = React.useCallback(async () => {
        const sanitizedValue = sanitizeMutedWordValue(field);
        const surfaces = ['tag', targets.includes('content') && 'content'].filter(Boolean);
        const actorTarget = excludeFollowing ? 'exclude-following' : 'all';
        const now = Date.now();
        const rawDuration = durations.at(0);
        // undefined evaluates to 'forever'
        let duration;
        if (rawDuration === '24_hours') {
            duration = new Date(now + ONE_DAY).toISOString();
        }
        else if (rawDuration === '7_days') {
            duration = new Date(now + 7 * ONE_DAY).toISOString();
        }
        else if (rawDuration === '30_days') {
            duration = new Date(now + 30 * ONE_DAY).toISOString();
        }
        if (!sanitizedValue || !surfaces.length) {
            setField('');
            setError(_(msg `Please enter a valid word, tag, or phrase to mute`));
            return;
        }
        try {
            // send raw value and rely on SDK as sanitization source of truth
            await addMutedWord([
                {
                    value: field,
                    targets: surfaces,
                    actorTarget,
                    expiresAt: duration,
                },
            ]);
            setField('');
        }
        catch (e) {
            logger.error(`Failed to save muted word`, { message: e.message });
            setError(e.message);
        }
    }, [_, field, targets, addMutedWord, setField, durations, excludeFollowing]);
    return (_jsxs(Dialog.ScrollableInner, { label: _(msg `Manage your muted words and tags`), children: [_jsxs(View, { children: [_jsx(Text, { style: [a.text_md, a.font_bold, a.pb_sm, t.atoms.text_contrast_high], children: _jsx(Trans, { children: "Add muted words and tags" }) }), _jsx(Text, { style: [a.pb_lg, a.leading_snug, t.atoms.text_contrast_medium], children: _jsx(Trans, { children: "Posts can be muted based on their text, their tags, or both. We recommend avoiding common words that appear in many posts, since it can result in no posts being shown." }) }), _jsx(View, { style: [a.pb_sm], children: _jsx(Dialog.Input, { autoCorrect: false, autoCapitalize: "none", autoComplete: "off", label: _(msg `Enter a word or tag`), placeholder: _(msg `Enter a word or tag`), value: field, onChangeText: value => {
                                if (error) {
                                    setError('');
                                }
                                setField(value);
                            }, onSubmitEditing: submit }) }), _jsxs(View, { style: [a.pb_xl, a.gap_sm], children: [_jsxs(Toggle.Group, { label: _(msg `Select how long to mute this word for.`), type: "radio", values: durations, onChange: setDurations, children: [_jsx(Text, { style: [
                                            a.pb_xs,
                                            a.text_sm,
                                            a.font_bold,
                                            t.atoms.text_contrast_medium,
                                        ], children: _jsx(Trans, { children: "Duration:" }) }), _jsxs(View, { style: [
                                            gtMobile && [a.flex_row, a.align_center, a.justify_start],
                                            a.gap_sm,
                                        ], children: [_jsxs(View, { style: [
                                                    a.flex_1,
                                                    a.flex_row,
                                                    a.justify_start,
                                                    a.align_center,
                                                    a.gap_sm,
                                                ], children: [_jsx(Toggle.Item, { label: _(msg `Mute this word until you unmute it`), name: "forever", style: [a.flex_1], children: _jsx(TargetToggle, { children: _jsxs(View, { style: [a.flex_1, a.flex_row, a.align_center, a.gap_sm], children: [_jsx(Toggle.Radio, {}), _jsx(Toggle.LabelText, { style: [a.flex_1, a.leading_tight], children: _jsx(Trans, { children: "Forever" }) })] }) }) }), _jsx(Toggle.Item, { label: _(msg `Mute this word for 24 hours`), name: "24_hours", style: [a.flex_1], children: _jsx(TargetToggle, { children: _jsxs(View, { style: [a.flex_1, a.flex_row, a.align_center, a.gap_sm], children: [_jsx(Toggle.Radio, {}), _jsx(Toggle.LabelText, { style: [a.flex_1, a.leading_tight], children: _jsx(Trans, { children: "24 hours" }) })] }) }) })] }), _jsxs(View, { style: [
                                                    a.flex_1,
                                                    a.flex_row,
                                                    a.justify_start,
                                                    a.align_center,
                                                    a.gap_sm,
                                                ], children: [_jsx(Toggle.Item, { label: _(msg `Mute this word for 7 days`), name: "7_days", style: [a.flex_1], children: _jsx(TargetToggle, { children: _jsxs(View, { style: [a.flex_1, a.flex_row, a.align_center, a.gap_sm], children: [_jsx(Toggle.Radio, {}), _jsx(Toggle.LabelText, { style: [a.flex_1, a.leading_tight], children: _jsx(Trans, { children: "7 days" }) })] }) }) }), _jsx(Toggle.Item, { label: _(msg `Mute this word for 30 days`), name: "30_days", style: [a.flex_1], children: _jsx(TargetToggle, { children: _jsxs(View, { style: [a.flex_1, a.flex_row, a.align_center, a.gap_sm], children: [_jsx(Toggle.Radio, {}), _jsx(Toggle.LabelText, { style: [a.flex_1, a.leading_tight], children: _jsx(Trans, { children: "30 days" }) })] }) }) })] })] })] }), _jsxs(Toggle.Group, { label: _(msg `Select what content this mute word should apply to.`), type: "radio", values: targets, onChange: setTargets, children: [_jsx(Text, { style: [
                                            a.pb_xs,
                                            a.text_sm,
                                            a.font_bold,
                                            t.atoms.text_contrast_medium,
                                        ], children: _jsx(Trans, { children: "Mute in:" }) }), _jsxs(View, { style: [a.flex_row, a.align_center, a.gap_sm, a.flex_wrap], children: [_jsx(Toggle.Item, { label: _(msg `Mute this word in post text and tags`), name: "content", style: [a.flex_1], children: _jsxs(TargetToggle, { children: [_jsxs(View, { style: [a.flex_1, a.flex_row, a.align_center, a.gap_sm], children: [_jsx(Toggle.Radio, {}), _jsx(Toggle.LabelText, { style: [a.flex_1, a.leading_tight], children: _jsx(Trans, { children: "Text & tags" }) })] }), _jsx(PageText, { size: "sm" })] }) }), _jsx(Toggle.Item, { label: _(msg `Mute this word in tags only`), name: "tag", style: [a.flex_1], children: _jsxs(TargetToggle, { children: [_jsxs(View, { style: [a.flex_1, a.flex_row, a.align_center, a.gap_sm], children: [_jsx(Toggle.Radio, {}), _jsx(Toggle.LabelText, { style: [a.flex_1, a.leading_tight], children: _jsx(Trans, { children: "Tags only" }) })] }), _jsx(Hashtag, { size: "sm" })] }) })] })] }), _jsxs(View, { children: [_jsx(Text, { style: [
                                            a.pb_xs,
                                            a.text_sm,
                                            a.font_bold,
                                            t.atoms.text_contrast_medium,
                                        ], children: _jsx(Trans, { children: "Options:" }) }), _jsx(Toggle.Item, { label: _(msg `Do not apply this mute word to users you follow`), name: "exclude_following", style: [a.flex_row, a.justify_between], value: excludeFollowing, onChange: setExcludeFollowing, children: _jsx(TargetToggle, { children: _jsxs(View, { style: [a.flex_1, a.flex_row, a.align_center, a.gap_sm], children: [_jsx(Toggle.Checkbox, {}), _jsx(Toggle.LabelText, { style: [a.flex_1, a.leading_tight], children: _jsx(Trans, { children: "Exclude users you follow" }) })] }) }) })] }), _jsx(View, { style: [a.pt_xs], children: _jsxs(Button, { disabled: isPending || !field, label: _(msg `Add mute word with chosen settings`), size: "large", color: "primary", variant: "solid", style: [], onPress: submit, children: [_jsx(ButtonText, { children: _jsx(Trans, { children: "Add" }) }), _jsx(ButtonIcon, { icon: isPending ? Loader : Plus, position: "right" })] }) }), error && (_jsx(View, { style: [
                                    a.mb_lg,
                                    a.flex_row,
                                    a.rounded_sm,
                                    a.p_md,
                                    a.mb_xs,
                                    t.atoms.bg_contrast_25,
                                    {
                                        backgroundColor: t.palette.negative_400,
                                    },
                                ], children: _jsx(Text, { style: [
                                        a.italic,
                                        { color: t.palette.white },
                                        native({ marginTop: 2 }),
                                    ], children: error }) }))] }), _jsx(Divider, {}), _jsxs(View, { style: [a.pt_2xl], children: [_jsx(Text, { style: [
                                    a.text_md,
                                    a.font_bold,
                                    a.pb_md,
                                    t.atoms.text_contrast_high,
                                ], children: _jsx(Trans, { children: "Your muted words" }) }), isPreferencesLoading ? (_jsx(Loader, {})) : preferencesError || !preferences ? (_jsx(View, { style: [a.py_md, a.px_lg, a.rounded_md, t.atoms.bg_contrast_25], children: _jsx(Text, { style: [a.italic, t.atoms.text_contrast_high], children: _jsx(Trans, { children: "We're sorry, but we weren't able to load your muted words at this time. Please try again." }) }) })) : preferences.moderationPrefs.mutedWords.length ? ([...preferences.moderationPrefs.mutedWords]
                                .reverse()
                                .map((word, i) => (_jsx(MutedWordRow, { word: word, style: [i % 2 === 0 && t.atoms.bg_contrast_25] }, word.value + i)))) : (_jsx(View, { style: [a.py_md, a.px_lg, a.rounded_md, t.atoms.bg_contrast_25], children: _jsx(Text, { style: [a.italic, t.atoms.text_contrast_high], children: _jsx(Trans, { children: "You haven't muted any words or tags yet" }) }) }))] }), isNative && _jsx(View, { style: { height: 20 } })] }), _jsx(Dialog.Close, {})] }));
}
function MutedWordRow({ style, word, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const { isPending, mutateAsync: removeMutedWord } = useRemoveMutedWordMutation();
    const control = Prompt.usePromptControl();
    const expiryDate = word.expiresAt ? new Date(word.expiresAt) : undefined;
    const isExpired = expiryDate && expiryDate < new Date();
    const formatDistance = useFormatDistance();
    const remove = React.useCallback(async () => {
        control.close();
        removeMutedWord(word);
    }, [removeMutedWord, word, control]);
    return (_jsxs(_Fragment, { children: [_jsx(Prompt.Basic, { control: control, title: _(msg `Are you sure?`), description: _(msg `This will delete "${word.value}" from your muted words. You can always add it back later.`), onConfirm: remove, confirmButtonCta: _(msg `Remove`), confirmButtonColor: "negative" }), _jsxs(View, { style: [
                    a.flex_row,
                    a.justify_between,
                    a.py_md,
                    a.px_lg,
                    a.rounded_md,
                    a.gap_md,
                    style,
                ], children: [_jsxs(View, { style: [a.flex_1, a.gap_xs], children: [_jsx(View, { style: [a.flex_row, a.align_center, a.gap_sm], children: _jsx(Text, { style: [
                                        a.flex_1,
                                        a.leading_snug,
                                        a.font_bold,
                                        web({
                                            overflowWrap: 'break-word',
                                            wordBreak: 'break-word',
                                        }),
                                    ], children: word.targets.find(t => t === 'content') ? (_jsxs(Trans, { comment: "Pattern: {wordValue} in text, tags", children: [word.value, ' ', _jsxs(Text, { style: [a.font_normal, t.atoms.text_contrast_medium], children: ["in", ' ', _jsx(Text, { style: [a.font_bold, t.atoms.text_contrast_medium], children: "text & tags" })] })] })) : (_jsxs(Trans, { comment: "Pattern: {wordValue} in tags", children: [word.value, ' ', _jsxs(Text, { style: [a.font_normal, t.atoms.text_contrast_medium], children: ["in", ' ', _jsx(Text, { style: [a.font_bold, t.atoms.text_contrast_medium], children: "tags" })] })] })) }) }), (expiryDate || word.actorTarget === 'exclude-following') && (_jsx(View, { style: [a.flex_1, a.flex_row, a.align_center, a.gap_sm], children: _jsxs(Text, { style: [
                                        a.flex_1,
                                        a.text_xs,
                                        a.leading_snug,
                                        t.atoms.text_contrast_medium,
                                    ], children: [expiryDate && (_jsx(_Fragment, { children: isExpired ? (_jsx(Trans, { children: "Expired" })) : (_jsxs(Trans, { children: ["Expires", ' ', formatDistance(expiryDate, new Date(), {
                                                        addSuffix: true,
                                                    })] })) })), word.actorTarget === 'exclude-following' && (_jsxs(_Fragment, { children: [' • ', _jsx(Trans, { children: "Excludes users you follow" })] }))] }) }))] }), _jsx(Button, { label: _(msg `Remove mute word from your list`), size: "tiny", shape: "round", variant: "outline", color: "secondary", onPress: () => control.open(), style: [a.ml_sm], children: _jsx(ButtonIcon, { icon: isPending ? Loader : X }) })] })] }));
}
function TargetToggle({ children }) {
    const t = useTheme();
    const ctx = Toggle.useItemContext();
    const { gtMobile } = useBreakpoints();
    return (_jsx(View, { style: [
            a.flex_row,
            a.align_center,
            a.justify_between,
            a.gap_xs,
            a.flex_1,
            a.py_sm,
            a.px_sm,
            gtMobile && a.px_md,
            a.rounded_sm,
            t.atoms.bg_contrast_25,
            (ctx.hovered || ctx.focused) && t.atoms.bg_contrast_50,
            ctx.selected && [
                {
                    backgroundColor: t.palette.primary_50,
                },
            ],
            ctx.disabled && {
                opacity: 0.8,
            },
        ], children: children }));
}
//# sourceMappingURL=MutedWords.js.map