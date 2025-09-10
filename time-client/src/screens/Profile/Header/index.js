import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { memo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { runOnJS, useAnimatedReaction, useAnimatedStyle, withTiming, } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {} from '@atproto/api';
import { useIsFocused } from '@react-navigation/native';
import { isNative } from '#/platform/detection';
import { useSetLightStatusBar } from '#/state/shell/light-status-bar';
import { usePagerHeaderContext } from '#/view/com/pager/PagerHeaderContext';
import { LoadingPlaceholder } from '#/view/com/util/LoadingPlaceholder';
import { atoms as a, useTheme } from '#/alf';
import { ProfileHeaderLabeler } from './ProfileHeaderLabeler';
import { ProfileHeaderStandard } from './ProfileHeaderStandard';
let ProfileHeaderLoading = (_props) => {
    const t = useTheme();
    return (_jsxs(View, { style: t.atoms.bg, children: [_jsx(LoadingPlaceholder, { width: "100%", height: 150, style: { borderRadius: 0 } }), _jsx(View, { style: [
                    t.atoms.bg,
                    { borderColor: t.atoms.bg.backgroundColor },
                    styles.avi,
                ], children: _jsx(LoadingPlaceholder, { width: 90, height: 90, style: styles.br45 }) }), _jsx(View, { style: styles.content, children: _jsx(View, { style: [styles.buttonsLine], children: _jsx(LoadingPlaceholder, { width: 140, height: 34, style: styles.br50 }) }) })] }));
};
ProfileHeaderLoading = memo(ProfileHeaderLoading);
export { ProfileHeaderLoading };
let ProfileHeader = ({ setMinimumHeight, ...props }) => {
    let content;
    if (props.profile.associated?.labeler) {
        if (!props.labeler) {
            content = _jsx(ProfileHeaderLoading, {});
        }
        else {
            content = _jsx(ProfileHeaderLabeler, { ...props, labeler: props.labeler });
        }
    }
    else {
        content = _jsx(ProfileHeaderStandard, { ...props });
    }
    return (_jsxs(_Fragment, { children: [isNative && (_jsx(MinimalHeader, { onLayout: evt => setMinimumHeight(evt.nativeEvent.layout.height), profile: props.profile, hideBackButton: props.hideBackButton })), content] }));
};
ProfileHeader = memo(ProfileHeader);
export { ProfileHeader };
const MinimalHeader = React.memo(function MinimalHeader({ onLayout, }) {
    const t = useTheme();
    const insets = useSafeAreaInsets();
    const ctx = usePagerHeaderContext();
    const [visible, setVisible] = useState(false);
    const [minimalHeaderHeight, setMinimalHeaderHeight] = React.useState(0);
    const isScreenFocused = useIsFocused();
    if (!ctx)
        throw new Error('MinimalHeader cannot be used on web');
    const { scrollY, headerHeight } = ctx;
    const animatedStyle = useAnimatedStyle(() => {
        // if we don't yet have the min header height in JS, hide
        if (!_WORKLET || minimalHeaderHeight === 0) {
            return {
                opacity: 0,
            };
        }
        const pastThreshold = scrollY.get() > 100;
        return {
            opacity: pastThreshold
                ? withTiming(1, { duration: 75 })
                : withTiming(0, { duration: 75 }),
            transform: [
                {
                    translateY: Math.min(scrollY.get(), headerHeight - minimalHeaderHeight),
                },
            ],
        };
    });
    useAnimatedReaction(() => scrollY.get() > 100, (value, prev) => {
        if (prev !== value) {
            runOnJS(setVisible)(value);
        }
    });
    useSetLightStatusBar(isScreenFocused && !visible);
    return (_jsx(Animated.View, { pointerEvents: visible ? 'auto' : 'none', "aria-hidden": !visible, accessibilityElementsHidden: !visible, importantForAccessibility: visible ? 'auto' : 'no-hide-descendants', onLayout: evt => {
            setMinimalHeaderHeight(evt.nativeEvent.layout.height);
            onLayout(evt);
        }, style: [
            a.absolute,
            a.z_50,
            t.atoms.bg,
            {
                top: 0,
                left: 0,
                right: 0,
                paddingTop: insets.top,
            },
            animatedStyle,
        ] }));
});
MinimalHeader.displayName = 'MinimalHeader';
const styles = StyleSheet.create({
    avi: {
        position: 'absolute',
        top: 110,
        left: 10,
        width: 94,
        height: 94,
        borderRadius: 47,
        borderWidth: 2,
    },
    content: {
        paddingTop: 12,
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    buttonsLine: {
        flexDirection: 'row',
        marginLeft: 'auto',
    },
    br45: { borderRadius: 45 },
    br50: { borderRadius: 50 },
});
//# sourceMappingURL=index.js.map