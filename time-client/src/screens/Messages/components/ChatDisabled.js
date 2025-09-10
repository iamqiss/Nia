import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { ComAtprotoModerationDefs } from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useMutation } from '@tanstack/react-query';
import { BLUESKY_MOD_SERVICE_HEADERS } from '#/lib/constants';
import { logger } from '#/logger';
import { useAgent, useSession } from '#/state/session';
import * as Toast from '#/view/com/util/Toast';
import { atoms as a, useBreakpoints, useTheme } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { Loader } from '#/components/Loader';
import { Text } from '#/components/Typography';
export function ChatDisabled() {
    const t = useTheme();
    return (_jsx(View, { style: [a.p_md], children: _jsxs(View, { style: [a.align_start, a.p_xl, a.rounded_md, t.atoms.bg_contrast_25], children: [_jsx(Text, { style: [a.text_md, a.font_bold, a.pb_sm, t.atoms.text_contrast_high], children: _jsx(Trans, { children: "Your chats have been disabled" }) }), _jsx(Text, { style: [a.text_sm, a.leading_snug, t.atoms.text_contrast_medium], children: _jsx(Trans, { children: "Our moderators have reviewed reports and decided to disable your access to chats on Bluesky." }) }), _jsx(AppealDialog, {})] }) }));
}
function AppealDialog() {
    const control = Dialog.useDialogControl();
    const { _ } = useLingui();
    return (_jsxs(_Fragment, { children: [_jsx(Button, { testID: "appealDisabledChatBtn", variant: "ghost", color: "secondary", size: "small", onPress: control.open, label: _(msg `Appeal this decision`), style: a.mt_sm, children: _jsx(ButtonText, { children: _(msg `Appeal this decision`) }) }), _jsxs(Dialog.Outer, { control: control, children: [_jsx(Dialog.Handle, {}), _jsx(DialogInner, {})] })] }));
}
function DialogInner() {
    const { _ } = useLingui();
    const control = Dialog.useDialogContext();
    const [details, setDetails] = useState('');
    const { gtMobile } = useBreakpoints();
    const agent = useAgent();
    const { currentAccount } = useSession();
    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            if (!currentAccount)
                throw new Error('No current account, should be unreachable');
            await agent.createModerationReport({
                reasonType: ComAtprotoModerationDefs.REASONAPPEAL,
                subject: {
                    $type: 'com.atproto.admin.defs#repoRef',
                    did: currentAccount.did,
                },
                reason: details,
            }, {
                encoding: 'application/json',
                headers: BLUESKY_MOD_SERVICE_HEADERS,
            });
        },
        onError: err => {
            logger.error('Failed to submit chat appeal', { message: err });
            Toast.show(_(msg `Failed to submit appeal, please try again.`), 'xmark');
        },
        onSuccess: () => {
            control.close();
            Toast.show(_(msg({ message: 'Appeal submitted', context: 'toast' })));
        },
    });
    const onSubmit = useCallback(() => mutate(), [mutate]);
    const onBack = useCallback(() => control.close(), [control]);
    return (_jsxs(Dialog.ScrollableInner, { label: _(msg `Appeal this decision`), children: [_jsx(Text, { style: [a.text_2xl, a.font_bold, a.pb_xs, a.leading_tight], children: _jsx(Trans, { children: "Appeal this decision" }) }), _jsx(Text, { style: [a.text_md, a.leading_snug], children: _jsx(Trans, { children: "This appeal will be sent to Bluesky's moderation service." }) }), _jsx(View, { style: [a.my_md], children: _jsx(Dialog.Input, { label: _(msg `Text input field`), placeholder: _(msg `Please explain why you think your chats were incorrectly disabled`), value: details, onChangeText: setDetails, autoFocus: true, numberOfLines: 3, multiline: true, maxLength: 300 }) }), _jsxs(View, { style: gtMobile
                    ? [a.flex_row, a.justify_between]
                    : [{ flexDirection: 'column-reverse' }, a.gap_sm], children: [_jsx(Button, { testID: "backBtn", variant: "solid", color: "secondary", size: "large", onPress: onBack, label: _(msg `Back`), children: _jsx(ButtonText, { children: _(msg `Back`) }) }), _jsxs(Button, { testID: "submitBtn", variant: "solid", color: "primary", size: "large", onPress: onSubmit, label: _(msg `Submit`), children: [_jsx(ButtonText, { children: _(msg `Submit`) }), isPending && _jsx(ButtonIcon, { icon: Loader })] })] }), _jsx(Dialog.Close, {})] }));
}
//# sourceMappingURL=ChatDisabled.js.map