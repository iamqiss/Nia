import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { View } from 'react-native';
import { XRPCError } from '@atproto/xrpc';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { validate as validateEmail } from 'email-validator';
import { useCleanError } from '#/lib/hooks/useCleanError';
import { SupportCode, useCreateSupportLink, } from '#/lib/hooks/useCreateSupportLink';
import { useGetTimeAgo } from '#/lib/hooks/useTimeAgo';
import { useTLDs } from '#/lib/hooks/useTLDs';
import { isEmailMaybeInvalid } from '#/lib/strings/email';
import {} from '#/locale/languages';
import { useAgeAssuranceContext } from '#/state/ageAssurance';
import { useInitAgeAssurance } from '#/state/ageAssurance/useInitAgeAssurance';
import { logger } from '#/state/ageAssurance/util';
import { useLanguagePrefs } from '#/state/preferences';
import { useSession } from '#/state/session';
import { atoms as a, useTheme, web } from '#/alf';
import { Admonition } from '#/components/Admonition';
import { AgeAssuranceBadge } from '#/components/ageAssurance/AgeAssuranceBadge';
import { urls } from '#/components/ageAssurance/const';
import { KWS_SUPPORTED_LANGS } from '#/components/ageAssurance/const';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { Divider } from '#/components/Divider';
import * as TextField from '#/components/forms/TextField';
import { ShieldCheck_Stroke2_Corner0_Rounded as Shield } from '#/components/icons/Shield';
import { LanguageSelect } from '#/components/LanguageSelect';
import { InlineLinkText } from '#/components/Link';
import { Loader } from '#/components/Loader';
import { Text } from '#/components/Typography';
export { useDialogControl } from '#/components/Dialog/context';
export function AgeAssuranceInitDialog({ control, }) {
    const { _ } = useLingui();
    return (_jsxs(Dialog.Outer, { control: control, children: [_jsx(Dialog.Handle, {}), _jsxs(Dialog.ScrollableInner, { label: _(msg `Begin the age assurance process by completing the fields below.`), style: [
                    web({
                        maxWidth: 400,
                    }),
                ], children: [_jsx(Inner, {}), _jsx(Dialog.Close, {})] })] }));
}
function Inner() {
    const t = useTheme();
    const { _ } = useLingui();
    const { currentAccount } = useSession();
    const langPrefs = useLanguagePrefs();
    const cleanError = useCleanError();
    const { close } = Dialog.useDialogContext();
    const { lastInitiatedAt } = useAgeAssuranceContext();
    const getTimeAgo = useGetTimeAgo();
    const tlds = useTLDs();
    const createSupportLink = useCreateSupportLink();
    const wasRecentlyInitiated = lastInitiatedAt &&
        new Date(lastInitiatedAt).getTime() > Date.now() - 5 * 60 * 1000; // 5 minutes
    const [success, setSuccess] = useState(false);
    const [email, setEmail] = useState(currentAccount?.email || '');
    const [emailError, setEmailError] = useState('');
    const [languageError, setLanguageError] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [language, setLanguage] = useState(convertToKWSSupportedLanguage(langPrefs.appLanguage));
    const [error, setError] = useState(null);
    const { mutateAsync: init, isPending } = useInitAgeAssurance();
    const runEmailValidation = () => {
        if (validateEmail(email)) {
            setEmailError('');
            setDisabled(false);
            if (tlds && isEmailMaybeInvalid(email, tlds)) {
                setEmailError(_(msg `Please double-check that you have entered your email address correctly.`));
                return { status: 'maybe' };
            }
            return { status: 'valid' };
        }
        setEmailError(_(msg `Please enter a valid email address.`));
        setDisabled(true);
        return { status: 'invalid' };
    };
    const onSubmit = async () => {
        setLanguageError(false);
        logger.metric('ageAssurance:initDialogSubmit', {});
        try {
            const { status } = runEmailValidation();
            if (status === 'invalid')
                return;
            if (!language) {
                setLanguageError(true);
                return;
            }
            await init({
                email,
                language,
            });
            setSuccess(true);
        }
        catch (e) {
            let error = _(msg `Something went wrong, please try again`);
            if (e instanceof XRPCError) {
                if (e.error === 'InvalidEmail') {
                    error = _(msg `Please enter a valid, non-temporary email address. You may need to access this email in the future.`);
                    logger.metric('ageAssurance:initDialogError', { code: 'InvalidEmail' });
                }
                else if (e.error === 'DidTooLong') {
                    error = (_jsx(_Fragment, { children: _jsxs(Trans, { children: ["We're having issues initializing the age assurance process for your account. Please", ' ', _jsx(InlineLinkText, { to: createSupportLink({ code: SupportCode.AA_DID, email }), label: _(msg `Contact support`), children: "contact support" }), ' ', "for assistance."] }) }));
                    logger.metric('ageAssurance:initDialogError', { code: 'DidTooLong' });
                }
                else {
                    logger.metric('ageAssurance:initDialogError', { code: 'other' });
                }
            }
            else {
                const { clean, raw } = cleanError(e);
                error = clean || raw || error;
                logger.metric('ageAssurance:initDialogError', { code: 'other' });
            }
            setError(error);
        }
    };
    return (_jsx(View, { children: _jsxs(View, { style: [a.align_start], children: [_jsx(AgeAssuranceBadge, {}), _jsx(Text, { style: [a.text_xl, a.font_heavy, a.pt_xl, a.pb_md], children: success ? _jsx(Trans, { children: "Success!" }) : _jsx(Trans, { children: "Verify your age" }) }), _jsx(View, { style: [a.pb_xl, a.gap_sm], children: success ? (_jsx(Text, { style: [a.text_sm, a.leading_snug], children: _jsx(Trans, { children: "Please check your email inbox for further instructions. It may take a minute or two to arrive." }) })) : (_jsxs(_Fragment, { children: [_jsx(Text, { style: [a.text_sm, a.leading_snug], children: _jsxs(Trans, { children: ["We have partnered with", ' ', _jsx(InlineLinkText, { overridePresentation: true, disableMismatchWarning: true, label: _(msg `KWS website`), to: urls.kwsHome, style: [a.text_sm, a.leading_snug], children: "KWS" }), ' ', "to verify that you\u2019re an adult. When you click \"Begin\" below, KWS will check if you have previously verified your age using this email address for other games/services powered by KWS technology. If not, KWS will email you instructions for verifying your age. When you\u2019re done, you'll be brought back to continue using Bluesky."] }) }), _jsx(Text, { style: [a.text_sm, a.leading_snug], children: _jsx(Trans, { children: "This should only take a few minutes." }) })] })) }), success ? (_jsx(View, { style: [a.w_full], children: _jsx(Button, { label: _(msg `Close dialog`), size: "large", variant: "solid", color: "secondary", onPress: () => close(), children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Close dialog" }) }) }) })) : (_jsxs(_Fragment, { children: [_jsx(Divider, {}), _jsxs(View, { style: [a.w_full, a.pt_xl, a.gap_lg, a.pb_lg], children: [wasRecentlyInitiated && (_jsx(Admonition, { type: "warning", children: _jsxs(Trans, { children: ["You initiated this flow already,", ' ', getTimeAgo(lastInitiatedAt, new Date(), { format: 'long' }), ' ', "ago. It may take up to 5 minutes for emails to reach your inbox. Please consider waiting a few minutes before trying again."] }) })), _jsxs(View, { children: [_jsx(TextField.LabelText, { children: _jsx(Trans, { children: "Your email" }) }), _jsx(TextField.Root, { isInvalid: !!emailError, children: _jsx(TextField.Input, { label: _(msg `Your email`), placeholder: _(msg `Your email`), value: email, onChangeText: setEmail, onFocus: () => setEmailError(''), onBlur: () => {
                                                    runEmailValidation();
                                                }, returnKeyType: "done", autoCapitalize: "none", autoComplete: "off", autoCorrect: false, onSubmitEditing: onSubmit }) }), emailError ? (_jsx(Admonition, { type: "error", style: [a.mt_sm], children: emailError })) : (_jsx(Admonition, { type: "tip", style: [a.mt_sm], children: _jsx(Trans, { children: "Use your account email address, or another real email address you control, in case KWS or Bluesky needs to contact you." }) }))] }), _jsxs(View, { children: [_jsx(TextField.LabelText, { children: _jsx(Trans, { children: "Your preferred language" }) }), _jsx(LanguageSelect, { value: language, onChange: value => {
                                                setLanguage(value);
                                                setLanguageError(false);
                                            }, items: KWS_SUPPORTED_LANGS }), languageError && (_jsx(Admonition, { type: "error", style: [a.mt_sm], children: _jsx(Trans, { children: "Please select a language" }) }))] }), error && _jsx(Admonition, { type: "error", children: error }), _jsxs(Button, { disabled: disabled, label: _(msg `Begin age assurance process`), size: "large", variant: "solid", color: "primary", onPress: onSubmit, children: [_jsx(ButtonText, { children: _jsx(Trans, { children: "Begin" }) }), _jsx(ButtonIcon, { icon: isPending ? Loader : Shield, position: "right" })] })] }), _jsx(Text, { style: [a.text_xs, a.leading_snug, t.atoms.text_contrast_medium], children: _jsxs(Trans, { children: ["By continuing, you agree to the", ' ', _jsx(InlineLinkText, { overridePresentation: true, disableMismatchWarning: true, label: _(msg `KWS Terms of Use`), to: urls.kwsTermsOfUse, style: [a.text_xs, a.leading_snug], children: "KWS Terms of Use" }), ' ', "and acknowledge that KWS will store your verified status with your hashed email address in accordance with the", ' ', _jsx(InlineLinkText, { overridePresentation: true, disableMismatchWarning: true, label: _(msg `KWS Privacy Policy`), to: urls.kwsPrivacyPolicy, style: [a.text_xs, a.leading_snug], children: "KWS Privacy Policy" }), ". This means you won\u2019t need to verify again the next time you use this email for other apps, games, and services powered by KWS technology."] }) })] }))] }) }));
}
// best-effort mapping of our languages to KWS supported languages
function convertToKWSSupportedLanguage(appLanguage) {
    // `${Enum}` is how you get a type of string union of the enum values (???) -sfn
    switch (appLanguage) {
        // only en is supported
        case 'en-GB':
            return 'en';
        // pt-PT is pt (pt-BR is supported independently)
        case 'pt-PT':
            return 'pt';
        // only chinese (simplified) is supported, map all chinese variants
        case 'zh-Hans-CN':
        case 'zh-Hant-HK':
        case 'zh-Hant-TW':
            return 'zh-Hans';
        default:
            // try and map directly - if undefined, they will have to pick from the dropdown
            return KWS_SUPPORTED_LANGS.find(v => v.value === appLanguage)?.value;
    }
}
//# sourceMappingURL=AgeAssuranceInitDialog.js.map