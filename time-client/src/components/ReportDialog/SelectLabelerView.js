import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View } from 'react-native';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { getLabelingServiceTitle } from '#/lib/moderation';
import { atoms as a, useBreakpoints, useTheme } from '#/alf';
import { Button, useButtonContext } from '#/components/Button';
import { Divider } from '#/components/Divider';
import * as LabelingServiceCard from '#/components/LabelingServiceCard';
import { Text } from '#/components/Typography';
import {} from './types';
export function SelectLabelerView({ ...props }) {
    const t = useTheme();
    const { _ } = useLingui();
    const { gtMobile } = useBreakpoints();
    return (_jsxs(View, { style: [a.gap_lg], children: [_jsxs(View, { style: [a.justify_center, gtMobile ? a.gap_sm : a.gap_xs], children: [_jsx(Text, { style: [a.text_2xl, a.font_bold], children: _jsx(Trans, { children: "Select moderator" }) }), _jsx(Text, { style: [a.text_md, t.atoms.text_contrast_medium], children: _jsx(Trans, { children: "To whom would you like to send this report?" }) })] }), _jsx(Divider, {}), _jsx(View, { style: [a.gap_sm], children: props.labelers.map(labeler => {
                    return (_jsx(Button, { label: _(msg `Send report to ${labeler.creator.displayName}`), onPress: () => props.onSelectLabeler(labeler.creator.did), children: _jsx(LabelerButton, { labeler: labeler }) }, labeler.creator.did));
                }) })] }));
}
function LabelerButton({ labeler, }) {
    const t = useTheme();
    const { hovered, pressed } = useButtonContext();
    const interacted = hovered || pressed;
    return (_jsxs(LabelingServiceCard.Outer, { style: [
            a.p_md,
            a.rounded_sm,
            t.atoms.bg_contrast_25,
            interacted && t.atoms.bg_contrast_50,
        ], children: [_jsx(LabelingServiceCard.Avatar, { avatar: labeler.creator.avatar }), _jsxs(LabelingServiceCard.Content, { children: [_jsx(LabelingServiceCard.Title, { value: getLabelingServiceTitle({
                            displayName: labeler.creator.displayName,
                            handle: labeler.creator.handle,
                        }) }), _jsxs(Text, { style: [t.atoms.text_contrast_medium, a.text_sm, a.font_bold], children: ["@", labeler.creator.handle] })] })] }));
}
//# sourceMappingURL=SelectLabelerView.js.map