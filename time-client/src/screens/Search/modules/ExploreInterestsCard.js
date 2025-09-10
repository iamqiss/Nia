import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Nux, useSaveNux } from '#/state/queries/nuxs';
import { usePreferencesQuery } from '#/state/queries/preferences';
import { useInterestsDisplayNames } from '#/screens/Onboarding/state';
import { atoms as a, useTheme } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import { Shapes_Stroke2_Corner0_Rounded as Shapes } from '#/components/icons/Shapes';
import { TimesLarge_Stroke2_Corner0_Rounded as X } from '#/components/icons/Times';
import { Link } from '#/components/Link';
import * as Prompt from '#/components/Prompt';
import { Text } from '#/components/Typography';
export function ExploreInterestsCard() {
    const t = useTheme();
    const { _ } = useLingui();
    const { data: preferences } = usePreferencesQuery();
    const interestsDisplayNames = useInterestsDisplayNames();
    const { mutateAsync: saveNux } = useSaveNux();
    const trendingPrompt = Prompt.usePromptControl();
    const [closing, setClosing] = useState(false);
    const onClose = () => {
        trendingPrompt.open();
    };
    const onConfirmClose = () => {
        setClosing(true);
        // if this fails, they can try again later
        saveNux({
            id: Nux.ExploreInterestsCard,
            completed: true,
            data: undefined,
        }).catch(() => { });
    };
    return closing ? null : (_jsxs(_Fragment, { children: [_jsx(Prompt.Basic, { control: trendingPrompt, title: _(msg `Dismiss interests`), description: _(msg `You can adjust your interests at any time from "Content and media" settings.`), confirmButtonCta: _(msg({
                    message: `OK`,
                    comment: `Confirm button text.`,
                })), onConfirm: onConfirmClose }), _jsx(View, { style: [a.pb_2xs], children: _jsxs(View, { style: [
                        a.p_lg,
                        a.border_b,
                        a.gap_md,
                        t.atoms.border_contrast_medium,
                    ], children: [_jsxs(View, { style: [a.flex_row, a.gap_sm, a.align_center], children: [_jsx(Shapes, {}), _jsx(Text, { style: [a.text_xl, a.font_bold, a.leading_tight], children: _jsx(Trans, { children: "Your interests" }) })] }), preferences?.interests?.tags &&
                            preferences.interests.tags.length > 0 ? (_jsx(View, { style: [a.flex_row, a.flex_wrap, { gap: 6 }], children: preferences.interests.tags.map(tag => (_jsx(View, { style: [
                                    a.justify_center,
                                    a.align_center,
                                    a.rounded_full,
                                    t.atoms.bg_contrast_25,
                                    a.px_lg,
                                    { height: 32 },
                                ], children: _jsx(Text, { style: [a.text_sm, t.atoms.text_contrast_high], children: interestsDisplayNames[tag] }) }, tag))) })) : null, _jsx(Text, { style: [a.text_sm, a.leading_snug], children: _jsx(Trans, { children: "Your interests help us find what you like!" }) }), _jsx(Link, { label: _(msg `Edit interests`), to: "/settings/interests", size: "small", variant: "solid", color: "primary", style: [a.justify_center], children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Edit interests" }) }) }), _jsx(Button, { label: _(msg `Hide this card`), size: "small", variant: "ghost", color: "secondary", shape: "round", onPress: onClose, style: [
                                a.absolute,
                                { top: a.pt_sm.paddingTop, right: a.pr_sm.paddingRight },
                            ], children: _jsx(ButtonIcon, { icon: X, size: "md" }) })] }) })] }));
}
//# sourceMappingURL=ExploreInterestsCard.js.map