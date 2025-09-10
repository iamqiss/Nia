import { type AppBskyActorDefs, type BskyAgent } from '@atproto/api';
import { type QueryClient } from '@tanstack/react-query';
export declare const RQKEY: (uri: string) => string[];
export declare const RQKEY_ALL: (uri: string) => string[];
export declare function useListMembersQuery(uri?: string, limit?: number): any;
export declare function useAllListMembersQuery(uri?: string): any;
export declare function getAllListMembers(agent: BskyAgent, uri: string): Promise<AppBskyGraphDefs.ListItemView[]>;
export declare function invalidateListMembersQuery({ queryClient, uri, }: {
    queryClient: QueryClient;
    uri: string;
}): Promise<void>;
export declare function findAllProfilesInQueryData(queryClient: QueryClient, did: string): Generator<AppBskyActorDefs.ProfileView, void>;
//# sourceMappingURL=list-members.d.ts.map