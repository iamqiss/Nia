import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback } from 'react';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useRequireEmailVerification } from '#/lib/hooks/useRequireEmailVerification';
import { createSanitizedDisplayName } from '#/lib/moderation/create-sanitized-display-name';
import { Button, ButtonIcon } from '#/components/Button';
import { useDialogControl } from '#/components/Dialog';
import { BellPlus_Stroke2_Corner0_Rounded as BellPlusIcon } from '#/components/icons/BellPlus';
import { BellRinging_Filled_Corner0_Rounded as BellRingingIcon } from '#/components/icons/BellRinging';
import * as Tooltip from '#/components/Tooltip';
import { Text } from '#/components/Typography';
import { useActivitySubscriptionsNudged } from '#/storage/hooks/activity-subscriptions-nudged';
import { SubscribeProfileDialog } from './SubscribeProfileDialog';
export function SubscribeProfileButton({ profile, moderationOpts, }) {
    const { _ } = useLingui();
    const requireEmailVerification = useRequireEmailVerification();
    const subscribeDialogControl = useDialogControl();
    const [activitySubscriptionsNudged, setActivitySubscriptionsNudged] = useActivitySubscriptionsNudged();
    const onDismissTooltip = () => {
        setActivitySubscriptionsNudged(true);
    };
    const onPress = useCallback(() => {
        subscribeDialogControl.open();
    }, [subscribeDialogControl]);
    const name = createSanitizedDisplayName(profile, true);
    const wrappedOnPress = requireEmailVerification(onPress, {
        instructions: [
            _jsxs(Trans, { children: ["Before you can get notifications for ", name, "'s posts, you must first verify your email."] }, "message"),
        ],
    });
    const isSubscribed = profile.viewer?.activitySubscription?.post ||
        profile.viewer?.activitySubscription?.reply;
    const Icon = isSubscribed ? BellRingingIcon : BellPlusIcon;
    return (_jsxs(_Fragment, { children: [_jsxs(Tooltip.Outer, { visible: !activitySubscriptionsNudged, onVisibleChange: onDismissTooltip, position: "bottom", children: [_jsx(Tooltip.Target, { children: _jsx(Button, { accessibilityRole: "button", testID: "dmBtn", size: "small", color: "secondary", variant: "solid", shape: "round", label: _(msg `Get notified when ${name} posts`), onPress: wrappedOnPress, children: _jsx(ButtonIcon, { icon: Icon, size: "md" }) }) }), _jsx(Tooltip.TextBubble, { children: _jsx(Text, { children: _jsx(Trans, { children: "Get notified about new posts" }) }) })] }), _jsx(SubscribeProfileDialog, { control: subscribeDialogControl, profile: profile, moderationOpts: moderationOpts })] }));
}
//# sourceMappingURL=SubscribeProfileButton.js.map