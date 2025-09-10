import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View } from 'react-native';
import {} from '@atproto/api';
import { msg, Plural, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useSession } from '#/state/session';
import { atoms as a } from '#/alf';
import { Button, ButtonIcon, ButtonText, } from '#/components/Button';
import { CircleInfo_Stroke2_Corner0_Rounded as CircleInfo } from '#/components/icons/CircleInfo';
import { LabelsOnMeDialog, useLabelsOnMeDialogControl, } from '#/components/moderation/LabelsOnMeDialog';
export function LabelsOnMe({ type, labels, size, style, }) {
    const { _ } = useLingui();
    const { currentAccount } = useSession();
    const control = useLabelsOnMeDialogControl();
    if (!labels || !currentAccount) {
        return null;
    }
    labels = labels.filter(l => !l.val.startsWith('!'));
    if (!labels.length) {
        return null;
    }
    return (_jsxs(View, { style: [a.flex_row, style], children: [_jsx(LabelsOnMeDialog, { control: control, labels: labels, type: type }), _jsxs(Button, { variant: "solid", color: "secondary", size: size || 'small', label: _(msg `View information about these labels`), onPress: () => {
                    control.open();
                }, children: [_jsx(ButtonIcon, { position: "left", icon: CircleInfo }), _jsx(ButtonText, { style: [a.leading_snug], children: type === 'account' ? (_jsxs(Trans, { children: [_jsx(Plural, { value: labels.length, one: "# label has", other: "# labels have" }), ' ', "been placed on this account"] })) : (_jsxs(Trans, { children: [_jsx(Plural, { value: labels.length, one: "# label has", other: "# labels have" }), ' ', "been placed on this content"] })) })] })] }));
}
export function LabelsOnMyPost({ post, style, }) {
    const { currentAccount } = useSession();
    if (post.author.did !== currentAccount?.did) {
        return null;
    }
    return (_jsx(LabelsOnMe, { type: "content", labels: post.labels, size: "tiny", style: style }));
}
//# sourceMappingURL=LabelsOnMe.js.map