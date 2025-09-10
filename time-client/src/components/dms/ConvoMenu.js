import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useCallback } from 'react';
import { Keyboard, View } from 'react-native';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useNavigation } from '@react-navigation/native';
import {} from '#/lib/routes/types';
import {} from '#/state/cache/types';
import { useConvoQuery, useMarkAsReadMutation, } from '#/state/queries/messages/conversation';
import { useMuteConvo } from '#/state/queries/messages/mute-conversation';
import { useProfileBlockMutationQueue } from '#/state/queries/profile';
import * as Toast from '#/view/com/util/Toast';
import {} from '#/alf';
import { atoms as a } from '#/alf';
import { Button, ButtonIcon } from '#/components/Button';
import { BlockedByListDialog } from '#/components/dms/BlockedByListDialog';
import { LeaveConvoPrompt } from '#/components/dms/LeaveConvoPrompt';
import { ReportConversationPrompt } from '#/components/dms/ReportConversationPrompt';
import { ReportDialog } from '#/components/dms/ReportDialog';
import { ArrowBoxLeft_Stroke2_Corner0_Rounded as ArrowBoxLeft } from '#/components/icons/ArrowBoxLeft';
import { Bubble_Stroke2_Corner2_Rounded as Bubble } from '#/components/icons/Bubble';
import { DotGrid_Stroke2_Corner0_Rounded as DotsHorizontal } from '#/components/icons/DotGrid';
import { Flag_Stroke2_Corner0_Rounded as Flag } from '#/components/icons/Flag';
import { Mute_Stroke2_Corner0_Rounded as Mute } from '#/components/icons/Mute';
import { Person_Stroke2_Corner0_Rounded as Person, PersonCheck_Stroke2_Corner0_Rounded as PersonCheck, PersonX_Stroke2_Corner0_Rounded as PersonX, } from '#/components/icons/Person';
import { SpeakerVolumeFull_Stroke2_Corner0_Rounded as Unmute } from '#/components/icons/Speaker';
import * as Menu from '#/components/Menu';
import * as Prompt from '#/components/Prompt';
let ConvoMenu = ({ convo, profile, control, currentScreen, showMarkAsRead, hideTrigger, blockInfo, latestReportableMessage, style, }) => {
    const { _ } = useLingui();
    const leaveConvoControl = Prompt.usePromptControl();
    const reportControl = Prompt.usePromptControl();
    const blockedByListControl = Prompt.usePromptControl();
    const { listBlocks } = blockInfo;
    return (_jsxs(_Fragment, { children: [_jsxs(Menu.Root, { control: control, children: [!hideTrigger && (_jsx(View, { style: [style], children: _jsx(Menu.Trigger, { label: _(msg `Chat settings`), children: ({ props }) => (_jsx(Button, { label: props.accessibilityLabel, ...props, onPress: () => {
                                    Keyboard.dismiss();
                                    props.onPress();
                                }, size: "small", color: "secondary", shape: "round", variant: "ghost", style: [a.bg_transparent], children: _jsx(ButtonIcon, { icon: DotsHorizontal, size: "md" }) })) }) })), _jsx(Menu.Outer, { children: _jsx(MenuContent, { profile: profile, showMarkAsRead: showMarkAsRead, blockInfo: blockInfo, convo: convo, leaveConvoControl: leaveConvoControl, reportControl: reportControl, blockedByListControl: blockedByListControl }) })] }), _jsx(LeaveConvoPrompt, { control: leaveConvoControl, convoId: convo.id, currentScreen: currentScreen }), latestReportableMessage ? (_jsx(ReportDialog, { currentScreen: currentScreen, params: {
                    type: 'convoMessage',
                    convoId: convo.id,
                    message: latestReportableMessage,
                }, control: reportControl })) : (_jsx(ReportConversationPrompt, { control: reportControl })), _jsx(BlockedByListDialog, { control: blockedByListControl, listBlocks: listBlocks })] }));
};
ConvoMenu = React.memo(ConvoMenu);
function MenuContent({ convo: initialConvo, profile, showMarkAsRead, blockInfo, leaveConvoControl, reportControl, blockedByListControl, }) {
    const navigation = useNavigation();
    const { _ } = useLingui();
    const { mutate: markAsRead } = useMarkAsReadMutation();
    const { listBlocks, userBlock } = blockInfo;
    const isBlocking = userBlock || !!listBlocks.length;
    const isDeletedAccount = profile.handle === 'missing.invalid';
    const convoId = initialConvo.id;
    const { data: convo } = useConvoQuery(initialConvo);
    const onNavigateToProfile = useCallback(() => {
        navigation.navigate('Profile', { name: profile.did });
    }, [navigation, profile.did]);
    const { mutate: muteConvo } = useMuteConvo(convoId, {
        onSuccess: data => {
            if (data.convo.muted) {
                Toast.show(_(msg({ message: 'Chat muted', context: 'toast' })));
            }
            else {
                Toast.show(_(msg({ message: 'Chat unmuted', context: 'toast' })));
            }
        },
        onError: () => {
            Toast.show(_(msg `Could not mute chat`), 'xmark');
        },
    });
    const [queueBlock, queueUnblock] = useProfileBlockMutationQueue(profile);
    const toggleBlock = React.useCallback(() => {
        if (listBlocks.length) {
            blockedByListControl.open();
            return;
        }
        if (userBlock) {
            queueUnblock();
        }
        else {
            queueBlock();
        }
    }, [userBlock, listBlocks, blockedByListControl, queueBlock, queueUnblock]);
    return isDeletedAccount ? (_jsxs(Menu.Item, { label: _(msg `Leave conversation`), onPress: () => leaveConvoControl.open(), children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Leave conversation" }) }), _jsx(Menu.ItemIcon, { icon: ArrowBoxLeft })] })) : (_jsxs(_Fragment, { children: [_jsxs(Menu.Group, { children: [showMarkAsRead && (_jsxs(Menu.Item, { label: _(msg `Mark as read`), onPress: () => markAsRead({ convoId }), children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Mark as read" }) }), _jsx(Menu.ItemIcon, { icon: Bubble })] })), _jsxs(Menu.Item, { label: _(msg `Go to user's profile`), onPress: onNavigateToProfile, children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Go to profile" }) }), _jsx(Menu.ItemIcon, { icon: Person })] }), _jsxs(Menu.Item, { label: _(msg `Mute conversation`), onPress: () => muteConvo({ mute: !convo?.muted }), children: [_jsx(Menu.ItemText, { children: convo?.muted ? (_jsx(Trans, { children: "Unmute conversation" })) : (_jsx(Trans, { children: "Mute conversation" })) }), _jsx(Menu.ItemIcon, { icon: convo?.muted ? Unmute : Mute })] })] }), _jsx(Menu.Divider, {}), _jsxs(Menu.Group, { children: [_jsxs(Menu.Item, { label: isBlocking ? _(msg `Unblock account`) : _(msg `Block account`), onPress: toggleBlock, children: [_jsx(Menu.ItemText, { children: isBlocking ? _(msg `Unblock account`) : _(msg `Block account`) }), _jsx(Menu.ItemIcon, { icon: isBlocking ? PersonCheck : PersonX })] }), _jsxs(Menu.Item, { label: _(msg `Report conversation`), onPress: () => reportControl.open(), children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Report conversation" }) }), _jsx(Menu.ItemIcon, { icon: Flag })] })] }), _jsx(Menu.Divider, {}), _jsx(Menu.Group, { children: _jsxs(Menu.Item, { label: _(msg `Leave conversation`), onPress: () => leaveConvoControl.open(), children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Leave conversation" }) }), _jsx(Menu.ItemIcon, { icon: ArrowBoxLeft })] }) })] }));
}
export { ConvoMenu };
//# sourceMappingURL=ConvoMenu.js.map