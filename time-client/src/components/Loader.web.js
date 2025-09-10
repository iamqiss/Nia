import { jsx as _jsx } from "react/jsx-runtime";
import { View } from 'react-native';
import { atoms as a, flatten, useTheme } from '#/alf';
import { useCommonSVGProps } from '#/components/icons/common';
import { Loader_Stroke2_Corner0_Rounded as Icon } from '#/components/icons/Loader';
export function Loader(props) {
    const t = useTheme();
    const common = useCommonSVGProps(props);
    return (_jsx(View, { style: [
            a.relative,
            a.justify_center,
            a.align_center,
            { width: common.size, height: common.size },
        ], children: _jsx("div", { className: "rotate-500ms", children: _jsx(Icon, { ...props, style: [
                    a.absolute,
                    a.inset_0,
                    t.atoms.text_contrast_high,
                    flatten(props.style),
                ] }) }) }));
}
//# sourceMappingURL=Loader.web.js.map