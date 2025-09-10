import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useState } from 'react';
import { LayoutAnimation, View } from 'react-native';
import { Pressable } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useFocusEffect } from '@react-navigation/native';
import { useGetTimeAgo } from '#/lib/hooks/useTimeAgo';
import {} from '#/lib/routes/types';
import { getEntries } from '#/logger/logDump';
import { useTickEveryMinute } from '#/state/shell';
import { useSetMinimalShellMode } from '#/state/shell';
import { atoms as a, useTheme } from '#/alf';
import { ChevronBottom_Stroke2_Corner0_Rounded as ChevronBottomIcon, ChevronTop_Stroke2_Corner0_Rounded as ChevronTopIcon, } from '#/components/icons/Chevron';
import { CircleInfo_Stroke2_Corner0_Rounded as CircleInfoIcon } from '#/components/icons/CircleInfo';
import { Warning_Stroke2_Corner0_Rounded as WarningIcon } from '#/components/icons/Warning';
import * as Layout from '#/components/Layout';
import { Text } from '#/components/Typography';
export function LogScreen({}) {
    const t = useTheme();
    const { _ } = useLingui();
    const setMinimalShellMode = useSetMinimalShellMode();
    const [expanded, setExpanded] = useState([]);
    const timeAgo = useGetTimeAgo();
    const tick = useTickEveryMinute();
    useFocusEffect(useCallback(() => {
        setMinimalShellMode(false);
    }, [setMinimalShellMode]));
    const toggler = (id) => () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        if (expanded.includes(id)) {
            setExpanded(expanded.filter(v => v !== id));
        }
        else {
            setExpanded([...expanded, id]);
        }
    };
    return (_jsxs(Layout.Screen, { children: [_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, { children: _jsx(Layout.Header.TitleText, { children: _jsx(Trans, { children: "System log" }) }) }), _jsx(Layout.Header.Slot, {})] }), _jsx(Layout.Content, { children: getEntries()
                    .slice(0)
                    .map(entry => {
                    return (_jsxs(View, { children: [_jsxs(Pressable, { style: [
                                    a.flex_row,
                                    a.align_center,
                                    a.py_md,
                                    a.px_sm,
                                    a.border_b,
                                    t.atoms.border_contrast_low,
                                    t.atoms.bg,
                                    a.gap_sm,
                                ], onPress: toggler(entry.id), accessibilityLabel: _(msg `View debug entry`), accessibilityHint: _(msg `Opens additional details for a debug entry`), children: [entry.level === 'warn' || entry.level === 'error' ? (_jsx(WarningIcon, { size: "sm", fill: t.palette.negative_500 })) : (_jsx(CircleInfoIcon, { size: "sm" })), _jsxs(View, { style: [
                                            a.flex_1,
                                            a.flex_row,
                                            a.justify_start,
                                            a.align_center,
                                            a.gap_sm,
                                        ], children: [entry.context && (_jsxs(Text, { style: [t.atoms.text_contrast_medium], children: ["(", String(entry.context), ")"] })), _jsx(Text, { children: String(entry.message) })] }), entry.metadata &&
                                        Object.keys(entry.metadata).length > 0 &&
                                        (expanded.includes(entry.id) ? (_jsx(ChevronTopIcon, { size: "sm", style: [t.atoms.text_contrast_low] })) : (_jsx(ChevronBottomIcon, { size: "sm", style: [t.atoms.text_contrast_low] }))), _jsx(Text, { style: [{ minWidth: 40 }, t.atoms.text_contrast_medium], children: timeAgo(entry.timestamp, tick) })] }), expanded.includes(entry.id) && (_jsx(View, { style: [
                                    t.atoms.bg_contrast_25,
                                    a.rounded_xs,
                                    a.p_sm,
                                    a.border_b,
                                    t.atoms.border_contrast_low,
                                ], children: _jsx(View, { style: [a.px_sm, a.py_xs], children: _jsx(Text, { style: [a.leading_snug, { fontFamily: 'monospace' }], children: JSON.stringify(entry.metadata, null, 2) }) }) }))] }, `entry-${entry.id}`));
                }) })] }));
}
//# sourceMappingURL=Log.js.map