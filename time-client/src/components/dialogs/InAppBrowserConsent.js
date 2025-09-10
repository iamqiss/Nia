import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback } from 'react';
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useOpenLink } from '#/lib/hooks/useOpenLink';
import { isWeb } from '#/platform/detection';
import { useSetInAppBrowser } from '#/state/preferences/in-app-browser';
import { atoms as a, useTheme } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { SquareArrowTopRight_Stroke2_Corner0_Rounded as External } from '#/components/icons/SquareArrowTopRight';
import { Text } from '#/components/Typography';
import { useGlobalDialogsControlContext } from './Context';
export function InAppBrowserConsentDialog() {
    const { inAppBrowserConsentControl } = useGlobalDialogsControlContext();
    if (isWeb)
        return null;
    return (_jsxs(Dialog.Outer, { control: inAppBrowserConsentControl.control, nativeOptions: { preventExpansion: true }, onClose: inAppBrowserConsentControl.clear, children: [_jsx(Dialog.Handle, {}), _jsx(InAppBrowserConsentInner, { href: inAppBrowserConsentControl.value })] }));
}
function InAppBrowserConsentInner({ href }) {
    const control = Dialog.useDialogContext();
    const { _ } = useLingui();
    const t = useTheme();
    const setInAppBrowser = useSetInAppBrowser();
    const openLink = useOpenLink();
    const onUseIAB = useCallback(() => {
        control.close(() => {
            setInAppBrowser(true);
            if (href) {
                openLink(href, true);
            }
        });
    }, [control, setInAppBrowser, href, openLink]);
    const onUseLinking = useCallback(() => {
        control.close(() => {
            setInAppBrowser(false);
            if (href) {
                openLink(href, false);
            }
        });
    }, [control, setInAppBrowser, href, openLink]);
    const onCancel = useCallback(() => {
        control.close();
    }, [control]);
    return (_jsx(Dialog.ScrollableInner, { label: _(msg `How should we open this link?`), children: _jsxs(View, { style: [a.gap_2xl], children: [_jsxs(View, { style: [a.gap_sm], children: [_jsx(Text, { style: [a.font_heavy, a.text_2xl], children: _jsx(Trans, { children: "How should we open this link?" }) }), _jsx(Text, { style: [t.atoms.text_contrast_high, a.leading_snug, a.text_md], children: _jsx(Trans, { children: "Your choice will be remembered for future links. You can change it at any time in settings." }) })] }), _jsxs(View, { style: [a.gap_sm], children: [_jsx(Button, { label: _(msg `Use in-app browser`), onPress: onUseIAB, size: "large", variant: "solid", color: "primary", children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Use in-app browser" }) }) }), _jsxs(Button, { label: _(msg `Use my default browser`), onPress: onUseLinking, size: "large", variant: "solid", color: "secondary", children: [_jsx(ButtonText, { children: _jsx(Trans, { children: "Use my default browser" }) }), _jsx(ButtonIcon, { position: "right", icon: External })] }), _jsx(Button, { label: _(msg `Cancel`), onPress: onCancel, size: "large", variant: "ghost", color: "secondary", children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Cancel" }) }) })] })] }) }));
}
//# sourceMappingURL=InAppBrowserConsent.js.map