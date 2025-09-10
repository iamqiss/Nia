import { type QueryClient } from '@tanstack/react-query';
export type MyListsFilter = 'all' | 'curate' | 'mod' | 'all-including-subscribed';
export declare const RQKEY: (filter: MyListsFilter) => string[];
export declare function useMyListsQuery(filter: MyListsFilter): any;
export declare function invalidate(qc: QueryClient, filter?: MyListsFilter): void;
//# sourceMappingURL=my-lists.d.ts.map