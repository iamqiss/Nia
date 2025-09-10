import React from 'react';
import { type ViewStyle } from 'react-native';
import { type IconProp } from '@fortawesome/fontawesome-svg-core';
import { DropdownMenu } from 'radix-ui';
import { type MenuItemCommonProps } from 'zeego/lib/typescript/menu';
export declare const DropdownMenuRoot: any;
export declare const DropdownMenuContent: any;
type ItemProps = React.ComponentProps<(typeof DropdownMenu)['Item']>;
export declare const DropdownMenuItem: (props: ItemProps & {
    testID?: string;
}) => any;
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
 * @deprecated use Menu from `#/components/Menu.tsx` instead
 */
export declare function NativeDropdown({ items, children, testID, accessibilityLabel, accessibilityHint, triggerStyle, }: React.PropsWithChildren<Props>): any;
export {};
//# sourceMappingURL=NativeDropdown.web.d.ts.map