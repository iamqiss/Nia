import { type GlobalGestureEvents } from '#/state/global-gesture-events';
/**
 * Listen for global gesture events. Callback should be wrapped with
 * `useCallback` or otherwise memoized to avoid unnecessary re-renders.
 */
export declare function useOnGesture(onGestureCallback: (e: GlobalGestureEvents['begin']) => void): void;
//# sourceMappingURL=index.d.ts.map