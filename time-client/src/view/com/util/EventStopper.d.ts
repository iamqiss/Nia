import { type ViewStyle } from 'react-native';
/**
 * This utility function captures events and stops
 * them from propagating upwards.
 */
export declare function EventStopper({ children, style, onKeyDown, }: React.PropsWithChildren<{
    style?: ViewStyle | ViewStyle[];
    /**
     * Default `true`. Set to `false` to allow onKeyDown to propagate
     */
    onKeyDown?: boolean;
}>): any;
//# sourceMappingURL=EventStopper.d.ts.map