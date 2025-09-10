type Gutter = 'compact' | 'base' | 'wide' | 0;
type Gutters = {
    paddingTop: number;
    paddingRight: number;
    paddingBottom: number;
    paddingLeft: number;
};
export declare function useGutters([all]: [Gutter]): Gutters;
export declare function useGutters([vertical, horizontal]: [Gutter, Gutter]): Gutters;
export declare function useGutters([top, right, bottom, left]: [
    Gutter,
    Gutter,
    Gutter,
    Gutter
]): Gutters;
export {};
//# sourceMappingURL=useGutters.d.ts.map