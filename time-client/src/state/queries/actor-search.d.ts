import { type QueryClient } from '@tanstack/react-query';
export declare const RQKEY: (query: string) => string[];
export declare const RQKEY_ROOT_PAGINATED = "actor-search_paginated";
export declare const RQKEY_PAGINATED: (query: string, limit?: number) => (string | number | undefined)[];
export declare function useActorSearch({ query, enabled, }: {
    query: string;
    enabled?: boolean;
}): any;
export declare function useActorSearchPaginated({ query, enabled, maintainData, limit, }: {
    query: string;
    enabled?: boolean;
    maintainData?: boolean;
    limit?: number;
}): any;
export declare function findAllProfilesInQueryData(queryClient: QueryClient, did: string): Generator<any, void, unknown>;
//# sourceMappingURL=actor-search.d.ts.map