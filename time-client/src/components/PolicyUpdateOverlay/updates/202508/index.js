import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback } from 'react';
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { isAndroid } from '#/platform/detection';
import { useA11y } from '#/state/a11y';
import { atoms as a, useTheme } from '#/alf';
import { Button, ButtonText } from '#/components/Button';
import { InlineLinkText, Link } from '#/components/Link';
import { Badge } from '#/components/PolicyUpdateOverlay/Badge';
import { Overlay } from '#/components/PolicyUpdateOverlay/Overlay';
import {} from '#/components/PolicyUpdateOverlay/usePolicyUpdateState';
import { Text } from '#/components/Typography';
export function Content({ state }) {
    const t = useTheme();
    const { _ } = useLingui();
    const { screenReaderEnabled } = useA11y();
    const handleClose = useCallback(() => {
        state.complete();
    }, [state]);
    const linkStyle = [a.text_md];
    const links = {
        terms: {
            overridePresentation: false,
            to: `https://bsky.social/about/support/tos`,
            label: _(msg `Terms of Service`),
        },
        privacy: {
            overridePresentation: false,
            to: `https://bsky.social/about/support/privacy-policy`,
            label: _(msg `Privacy Policy`),
        },
        copyright: {
            overridePresentation: false,
            to: `https://bsky.social/about/support/copyright`,
            label: _(msg `Copyright Policy`),
        },
        guidelines: {
            overridePresentation: false,
            to: `https://bsky.social/about/support/community-guidelines`,
            label: _(msg `Community Guidelines`),
        },
        blog: {
            overridePresentation: false,
            to: `https://bsky.social/about/blog/08-14-2025-updated-terms-and-policies`,
            label: _(msg `Our blog post`),
        },
    };
    const linkButtonStyles = {
        overridePresentation: false,
        color: 'secondary',
        size: 'small',
    };
    const label = isAndroid
        ? _(msg `We’re updating our Terms of Service, Privacy Policy, and Copyright Policy, effective September 15th, 2025. We're also updating our Community Guidelines, and we want your input! These new guidelines will take effect on October 15th, 2025. Learn more about these changes and how to share your thoughts with us by reading our blog post.`)
        : _(msg `We're updating our policies`);
    return (_jsx(Overlay, { label: label, children: _jsxs(View, { style: [a.align_start, a.gap_xl], children: [_jsx(Badge, {}), screenReaderEnabled ? (_jsxs(View, { style: [a.gap_sm], children: [_jsx(Text, { emoji: true, style: [a.text_2xl, a.font_bold, a.leading_snug], children: _jsx(Trans, { children: "Hey there \uD83D\uDC4B" }) }), _jsx(Text, { style: [a.leading_snug, a.text_md], children: _jsx(Trans, { children: "We\u2019re updating our Terms of Service, Privacy Policy, and Copyright Policy, effective September 15th, 2025." }) }), _jsx(Text, { style: [a.leading_snug, a.text_md], children: _jsx(Trans, { children: "We're also updating our Community Guidelines, and we want your input! These new guidelines will take effect on October 15th, 2025." }) }), _jsx(Text, { style: [a.leading_snug, a.text_md], children: _jsx(Trans, { children: "Learn more about these changes and how to share your thoughts with us by reading our blog post." }) }), _jsx(Link, { ...links.terms, ...linkButtonStyles, children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Terms of Service" }) }) }), _jsx(Link, { ...links.privacy, ...linkButtonStyles, children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Privacy Policy" }) }) }), _jsx(Link, { ...links.copyright, ...linkButtonStyles, children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Copyright Policy" }) }) }), _jsx(Link, { ...links.blog, ...linkButtonStyles, children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Read our blog post" }) }) })] })) : (_jsxs(View, { style: [a.gap_sm], children: [_jsx(Text, { emoji: true, style: [a.text_2xl, a.font_bold, a.leading_snug], children: _jsx(Trans, { children: "Hey there \uD83D\uDC4B" }) }), _jsx(Text, { style: [a.leading_snug, a.text_md], children: _jsxs(Trans, { children: ["We\u2019re updating our", ' ', _jsx(InlineLinkText, { ...links.terms, style: linkStyle, children: "Terms of Service" }), ",", ' ', _jsx(InlineLinkText, { ...links.privacy, style: linkStyle, children: "Privacy Policy" }), ", and", ' ', _jsx(InlineLinkText, { ...links.copyright, style: linkStyle, children: "Copyright Policy" }), ", effective September 15th, 2025."] }) }), _jsx(Text, { style: [a.leading_snug, a.text_md], children: _jsxs(Trans, { children: ["We're also updating our", ' ', _jsx(InlineLinkText, { ...links.guidelines, style: linkStyle, children: "Community Guidelines" }), ", and we want your input! These new guidelines will take effect on October 15th, 2025."] }) }), _jsx(Text, { style: [a.leading_snug, a.text_md], children: _jsxs(Trans, { children: ["Learn more about these changes and how to share your thoughts with us by", ' ', _jsx(InlineLinkText, { ...links.blog, style: linkStyle, children: "reading our blog post." })] }) })] })), _jsxs(View, { style: [a.w_full, a.gap_md], children: [_jsx(Button, { label: _(msg `Continue`), accessibilityHint: _(msg `Tap to acknowledge that you understand and agree to these updates and continue using Bluesky`), color: "primary", size: "large", onPress: handleClose, children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Continue" }) }) }), _jsx(Text, { style: [
                                a.leading_snug,
                                a.text_sm,
                                a.italic,
                                t.atoms.text_contrast_medium,
                            ], children: _jsx(Trans, { children: "By clicking \"Continue\" you acknowledge that you understand and agree to these updates." }) })] })] }) }));
}
//# sourceMappingURL=index.js.map