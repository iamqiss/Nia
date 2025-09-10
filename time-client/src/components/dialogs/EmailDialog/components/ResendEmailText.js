import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { wait } from '#/lib/async/wait';
import { atoms as a, useTheme } from '#/alf';
import { CheckThick_Stroke2_Corner0_Rounded as Check } from '#/components/icons/Check';
import { createStaticClick, InlineLinkText } from '#/components/Link';
import { Loader } from '#/components/Loader';
import { Span, Text } from '#/components/Typography';
export function ResendEmailText({ onPress, style, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const [status, setStatus] = useState(null);
    const handleOnPress = async () => {
        setStatus('sending');
        try {
            await wait(1000, onPress());
            setStatus('success');
        }
        finally {
            setTimeout(() => {
                setStatus(null);
            }, 1000);
        }
    };
    return (_jsxs(Text, { style: [a.italic, a.leading_snug, t.atoms.text_contrast_medium, style], children: [_jsxs(Trans, { children: ["Don't see an email?", ' ', _jsx(InlineLinkText, { label: _(msg `Resend`), ...createStaticClick(() => {
                            handleOnPress();
                        }), children: "Click here to resend." })] }), ' ', _jsx(Span, { style: { top: 1 }, children: status === 'sending' ? (_jsx(Loader, { size: "xs" })) : status === 'success' ? (_jsx(Check, { size: "xs", fill: t.palette.positive_500 })) : null })] }));
}
//# sourceMappingURL=ResendEmailText.js.map