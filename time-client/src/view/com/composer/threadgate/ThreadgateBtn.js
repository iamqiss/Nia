import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Keyboard } from 'react-native';
import {} from 'react-native-reanimated';
import {} from '@atproto/api';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { isNative } from '#/platform/detection';
import {} from '#/state/queries/threadgate';
import { native } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { PostInteractionSettingsControlledDialog } from '#/components/dialogs/PostInteractionSettingsDialog';
import { Earth_Stroke2_Corner0_Rounded as Earth } from '#/components/icons/Globe';
import { Group3_Stroke2_Corner0_Rounded as Group } from '#/components/icons/Group';
export function ThreadgateBtn({ postgate, onChangePostgate, threadgateAllowUISettings, onChangeThreadgateAllowUISettings, }) {
    const { _ } = useLingui();
    const control = Dialog.useDialogControl();
    const onPress = () => {
        if (isNative && Keyboard.isVisible()) {
            Keyboard.dismiss();
        }
        control.open();
    };
    const anyoneCanReply = threadgateAllowUISettings.length === 1 &&
        threadgateAllowUISettings[0].type === 'everybody';
    const anyoneCanQuote = !postgate.embeddingRules || postgate.embeddingRules.length === 0;
    const anyoneCanInteract = anyoneCanReply && anyoneCanQuote;
    const label = anyoneCanInteract
        ? _(msg `Anybody can interact`)
        : _(msg `Interaction limited`);
    return (_jsxs(_Fragment, { children: [_jsxs(Button, { variant: "solid", color: "secondary", size: "small", testID: "openReplyGateButton", onPress: onPress, label: label, accessibilityHint: _(msg `Opens a dialog to choose who can reply to this thread`), style: [
                    native({
                        paddingHorizontal: 8,
                        paddingVertical: 6,
                    }),
                ], children: [_jsx(ButtonIcon, { icon: anyoneCanInteract ? Earth : Group }), _jsx(ButtonText, { numberOfLines: 1, children: label })] }), _jsx(PostInteractionSettingsControlledDialog, { control: control, onSave: () => {
                    control.close();
                }, postgate: postgate, onChangePostgate: onChangePostgate, threadgateAllowUISettings: threadgateAllowUISettings, onChangeThreadgateAllowUISettings: onChangeThreadgateAllowUISettings })] }));
}
//# sourceMappingURL=ThreadgateBtn.js.map