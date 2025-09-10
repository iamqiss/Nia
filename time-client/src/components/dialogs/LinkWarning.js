import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useOpenLink } from '#/lib/hooks/useOpenLink';
import { shareUrl } from '#/lib/sharing';
import { isPossiblyAUrl, splitApexDomain } from '#/lib/strings/url-helpers';
import { atoms as a, useBreakpoints, useTheme, web } from '#/alf';
import { Button, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { Text } from '#/components/Typography';
import { useGlobalDialogsControlContext } from './Context';
export function LinkWarningDialog() {
    const { linkWarningDialogControl } = useGlobalDialogsControlContext();
    return (_jsxs(Dialog.Outer, { control: linkWarningDialogControl.control, nativeOptions: { preventExpansion: true }, webOptions: { alignCenter: true }, onClose: linkWarningDialogControl.clear, children: [_jsx(Dialog.Handle, {}), _jsx(InAppBrowserConsentInner, { link: linkWarningDialogControl.value })] }));
}
function InAppBrowserConsentInner({ link, }) {
    const control = Dialog.useDialogContext();
    const { _ } = useLingui();
    const t = useTheme();
    const openLink = useOpenLink();
    const { gtMobile } = useBreakpoints();
    const potentiallyMisleading = useMemo(() => link && isPossiblyAUrl(link.displayText), [link]);
    const onPressVisit = useCallback(() => {
        control.close(() => {
            if (!link)
                return;
            if (link.share) {
                shareUrl(link.href);
            }
            else {
                openLink(link.href, undefined, true);
            }
        });
    }, [control, link, openLink]);
    const onCancel = useCallback(() => {
        control.close();
    }, [control]);
    return (_jsxs(Dialog.ScrollableInner, { style: web({ maxWidth: 450 }), label: potentiallyMisleading
            ? _(msg `Potentially misleading link warning`)
            : _(msg `Leaving Bluesky`), children: [_jsxs(View, { style: [a.gap_2xl], children: [_jsxs(View, { style: [a.gap_sm], children: [_jsx(Text, { style: [a.font_heavy, a.text_2xl], children: potentiallyMisleading ? (_jsx(Trans, { children: "Potentially misleading link" })) : (_jsx(Trans, { children: "Leaving Bluesky" })) }), _jsx(Text, { style: [t.atoms.text_contrast_high, a.text_md, a.leading_snug], children: _jsx(Trans, { children: "This link is taking you to the following website:" }) }), link && _jsx(LinkBox, { href: link.href }), potentiallyMisleading && (_jsx(Text, { style: [t.atoms.text_contrast_high, a.text_md, a.leading_snug], children: _jsx(Trans, { children: "Make sure this is where you intend to go!" }) }))] }), _jsxs(View, { style: [
                            a.flex_1,
                            a.gap_sm,
                            gtMobile && [a.flex_row_reverse, a.justify_start],
                        ], children: [_jsx(Button, { label: link?.share ? _(msg `Share link`) : _(msg `Visit site`), accessibilityHint: _(msg `Opens link ${link?.href ?? ''}`), onPress: onPressVisit, size: "large", variant: "solid", color: potentiallyMisleading ? 'secondary_inverted' : 'primary', children: _jsx(ButtonText, { children: link?.share ? (_jsx(Trans, { children: "Share link" })) : (_jsx(Trans, { children: "Visit site" })) }) }), _jsx(Button, { label: _(msg `Go back`), onPress: onCancel, size: "large", variant: "ghost", color: "secondary", children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Go back" }) }) })] })] }), _jsx(Dialog.Close, {})] }));
}
function LinkBox({ href }) {
    const t = useTheme();
    const [scheme, hostname, rest] = useMemo(() => {
        try {
            const urlp = new URL(href);
            const [subdomain, apexdomain] = splitApexDomain(urlp.hostname);
            return [
                urlp.protocol + '//' + subdomain,
                apexdomain,
                urlp.pathname.replace(/\/$/, '') + urlp.search + urlp.hash,
            ];
        }
        catch {
            return ['', href, ''];
        }
    }, [href]);
    return (_jsx(View, { style: [
            t.atoms.bg,
            t.atoms.border_contrast_medium,
            a.px_md,
            { paddingVertical: 10 },
            a.rounded_sm,
            a.border,
        ], children: _jsxs(Text, { style: [a.text_md, a.leading_snug, t.atoms.text_contrast_medium], children: [scheme, _jsx(Text, { style: [a.text_md, a.leading_snug, t.atoms.text, a.font_bold], children: hostname }), rest] }) }));
}
//# sourceMappingURL=LinkWarning.js.map