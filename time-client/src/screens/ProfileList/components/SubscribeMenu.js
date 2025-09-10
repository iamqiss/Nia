import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { logger } from '#/logger';
import { useListBlockMutation, useListMuteMutation } from '#/state/queries/list';
import { atoms as a } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import { Mute_Stroke2_Corner0_Rounded as MuteIcon } from '#/components/icons/Mute';
import { PersonX_Stroke2_Corner0_Rounded as PersonXIcon } from '#/components/icons/Person';
import { Loader } from '#/components/Loader';
import * as Menu from '#/components/Menu';
import * as Prompt from '#/components/Prompt';
import * as Toast from '#/components/Toast';
export function SubscribeMenu({ list }) {
    const { _ } = useLingui();
    const subscribeMutePromptControl = Prompt.usePromptControl();
    const subscribeBlockPromptControl = Prompt.usePromptControl();
    const { mutateAsync: muteList, isPending: isMutePending } = useListMuteMutation();
    const { mutateAsync: blockList, isPending: isBlockPending } = useListBlockMutation();
    const isPending = isMutePending || isBlockPending;
    const onSubscribeMute = async () => {
        try {
            await muteList({ uri: list.uri, mute: true });
            Toast.show(_(msg({ message: 'List muted', context: 'toast' })));
            logger.metric('moderation:subscribedToList', { listType: 'mute' }, { statsig: true });
        }
        catch {
            Toast.show(_(msg `There was an issue. Please check your internet connection and try again.`), { type: 'error' });
        }
    };
    const onSubscribeBlock = async () => {
        try {
            await blockList({ uri: list.uri, block: true });
            Toast.show(_(msg({ message: 'List blocked', context: 'toast' })));
            logger.metric('moderation:subscribedToList', { listType: 'block' }, { statsig: true });
        }
        catch {
            Toast.show(_(msg `There was an issue. Please check your internet connection and try again.`), { type: 'error' });
        }
    };
    return (_jsxs(_Fragment, { children: [_jsxs(Menu.Root, { children: [_jsx(Menu.Trigger, { label: _(msg `Subscribe to this list`), children: ({ props }) => (_jsxs(Button, { label: props.accessibilityLabel, testID: "subscribeBtn", size: "small", color: "primary_subtle", style: [a.rounded_full], disabled: isPending, ...props, children: [isPending && _jsx(ButtonIcon, { icon: Loader }), _jsx(ButtonText, { children: _jsx(Trans, { children: "Subscribe" }) })] })) }), _jsx(Menu.Outer, { showCancel: true, children: _jsxs(Menu.Group, { children: [_jsxs(Menu.Item, { label: _(msg `Mute accounts`), onPress: subscribeMutePromptControl.open, children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Mute accounts" }) }), _jsx(Menu.ItemIcon, { position: "right", icon: MuteIcon })] }), _jsxs(Menu.Item, { label: _(msg `Block accounts`), onPress: subscribeBlockPromptControl.open, children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Block accounts" }) }), _jsx(Menu.ItemIcon, { position: "right", icon: PersonXIcon })] })] }) })] }), _jsx(Prompt.Basic, { control: subscribeMutePromptControl, title: _(msg `Mute these accounts?`), description: _(msg `Muting is private. Muted accounts can interact with you, but you will not see their posts or receive notifications from them.`), onConfirm: onSubscribeMute, confirmButtonCta: _(msg `Mute list`) }), _jsx(Prompt.Basic, { control: subscribeBlockPromptControl, title: _(msg `Block these accounts?`), description: _(msg `Blocking is public. Blocked accounts cannot reply in your threads, mention you, or otherwise interact with you.`), onConfirm: onSubscribeBlock, confirmButtonCta: _(msg `Block list`), confirmButtonColor: "negative" })] }));
}
//# sourceMappingURL=SubscribeMenu.js.map