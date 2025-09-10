import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Pressable, StyleSheet, Text, } from 'react-native';
import {} from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { DropdownMenu } from 'radix-ui';
import {} from 'zeego/lib/typescript/menu';
import { HITSLOP_10 } from '#/lib/constants';
import { usePalette } from '#/lib/hooks/usePalette';
import { useTheme } from '#/lib/ThemeContext';
// Custom Dropdown Menu Components
// ==
export const DropdownMenuRoot = DropdownMenu.Root;
export const DropdownMenuContent = DropdownMenu.Content;
export const DropdownMenuItem = (props) => {
    const theme = useTheme();
    const [focused, setFocused] = React.useState(false);
    const backgroundColor = theme.colorScheme === 'dark' ? '#fff1' : '#0001';
    return (_jsx(DropdownMenu.Item, { className: "nativeDropdown-item", ...props, style: StyleSheet.flatten([
            styles.item,
            focused && { backgroundColor: backgroundColor },
        ]), onFocus: () => {
            setFocused(true);
        }, onBlur: () => {
            setFocused(false);
        } }));
};
/**
 * @deprecated use Menu from `#/components/Menu.tsx` instead
 */
export function NativeDropdown({ items, children, testID, accessibilityLabel, accessibilityHint, triggerStyle, }) {
    const [open, setOpen] = React.useState(false);
    const buttonRef = React.useRef(null);
    const menuRef = React.useRef(null);
    React.useEffect(() => {
        if (!open) {
            return;
        }
        function clickHandler(e) {
            const t = e.target;
            if (!open)
                return;
            if (!t)
                return;
            if (!buttonRef.current || !menuRef.current)
                return;
            if (t !== buttonRef.current &&
                !buttonRef.current.contains(t) &&
                t !== menuRef.current &&
                !menuRef.current.contains(t)) {
                // prevent clicking through to links beneath dropdown
                // only applies to mobile web
                e.preventDefault();
                e.stopPropagation();
                // close menu
                setOpen(false);
            }
        }
        function keydownHandler(e) {
            if (e.key === 'Escape' && open) {
                setOpen(false);
            }
        }
        document.addEventListener('click', clickHandler, true);
        window.addEventListener('keydown', keydownHandler, true);
        return () => {
            document.removeEventListener('click', clickHandler, true);
            window.removeEventListener('keydown', keydownHandler, true);
        };
    }, [open, setOpen]);
    return (_jsxs(DropdownMenuRoot, { open: open, onOpenChange: o => setOpen(o), children: [_jsx(DropdownMenu.Trigger, { asChild: true, children: _jsx(Pressable, { ref: buttonRef, testID: testID, accessibilityRole: "button", accessibilityLabel: accessibilityLabel, accessibilityHint: accessibilityHint, onPointerDown: e => {
                        // Prevent false positive that interpret mobile scroll as a tap.
                        // This requires the custom onPress handler below to compensate.
                        // https://github.com/radix-ui/primitives/issues/1912
                        e.preventDefault();
                    }, onPress: () => {
                        if (window.event instanceof KeyboardEvent) {
                            // The onPointerDown hack above is not relevant to this press, so don't do anything.
                            return;
                        }
                        // Compensate for the disabled onPointerDown above by triggering it manually.
                        setOpen(o => !o);
                    }, hitSlop: HITSLOP_10, style: triggerStyle, children: children }) }), _jsx(DropdownMenu.Portal, { children: _jsx(DropdownContent, { items: items, menuRef: menuRef }) })] }));
}
function DropdownContent({ items, menuRef, }) {
    const pal = usePalette('default');
    const theme = useTheme();
    const dropDownBackgroundColor = theme.colorScheme === 'dark' ? pal.btn : pal.view;
    const { borderColor: separatorColor } = theme.colorScheme === 'dark' ? pal.borderDark : pal.border;
    return (_jsx(DropdownMenu.Content, { ref: menuRef, style: StyleSheet.flatten([
            styles.content,
            dropDownBackgroundColor,
        ]), loop: true, children: items.map((item, index) => {
            if (item.label === 'separator') {
                return (_jsx(DropdownMenu.Separator, { style: StyleSheet.flatten([
                        styles.separator,
                        { backgroundColor: separatorColor },
                    ]) }, getKey(item.label, index, item.testID)));
            }
            if (index > 1 && items[index - 1].label === 'separator') {
                return (_jsx(DropdownMenu.Group, { children: _jsxs(DropdownMenuItem, { onSelect: item.onPress, children: [_jsx(Text, { selectable: false, style: [pal.text, styles.itemTitle], children: item.label }), item.icon && (_jsx(FontAwesomeIcon, { icon: item.icon.web, size: 20, color: pal.colors.textLight }))] }, getKey(item.label, index, item.testID)) }, getKey(item.label, index, item.testID)));
            }
            return (_jsxs(DropdownMenuItem, { onSelect: item.onPress, children: [_jsx(Text, { selectable: false, style: [pal.text, styles.itemTitle], children: item.label }), item.icon && (_jsx(FontAwesomeIcon, { icon: item.icon.web, size: 20, color: pal.colors.textLight }))] }, getKey(item.label, index, item.testID)));
        }) }));
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
        marginTop: 4,
        marginBottom: 4,
    },
    content: {
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 4,
        paddingRight: 4,
        marginTop: 6,
        // @ts-ignore web only -prf
        boxShadow: 'rgba(0, 0, 0, 0.3) 0px 5px 20px',
    },
    item: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        columnGap: 20,
        cursor: 'pointer',
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: 8,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Liberation Sans", Helvetica, Arial, sans-serif',
        // @ts-expect-error web only
        outline: 0,
        border: 0,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        paddingRight: 10,
    },
});
//# sourceMappingURL=NativeDropdown.web.js.map