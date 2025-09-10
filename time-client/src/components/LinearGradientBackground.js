import { jsx as _jsx } from "react/jsx-runtime";
import {} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '#/alf/tokens';
export function LinearGradientBackground({ style, gradient = 'sky', children, start, end, }) {
    const colors = gradients[gradient].values.map(([_, color]) => {
        return color;
    });
    if (gradient.length < 2) {
        throw new Error('Gradient must have at least 2 colors');
    }
    return (_jsx(LinearGradient, { colors: colors, style: style, start: start, end: end, children: children }));
}
//# sourceMappingURL=LinearGradientBackground.js.map