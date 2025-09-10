export declare function retry<P>(retries: number, shouldRetry: (err: any) => boolean, action: () => Promise<P>, delay?: number): Promise<P>;
export declare function networkRetry<P>(retries: number, fn: () => Promise<P>): Promise<P>;
//# sourceMappingURL=retry.d.ts.map