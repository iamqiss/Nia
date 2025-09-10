import { type AppNux, type Nux } from '#/state/queries/nuxs/definitions';
export { Nux } from '#/state/queries/nuxs/definitions';
export declare function useNuxs(): {
    nuxs: AppNux[];
    status: 'ready';
} | {
    nuxs: undefined;
    status: 'loading' | 'error';
};
export declare function useNux<T extends Nux>(id: T): {
    nux: Extract<AppNux, {
        id: T;
    }> | undefined;
    status: 'ready';
} | {
    nux: undefined;
    status: 'loading' | 'error';
};
export declare function useSaveNux(): any;
export declare function useResetNuxs(): any;
//# sourceMappingURL=index.d.ts.map