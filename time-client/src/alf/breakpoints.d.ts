export type Breakpoint = 'gtPhone' | 'gtMobile' | 'gtTablet';
export declare function useBreakpoints(): Record<Breakpoint, boolean> & {
    activeBreakpoint: Breakpoint | undefined;
};
/**
 * Fine-tuned breakpoints for the shell layout
 */
export declare function useLayoutBreakpoints(): {
    rightNavVisible: any;
    centerColumnOffset: any;
    leftNavMinimal: any;
};
//# sourceMappingURL=breakpoints.d.ts.map