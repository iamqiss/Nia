type BundledFn<Args extends readonly unknown[], Res> = (...args: Args) => Promise<Res>;
/**
 * A helper which ensures that multiple calls to an async function
 * only produces one in-flight request at a time.
 */
export declare function bundleAsync<Args extends readonly unknown[], Res>(fn: BundledFn<Args, Res>): BundledFn<Args, Res>;
export {};
//# sourceMappingURL=bundle.d.ts.map