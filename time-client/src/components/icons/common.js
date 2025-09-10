import { jsx as _jsx } from "react/jsx-runtime";
import { StyleSheet } from 'react-native';
import {} from 'react-native-svg';
import { Defs, LinearGradient, Stop } from 'react-native-svg';
import { nanoid } from 'nanoid/non-secure';
import { tokens, useTheme } from '#/alf';
export const sizes = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
    '2xl': 32,
};
export function useCommonSVGProps(props) {
    const t = useTheme();
    const { fill, size, gradient, ...rest } = props;
    const style = StyleSheet.flatten(rest.style);
    const _size = Number(size ? sizes[size] : rest.width || sizes.md);
    let _fill = fill || style?.color || t.palette.primary_500;
    let gradientDef = null;
    if (gradient && tokens.gradients[gradient]) {
        const id = gradient + '_' + nanoid();
        const config = tokens.gradients[gradient];
        _fill = `url(#${id})`;
        gradientDef = (_jsx(Defs, { children: _jsx(LinearGradient, { id: id, x1: "0", y1: "0", x2: "100%", y2: "0", gradientTransform: "rotate(45)", children: config.values.map(([stop, fill]) => (_jsx(Stop, { offset: stop, stopColor: fill }, stop))) }) }));
    }
    return {
        fill: _fill,
        size: _size,
        style,
        gradient: gradientDef,
        ...rest,
    };
}
//# sourceMappingURL=common.js.map