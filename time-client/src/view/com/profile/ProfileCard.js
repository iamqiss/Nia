import { jsx as _jsx } from "react/jsx-runtime";
import { View } from 'react-native';
import {} from '@atproto/api';
import { useModerationOpts } from '#/state/preferences/moderation-opts';
import { atoms as a, useTheme } from '#/alf';
import * as ProfileCard from '#/components/ProfileCard';
export function ProfileCardWithFollowBtn({ profile, noBorder, logContext = 'ProfileCard', }) {
    const t = useTheme();
    const moderationOpts = useModerationOpts();
    if (!moderationOpts)
        return null;
    return (_jsx(View, { style: [
            a.py_md,
            a.px_xl,
            !noBorder && [a.border_t, t.atoms.border_contrast_low],
        ], children: _jsx(ProfileCard.Default, { profile: profile, moderationOpts: moderationOpts, logContext: logContext }) }));
}
//# sourceMappingURL=ProfileCard.js.map