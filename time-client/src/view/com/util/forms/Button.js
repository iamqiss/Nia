import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, } from 'react-native';
import { choose } from '#/lib/functions';
import { useTheme } from '#/lib/ThemeContext';
import { Text } from '../text/Text';
/**
 * @deprecated use Button from `#/components/Button.tsx` instead
 */
export function Button({ type = 'primary', label, style, labelContainerStyle, labelStyle, onPress, children, testID, accessibilityLabel, accessibilityHint, accessibilityLabelledBy, onAccessibilityEscape, withLoading = false, disabled = false, }) {
    const theme = useTheme();
    const typeOuterStyle = choose(type, {
        primary: {
            backgroundColor: theme.palette.primary.background,
        },
        secondary: {
            backgroundColor: theme.palette.secondary.background,
        },
        default: {
            backgroundColor: theme.palette.default.backgroundLight,
        },
        inverted: {
            backgroundColor: theme.palette.inverted.background,
        },
        'primary-outline': {
            backgroundColor: theme.palette.default.background,
            borderWidth: 1,
            borderColor: theme.palette.primary.border,
        },
        'secondary-outline': {
            backgroundColor: theme.palette.default.background,
            borderWidth: 1,
            borderColor: theme.palette.secondary.border,
        },
        'primary-light': {
            backgroundColor: theme.palette.default.background,
        },
        'secondary-light': {
            backgroundColor: theme.palette.default.background,
        },
        'default-light': {
            backgroundColor: theme.palette.default.background,
        },
    });
    const typeLabelStyle = choose(type, {
        primary: {
            color: theme.palette.primary.text,
            fontWeight: '600',
        },
        secondary: {
            color: theme.palette.secondary.text,
            fontWeight: theme.palette.secondary.isLowContrast ? '600' : undefined,
        },
        default: {
            color: theme.palette.default.text,
        },
        inverted: {
            color: theme.palette.inverted.text,
            fontWeight: '600',
        },
        'primary-outline': {
            color: theme.palette.primary.textInverted,
            fontWeight: theme.palette.primary.isLowContrast ? '600' : undefined,
        },
        'secondary-outline': {
            color: theme.palette.secondary.textInverted,
            fontWeight: theme.palette.secondary.isLowContrast ? '600' : undefined,
        },
        'primary-light': {
            color: theme.palette.primary.textInverted,
            fontWeight: theme.palette.primary.isLowContrast ? '600' : undefined,
        },
        'secondary-light': {
            color: theme.palette.secondary.textInverted,
            fontWeight: theme.palette.secondary.isLowContrast ? '600' : undefined,
        },
        'default-light': {
            color: theme.palette.default.text,
            fontWeight: theme.palette.default.isLowContrast ? '600' : undefined,
        },
    });
    const [isLoading, setIsLoading] = React.useState(false);
    const onPressWrapped = React.useCallback(async (event) => {
        event.stopPropagation();
        event.preventDefault();
        withLoading && setIsLoading(true);
        await onPress?.(event);
        withLoading && setIsLoading(false);
    }, [onPress, withLoading]);
    const getStyle = React.useCallback((state) => {
        const arr = [typeOuterStyle, styles.outer, style];
        if (state.pressed) {
            arr.push({ opacity: 0.6 });
        }
        else if (state.hovered) {
            arr.push({ opacity: 0.8 });
        }
        return arr;
    }, [typeOuterStyle, style]);
    const renderChildern = React.useCallback(() => {
        if (!label) {
            return children;
        }
        return (_jsxs(View, { style: [styles.labelContainer, labelContainerStyle], children: [label && withLoading && isLoading ? (_jsx(ActivityIndicator, { size: 12, color: typeLabelStyle.color })) : null, _jsx(Text, { type: "button", style: [typeLabelStyle, labelStyle], children: label })] }));
    }, [
        children,
        label,
        withLoading,
        isLoading,
        labelContainerStyle,
        typeLabelStyle,
        labelStyle,
    ]);
    return (_jsx(Pressable, { style: getStyle, onPress: onPressWrapped, disabled: disabled || isLoading, testID: testID, accessibilityRole: "button", accessibilityLabel: accessibilityLabel, accessibilityHint: accessibilityHint, accessibilityLabelledBy: accessibilityLabelledBy, onAccessibilityEscape: onAccessibilityEscape, children: renderChildern }));
}
const styles = StyleSheet.create({
    outer: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 24,
    },
    labelContainer: {
        flexDirection: 'row',
        gap: 8,
    },
});
//# sourceMappingURL=Button.js.map