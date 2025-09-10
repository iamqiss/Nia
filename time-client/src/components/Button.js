import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { Pressable, StyleSheet, View, } from 'react-native';
import { atoms as a, flatten, select, useTheme } from '#/alf';
import {} from '#/components/icons/common';
import { Text } from '#/components/Typography';
const Context = React.createContext({
    hovered: false,
    focused: false,
    pressed: false,
    disabled: false,
});
Context.displayName = 'ButtonContext';
export function useButtonContext() {
    return React.useContext(Context);
}
export const Button = React.forwardRef(({ children, variant, color, size, shape = 'default', label, disabled = false, style, hoverStyle: hoverStyleProp, PressableComponent = Pressable, onPressIn: onPressInOuter, onPressOut: onPressOutOuter, onHoverIn: onHoverInOuter, onHoverOut: onHoverOutOuter, onFocus: onFocusOuter, onBlur: onBlurOuter, ...rest }, ref) => {
    /**
     * The `variant` prop is deprecated in favor of simply specifying `color`.
     * If a `color` is set, then we want to use the existing codepaths for
     * "solid" buttons. This is to maintain backwards compatibility.
     */
    if (!variant && color) {
        variant = 'solid';
    }
    const t = useTheme();
    const [state, setState] = React.useState({
        pressed: false,
        hovered: false,
        focused: false,
    });
    const onPressIn = React.useCallback((e) => {
        setState(s => ({
            ...s,
            pressed: true,
        }));
        onPressInOuter?.(e);
    }, [setState, onPressInOuter]);
    const onPressOut = React.useCallback((e) => {
        setState(s => ({
            ...s,
            pressed: false,
        }));
        onPressOutOuter?.(e);
    }, [setState, onPressOutOuter]);
    const onHoverIn = React.useCallback((e) => {
        setState(s => ({
            ...s,
            hovered: true,
        }));
        onHoverInOuter?.(e);
    }, [setState, onHoverInOuter]);
    const onHoverOut = React.useCallback((e) => {
        setState(s => ({
            ...s,
            hovered: false,
        }));
        onHoverOutOuter?.(e);
    }, [setState, onHoverOutOuter]);
    const onFocus = React.useCallback((e) => {
        setState(s => ({
            ...s,
            focused: true,
        }));
        onFocusOuter?.(e);
    }, [setState, onFocusOuter]);
    const onBlur = React.useCallback((e) => {
        setState(s => ({
            ...s,
            focused: false,
        }));
        onBlurOuter?.(e);
    }, [setState, onBlurOuter]);
    const { baseStyles, hoverStyles } = React.useMemo(() => {
        const baseStyles = [];
        const hoverStyles = [];
        /*
         * This is the happy path for new button styles, following the
         * deprecation of `variant` prop. This redundant `variant` check is here
         * just to make this handling easier to understand.
         */
        if (variant === 'solid') {
            if (color === 'primary') {
                if (!disabled) {
                    baseStyles.push({
                        backgroundColor: t.palette.primary_500,
                    });
                    hoverStyles.push({
                        backgroundColor: t.palette.primary_600,
                    });
                }
                else {
                    baseStyles.push({
                        backgroundColor: t.palette.primary_200,
                    });
                }
            }
            else if (color === 'secondary') {
                if (!disabled) {
                    baseStyles.push(t.atoms.bg_contrast_25);
                    hoverStyles.push(t.atoms.bg_contrast_100);
                }
                else {
                    baseStyles.push(t.atoms.bg_contrast_50);
                }
            }
            else if (color === 'secondary_inverted') {
                if (!disabled) {
                    baseStyles.push({
                        backgroundColor: t.palette.contrast_900,
                    });
                    hoverStyles.push({
                        backgroundColor: t.palette.contrast_975,
                    });
                }
                else {
                    baseStyles.push({
                        backgroundColor: t.palette.contrast_600,
                    });
                }
            }
            else if (color === 'negative') {
                if (!disabled) {
                    baseStyles.push({
                        backgroundColor: t.palette.negative_500,
                    });
                    hoverStyles.push({
                        backgroundColor: t.palette.negative_600,
                    });
                }
                else {
                    baseStyles.push({
                        backgroundColor: t.palette.negative_700,
                    });
                }
            }
            else if (color === 'primary_subtle') {
                if (!disabled) {
                    baseStyles.push({
                        backgroundColor: select(t.name, {
                            light: t.palette.primary_50,
                            dim: t.palette.primary_100,
                            dark: t.palette.primary_100,
                        }),
                    });
                    hoverStyles.push({
                        backgroundColor: select(t.name, {
                            light: t.palette.primary_100,
                            dim: t.palette.primary_200,
                            dark: t.palette.primary_200,
                        }),
                    });
                }
                else {
                    baseStyles.push({
                        backgroundColor: select(t.name, {
                            light: t.palette.primary_25,
                            dim: t.palette.primary_50,
                            dark: t.palette.primary_50,
                        }),
                    });
                }
            }
            else if (color === 'negative_subtle') {
                if (!disabled) {
                    baseStyles.push({
                        backgroundColor: select(t.name, {
                            light: t.palette.negative_50,
                            dim: t.palette.negative_100,
                            dark: t.palette.negative_100,
                        }),
                    });
                    hoverStyles.push({
                        backgroundColor: select(t.name, {
                            light: t.palette.negative_100,
                            dim: t.palette.negative_200,
                            dark: t.palette.negative_200,
                        }),
                    });
                }
                else {
                    baseStyles.push({
                        backgroundColor: select(t.name, {
                            light: t.palette.negative_25,
                            dim: t.palette.negative_50,
                            dark: t.palette.negative_50,
                        }),
                    });
                }
            }
        }
        else {
            /*
             * BEGIN DEPRECATED STYLES
             */
            if (color === 'primary') {
                if (variant === 'outline') {
                    baseStyles.push(a.border, t.atoms.bg, {
                        borderWidth: 1,
                    });
                    if (!disabled) {
                        baseStyles.push(a.border, {
                            borderColor: t.palette.primary_500,
                        });
                        hoverStyles.push(a.border, {
                            backgroundColor: t.palette.primary_50,
                        });
                    }
                    else {
                        baseStyles.push(a.border, {
                            borderColor: t.palette.primary_200,
                        });
                    }
                }
                else if (variant === 'ghost') {
                    if (!disabled) {
                        baseStyles.push(t.atoms.bg);
                        hoverStyles.push({
                            backgroundColor: t.palette.primary_100,
                        });
                    }
                }
            }
            else if (color === 'secondary') {
                if (variant === 'outline') {
                    baseStyles.push(a.border, t.atoms.bg, {
                        borderWidth: 1,
                    });
                    if (!disabled) {
                        baseStyles.push(a.border, {
                            borderColor: t.palette.contrast_300,
                        });
                        hoverStyles.push(t.atoms.bg_contrast_50);
                    }
                    else {
                        baseStyles.push(a.border, {
                            borderColor: t.palette.contrast_200,
                        });
                    }
                }
                else if (variant === 'ghost') {
                    if (!disabled) {
                        baseStyles.push(t.atoms.bg);
                        hoverStyles.push({
                            backgroundColor: t.palette.contrast_25,
                        });
                    }
                }
            }
            else if (color === 'secondary_inverted') {
                if (variant === 'outline') {
                    baseStyles.push(a.border, t.atoms.bg, {
                        borderWidth: 1,
                    });
                    if (!disabled) {
                        baseStyles.push(a.border, {
                            borderColor: t.palette.contrast_300,
                        });
                        hoverStyles.push(t.atoms.bg_contrast_50);
                    }
                    else {
                        baseStyles.push(a.border, {
                            borderColor: t.palette.contrast_200,
                        });
                    }
                }
                else if (variant === 'ghost') {
                    if (!disabled) {
                        baseStyles.push(t.atoms.bg);
                        hoverStyles.push({
                            backgroundColor: t.palette.contrast_25,
                        });
                    }
                }
            }
            else if (color === 'negative') {
                if (variant === 'outline') {
                    baseStyles.push(a.border, t.atoms.bg, {
                        borderWidth: 1,
                    });
                    if (!disabled) {
                        baseStyles.push(a.border, {
                            borderColor: t.palette.negative_500,
                        });
                        hoverStyles.push(a.border, {
                            backgroundColor: t.palette.negative_50,
                        });
                    }
                    else {
                        baseStyles.push(a.border, {
                            borderColor: t.palette.negative_200,
                        });
                    }
                }
                else if (variant === 'ghost') {
                    if (!disabled) {
                        baseStyles.push(t.atoms.bg);
                        hoverStyles.push({
                            backgroundColor: t.palette.negative_100,
                        });
                    }
                }
            }
            else if (color === 'negative_subtle') {
                if (variant === 'outline') {
                    baseStyles.push(a.border, t.atoms.bg, {
                        borderWidth: 1,
                    });
                    if (!disabled) {
                        baseStyles.push(a.border, {
                            borderColor: t.palette.negative_500,
                        });
                        hoverStyles.push(a.border, {
                            backgroundColor: t.palette.negative_50,
                        });
                    }
                    else {
                        baseStyles.push(a.border, {
                            borderColor: t.palette.negative_200,
                        });
                    }
                }
                else if (variant === 'ghost') {
                    if (!disabled) {
                        baseStyles.push(t.atoms.bg);
                        hoverStyles.push({
                            backgroundColor: t.palette.negative_100,
                        });
                    }
                }
            }
            /*
             * END DEPRECATED STYLES
             */
        }
        if (shape === 'default') {
            if (size === 'large') {
                baseStyles.push({
                    paddingVertical: 12,
                    paddingHorizontal: 25,
                    borderRadius: 10,
                    gap: 3,
                });
            }
            else if (size === 'small') {
                baseStyles.push({
                    paddingVertical: 8,
                    paddingHorizontal: 13,
                    borderRadius: 8,
                    gap: 3,
                });
            }
            else if (size === 'tiny') {
                baseStyles.push({
                    paddingVertical: 5,
                    paddingHorizontal: 9,
                    borderRadius: 6,
                    gap: 2,
                });
            }
        }
        else if (shape === 'round' || shape === 'square') {
            /*
             * These sizes match the actual rendered size on screen, based on
             * Chrome's web inspector
             */
            if (size === 'large') {
                if (shape === 'round') {
                    baseStyles.push({ height: 44, width: 44 });
                }
                else {
                    baseStyles.push({ height: 44, width: 44 });
                }
            }
            else if (size === 'small') {
                if (shape === 'round') {
                    baseStyles.push({ height: 33, width: 33 });
                }
                else {
                    baseStyles.push({ height: 33, width: 33 });
                }
            }
            else if (size === 'tiny') {
                if (shape === 'round') {
                    baseStyles.push({ height: 25, width: 25 });
                }
                else {
                    baseStyles.push({ height: 25, width: 25 });
                }
            }
            if (shape === 'round') {
                baseStyles.push(a.rounded_full);
            }
            else if (shape === 'square') {
                if (size === 'tiny') {
                    baseStyles.push({
                        borderRadius: 6,
                    });
                }
                else {
                    baseStyles.push(a.rounded_sm);
                }
            }
        }
        return {
            baseStyles,
            hoverStyles,
        };
    }, [t, variant, color, size, shape, disabled]);
    const context = React.useMemo(() => ({
        ...state,
        variant,
        color,
        size,
        disabled: disabled || false,
    }), [state, variant, color, size, disabled]);
    const flattenedBaseStyles = flatten([baseStyles, style]);
    return (_jsx(PressableComponent, { role: "button", accessibilityHint: undefined, ...rest, 
        // @ts-ignore - this will always be a pressable
        ref: ref, "aria-label": label, "aria-pressed": state.pressed, accessibilityLabel: label, disabled: disabled || false, accessibilityState: {
            disabled: disabled || false,
        }, style: [
            a.flex_row,
            a.align_center,
            a.justify_center,
            a.curve_continuous,
            flattenedBaseStyles,
            ...(state.hovered || state.pressed
                ? [hoverStyles, flatten(hoverStyleProp)]
                : []),
        ], onPressIn: onPressIn, onPressOut: onPressOut, onHoverIn: onHoverIn, onHoverOut: onHoverOut, onFocus: onFocus, onBlur: onBlur, children: _jsx(Context.Provider, { value: context, children: typeof children === 'function' ? children(context) : children }) }));
});
Button.displayName = 'Button';
export function useSharedButtonTextStyles() {
    const t = useTheme();
    const { color, variant, disabled, size } = useButtonContext();
    return React.useMemo(() => {
        const baseStyles = [];
        /*
         * This is the happy path for new button styles, following the
         * deprecation of `variant` prop. This redundant `variant` check is here
         * just to make this handling easier to understand.
         */
        if (variant === 'solid') {
            if (color === 'primary') {
                if (!disabled) {
                    baseStyles.push({ color: t.palette.white });
                }
                else {
                    baseStyles.push({
                        color: select(t.name, {
                            light: t.palette.white,
                            dim: t.atoms.text_inverted.color,
                            dark: t.atoms.text_inverted.color,
                        }),
                    });
                }
            }
            else if (color === 'secondary') {
                if (!disabled) {
                    baseStyles.push(t.atoms.text_contrast_medium);
                }
                else {
                    baseStyles.push({
                        color: t.palette.contrast_300,
                    });
                }
            }
            else if (color === 'secondary_inverted') {
                if (!disabled) {
                    baseStyles.push(t.atoms.text_inverted);
                }
                else {
                    baseStyles.push({
                        color: t.palette.contrast_300,
                    });
                }
            }
            else if (color === 'negative') {
                if (!disabled) {
                    baseStyles.push({ color: t.palette.white });
                }
                else {
                    baseStyles.push({ color: t.palette.negative_300 });
                }
            }
            else if (color === 'primary_subtle') {
                if (!disabled) {
                    baseStyles.push({
                        color: select(t.name, {
                            light: t.palette.primary_600,
                            dim: t.palette.primary_800,
                            dark: t.palette.primary_800,
                        }),
                    });
                }
                else {
                    baseStyles.push({
                        color: select(t.name, {
                            light: t.palette.primary_200,
                            dim: t.palette.primary_200,
                            dark: t.palette.primary_200,
                        }),
                    });
                }
            }
            else if (color === 'negative_subtle') {
                if (!disabled) {
                    baseStyles.push({
                        color: select(t.name, {
                            light: t.palette.negative_600,
                            dim: t.palette.negative_800,
                            dark: t.palette.negative_800,
                        }),
                    });
                }
                else {
                    baseStyles.push({
                        color: select(t.name, {
                            light: t.palette.negative_200,
                            dim: t.palette.negative_200,
                            dark: t.palette.negative_200,
                        }),
                    });
                }
            }
        }
        else {
            /*
             * BEGIN DEPRECATED STYLES
             */
            if (color === 'primary') {
                if (variant === 'outline') {
                    if (!disabled) {
                        baseStyles.push({
                            color: t.palette.primary_600,
                        });
                    }
                    else {
                        baseStyles.push({ color: t.palette.primary_600, opacity: 0.5 });
                    }
                }
                else if (variant === 'ghost') {
                    if (!disabled) {
                        baseStyles.push({ color: t.palette.primary_600 });
                    }
                    else {
                        baseStyles.push({ color: t.palette.primary_600, opacity: 0.5 });
                    }
                }
            }
            else if (color === 'secondary') {
                if (variant === 'outline') {
                    if (!disabled) {
                        baseStyles.push({
                            color: t.palette.contrast_600,
                        });
                    }
                    else {
                        baseStyles.push({
                            color: t.palette.contrast_300,
                        });
                    }
                }
                else if (variant === 'ghost') {
                    if (!disabled) {
                        baseStyles.push({
                            color: t.palette.contrast_600,
                        });
                    }
                    else {
                        baseStyles.push({
                            color: t.palette.contrast_300,
                        });
                    }
                }
            }
            else if (color === 'secondary_inverted') {
                if (variant === 'outline') {
                    if (!disabled) {
                        baseStyles.push({
                            color: t.palette.contrast_600,
                        });
                    }
                    else {
                        baseStyles.push({
                            color: t.palette.contrast_300,
                        });
                    }
                }
                else if (variant === 'ghost') {
                    if (!disabled) {
                        baseStyles.push({
                            color: t.palette.contrast_600,
                        });
                    }
                    else {
                        baseStyles.push({
                            color: t.palette.contrast_300,
                        });
                    }
                }
            }
            else if (color === 'negative') {
                if (variant === 'outline') {
                    if (!disabled) {
                        baseStyles.push({ color: t.palette.negative_400 });
                    }
                    else {
                        baseStyles.push({ color: t.palette.negative_400, opacity: 0.5 });
                    }
                }
                else if (variant === 'ghost') {
                    if (!disabled) {
                        baseStyles.push({ color: t.palette.negative_400 });
                    }
                    else {
                        baseStyles.push({ color: t.palette.negative_400, opacity: 0.5 });
                    }
                }
            }
            else if (color === 'negative_subtle') {
                if (variant === 'outline') {
                    if (!disabled) {
                        baseStyles.push({ color: t.palette.negative_400 });
                    }
                    else {
                        baseStyles.push({ color: t.palette.negative_400, opacity: 0.5 });
                    }
                }
                else if (variant === 'ghost') {
                    if (!disabled) {
                        baseStyles.push({ color: t.palette.negative_400 });
                    }
                    else {
                        baseStyles.push({ color: t.palette.negative_400, opacity: 0.5 });
                    }
                }
            }
            /*
             * END DEPRECATED STYLES
             */
        }
        if (size === 'large') {
            baseStyles.push(a.text_md, a.leading_snug, a.font_medium);
        }
        else if (size === 'small') {
            baseStyles.push(a.text_sm, a.leading_snug, a.font_medium);
        }
        else if (size === 'tiny') {
            baseStyles.push(a.text_xs, a.leading_snug, a.font_medium);
        }
        return StyleSheet.flatten(baseStyles);
    }, [t, variant, color, size, disabled]);
}
export function ButtonText({ children, style, ...rest }) {
    const textStyles = useSharedButtonTextStyles();
    return (_jsx(Text, { ...rest, style: [a.text_center, textStyles, style], children: children }));
}
export function ButtonIcon({ icon: Comp, size, }) {
    const { size: buttonSize } = useButtonContext();
    const textStyles = useSharedButtonTextStyles();
    const { iconSize, iconContainerSize } = React.useMemo(() => {
        /**
         * Pre-set icon sizes for different button sizes
         */
        const iconSizeShorthand = size ??
            ({
                large: 'md',
                small: 'sm',
                tiny: 'xs',
            }[buttonSize || 'small'] || 'sm');
        /*
         * Copied here from icons/common.tsx so we can tweak if we need to, but
         * also so that we can calculate transforms.
         */
        const iconSize = {
            xs: 12,
            sm: 16,
            md: 18,
            lg: 24,
            xl: 28,
            '2xl': 32,
        }[iconSizeShorthand];
        /*
         * Goal here is to match rendered text size so that different size icons
         * don't increase button size
         */
        const iconContainerSize = {
            large: 20,
            small: 17,
            tiny: 15,
        }[buttonSize || 'small'];
        return {
            iconSize,
            iconContainerSize,
        };
    }, [buttonSize, size]);
    return (_jsx(View, { style: [
            a.z_20,
            {
                width: iconContainerSize,
                height: iconContainerSize,
            },
        ], children: _jsx(View, { style: [
                a.absolute,
                {
                    width: iconSize,
                    height: iconSize,
                    top: '50%',
                    left: '50%',
                    transform: [
                        {
                            translateX: (iconSize / 2) * -1,
                        },
                        {
                            translateY: (iconSize / 2) * -1,
                        },
                    ],
                },
            ], children: _jsx(Comp, { width: iconSize, style: [
                    {
                        color: textStyles.color,
                        pointerEvents: 'none',
                    },
                ] }) }) }));
}
//# sourceMappingURL=Button.js.map