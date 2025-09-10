import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View } from 'react-native';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { isInvalidHandle, sanitizeHandle } from '#/lib/strings/handles';
import { isIOS, isNative } from '#/platform/detection';
import {} from '#/state/cache/types';
import { atoms as a, useTheme, web } from '#/alf';
import { NewskieDialog } from '#/components/NewskieDialog';
import { Text } from '#/components/Typography';
export function ProfileHeaderHandle({ profile, disableTaps, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const invalidHandle = isInvalidHandle(profile.handle);
    const blockHide = profile.viewer?.blocking || profile.viewer?.blockedBy;
    return (_jsxs(View, { style: [a.flex_row, a.gap_sm, a.align_center, { maxWidth: '100%' }], pointerEvents: disableTaps ? 'none' : isIOS ? 'auto' : 'box-none', children: [_jsx(NewskieDialog, { profile: profile, disabled: disableTaps }), profile.viewer?.followedBy && !blockHide ? (_jsx(View, { style: [t.atoms.bg_contrast_25, a.rounded_xs, a.px_sm, a.py_xs], children: _jsx(Text, { style: [t.atoms.text, a.text_sm], children: _jsx(Trans, { children: "Follows you" }) }) })) : undefined, _jsx(Text, { emoji: true, numberOfLines: 1, style: [
                    invalidHandle
                        ? [
                            a.border,
                            a.text_xs,
                            a.px_sm,
                            a.py_xs,
                            a.rounded_xs,
                            { borderColor: t.palette.contrast_200 },
                        ]
                        : [a.text_md, a.leading_snug, t.atoms.text_contrast_medium],
                    web({
                        wordBreak: 'break-all',
                        direction: 'ltr',
                        unicodeBidi: 'isolate',
                    }),
                ], children: invalidHandle
                    ? _(msg `⚠Invalid Handle`)
                    : sanitizeHandle(profile.handle, '@', 
                    // forceLTR handled by CSS above on web
                    isNative) })] }));
}
//# sourceMappingURL=Handle.js.map