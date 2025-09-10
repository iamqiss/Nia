export type Params = Record<string, string>;
export declare function parseSearchQuery(rawQuery: string): {
    query: string;
    params: Params;
};
export declare function makeSearchQuery(query: string, params: Params): string;
//# sourceMappingURL=utils.d.ts.map