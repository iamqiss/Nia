export declare function choose<U, T extends Record<string, U>>(value: keyof T, choices: T): U;
export declare function dedupArray<T>(arr: T[]): T[];
/**
 * Taken from @tanstack/query-core utils.ts
 * Modified to support Date object comparisons
 *
 * This function returns `a` if `b` is deeply equal.
 * If not, it will replace any deeply equal children of `b` with those of `a`.
 * This can be used for structural sharing between JSON values for example.
 */
export declare function replaceEqualDeep(a: any, b: any): any;
export declare function isPlainArray(value: unknown): boolean;
export declare function isPlainObject(o: any): o is Object;
//# sourceMappingURL=functions.d.ts.map