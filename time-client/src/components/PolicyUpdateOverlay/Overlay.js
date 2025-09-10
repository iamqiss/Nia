import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import {} from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaFrame, useSafeAreaInsets, } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { isAndroid, isNative } from '#/platform/detection';
import { useA11y } from '#/state/a11y';
import { atoms as a, flatten, useBreakpoints, useTheme, web } from '#/alf';
import { transparentifyColor } from '#/alf/util/colorGeneration';
import { FocusScope } from '#/components/FocusScope';
import { LockScroll } from '#/components/LockScroll';
const GUTTER = 24;
export function Overlay({ children, label, }) {
    const t = useTheme();
    const { gtPhone } = useBreakpoints();
    const { reduceMotionEnabled } = useA11y();
    const insets = useSafeAreaInsets();
    const frame = useSafeAreaFrame();
    return (_jsxs(_Fragment, { children: [_jsx(LockScroll, {}), _jsx(View, { style: [a.fixed, a.inset_0, !reduceMotionEnabled && a.fade_in], children: gtPhone ? (_jsx(View, { style: [a.absolute, a.inset_0, { opacity: 0.8 }], children: _jsx(View, { style: [
                            a.fixed,
                            a.inset_0,
                            { backgroundColor: t.palette.black },
                            !reduceMotionEnabled && a.fade_in,
                        ] }) })) : (_jsx(LinearGradient, { colors: [
                        transparentifyColor(t.atoms.bg.backgroundColor, 0),
                        t.atoms.bg.backgroundColor,
                        t.atoms.bg.backgroundColor,
                    ], start: [0.5, 0], end: [0.5, 1], style: [a.absolute, a.inset_0] })) }), _jsx(ScrollView, { showsVerticalScrollIndicator: false, style: [
                    a.z_10,
                    gtPhone &&
                        web({
                            paddingHorizontal: GUTTER,
                            paddingVertical: '10vh',
                        }),
                ], contentContainerStyle: [a.align_center], children: _jsxs(View, { style: [
                        a.w_full,
                        a.z_20,
                        a.align_center,
                        !gtPhone && [a.justify_end, { minHeight: frame.height }],
                        isNative && [
                            {
                                paddingBottom: Math.max(insets.bottom, a.p_2xl.padding),
                            },
                        ],
                    ], children: [!gtPhone && (_jsx(View, { style: [
                                a.flex_1,
                                a.w_full,
                                {
                                    minHeight: Math.max(insets.top, a.p_2xl.padding),
                                },
                            ], children: _jsx(LinearGradient, { colors: [
                                    transparentifyColor(t.atoms.bg.backgroundColor, 0),
                                    t.atoms.bg.backgroundColor,
                                ], start: [0.5, 0], end: [0.5, 1], style: [a.absolute, a.inset_0] }) })), _jsx(FocusScope, { children: _jsx(View, { accessible: isAndroid, role: "dialog", "aria-role": "dialog", "aria-label": label, style: flatten([
                                    a.relative,
                                    a.w_full,
                                    a.p_2xl,
                                    t.atoms.bg,
                                    !reduceMotionEnabled && a.zoom_fade_in,
                                    gtPhone && [
                                        a.rounded_md,
                                        a.border,
                                        t.atoms.shadow_lg,
                                        t.atoms.border_contrast_low,
                                        web({
                                            maxWidth: 420,
                                        }),
                                    ],
                                ]), children: children }) })] }) })] }));
}
//# sourceMappingURL=Overlay.js.map