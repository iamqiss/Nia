import { type AppBskyActorDefs } from '@atproto/api';
import { type QueryClient } from '@tanstack/react-query';
export type QueryProps = {
    category?: string | null;
    limit?: number;
    enabled?: boolean;
    overrideInterests?: string[];
};
export declare const getSuggestedUsersQueryKeyRoot = "unspecced-suggested-users";
export declare const createGetSuggestedUsersQueryKey: (props: QueryProps) => (string | number | null | undefined)[];
export declare function useGetSuggestedUsersQuery(props: QueryProps): any;
export declare function findAllProfilesInQueryData(queryClient: QueryClient, did: string): Generator<AppBskyActorDefs.ProfileView, void>;
//# sourceMappingURL=useGetSuggestedUsersQuery.d.ts.map