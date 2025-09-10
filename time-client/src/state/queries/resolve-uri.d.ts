import { type QueryClient, type UseQueryResult } from '@tanstack/react-query';
export declare const RQKEY: (didOrHandle: string) => string[];
type UriUseQueryResult = UseQueryResult<{
    did: string;
    uri: string;
}, Error>;
export declare function useResolveUriQuery(uri: string | undefined): UriUseQueryResult;
export declare function useResolveDidQuery(didOrHandle: string | undefined): any;
export declare function precacheResolvedUri(queryClient: QueryClient, handle: string, did: string): void;
export {};
//# sourceMappingURL=resolve-uri.d.ts.map