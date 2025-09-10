import { jsx as _jsx } from "react/jsx-runtime";
import { View } from 'react-native';
import {} from '@atproto/api';
import { sanitizeDisplayName } from '#/lib/strings/display-names';
import { sanitizeHandle } from '#/lib/strings/handles';
import {} from '#/state/cache/types';
import { atoms as a, useBreakpoints, useTheme } from '#/alf';
import { Text } from '#/components/Typography';
export function ProfileHeaderDisplayName({ profile, moderation, }) {
    const t = useTheme();
    const { gtMobile } = useBreakpoints();
    return (_jsx(View, { pointerEvents: "none", children: _jsx(Text, { emoji: true, testID: "profileHeaderDisplayName", style: [
                t.atoms.text,
                gtMobile ? a.text_4xl : a.text_3xl,
                a.self_start,
                a.font_heavy,
            ], children: sanitizeDisplayName(profile.displayName || sanitizeHandle(profile.handle), moderation.ui('displayName')) }) }));
}
//# sourceMappingURL=DisplayName.js.map