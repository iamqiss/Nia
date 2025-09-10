import { jsx as _jsx } from "react/jsx-runtime";
import {} from '#/components/icons/common';
import { VerifiedCheck } from '#/components/icons/VerifiedCheck';
import { VerifierCheck } from '#/components/icons/VerifierCheck';
export function VerificationCheck({ verifier, ...rest }) {
    return verifier ? _jsx(VerifierCheck, { ...rest }) : _jsx(VerifiedCheck, { ...rest });
}
//# sourceMappingURL=VerificationCheck.js.map