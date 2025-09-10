import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { Platform, Pressable, StyleSheet, View, } from 'react-native';
import {} from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import * as DropdownMenu from 'zeego/dropdown-menu';
import {} from 'zeego/lib/typescript/menu';
import { usePalette } from '#/lib/hooks/usePalette';
import { useTheme } from '#/lib/ThemeContext';
import { isIOS } from '#/platform/detection';
import { Portal } from '#/components/Portal';
// Custom Dropdown Menu Components
// ==
/**
 * @deprecated use Menu from `#/components/Menu.tsx` instead
 */
export const DropdownMenuRoot = DropdownMenu.Root;
// export const DropdownMenuTrigger = DropdownMenu.Trigger
/**
 * @deprecated use Menu from `#/components/Menu.tsx` instead
 */
export const DropdownMenuContent = DropdownMenu.Content;
/**
 * @deprecated use Menu from `#/components/Menu.tsx` instead
 */
export const DropdownMenuTrigger = DropdownMenu.create((props) => {
    const theme = useTheme();
    const defaultCtrlColor = theme.palette.default.postCtrl;
    return (
    // This Pressable doesn't actually do anything other than
    // provide the "pressed state" visual feedback.
    _jsx(Pressable, { testID: props.testID, accessibilityRole: "button", accessibilityLabel: props.accessibilityLabel, accessibilityHint: props.accessibilityHint, style: ({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }], children: _jsx(DropdownMenu.Trigger, { action: "press", children: _jsx(View, { children: props.children ? (props.children) : (_jsx(FontAwesomeIcon, { icon: "ellipsis", size: 20, color: defaultCtrlColor })) }) }) }));
}, 'Trigger');
/**
 * @deprecated use Menu from `#/components/Menu.tsx` instead
 */
export const DropdownMenuItem = DropdownMenu.create((props) => {
    const theme = useTheme();
    const [focused, setFocused] = React.useState(false);
    const backgroundColor = theme.colorScheme === 'dark' ? '#fff1' : '#0001';
    return (_jsx(DropdownMenu.Item, { ...props, style: [styles.item, focused && { backgroundColor: backgroundColor }], onFocus: () => {
            setFocused(true);
            props.onFocus && props.onFocus();
        }, onBlur: () => {
            setFocused(false);
            props.onBlur && props.onBlur();
        } }));
}, 'Item');
/**
 * @deprecated use Menu from `#/components/Menu.tsx` instead
 */
export const DropdownMenuItemTitle = DropdownMenu.create((props) => {
    const pal = usePalette('default');
    return (_jsx(DropdownMenu.ItemTitle, { ...props, style: [props.style, pal.text, styles.itemTitle] }));
}, 'ItemTitle');
/**
 * @deprecated use Menu from `#/components/Menu.tsx` instead
 */
export const DropdownMenuItemIcon = DropdownMenu.create((props) => {
    return _jsx(DropdownMenu.ItemIcon, { ...props });
}, 'ItemIcon');
/**
 * @deprecated use Menu from `#/components/Menu.tsx` instead
 */
export const DropdownMenuSeparator = DropdownMenu.create((props) => {
    const pal = usePalette('default');
    const theme = useTheme();
    const { borderColor: separatorColor } = theme.colorScheme === 'dark' ? pal.borderDark : pal.border;
    return (_jsx(DropdownMenu.Separator, { ...props, style: [
            props.style,
            styles.separator,
            { backgroundColor: separatorColor },
        ] }));
}, 'Separator');
/**
 * The `NativeDropdown` function uses native iOS and Android dropdown menus.
 * It also creates a animated custom dropdown for web that uses
 * Radix UI primitives under the hood
 * @prop {DropdownItem[]} items - An array of dropdown items
 * @prop {React.ReactNode} children - A custom dropdown trigger
 *
 * @deprecated use Menu from `#/components/Menu.tsx` instead
 */
export function NativeDropdown({ items, children, testID, accessibilityLabel, accessibilityHint, }) {
    const pal = usePalette('default');
    const theme = useTheme();
    const [isOpen, setIsOpen] = React.useState(false);
    const dropDownBackgroundColor = theme.colorScheme === 'dark' ? pal.btn : pal.viewLight;
    return (_jsxs(_Fragment, { children: [isIOS && isOpen && (_jsx(Portal, { children: _jsx(Backdrop, {}) })), _jsxs(DropdownMenuRoot, { onOpenWillChange: setIsOpen, children: [_jsx(DropdownMenuTrigger, { action: "press", testID: testID, accessibilityLabel: accessibilityLabel, accessibilityHint: accessibilityHint, children: children }), _jsx(DropdownMenuContent, { style: [styles.content, dropDownBackgroundColor], loop: true, children: items.map((item, index) => {
                            if (item.label === 'separator') {
                                return (_jsx(DropdownMenuSeparator, {}, getKey(item.label, index, item.testID)));
                            }
                            if (index > 1 && items[index - 1].label === 'separator') {
                                return (_jsx(DropdownMenu.Group, { children: _jsxs(DropdownMenuItem, { onSelect: item.onPress, children: [_jsx(DropdownMenuItemTitle, { children: item.label }), item.icon && (_jsx(DropdownMenuItemIcon, { ios: item.icon.ios, children: _jsx(FontAwesomeIcon, { icon: item.icon.web, size: 20, style: [pal.text] }) }))] }, getKey(item.label, index, item.testID)) }, getKey(item.label, index, item.testID)));
                            }
                            return (_jsxs(DropdownMenuItem, { onSelect: item.onPress, children: [_jsx(DropdownMenuItemTitle, { children: item.label }), item.icon && (_jsx(DropdownMenuItemIcon, { ios: item.icon.ios, children: _jsx(FontAwesomeIcon, { icon: item.icon.web, size: 20, style: [pal.text] }) }))] }, getKey(item.label, index, item.testID)));
                        }) })] })] }));
}
function Backdrop() {
    // Not visible but it eats the click outside.
    // Only necessary for iOS.
    return (_jsx(Pressable, { accessibilityRole: "button", accessibilityLabel: "Dialog backdrop", accessibilityHint: "Press the backdrop to close the dialog", style: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            position: 'absolute',
        }, onPress: () => {
            /* noop */
        } }));
}
const getKey = (label, index, id) => {
    if (id) {
        return id;
    }
    return `${label}_${index}`;
};
const styles = StyleSheet.create({
    separator: {
        height: 1,
        marginVertical: 4,
    },
    content: {
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 4,
        marginTop: 6,
        ...Platform.select({
            web: {
                animationDuration: '400ms',
                animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                willChange: 'transform, opacity',
                animationKeyframes: {
                    '0%': { opacity: 0, transform: [{ scale: 0.5 }] },
                    '100%': { opacity: 1, transform: [{ scale: 1 }] },
                },
                boxShadow: '0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)',
                transformOrigin: 'var(--radix-dropdown-menu-content-transform-origin)',
            },
        }),
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        columnGap: 20,
        // @ts-ignore -web
        cursor: 'pointer',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    itemTitle: {
        fontSize: 18,
    },
});
//# sourceMappingURL=NativeDropdown.js.map