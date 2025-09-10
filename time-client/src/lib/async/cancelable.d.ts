export declare function cancelable<A, T>(f: (args: A) => Promise<T>, signal: AbortSignal): (args: A) => Promise<T>;
export declare class AbortError extends Error {
    constructor();
}
//# sourceMappingURL=cancelable.d.ts.map