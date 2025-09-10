import { jsx as _jsx } from "react/jsx-runtime";
import { View } from 'react-native';
import { moderateProfile } from '@atproto/api';
import { logger } from '#/logger';
import { useModerationOpts } from '#/state/preferences/moderation-opts';
import { useProfilesQuery } from '#/state/queries/profile';
import { UserAvatar } from '#/view/com/util/UserAvatar';
import { atoms as a, useTheme } from '#/alf';
export function AvatarStack({ profiles, size = 26, numPending, backgroundColor, }) {
    const translation = size / 3; // overlap by 1/3
    const t = useTheme();
    const moderationOpts = useModerationOpts();
    const isPending = (numPending && profiles.length === 0) || !moderationOpts;
    const items = isPending
        ? Array.from({ length: numPending ?? profiles.length }).map((_, i) => ({
            key: i,
            profile: null,
            moderation: null,
        }))
        : profiles.map(item => ({
            key: item.did,
            profile: item,
            moderation: moderateProfile(item, moderationOpts),
        }));
    return (_jsx(View, { style: [
            a.flex_row,
            a.align_center,
            a.relative,
            { width: size + (items.length - 1) * (size - translation) },
        ], children: items.map((item, i) => (_jsx(View, { style: [
                t.atoms.bg_contrast_25,
                a.relative,
                {
                    width: size,
                    height: size,
                    left: i * -translation,
                    borderWidth: 1,
                    borderColor: backgroundColor ?? t.atoms.bg.backgroundColor,
                    borderRadius: 999,
                    zIndex: 3 - i,
                },
            ], children: item.profile && (_jsx(UserAvatar, { size: size - 2, avatar: item.profile.avatar, type: item.profile.associated?.labeler ? 'labeler' : 'user', moderation: item.moderation.ui('avatar') })) }, item.key))) }));
}
export function AvatarStackWithFetch({ profiles, size, backgroundColor, }) {
    const { data, error } = useProfilesQuery({ handles: profiles });
    if (error) {
        if (error.name !== 'AbortError') {
            logger.error('Error fetching profiles for AvatarStack', {
                safeMessage: error,
            });
        }
        return null;
    }
    return (_jsx(AvatarStack, { numPending: profiles.length, profiles: data?.profiles || [], size: size, backgroundColor: backgroundColor }));
}
//# sourceMappingURL=AvatarStack.js.map