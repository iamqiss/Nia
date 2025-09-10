import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View } from 'react-native';
import { atoms as a } from '#/alf';
import { Admonition } from '#/components/Admonition';
import { InlineLinkText } from '#/components/Link';
import { H1 } from '#/components/Typography';
export function Admonitions() {
    return (_jsxs(View, { style: [a.gap_md], children: [_jsx(H1, { children: "Admonitions" }), _jsx(Admonition, { children: "The quick brown fox jumps over the lazy dog." }), _jsxs(Admonition, { type: "info", children: ["How happy the blameless vestal's lot, the world forgetting by the world forgot.", ' ', _jsx(InlineLinkText, { label: "test", to: "https://letterboxd.com/film/eternal-sunshine-of-the-spotless-mind/", children: "Eternal sunshine of the spotless mind" }), "! Each pray'r accepted, and each wish resign'd."] }), _jsx(Admonition, { type: "tip", children: "The quick brown fox jumps over the lazy dog." }), _jsx(Admonition, { type: "warning", children: "The quick brown fox jumps over the lazy dog." }), _jsx(Admonition, { type: "error", children: "The quick brown fox jumps over the lazy dog." })] }));
}
//# sourceMappingURL=Admonitions.js.map