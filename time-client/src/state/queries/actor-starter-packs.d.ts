import { type QueryClient } from '@tanstack/react-query';
export declare const RQKEY_ROOT = "actor-starter-packs";
export declare const RQKEY_WITH_MEMBERSHIP_ROOT = "actor-starter-packs-with-membership";
export declare const RQKEY: (did?: string) => (string | undefined)[];
export declare const RQKEY_WITH_MEMBERSHIP: (did?: string) => (string | undefined)[];
export declare function useActorStarterPacksQuery({ did, enabled, }: {
    did?: string;
    enabled?: boolean;
}): any;
export declare function useActorStarterPacksWithMembershipsQuery({ did, enabled, }: {
    did?: string;
    enabled?: boolean;
}): any;
export declare function invalidateActorStarterPacksQuery({ queryClient, did, }: {
    queryClient: QueryClient;
    did: string;
}): Promise<void>;
export declare function invalidateActorStarterPacksWithMembershipQuery({ queryClient, did, }: {
    queryClient: QueryClient;
    did: string;
}): Promise<void>;
//# sourceMappingURL=actor-starter-packs.d.ts.map