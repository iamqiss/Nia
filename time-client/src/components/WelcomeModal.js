import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { ImageBackground } from 'expo-image';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { FocusGuards, FocusScope } from 'radix-ui/internal';
import { logger } from '#/logger';
import { useLoggedOutViewControls } from '#/state/shell/logged-out';
import { Logo } from '#/view/icons/Logo';
import { atoms as a, flatten, useBreakpoints, web } from '#/alf';
import { Button, ButtonText } from '#/components/Button';
import { TimesLarge_Stroke2_Corner0_Rounded as XIcon } from '#/components/icons/Times';
import { Text } from '#/components/Typography';
const welcomeModalBg = require('../../assets/images/welcome-modal-bg.jpg');
export function WelcomeModal({ control }) {
    const { _ } = useLingui();
    const { requestSwitchToAccount } = useLoggedOutViewControls();
    const { gtMobile } = useBreakpoints();
    const [isExiting, setIsExiting] = useState(false);
    const [signInLinkHovered, setSignInLinkHovered] = useState(false);
    const fadeOutAndClose = (callback) => {
        setIsExiting(true);
        setTimeout(() => {
            control.close();
            if (callback)
                callback();
        }, 150);
    };
    useEffect(() => {
        if (control.isOpen) {
            logger.metric('welcomeModal:presented', {});
        }
    }, [control.isOpen]);
    const onPressCreateAccount = () => {
        logger.metric('welcomeModal:signupClicked', {});
        control.close();
        requestSwitchToAccount({ requestedAccount: 'new' });
    };
    const onPressExplore = () => {
        logger.metric('welcomeModal:exploreClicked', {});
        fadeOutAndClose();
    };
    const onPressSignIn = () => {
        logger.metric('welcomeModal:signinClicked', {});
        control.close();
        requestSwitchToAccount({ requestedAccount: 'existing' });
    };
    FocusGuards.useFocusGuards();
    return (_jsx(View, { role: "dialog", "aria-modal": true, style: [
            a.fixed,
            a.inset_0,
            a.justify_center,
            a.align_center,
            { zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.2)' },
            web({ backdropFilter: 'blur(15px)' }),
            isExiting ? a.fade_out : a.fade_in,
        ], children: _jsx(FocusScope.FocusScope, { asChild: true, loop: true, trapped: true, children: _jsx(View, { style: flatten([
                    {
                        maxWidth: 800,
                        maxHeight: 600,
                        width: '90%',
                        height: '90%',
                        backgroundColor: '#C0DCF0',
                    },
                    a.rounded_lg,
                    a.overflow_hidden,
                    a.zoom_in,
                ]), children: _jsxs(ImageBackground, { source: welcomeModalBg, style: [a.flex_1, a.justify_center], contentFit: "cover", children: [_jsxs(View, { style: [a.gap_2xl, a.align_center, a.p_4xl], children: [_jsx(View, { style: [
                                        a.flex_row,
                                        a.align_center,
                                        a.justify_center,
                                        a.w_full,
                                        a.p_0,
                                    ], children: _jsxs(View, { style: [a.flex_row, a.align_center, a.gap_xs], children: [_jsx(Logo, { width: 26 }), _jsx(Text, { style: [
                                                    a.text_2xl,
                                                    a.font_bold,
                                                    a.user_select_none,
                                                    { color: '#354358', letterSpacing: -0.5 },
                                                ], children: "Bluesky" })] }) }), _jsx(View, { style: [
                                        a.gap_sm,
                                        a.align_center,
                                        a.pt_5xl,
                                        a.pb_3xl,
                                        a.mt_2xl,
                                    ], children: _jsxs(Text, { style: [
                                            gtMobile ? a.text_4xl : a.text_3xl,
                                            a.font_bold,
                                            a.text_center,
                                            { color: '#354358' },
                                            web({
                                                backgroundImage: 'linear-gradient(180deg, #313F54 0%, #667B99 83.65%, rgba(102, 123, 153, 0.50) 100%)',
                                                backgroundClip: 'text',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                color: 'transparent',
                                                lineHeight: 1.2,
                                                letterSpacing: -0.5,
                                            }),
                                        ], children: [_jsx(Trans, { children: "Real people." }), '\n', _jsx(Trans, { children: "Real conversations." }), '\n', _jsx(Trans, { children: "Social media you control." })] }) }), _jsxs(View, { style: [a.gap_md, a.align_center], children: [_jsxs(View, { children: [_jsx(Button, { onPress: onPressCreateAccount, label: _(msg `Create account`), size: "large", color: "primary", style: {
                                                        width: 200,
                                                        backgroundColor: '#006AFF',
                                                    }, children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Create account" }) }) }), _jsx(Button, { onPress: onPressExplore, label: _(msg `Explore the app`), size: "large", color: "primary", variant: "ghost", style: [a.bg_transparent, { width: 200 }], hoverStyle: [a.bg_transparent], children: ({ hovered }) => (_jsx(ButtonText, { style: [hovered && [a.underline], { color: '#006AFF' }], children: _jsx(Trans, { children: "Explore the app" }) })) })] }), _jsx(View, { style: [a.align_center, { minWidth: 200 }], children: _jsxs(Text, { style: [
                                                    a.text_md,
                                                    a.text_center,
                                                    { color: '#405168', lineHeight: 24 },
                                                ], children: [_jsx(Trans, { children: "Already have an account?" }), ' ', _jsx(Pressable, { onPointerEnter: () => setSignInLinkHovered(true), onPointerLeave: () => setSignInLinkHovered(false), accessibilityRole: "button", accessibilityLabel: _(msg `Sign in`), accessibilityHint: "", children: _jsx(Text, { style: [
                                                                a.font_medium,
                                                                {
                                                                    color: '#006AFF',
                                                                    fontSize: undefined,
                                                                },
                                                                signInLinkHovered && a.underline,
                                                            ], onPress: onPressSignIn, children: _jsx(Trans, { children: "Sign in" }) }) })] }) })] })] }), _jsx(Button, { label: _(msg `Close welcome modal`), style: [
                                a.absolute,
                                {
                                    top: 8,
                                    right: 8,
                                },
                                a.bg_transparent,
                            ], hoverStyle: [a.bg_transparent], onPress: () => {
                                logger.metric('welcomeModal:dismissed', {});
                                fadeOutAndClose();
                            }, color: "secondary", size: "small", variant: "ghost", shape: "round", children: ({ hovered, pressed, focused }) => (_jsx(XIcon, { size: "md", style: {
                                    color: '#354358',
                                    opacity: hovered || pressed || focused ? 1 : 0.7,
                                } })) })] }) }) }) }));
}
//# sourceMappingURL=WelcomeModal.js.map