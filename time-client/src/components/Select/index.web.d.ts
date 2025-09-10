import { type ContentProps, type IconProps, type ItemIndicatorProps, type ItemProps, type RootProps, type TriggerProps, type ValueProps } from './types';
export declare function Root(props: RootProps): any;
export declare function Trigger({ children, label }: TriggerProps): any;
export declare function ValueText({ children: _, style, ...props }: ValueProps): any;
export declare function Icon({ style }: IconProps): any;
export declare function Content<T>({ items, renderItem }: ContentProps<T>): any;
export declare function useItemContext(): any;
export declare function Item({ ref, value, style, children }: ItemProps): any;
export declare const ItemText: any;
export declare function ItemIndicator({ icon: Icon }: ItemIndicatorProps): any;
//# sourceMappingURL=index.web.d.ts.map