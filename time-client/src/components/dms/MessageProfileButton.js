import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useNavigation } from '@react-navigation/native';
import { useRequireEmailVerification } from '#/lib/hooks/useRequireEmailVerification';
import {} from '#/lib/routes/types';
import { logEvent } from '#/lib/statsig/statsig';
import { useGetConvoAvailabilityQuery } from '#/state/queries/messages/get-convo-availability';
import { useGetConvoForMembers } from '#/state/queries/messages/get-convo-for-members';
import * as Toast from '#/view/com/util/Toast';
import { atoms as a, useTheme } from '#/alf';
import { Button, ButtonIcon } from '#/components/Button';
import { canBeMessaged } from '#/components/dms/util';
import { Message_Stroke2_Corner0_Rounded as Message } from '#/components/icons/Message';
export function MessageProfileButton({ profile, }) {
    const { _ } = useLingui();
    const t = useTheme();
    const navigation = useNavigation();
    const requireEmailVerification = useRequireEmailVerification();
    const { data: convoAvailability } = useGetConvoAvailabilityQuery(profile.did);
    const { mutate: initiateConvo } = useGetConvoForMembers({
        onSuccess: ({ convo }) => {
            logEvent('chat:open', { logContext: 'ProfileHeader' });
            navigation.navigate('MessagesConversation', { conversation: convo.id });
        },
        onError: () => {
            Toast.show(_(msg `Failed to create conversation`));
        },
    });
    const onPress = React.useCallback(() => {
        if (!convoAvailability?.canChat) {
            return;
        }
        if (convoAvailability.convo) {
            logEvent('chat:open', { logContext: 'ProfileHeader' });
            navigation.navigate('MessagesConversation', {
                conversation: convoAvailability.convo.id,
            });
        }
        else {
            logEvent('chat:create', { logContext: 'ProfileHeader' });
            initiateConvo([profile.did]);
        }
    }, [navigation, profile.did, initiateConvo, convoAvailability]);
    const wrappedOnPress = requireEmailVerification(onPress, {
        instructions: [
            _jsx(Trans, { children: "Before you can message another user, you must first verify your email." }, "message"),
        ],
    });
    if (!convoAvailability) {
        // show pending state based on declaration
        if (canBeMessaged(profile)) {
            return (_jsx(View, { testID: "dmBtnLoading", "aria-hidden": true, style: [
                    a.justify_center,
                    a.align_center,
                    t.atoms.bg_contrast_25,
                    a.rounded_full,
                    // Matches size of button below to avoid layout shift
                    { width: 33, height: 33 },
                ], children: _jsx(Message, { style: [t.atoms.text, { opacity: 0.3 }], size: "md" }) }));
        }
        else {
            return null;
        }
    }
    if (convoAvailability.canChat) {
        return (_jsx(_Fragment, { children: _jsx(Button, { accessibilityRole: "button", testID: "dmBtn", size: "small", color: "secondary", variant: "solid", shape: "round", label: _(msg `Message ${profile.handle}`), style: [a.justify_center], onPress: wrappedOnPress, children: _jsx(ButtonIcon, { icon: Message, size: "md" }) }) }));
    }
    else {
        return null;
    }
}
//# sourceMappingURL=MessageProfileButton.js.map