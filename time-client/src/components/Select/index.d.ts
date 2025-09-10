import { type ContentProps, type IconProps, type ItemIndicatorProps, type ItemProps, type ItemTextProps, type RootProps, type TriggerProps, type ValueProps } from './types';
export declare function Root({ children, value, onValueChange, disabled }: RootProps): any;
export declare function Trigger({ children, label }: TriggerProps): any;
export declare function ValueText({ placeholder, children, style, }: ValueProps): any;
export declare function Icon({}: IconProps): any;
export declare function Content<T>({ items, valueExtractor, ...props }: ContentProps<T>): any;
export declare function useItemContext(): any;
export declare function Item({ children, value, label, style }: ItemProps): any;
export declare function ItemText({ children }: ItemTextProps): any;
export declare function ItemIndicator({ icon: Icon }: ItemIndicatorProps): any;
//# sourceMappingURL=index.d.ts.map