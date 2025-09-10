import { jsx as _jsx } from "react/jsx-runtime";
import { View } from 'react-native';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {} from '#/state/cache/types';
import { useProfileFollowMutationQueue } from '#/state/queries/profile';
import { Button } from '../util/forms/Button';
import * as Toast from '../util/Toast';
export function FollowButton({ unfollowedType = 'inverted', followedType = 'default', profile, labelStyle, logContext, onFollow, }) {
    const [queueFollow, queueUnfollow] = useProfileFollowMutationQueue(profile, logContext);
    const { _ } = useLingui();
    const onPressFollow = async () => {
        try {
            await queueFollow();
            onFollow?.();
        }
        catch (e) {
            if (e?.name !== 'AbortError') {
                Toast.show(_(msg `An issue occurred, please try again.`), 'xmark');
            }
        }
    };
    const onPressUnfollow = async () => {
        try {
            await queueUnfollow();
        }
        catch (e) {
            if (e?.name !== 'AbortError') {
                Toast.show(_(msg `An issue occurred, please try again.`), 'xmark');
            }
        }
    };
    if (!profile.viewer) {
        return _jsx(View, {});
    }
    if (profile.viewer.following) {
        return (_jsx(Button, { type: followedType, labelStyle: labelStyle, onPress: onPressUnfollow, label: _(msg({ message: 'Unfollow', context: 'action' })) }));
    }
    else if (!profile.viewer.followedBy) {
        return (_jsx(Button, { type: unfollowedType, labelStyle: labelStyle, onPress: onPressFollow, label: _(msg({ message: 'Follow', context: 'action' })) }));
    }
    else {
        return (_jsx(Button, { type: unfollowedType, labelStyle: labelStyle, onPress: onPressFollow, label: _(msg({ message: 'Follow back', context: 'action' })) }));
    }
}
//# sourceMappingURL=FollowButton.js.map