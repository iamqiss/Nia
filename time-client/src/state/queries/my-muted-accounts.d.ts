import { type AppBskyActorDefs } from '@atproto/api';
import { type QueryClient } from '@tanstack/react-query';
export declare const RQKEY: () => string[];
export declare function useMyMutedAccountsQuery(): any;
export declare function findAllProfilesInQueryData(queryClient: QueryClient, did: string): Generator<AppBskyActorDefs.ProfileView, void>;
//# sourceMappingURL=my-muted-accounts.d.ts.map