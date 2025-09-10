import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import {} from 'react';
import { View } from 'react-native';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { webLinks } from '#/lib/constants';
import { useGate } from '#/lib/statsig/statsig';
import { atoms as a, useTheme } from '#/alf';
import { Admonition } from '#/components/Admonition';
import { InlineLinkText } from '#/components/Link';
import { Text } from '#/components/Typography';
function CommunityGuidelinesNotice({}) {
    const { _ } = useLingui();
    const gate = useGate();
    if (gate('disable_onboarding_policy_update_notice'))
        return null;
    return (_jsx(View, { style: [a.pt_xs], children: _jsx(Admonition, { type: "tip", children: _jsxs(Trans, { children: ["You also agree to", ' ', _jsx(InlineLinkText, { label: _(msg `Bluesky's Community Guidelines`), to: webLinks.communityDeprecated, children: "Bluesky\u2019s Community Guidelines" }), ". An", ' ', _jsx(InlineLinkText, { label: _(msg `Bluesky's Updated Community Guidelines`), to: webLinks.community, children: "updated version of our Community Guidelines" }), ' ', "will take effect on October 15th."] }) }) }));
}
export const Policies = ({ serviceDescription, needsGuardian, under13, }) => {
    const t = useTheme();
    const { _ } = useLingui();
    if (!serviceDescription) {
        return _jsx(View, {});
    }
    const tos = validWebLink(serviceDescription.links?.termsOfService);
    const pp = validWebLink(serviceDescription.links?.privacyPolicy);
    if (!tos && !pp) {
        return (_jsxs(View, { style: [a.gap_sm], children: [_jsx(Admonition, { type: "info", children: _jsx(Trans, { children: "This service has not provided terms of service or a privacy policy." }) }), _jsx(CommunityGuidelinesNotice, {})] }));
    }
    let els;
    if (tos && pp) {
        els = (_jsxs(Trans, { children: ["By creating an account you agree to the", ' ', _jsx(InlineLinkText, { label: _(msg `Read the Bluesky Terms of Service`), to: tos, children: "Terms of Service" }, "tos"), ' ', "and", ' ', _jsx(InlineLinkText, { label: _(msg `Read the Bluesky Privacy Policy`), to: pp, children: "Privacy Policy" }, "pp"), "."] }));
    }
    else if (tos) {
        els = (_jsxs(Trans, { children: ["By creating an account you agree to the", ' ', _jsx(InlineLinkText, { label: _(msg `Read the Bluesky Terms of Service`), to: tos, children: "Terms of Service" }, "tos"), "."] }));
    }
    else if (pp) {
        els = (_jsxs(Trans, { children: ["By creating an account you agree to the", ' ', _jsx(InlineLinkText, { label: _(msg `Read the Bluesky Privacy Policy`), to: pp, children: "Privacy Policy" }, "pp"), "."] }));
    }
    else {
        return null;
    }
    return (_jsxs(View, { style: [a.gap_sm], children: [els ? (_jsx(Text, { style: [a.leading_snug, t.atoms.text_contrast_medium], children: els })) : null, under13 ? (_jsx(Admonition, { type: "error", children: _jsx(Trans, { children: "You must be 13 years of age or older to create an account." }) })) : needsGuardian ? (_jsx(Admonition, { type: "warning", children: _jsx(Trans, { children: "If you are not yet an adult according to the laws of your country, your parent or legal guardian must read these Terms on your behalf." }) })) : undefined, _jsx(CommunityGuidelinesNotice, {})] }));
};
function validWebLink(url) {
    return url && (url.startsWith('http://') || url.startsWith('https://'))
        ? url
        : undefined;
}
//# sourceMappingURL=Policies.js.map