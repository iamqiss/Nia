import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View } from 'react-native';
import { atoms as a, useTheme } from '#/alf';
import * as Skele from '#/components/Skeleton';
import { Text } from '#/components/Typography';
import * as SettingsList from '../../components/SettingsList';
export function ItemTextWithSubtitle({ titleText, subtitleText, bold = false, showSkeleton = false, }) {
    const t = useTheme();
    return (_jsxs(View, { style: [a.flex_1, bold ? a.gap_xs : a.gap_2xs], children: [_jsx(SettingsList.ItemText, { style: bold && [a.font_bold, a.text_lg], children: titleText }), showSkeleton ? (_jsx(Skele.Text, { style: [a.text_sm, { width: 120 }] })) : (_jsx(Text, { style: [a.text_sm, t.atoms.text_contrast_medium, a.leading_snug], children: subtitleText }))] }));
}
//# sourceMappingURL=ItemTextWithSubtitle.js.map