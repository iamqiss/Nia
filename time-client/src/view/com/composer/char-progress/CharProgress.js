import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, } from 'react-native';
// @ts-ignore no type definition -prf
import ProgressCircle from 'react-native-progress/Circle';
// @ts-ignore no type definition -prf
import ProgressPie from 'react-native-progress/Pie';
import { MAX_GRAPHEME_LENGTH } from '#/lib/constants';
import { usePalette } from '#/lib/hooks/usePalette';
import { atoms as a } from '#/alf';
import { Text } from '../../util/text/Text';
export function CharProgress({ count, max, style, textStyle, size, }) {
    const maxLength = max || MAX_GRAPHEME_LENGTH;
    const pal = usePalette('default');
    const textColor = count > maxLength ? '#e60000' : pal.colors.text;
    const circleColor = count > maxLength ? '#e60000' : pal.colors.link;
    return (_jsxs(View, { style: [a.flex_row, a.align_center, a.justify_between, a.gap_sm, style], children: [_jsx(Text, { style: [
                    { color: textColor, fontVariant: ['tabular-nums'] },
                    a.flex_grow,
                    a.text_right,
                    textStyle,
                ], children: maxLength - count }), count > maxLength ? (_jsx(ProgressPie, { size: size ?? 30, borderWidth: 4, borderColor: circleColor, color: circleColor, progress: Math.min((count - maxLength) / maxLength, 1) })) : (_jsx(ProgressCircle, { size: size ?? 30, borderWidth: 1, borderColor: pal.colors.border, color: circleColor, progress: count / maxLength }))] }));
}
//# sourceMappingURL=CharProgress.js.map