import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View } from 'react-native';
import { atoms as a, useBreakpoints, useTheme } from '#/alf';
import { Text } from '#/components/Typography';
export function FormContainer({ testID, titleText, children, style, }) {
    const { gtMobile } = useBreakpoints();
    const t = useTheme();
    return (_jsxs(View, { testID: testID, style: [a.gap_md, a.flex_1, !gtMobile && [a.px_lg, a.py_md], style], children: [titleText && !gtMobile && (_jsx(Text, { style: [a.text_xl, a.font_bold, t.atoms.text_contrast_high], children: titleText })), children] }));
}
//# sourceMappingURL=FormContainer.js.map