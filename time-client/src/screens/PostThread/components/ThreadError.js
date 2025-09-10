import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useCleanError } from '#/lib/hooks/useCleanError';
import { OUTER_SPACE } from '#/screens/PostThread/const';
import { atoms as a, useTheme } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import { ArrowRotateCounterClockwise_Stroke2_Corner0_Rounded as RetryIcon } from '#/components/icons/ArrowRotateCounterClockwise';
import * as Layout from '#/components/Layout';
import { Text } from '#/components/Typography';
export function ThreadError({ error, onRetry, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const cleanError = useCleanError();
    const { title, message } = useMemo(() => {
        let title = _(msg `Error loading post`);
        let message = _(msg `Something went wrong. Please try again in a moment.`);
        const { raw, clean } = cleanError(error);
        if (error.message.startsWith('Post not found')) {
            title = _(msg `Post not found`);
            message = clean || raw || message;
        }
        return { title, message };
    }, [_, error, cleanError]);
    return (_jsx(Layout.Center, { children: _jsx(View, { style: [
                a.w_full,
                a.align_center,
                {
                    padding: OUTER_SPACE,
                    paddingTop: OUTER_SPACE * 2,
                },
            ], children: _jsxs(View, { style: [
                    a.w_full,
                    a.align_center,
                    a.gap_xl,
                    {
                        maxWidth: 260,
                    },
                ], children: [_jsxs(View, { style: [a.gap_xs], children: [_jsx(Text, { style: [a.text_center, a.text_lg, a.font_bold, a.leading_snug], children: title }), _jsx(Text, { style: [
                                    a.text_center,
                                    a.text_sm,
                                    a.leading_snug,
                                    t.atoms.text_contrast_medium,
                                ], children: message })] }), _jsxs(Button, { label: _(msg `Retry`), size: "small", variant: "solid", color: "secondary_inverted", onPress: onRetry, children: [_jsx(ButtonText, { children: _jsx(Trans, { children: "Retry" }) }), _jsx(ButtonIcon, { icon: RetryIcon, position: "right" })] })] }) }) }));
}
//# sourceMappingURL=ThreadError.js.map