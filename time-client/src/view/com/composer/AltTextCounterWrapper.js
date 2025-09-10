import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View } from 'react-native';
import { MAX_ALT_TEXT } from '#/lib/constants';
import { CharProgress } from '#/view/com/composer/char-progress/CharProgress';
import { atoms as a, useTheme } from '#/alf';
export function AltTextCounterWrapper({ altText, children, }) {
    const t = useTheme();
    return (_jsxs(View, { style: [a.flex_row], children: [_jsx(CharProgress, { style: [
                    a.flex_col_reverse,
                    a.align_center,
                    a.mr_xs,
                    { minWidth: 50, gap: 1 },
                ], textStyle: [{ marginRight: 0 }, a.text_sm, t.atoms.text_contrast_medium], size: 26, count: altText?.length || 0, max: MAX_ALT_TEXT }), children] }));
}
//# sourceMappingURL=AltTextCounterWrapper.js.map