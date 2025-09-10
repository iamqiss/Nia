import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback } from 'react';
import { View } from 'react-native';
import {} from '@atproto/api';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useQueryClient } from '@tanstack/react-query';
import { makeProfileLink } from '#/lib/routes/links';
import { unstableCacheProfileView } from '#/state/queries/unstable-profile-cache';
import { atoms as a, useTheme } from '#/alf';
import { Link } from '#/components/Link';
import * as ProfileCard from '#/components/ProfileCard';
export function SearchProfileCard({ profile, moderationOpts, onPress: onPressInner, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const qc = useQueryClient();
    const onPress = useCallback(() => {
        unstableCacheProfileView(qc, profile);
        onPressInner?.();
    }, [qc, profile, onPressInner]);
    return (_jsx(Link, { testID: `searchAutoCompleteResult-${profile.handle}`, to: makeProfileLink(profile), label: _(msg `View ${profile.handle}'s profile`), onPress: onPress, children: ({ hovered, pressed }) => (_jsx(View, { style: [
                a.flex_1,
                a.px_md,
                a.py_sm,
                (hovered || pressed) && t.atoms.bg_contrast_25,
            ], children: _jsx(ProfileCard.Outer, { children: _jsxs(ProfileCard.Header, { children: [_jsx(ProfileCard.Avatar, { profile: profile, moderationOpts: moderationOpts }), _jsx(ProfileCard.NameAndHandle, { profile: profile, moderationOpts: moderationOpts })] }) }) })) }));
}
//# sourceMappingURL=SearchProfileCard.js.map