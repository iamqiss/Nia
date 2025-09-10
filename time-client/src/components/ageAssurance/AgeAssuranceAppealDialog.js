import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { ComAtprotoModerationDefs } from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useMutation } from '@tanstack/react-query';
import { BLUESKY_MOD_SERVICE_HEADERS } from '#/lib/constants';
import { logger } from '#/state/ageAssurance/util';
import { useAgent, useSession } from '#/state/session';
import * as Toast from '#/view/com/util/Toast';
import { atoms as a, useBreakpoints, web } from '#/alf';
import { AgeAssuranceBadge } from '#/components/ageAssurance/AgeAssuranceBadge';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { Loader } from '#/components/Loader';
import { Text } from '#/components/Typography';
export function AgeAssuranceAppealDialog({ control, }) {
    const { _ } = useLingui();
    return (_jsxs(Dialog.Outer, { control: control, children: [_jsx(Dialog.Handle, {}), _jsxs(Dialog.ScrollableInner, { label: _(msg `Contact our moderation team`), style: [web({ maxWidth: 400 })], children: [_jsx(Inner, { control: control }), _jsx(Dialog.Close, {})] })] }));
}
function Inner({ control }) {
    const { _ } = useLingui();
    const { currentAccount } = useSession();
    const { gtPhone } = useBreakpoints();
    const agent = useAgent();
    const [details, setDetails] = React.useState('');
    const isInvalid = details.length > 1000;
    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            logger.metric('ageAssurance:appealDialogSubmit', {});
            await agent.createModerationReport({
                reasonType: ComAtprotoModerationDefs.REASONAPPEAL,
                subject: {
                    $type: 'com.atproto.admin.defs#repoRef',
                    did: currentAccount?.did,
                },
                reason: `AGE_ASSURANCE_INQUIRY: ` + details,
            }, {
                encoding: 'application/json',
                headers: BLUESKY_MOD_SERVICE_HEADERS,
            });
        },
        onError: err => {
            logger.error('AgeAssuranceAppealDialog failed', { safeMessage: err });
            Toast.show(_(msg `Age assurance inquiry failed to send, please try again.`), 'xmark');
        },
        onSuccess: () => {
            control.close();
            Toast.show(_(msg({
                message: 'Age assurance inquiry was submitted',
                context: 'toast',
            })));
        },
    });
    return (_jsxs(View, { children: [_jsx(View, { style: [a.align_start], children: _jsx(AgeAssuranceBadge, {}) }), _jsx(Text, { style: [a.text_2xl, a.font_heavy, a.pt_md, a.leading_tight], children: _jsx(Trans, { children: "Contact us" }) }), _jsx(Text, { style: [a.text_sm, a.pt_sm, a.leading_snug], children: _jsx(Trans, { children: "Please provide any additional details you feel moderators may need in order to properly assess your Age Assurance status." }) }), _jsxs(View, { style: [a.pt_md], children: [_jsx(Dialog.Input, { multiline: true, isInvalid: isInvalid, value: details, onChangeText: details => {
                            setDetails(details);
                        }, label: _(msg `Additional details (limit 1000 characters)`), numberOfLines: 4, onSubmitEditing: () => mutate() }), _jsxs(View, { style: [a.pt_md, a.gap_sm, gtPhone && [a.flex_row_reverse]], children: [_jsxs(Button, { label: _(msg `Submit`), size: "small", variant: "solid", color: "primary", onPress: () => mutate(), children: [_jsx(ButtonText, { children: _jsx(Trans, { children: "Submit" }) }), isPending && _jsx(ButtonIcon, { icon: Loader, position: "right" })] }), _jsx(Button, { label: _(msg `Cancel`), size: "small", variant: "solid", color: "secondary", onPress: () => control.close(), children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Cancel" }) }) })] })] })] }));
}
//# sourceMappingURL=AgeAssuranceAppealDialog.js.map