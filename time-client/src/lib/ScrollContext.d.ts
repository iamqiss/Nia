import { type ScrollHandlers } from 'react-native-reanimated';
export declare function useScrollHandlers(): ScrollHandlers<any>;
type ProviderProps = {
    children: React.ReactNode;
} & ScrollHandlers<any>;
export declare function ScrollProvider({ children, onBeginDrag, onEndDrag, onScroll, onMomentumEnd, }: ProviderProps): any;
export {};
//# sourceMappingURL=ScrollContext.d.ts.map