import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext } from 'react';
import { Keyboard, View } from 'react-native';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useNavigation } from '@react-navigation/native';
import { HITSLOP_30 } from '#/lib/constants';
import {} from '#/lib/routes/types';
import { isIOS } from '#/platform/detection';
import { useSetDrawerOpen } from '#/state/shell';
import { atoms as a, platform, useBreakpoints, useGutters, useLayoutBreakpoints, useTheme, web, } from '#/alf';
import { Button, ButtonIcon } from '#/components/Button';
import { ArrowLeft_Stroke2_Corner0_Rounded as ArrowLeft } from '#/components/icons/Arrow';
import { Menu_Stroke2_Corner0_Rounded as Menu } from '#/components/icons/Menu';
import { BUTTON_VISUAL_ALIGNMENT_OFFSET, CENTER_COLUMN_OFFSET, HEADER_SLOT_SIZE, SCROLLBAR_OFFSET, } from '#/components/Layout/const';
import { ScrollbarOffsetContext } from '#/components/Layout/context';
import { Text } from '#/components/Typography';
export function Outer({ children, noBottomBorder, headerRef, sticky = true, }) {
    const t = useTheme();
    const gutters = useGutters([0, 'base']);
    const { gtMobile } = useBreakpoints();
    const { isWithinOffsetView } = useContext(ScrollbarOffsetContext);
    const { centerColumnOffset } = useLayoutBreakpoints();
    return (_jsx(View, { ref: headerRef, style: [
            a.w_full,
            !noBottomBorder && a.border_b,
            a.flex_row,
            a.align_center,
            a.gap_sm,
            sticky && web([a.sticky, { top: 0 }, a.z_10, t.atoms.bg]),
            gutters,
            platform({
                native: [a.pb_xs, { minHeight: 48 }],
                web: [a.py_xs, { minHeight: 52 }],
            }),
            t.atoms.border_contrast_low,
            gtMobile && [a.mx_auto, { maxWidth: 600 }],
            !isWithinOffsetView && {
                transform: [
                    { translateX: centerColumnOffset ? CENTER_COLUMN_OFFSET : 0 },
                    { translateX: web(SCROLLBAR_OFFSET) ?? 0 },
                ],
            },
        ], children: children }));
}
const AlignmentContext = createContext('platform');
AlignmentContext.displayName = 'AlignmentContext';
export function Content({ children, align = 'platform', }) {
    return (_jsx(View, { style: [
            a.flex_1,
            a.justify_center,
            isIOS && align === 'platform' && a.align_center,
            { minHeight: HEADER_SLOT_SIZE },
        ], children: _jsx(AlignmentContext.Provider, { value: align, children: children }) }));
}
export function Slot({ children }) {
    return _jsx(View, { style: [a.z_50, { width: HEADER_SLOT_SIZE }], children: children });
}
export function BackButton({ onPress, style, ...props }) {
    const { _ } = useLingui();
    const navigation = useNavigation();
    const onPressBack = useCallback((evt) => {
        onPress?.(evt);
        if (evt.defaultPrevented)
            return;
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
        else {
            navigation.navigate('Home');
        }
    }, [onPress, navigation]);
    return (_jsx(Slot, { children: _jsx(Button, { label: _(msg `Go back`), size: "small", variant: "ghost", color: "secondary", shape: "square", onPress: onPressBack, hitSlop: HITSLOP_30, style: [
                { marginLeft: -BUTTON_VISUAL_ALIGNMENT_OFFSET },
                a.bg_transparent,
                style,
            ], ...props, children: _jsx(ButtonIcon, { icon: ArrowLeft, size: "lg" }) }) }));
}
export function MenuButton() {
    const { _ } = useLingui();
    const setDrawerOpen = useSetDrawerOpen();
    const { gtMobile } = useBreakpoints();
    const onPress = useCallback(() => {
        Keyboard.dismiss();
        setDrawerOpen(true);
    }, [setDrawerOpen]);
    return gtMobile ? null : (_jsx(Slot, { children: _jsx(Button, { label: _(msg `Open drawer menu`), size: "small", variant: "ghost", color: "secondary", shape: "square", onPress: onPress, hitSlop: HITSLOP_30, style: [{ marginLeft: -BUTTON_VISUAL_ALIGNMENT_OFFSET }], children: _jsx(ButtonIcon, { icon: Menu, size: "lg" }) }) }));
}
export function TitleText({ children, style, }) {
    const { gtMobile } = useBreakpoints();
    const align = useContext(AlignmentContext);
    return (_jsx(Text, { style: [
            a.text_lg,
            a.font_heavy,
            a.leading_tight,
            isIOS && align === 'platform' && a.text_center,
            gtMobile && a.text_xl,
            style,
        ], numberOfLines: 2, emoji: true, children: children }));
}
export function SubtitleText({ children }) {
    const t = useTheme();
    const align = useContext(AlignmentContext);
    return (_jsx(Text, { style: [
            a.text_sm,
            a.leading_snug,
            isIOS && align === 'platform' && a.text_center,
            t.atoms.text_contrast_medium,
        ], numberOfLines: 2, children: children }));
}
//# sourceMappingURL=index.js.map