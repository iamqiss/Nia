import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useProfileQuery } from '#/state/queries/profile';
import { useSession } from '#/state/session';
import { useWizardState } from '#/screens/StarterPack/Wizard/State';
import { atoms as a, useTheme } from '#/alf';
import * as TextField from '#/components/forms/TextField';
import { StarterPack } from '#/components/icons/StarterPack';
import { ScreenTransition } from '#/components/StarterPack/Wizard/ScreenTransition';
import { Text } from '#/components/Typography';
export function StepDetails() {
    const { _ } = useLingui();
    const t = useTheme();
    const [state, dispatch] = useWizardState();
    const { currentAccount } = useSession();
    const { data: currentProfile } = useProfileQuery({
        did: currentAccount?.did,
        staleTime: 300,
    });
    return (_jsx(ScreenTransition, { direction: state.transitionDirection, children: _jsxs(View, { style: [a.px_xl, a.gap_xl, a.mt_4xl], children: [_jsxs(View, { style: [a.gap_md, a.align_center, a.px_md, a.mb_md], children: [_jsx(StarterPack, { width: 90, gradient: "sky" }), _jsx(Text, { style: [a.font_bold, a.text_3xl], children: _jsx(Trans, { children: "Invites, but personal" }) }), _jsx(Text, { style: [a.text_center, a.text_md, a.px_md], children: _jsx(Trans, { children: "Invite your friends to follow your favorite feeds and people" }) })] }), _jsxs(View, { children: [_jsx(TextField.LabelText, { children: _jsx(Trans, { children: "What do you want to call your starter pack?" }) }), _jsxs(TextField.Root, { children: [_jsx(TextField.Input, { label: _(msg `${currentProfile?.displayName || currentProfile?.handle}'s starter pack`), value: state.name, onChangeText: text => dispatch({ type: 'SetName', name: text }) }), _jsx(TextField.SuffixText, { label: _(msg({
                                        comment: 'Accessibility label describing how many characters the user has entered out of a 50-character limit in a text input field',
                                        message: `${state.name?.length} out of 50`,
                                    })), children: _jsxs(Text, { style: [t.atoms.text_contrast_medium], children: [state.name?.length ?? 0, "/50"] }) })] })] }), _jsxs(View, { children: [_jsx(TextField.LabelText, { children: _jsx(Trans, { children: "Tell us a little more" }) }), _jsx(TextField.Root, { children: _jsx(TextField.Input, { label: _(msg `${currentProfile?.displayName || currentProfile?.handle}'s favorite feeds and people - join me!`), value: state.description, onChangeText: text => dispatch({ type: 'SetDescription', description: text }), multiline: true, style: { minHeight: 150 } }) })] })] }) }));
}
//# sourceMappingURL=StepDetails.js.map