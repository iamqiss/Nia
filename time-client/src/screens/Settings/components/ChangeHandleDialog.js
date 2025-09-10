import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useMemo, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LayoutAnimationConfig, LinearTransition, SlideInLeft, SlideInRight, SlideOutLeft, SlideOutRight, } from 'react-native-reanimated';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HITSLOP_10, urls } from '#/lib/constants';
import { cleanError } from '#/lib/strings/errors';
import { createFullHandle, validateServiceHandle } from '#/lib/strings/handles';
import { sanitizeHandle } from '#/lib/strings/handles';
import { useFetchDid, useUpdateHandleMutation } from '#/state/queries/handle';
import { RQKEY as RQKEY_PROFILE } from '#/state/queries/profile';
import { useServiceQuery } from '#/state/queries/service';
import { useCurrentAccountProfile } from '#/state/queries/useCurrentAccountProfile';
import { useAgent, useSession } from '#/state/session';
import { ErrorScreen } from '#/view/com/util/error/ErrorScreen';
import { atoms as a, native, useBreakpoints, useTheme } from '#/alf';
import { Admonition } from '#/components/Admonition';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import * as TextField from '#/components/forms/TextField';
import * as ToggleButton from '#/components/forms/ToggleButton';
import { ArrowLeft_Stroke2_Corner0_Rounded as ArrowLeftIcon, ArrowRight_Stroke2_Corner0_Rounded as ArrowRightIcon, } from '#/components/icons/Arrow';
import { At_Stroke2_Corner0_Rounded as AtIcon } from '#/components/icons/At';
import { CheckThick_Stroke2_Corner0_Rounded as CheckIcon } from '#/components/icons/Check';
import { SquareBehindSquare4_Stroke2_Corner0_Rounded as CopyIcon } from '#/components/icons/SquareBehindSquare4';
import { InlineLinkText } from '#/components/Link';
import { Loader } from '#/components/Loader';
import { Text } from '#/components/Typography';
import { useSimpleVerificationState } from '#/components/verification';
import { CopyButton } from './CopyButton';
export function ChangeHandleDialog({ control, }) {
    const { height } = useWindowDimensions();
    return (_jsx(Dialog.Outer, { control: control, nativeOptions: { minHeight: height }, children: _jsx(ChangeHandleDialogInner, {}) }));
}
function ChangeHandleDialogInner() {
    const control = Dialog.useDialogContext();
    const { _ } = useLingui();
    const agent = useAgent();
    const { data: serviceInfo, error: serviceInfoError, refetch, } = useServiceQuery(agent.serviceUrl.toString());
    const [page, setPage] = useState('provided-handle');
    const cancelButton = useCallback(() => (_jsx(Button, { label: _(msg `Cancel`), onPress: () => control.close(), size: "small", color: "primary", variant: "ghost", style: [a.rounded_full], children: _jsx(ButtonText, { style: [a.text_md], children: _jsx(Trans, { children: "Cancel" }) }) })), [control, _]);
    return (_jsx(Dialog.ScrollableInner, { label: _(msg `Change Handle`), header: _jsx(Dialog.Header, { renderLeft: cancelButton, children: _jsx(Dialog.HeaderText, { children: _jsx(Trans, { children: "Change Handle" }) }) }), contentContainerStyle: [a.pt_0, a.px_0], children: _jsx(View, { style: [a.flex_1, a.pt_lg, a.px_xl], children: serviceInfoError ? (_jsx(ErrorScreen, { title: _(msg `Oops!`), message: _(msg `There was an issue fetching your service info`), details: cleanError(serviceInfoError), onPressTryAgain: refetch })) : serviceInfo ? (_jsx(LayoutAnimationConfig, { skipEntering: true, skipExiting: true, children: page === 'provided-handle' ? (_jsx(Animated.View, { entering: native(SlideInLeft), exiting: native(SlideOutLeft), children: _jsx(ProvidedHandlePage, { serviceInfo: serviceInfo, goToOwnHandle: () => setPage('own-handle') }) }, page)) : (_jsx(Animated.View, { entering: native(SlideInRight), exiting: native(SlideOutRight), children: _jsx(OwnHandlePage, { goToServiceHandle: () => setPage('provided-handle') }) }, page)) })) : (_jsx(View, { style: [a.flex_1, a.justify_center, a.align_center, a.py_4xl], children: _jsx(Loader, { size: "xl" }) })) }) }));
}
function ProvidedHandlePage({ serviceInfo, goToOwnHandle, }) {
    const { _ } = useLingui();
    const [subdomain, setSubdomain] = useState('');
    const agent = useAgent();
    const control = Dialog.useDialogContext();
    const { currentAccount } = useSession();
    const queryClient = useQueryClient();
    const profile = useCurrentAccountProfile();
    const verification = useSimpleVerificationState({
        profile,
    });
    const { mutate: changeHandle, isPending, error, isSuccess, } = useUpdateHandleMutation({
        onSuccess: () => {
            if (currentAccount) {
                queryClient.invalidateQueries({
                    queryKey: RQKEY_PROFILE(currentAccount.did),
                });
            }
            agent.resumeSession(agent.session).then(() => control.close());
        },
    });
    const host = serviceInfo.availableUserDomains[0];
    const validation = useMemo(() => validateServiceHandle(subdomain, host), [subdomain, host]);
    const isInvalid = !validation.handleChars ||
        !validation.hyphenStartOrEnd ||
        !validation.totalLength;
    return (_jsx(LayoutAnimationConfig, { skipEntering: true, children: _jsxs(View, { style: [a.flex_1, a.gap_md], children: [isSuccess && (_jsx(Animated.View, { entering: FadeIn, exiting: FadeOut, children: _jsx(SuccessMessage, { text: _(msg `Handle changed!`) }) })), error && (_jsx(Animated.View, { entering: FadeIn, exiting: FadeOut, children: _jsx(ChangeHandleError, { error: error }) })), _jsxs(Animated.View, { layout: native(LinearTransition), style: [a.flex_1, a.gap_md], children: [verification.isVerified && verification.role === 'default' && (_jsx(Admonition, { type: "error", children: _jsxs(Trans, { children: ["You are verified. You will lose your verification status if you change your handle.", ' ', _jsx(InlineLinkText, { label: _(msg({
                                            message: `Learn more`,
                                            context: `english-only-resource`,
                                        })), to: urls.website.blog.initialVerificationAnnouncement, children: _jsx(Trans, { context: "english-only-resource", children: "Learn more." }) })] }) })), _jsxs(View, { children: [_jsx(TextField.LabelText, { children: _jsx(Trans, { children: "New handle" }) }), _jsxs(TextField.Root, { isInvalid: isInvalid, children: [_jsx(TextField.Icon, { icon: AtIcon }), _jsx(Dialog.Input, { editable: !isPending, defaultValue: subdomain, onChangeText: text => setSubdomain(text), label: _(msg `New handle`), placeholder: _(msg `e.g. alice`), autoCapitalize: "none", autoCorrect: false }), _jsx(TextField.SuffixText, { label: host, style: [{ maxWidth: '40%' }], children: host })] })] }), _jsx(Text, { children: _jsxs(Trans, { children: ["Your full handle will be", ' ', _jsxs(Text, { style: [a.font_bold], children: ["@", createFullHandle(subdomain, host)] })] }) }), _jsx(Button, { label: _(msg `Save new handle`), variant: "solid", size: "large", color: validation.overall ? 'primary' : 'secondary', disabled: !validation.overall, onPress: () => {
                                if (validation.overall) {
                                    changeHandle({ handle: createFullHandle(subdomain, host) });
                                }
                            }, children: isPending ? (_jsx(ButtonIcon, { icon: Loader })) : (_jsx(ButtonText, { children: _jsx(Trans, { children: "Save" }) })) }), _jsx(Text, { style: [a.leading_snug], children: _jsxs(Trans, { children: ["If you have your own domain, you can use that as your handle. This lets you self-verify your identity.", ' ', _jsx(InlineLinkText, { label: _(msg({
                                            message: `Learn more`,
                                            context: `english-only-resource`,
                                        })), to: "https://bsky.social/about/blog/4-28-2023-domain-handle-tutorial", style: [a.font_bold], disableMismatchWarning: true, children: "Learn more here." })] }) }), _jsxs(Button, { label: _(msg `I have my own domain`), variant: "outline", color: "primary", size: "large", onPress: goToOwnHandle, children: [_jsx(ButtonText, { children: _jsx(Trans, { children: "I have my own domain" }) }), _jsx(ButtonIcon, { icon: ArrowRightIcon, position: "right" })] })] })] }) }));
}
function OwnHandlePage({ goToServiceHandle }) {
    const { _ } = useLingui();
    const t = useTheme();
    const { currentAccount } = useSession();
    const [dnsPanel, setDNSPanel] = useState(true);
    const [domain, setDomain] = useState('');
    const agent = useAgent();
    const control = Dialog.useDialogContext();
    const fetchDid = useFetchDid();
    const queryClient = useQueryClient();
    const { mutate: changeHandle, isPending, error, isSuccess, } = useUpdateHandleMutation({
        onSuccess: () => {
            if (currentAccount) {
                queryClient.invalidateQueries({
                    queryKey: RQKEY_PROFILE(currentAccount.did),
                });
            }
            agent.resumeSession(agent.session).then(() => control.close());
        },
    });
    const { mutate: verify, isPending: isVerifyPending, isSuccess: isVerified, error: verifyError, reset: resetVerification, } = useMutation({
        mutationKey: ['verify-handle', domain],
        mutationFn: async () => {
            const did = await fetchDid(domain);
            if (did !== currentAccount?.did) {
                throw new DidMismatchError(did);
            }
            return true;
        },
    });
    return (_jsxs(View, { style: [a.flex_1, a.gap_lg], children: [isSuccess && (_jsx(Animated.View, { entering: FadeIn, exiting: FadeOut, children: _jsx(SuccessMessage, { text: _(msg `Handle changed!`) }) })), error && (_jsx(Animated.View, { entering: FadeIn, exiting: FadeOut, children: _jsx(ChangeHandleError, { error: error }) })), verifyError && (_jsx(Animated.View, { entering: FadeIn, exiting: FadeOut, children: _jsx(Admonition, { type: "error", children: verifyError instanceof DidMismatchError ? (_jsxs(Trans, { children: ["Wrong DID returned from server. Received: ", verifyError.did] })) : (_jsx(Trans, { children: "Failed to verify handle. Please try again." })) }) })), _jsxs(Animated.View, { layout: native(LinearTransition), style: [a.flex_1, a.gap_md, a.overflow_hidden], children: [_jsxs(View, { children: [_jsx(TextField.LabelText, { children: _jsx(Trans, { children: "Enter the domain you want to use" }) }), _jsxs(TextField.Root, { children: [_jsx(TextField.Icon, { icon: AtIcon }), _jsx(Dialog.Input, { label: _(msg `New handle`), placeholder: _(msg `e.g. alice.com`), editable: !isPending, defaultValue: domain, onChangeText: text => {
                                            setDomain(text);
                                            resetVerification();
                                        }, autoCapitalize: "none", autoCorrect: false })] })] }), _jsxs(ToggleButton.Group, { label: _(msg `Choose domain verification method`), values: [dnsPanel ? 'dns' : 'file'], onChange: values => setDNSPanel(values[0] === 'dns'), children: [_jsx(ToggleButton.Button, { name: "dns", label: _(msg `DNS Panel`), children: _jsx(ToggleButton.ButtonText, { children: _jsx(Trans, { children: "DNS Panel" }) }) }), _jsx(ToggleButton.Button, { name: "file", label: _(msg `No DNS Panel`), children: _jsx(ToggleButton.ButtonText, { children: _jsx(Trans, { children: "No DNS Panel" }) }) })] }), dnsPanel ? (_jsxs(_Fragment, { children: [_jsx(Text, { children: _jsx(Trans, { children: "Add the following DNS record to your domain:" }) }), _jsxs(View, { style: [
                                    t.atoms.bg_contrast_25,
                                    a.rounded_sm,
                                    a.p_md,
                                    a.border,
                                    t.atoms.border_contrast_low,
                                ], children: [_jsx(Text, { style: [t.atoms.text_contrast_medium], children: _jsx(Trans, { children: "Host:" }) }), _jsx(View, { style: [a.py_xs], children: _jsxs(CopyButton, { variant: "solid", color: "secondary", value: "_atproto", label: _(msg `Copy host`), hoverStyle: [a.bg_transparent], hitSlop: HITSLOP_10, children: [_jsx(Text, { style: [a.text_md, a.flex_1], children: "_atproto" }), _jsx(ButtonIcon, { icon: CopyIcon })] }) }), _jsx(Text, { style: [a.mt_xs, t.atoms.text_contrast_medium], children: _jsx(Trans, { children: "Type:" }) }), _jsx(View, { style: [a.py_xs], children: _jsx(Text, { style: [a.text_md], children: "TXT" }) }), _jsx(Text, { style: [a.mt_xs, t.atoms.text_contrast_medium], children: _jsx(Trans, { children: "Value:" }) }), _jsx(View, { style: [a.py_xs], children: _jsxs(CopyButton, { variant: "solid", color: "secondary", value: 'did=' + currentAccount?.did, label: _(msg `Copy TXT record value`), hoverStyle: [a.bg_transparent], hitSlop: HITSLOP_10, children: [_jsxs(Text, { style: [a.text_md, a.flex_1], children: ["did=", currentAccount?.did] }), _jsx(ButtonIcon, { icon: CopyIcon })] }) })] }), _jsx(Text, { children: _jsx(Trans, { children: "This should create a domain record at:" }) }), _jsx(View, { style: [
                                    t.atoms.bg_contrast_25,
                                    a.rounded_sm,
                                    a.p_md,
                                    a.border,
                                    t.atoms.border_contrast_low,
                                ], children: _jsxs(Text, { style: [a.text_md], children: ["_atproto.", domain] }) })] })) : (_jsxs(_Fragment, { children: [_jsx(Text, { children: _jsx(Trans, { children: "Upload a text file to:" }) }), _jsx(View, { style: [
                                    t.atoms.bg_contrast_25,
                                    a.rounded_sm,
                                    a.p_md,
                                    a.border,
                                    t.atoms.border_contrast_low,
                                ], children: _jsxs(Text, { style: [a.text_md], children: ["https://", domain, "/.well-known/atproto-did"] }) }), _jsx(Text, { children: _jsx(Trans, { children: "That contains the following:" }) }), _jsxs(CopyButton, { value: currentAccount?.did ?? '', label: _(msg `Copy DID`), size: "large", variant: "solid", color: "secondary", style: [a.px_md, a.border, t.atoms.border_contrast_low], children: [_jsx(Text, { style: [a.text_md, a.flex_1], children: currentAccount?.did }), _jsx(ButtonIcon, { icon: CopyIcon })] })] }))] }), isVerified && (_jsx(Animated.View, { entering: FadeIn, exiting: FadeOut, layout: native(LinearTransition), children: _jsx(SuccessMessage, { text: _(msg `Domain verified!`) }) })), _jsxs(Animated.View, { layout: native(LinearTransition), children: [currentAccount?.handle?.endsWith('.bsky.social') && (_jsx(Admonition, { type: "info", style: [a.mb_md], children: _jsxs(Trans, { children: ["Your current handle", ' ', _jsx(Text, { style: [a.font_bold], children: sanitizeHandle(currentAccount?.handle || '', '@') }), ' ', "will automatically remain reserved for you. You can switch back to it at any time from this account."] }) })), _jsx(Button, { label: isVerified
                            ? _(msg `Update to ${domain}`)
                            : dnsPanel
                                ? _(msg `Verify DNS Record`)
                                : _(msg `Verify Text File`), variant: "solid", size: "large", color: "primary", disabled: domain.trim().length === 0, onPress: () => {
                            if (isVerified) {
                                changeHandle({ handle: domain });
                            }
                            else {
                                verify();
                            }
                        }, children: isPending || isVerifyPending ? (_jsx(ButtonIcon, { icon: Loader })) : (_jsx(ButtonText, { children: isVerified ? (_jsxs(Trans, { children: ["Update to ", domain] })) : dnsPanel ? (_jsx(Trans, { children: "Verify DNS Record" })) : (_jsx(Trans, { children: "Verify Text File" })) })) }), _jsxs(Button, { label: _(msg `Use default provider`), accessibilityHint: _(msg `Returns to previous page`), onPress: goToServiceHandle, variant: "outline", color: "secondary", size: "large", style: [a.mt_sm], children: [_jsx(ButtonIcon, { icon: ArrowLeftIcon, position: "left" }), _jsx(ButtonText, { children: _jsx(Trans, { children: "Nevermind, create a handle for me" }) })] })] })] }));
}
class DidMismatchError extends Error {
    did;
    constructor(did) {
        super('DID mismatch');
        this.name = 'DidMismatchError';
        this.did = did;
    }
}
function ChangeHandleError({ error }) {
    const { _ } = useLingui();
    let message = _(msg `Failed to change handle. Please try again.`);
    if (error instanceof Error) {
        if (error.message.startsWith('Handle already taken')) {
            message = _(msg `Handle already taken. Please try a different one.`);
        }
        else if (error.message === 'Reserved handle') {
            message = _(msg `This handle is reserved. Please try a different one.`);
        }
        else if (error.message === 'Handle too long') {
            message = _(msg `Handle too long. Please try a shorter one.`);
        }
        else if (error.message === 'Input/handle must be a valid handle') {
            message = _(msg `Invalid handle. Please try a different one.`);
        }
        else if (error.message === 'Rate Limit Exceeded') {
            message = _(msg `Rate limit exceeded – you've tried to change your handle too many times in a short period. Please wait a minute before trying again.`);
        }
    }
    return _jsx(Admonition, { type: "error", children: message });
}
function SuccessMessage({ text }) {
    const { gtMobile } = useBreakpoints();
    const t = useTheme();
    return (_jsxs(View, { style: [
            a.flex_1,
            a.gap_md,
            a.flex_row,
            a.justify_center,
            a.align_center,
            gtMobile ? a.px_md : a.px_sm,
            a.py_xs,
            t.atoms.border_contrast_low,
        ], children: [_jsx(View, { style: [
                    { height: 20, width: 20 },
                    a.rounded_full,
                    a.align_center,
                    a.justify_center,
                    { backgroundColor: t.palette.positive_600 },
                ], children: _jsx(CheckIcon, { fill: t.palette.white, size: "xs" }) }), _jsx(Text, { style: [a.text_md], children: text })] }));
}
//# sourceMappingURL=ChangeHandleDialog.js.map