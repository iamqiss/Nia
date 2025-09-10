import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Modal, View } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ComAtprotoModerationDefs } from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useMutation } from '@tanstack/react-query';
import Graphemer from 'graphemer';
import { MAX_REPORT_REASON_GRAPHEME_LENGTH } from '#/lib/constants';
import { useEnableKeyboardController } from '#/lib/hooks/useEnableKeyboardController';
import { cleanError } from '#/lib/strings/errors';
import { isIOS, isWeb } from '#/platform/detection';
import { useAgent, useSession, useSessionApi } from '#/state/session';
import { CharProgress } from '#/view/com/composer/char-progress/CharProgress';
import { Logo } from '#/view/icons/Logo';
import { atoms as a, native, useBreakpoints, useTheme, web } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import * as TextField from '#/components/forms/TextField';
import { InlineLinkText } from '#/components/Link';
import { Loader } from '#/components/Loader';
import { P, Text } from '#/components/Typography';
const COL_WIDTH = 400;
export function Takendown() {
    const { _ } = useLingui();
    const t = useTheme();
    const insets = useSafeAreaInsets();
    const { gtMobile } = useBreakpoints();
    const { currentAccount } = useSession();
    const { logoutCurrentAccount } = useSessionApi();
    const agent = useAgent();
    const [isAppealling, setIsAppealling] = useState(false);
    const [reason, setReason] = useState('');
    const graphemer = useMemo(() => new Graphemer(), []);
    const reasonGraphemeLength = useMemo(() => {
        return graphemer.countGraphemes(reason);
    }, [graphemer, reason]);
    const { mutate: submitAppeal, isPending, isSuccess, error, } = useMutation({
        mutationFn: async (appealText) => {
            if (!currentAccount)
                throw new Error('No session');
            await agent.com.atproto.moderation.createReport({
                reasonType: ComAtprotoModerationDefs.REASONAPPEAL,
                subject: {
                    $type: 'com.atproto.admin.defs#repoRef',
                    did: currentAccount.did,
                },
                reason: appealText,
            });
        },
        onSuccess: () => setReason(''),
    });
    const primaryBtn = isAppealling && !isSuccess ? (_jsxs(Button, { variant: "solid", color: "primary", size: "large", label: _(msg `Submit appeal`), onPress: () => submitAppeal(reason), disabled: isPending || reasonGraphemeLength > MAX_REPORT_REASON_GRAPHEME_LENGTH, children: [_jsx(ButtonText, { children: _jsx(Trans, { children: "Submit Appeal" }) }), isPending && _jsx(ButtonIcon, { icon: Loader })] })) : (_jsx(Button, { variant: "solid", size: "large", color: "secondary_inverted", label: _(msg `Sign out`), onPress: () => logoutCurrentAccount('Takendown'), children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Sign Out" }) }) }));
    const secondaryBtn = isAppealling ? (!isSuccess && (_jsx(Button, { variant: "ghost", size: "large", color: "secondary", label: _(msg `Cancel`), onPress: () => setIsAppealling(false), children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Cancel" }) }) }))) : (_jsx(Button, { variant: "ghost", size: "large", color: "secondary", label: _(msg `Appeal suspension`), onPress: () => setIsAppealling(true), children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Appeal Suspension" }) }) }));
    const webLayout = isWeb && gtMobile;
    useEnableKeyboardController(true);
    return (_jsxs(Modal, { visible: true, animationType: native('slide'), presentationStyle: "formSheet", style: [web(a.util_screen_outer)], children: [isIOS && _jsx(SystemBars, { style: { statusBar: 'light' } }), _jsx(KeyboardAwareScrollView, { style: [a.flex_1, t.atoms.bg], centerContent: true, children: _jsx(View, { style: [
                        a.flex_row,
                        a.justify_center,
                        gtMobile ? a.pt_4xl : [a.px_xl, a.pt_4xl],
                    ], children: _jsxs(View, { style: [a.flex_1, { maxWidth: COL_WIDTH, minHeight: COL_WIDTH }], children: [_jsx(View, { style: [a.pb_xl], children: _jsx(Logo, { width: 64 }) }), _jsx(Text, { style: [a.text_4xl, a.font_heavy, a.pb_md], children: isAppealling ? (_jsx(Trans, { children: "Appeal suspension" })) : (_jsx(Trans, { children: "Your account has been suspended" })) }), isAppealling ? (_jsxs(View, { style: [a.relative, a.w_full, a.mt_xl], children: [isSuccess ? (_jsx(P, { style: [t.atoms.text_contrast_medium, a.text_center], children: _jsx(Trans, { children: "Your appeal has been submitted. If your appeal succeeds, you will receive an email." }) })) : (_jsxs(_Fragment, { children: [_jsx(TextField.LabelText, { children: _jsx(Trans, { children: "Reason for appeal" }) }), _jsx(TextField.Root, { isInvalid: reasonGraphemeLength >
                                                    MAX_REPORT_REASON_GRAPHEME_LENGTH || !!error, children: _jsx(TextField.Input, { label: _(msg `Reason for appeal`), defaultValue: reason, onChangeText: setReason, placeholder: _(msg `Why are you appealing?`), multiline: true, numberOfLines: 5, autoFocus: true, style: { paddingBottom: 40, minHeight: 150 }, maxLength: MAX_REPORT_REASON_GRAPHEME_LENGTH * 10 }) }), _jsx(View, { style: [
                                                    a.absolute,
                                                    a.flex_row,
                                                    a.align_center,
                                                    a.pr_md,
                                                    a.pb_sm,
                                                    {
                                                        bottom: 0,
                                                        right: 0,
                                                    },
                                                ], children: _jsx(CharProgress, { count: reasonGraphemeLength, max: MAX_REPORT_REASON_GRAPHEME_LENGTH }) })] })), error && (_jsx(Text, { style: [
                                            a.text_md,
                                            a.leading_normal,
                                            { color: t.palette.negative_500 },
                                            a.mt_lg,
                                        ], children: cleanError(error) }))] })) : (_jsx(P, { style: [t.atoms.text_contrast_medium], children: _jsxs(Trans, { children: ["Your account was found to be in violation of the", ' ', _jsx(InlineLinkText, { label: _(msg `Bluesky Social Terms of Service`), to: "https://bsky.social/about/support/tos", style: [a.text_md, a.leading_normal], overridePresentation: true, children: "Bluesky Social Terms of Service" }), ". You have been sent an email outlining the specific violation and suspension period, if applicable. You can appeal this decision if you believe it was made in error."] }) })), webLayout && (_jsxs(View, { style: [
                                    a.w_full,
                                    a.flex_row,
                                    a.justify_between,
                                    a.pt_5xl,
                                    { paddingBottom: 200 },
                                ], children: [secondaryBtn, primaryBtn] }))] }) }) }), !webLayout && (_jsx(View, { style: [
                    a.align_center,
                    t.atoms.bg,
                    gtMobile ? a.px_5xl : a.px_xl,
                    { paddingBottom: Math.max(insets.bottom, a.pb_5xl.paddingBottom) },
                ], children: _jsxs(View, { style: [a.w_full, a.gap_sm, { maxWidth: COL_WIDTH }], children: [primaryBtn, secondaryBtn] }) }))] }));
}
//# sourceMappingURL=Takendown.js.map