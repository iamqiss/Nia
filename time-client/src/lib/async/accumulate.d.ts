export interface AccumulateResponse<T> {
    cursor?: string;
    items: T[];
}
export type AccumulateFetchFn<T> = (cursor: string | undefined) => Promise<AccumulateResponse<T>>;
export declare function accumulate<T>(fn: AccumulateFetchFn<T>, pageLimit?: number): Promise<T[]>;
//# sourceMappingURL=accumulate.d.ts.map