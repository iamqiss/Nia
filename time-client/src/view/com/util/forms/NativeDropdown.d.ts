import React from 'react';
import { type ViewStyle } from 'react-native';
import { type IconProp } from '@fortawesome/fontawesome-svg-core';
import { type MenuItemCommonProps } from 'zeego/lib/typescript/menu';
/**
 * @deprecated use Menu from `#/components/Menu.tsx` instead
 */
export declare const DropdownMenuRoot: any;
/**
 * @deprecated use Menu from `#/components/Menu.tsx` instead
 */
export declare const DropdownMenuContent: any;
/**
 * @deprecated use Menu from `#/components/Menu.tsx` instead
 */
export declare const DropdownMenuTrigger: any;
/**
 * @deprecated use Menu from `#/components/Menu.tsx` instead
 */
export declare const DropdownMenuItem: any;
/**
 * @deprecated use Menu from `#/components/Menu.tsx` instead
 */
export declare const DropdownMenuItemTitle: any;
/**
 * @deprecated use Menu from `#/components/Menu.tsx` instead
 */
export declare const DropdownMenuItemIcon: any;
/**
 * @deprecated use Menu from `#/components/Menu.tsx` instead
 */
export declare const DropdownMenuSeparator: any;
export type DropdownItem = {
    label: string | 'separator';
    onPress?: () => void;
    testID?: string;
    icon?: {
        ios: MenuItemCommonProps['ios'];
        android: string;
        web: IconProp;
    };
};
type Props = {
    items: DropdownItem[];
    testID?: string;
    accessibilityLabel?: string;
    accessibilityHint?: string;
    triggerStyle?: ViewStyle;
};
/**
 * The `NativeDropdown` function uses native iOS and Android dropdown menus.
 * It also creates a animated custom dropdown for web that uses
 * Radix UI primitives under the hood
 * @prop {DropdownItem[]} items - An array of dropdown items
 * @prop {React.ReactNode} children - A custom dropdown trigger
 *
 * @deprecated use Menu from `#/components/Menu.tsx` instead
 */
export declare function NativeDropdown({ items, children, testID, accessibilityLabel, accessibilityHint, }: React.PropsWithChildren<Props>): any;
export {};
//# sourceMappingURL=NativeDropdown.d.ts.map