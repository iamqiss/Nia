import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Alert, View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import * as DynamicAppIcon from '@mozzius/expo-dynamic-app-icon';
import {} from '@react-navigation/native-stack';
import { PressableScale } from '#/lib/custom-animations/PressableScale';
import {} from '#/lib/routes/types';
import { useGate } from '#/lib/statsig/statsig';
import { isAndroid } from '#/platform/detection';
import { AppIconImage } from '#/screens/Settings/AppIconSettings/AppIconImage';
import {} from '#/screens/Settings/AppIconSettings/types';
import { useAppIconSets } from '#/screens/Settings/AppIconSettings/useAppIconSets';
import { atoms as a, useTheme } from '#/alf';
import * as Toggle from '#/components/forms/Toggle';
import * as Layout from '#/components/Layout';
import { Text } from '#/components/Typography';
import { IS_INTERNAL } from '#/env';
export function AppIconSettingsScreen({}) {
    const t = useTheme();
    const { _ } = useLingui();
    const sets = useAppIconSets();
    const gate = useGate();
    const [currentAppIcon, setCurrentAppIcon] = useState(() => getAppIconName(DynamicAppIcon.getAppIcon()));
    const onSetAppIcon = (icon) => {
        if (isAndroid) {
            const next = sets.defaults.find(i => i.id === icon) ??
                sets.core.find(i => i.id === icon);
            Alert.alert(next
                ? _(msg `Change app icon to "${next.name}"`)
                : _(msg `Change app icon`), 
            // unfortunately necessary -sfn
            _(msg `The app will be restarted`), [
                {
                    text: _(msg `Cancel`),
                    style: 'cancel',
                },
                {
                    text: _(msg `OK`),
                    onPress: () => {
                        setCurrentAppIcon(setAppIcon(icon));
                    },
                    style: 'default',
                },
            ]);
        }
        else {
            setCurrentAppIcon(setAppIcon(icon));
        }
    };
    return (_jsxs(Layout.Screen, { children: [_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, { children: _jsx(Layout.Header.TitleText, { children: _jsx(Trans, { children: "App Icon" }) }) }), _jsx(Layout.Header.Slot, {})] }), _jsxs(Layout.Content, { contentContainerStyle: [a.p_lg], children: [_jsx(Group, { label: _(msg `Default icons`), value: currentAppIcon, onChange: onSetAppIcon, children: sets.defaults.map((icon, i) => (_jsxs(Row, { icon: icon, isEnd: i === sets.defaults.length - 1, children: [_jsx(AppIcon, { icon: icon, size: 40 }, icon.id), _jsx(RowText, { children: icon.name })] }, icon.id))) }), IS_INTERNAL && gate('debug_subscriptions') && (_jsxs(_Fragment, { children: [_jsx(Text, { style: [
                                    a.text_md,
                                    a.mt_xl,
                                    a.mb_sm,
                                    a.font_bold,
                                    t.atoms.text_contrast_medium,
                                ], children: _jsx(Trans, { children: "Bluesky+" }) }), _jsx(Group, { label: _(msg `Bluesky+ icons`), value: currentAppIcon, onChange: onSetAppIcon, children: sets.core.map((icon, i) => (_jsxs(Row, { icon: icon, isEnd: i === sets.core.length - 1, children: [_jsx(AppIcon, { icon: icon, size: 40 }, icon.id), _jsx(RowText, { children: icon.name })] }, icon.id))) })] }))] })] }));
}
function setAppIcon(icon) {
    if (icon === 'default_light') {
        return getAppIconName(DynamicAppIcon.setAppIcon(null));
    }
    else {
        return getAppIconName(DynamicAppIcon.setAppIcon(icon));
    }
}
function getAppIconName(icon) {
    if (!icon || icon === 'DEFAULT') {
        return 'default_light';
    }
    else {
        return icon;
    }
}
function Group({ children, label, value, onChange, }) {
    return (_jsx(Toggle.Group, { type: "radio", label: label, values: [value], maxSelections: 1, onChange: vals => {
            if (vals[0])
                onChange(vals[0]);
        }, children: _jsx(View, { style: [a.flex_1, a.rounded_md, a.overflow_hidden], children: children }) }));
}
function Row({ icon, children, isEnd, }) {
    const t = useTheme();
    const { _ } = useLingui();
    return (_jsx(Toggle.Item, { label: _(msg `Set app icon to ${icon.name}`), name: icon.id, children: ({ hovered, pressed }) => (_jsxs(View, { style: [
                a.flex_1,
                a.p_md,
                a.flex_row,
                a.gap_md,
                a.align_center,
                t.atoms.bg_contrast_25,
                (hovered || pressed) && t.atoms.bg_contrast_50,
                t.atoms.border_contrast_high,
                !isEnd && a.border_b,
            ], children: [children, _jsx(Toggle.Radio, {})] })) }));
}
function RowText({ children }) {
    const t = useTheme();
    return (_jsx(Text, { style: [a.text_md, a.font_bold, a.flex_1, t.atoms.text_contrast_medium], emoji: true, children: children }));
}
function AppIcon({ icon, size = 50 }) {
    const { _ } = useLingui();
    return (_jsx(PressableScale, { accessibilityLabel: icon.name, accessibilityHint: _(msg `Changes app icon`), targetScale: 0.95, onPress: () => {
            if (isAndroid) {
                Alert.alert(_(msg `Change app icon to "${icon.name}"`), _(msg `The app will be restarted`), [
                    {
                        text: _(msg `Cancel`),
                        style: 'cancel',
                    },
                    {
                        text: _(msg `OK`),
                        onPress: () => {
                            DynamicAppIcon.setAppIcon(icon.id);
                        },
                        style: 'default',
                    },
                ]);
            }
            else {
                DynamicAppIcon.setAppIcon(icon.id);
            }
        }, children: _jsx(AppIconImage, { icon: icon, size: size }) }));
}
//# sourceMappingURL=index.js.map