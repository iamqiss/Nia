import { type AppBskyActorDefs } from '@atproto/api';
import { type QueryClient } from '@tanstack/react-query';
export declare const RQKEY_getActivitySubscriptions: string[];
export declare const RQKEY_getNotificationDeclaration: string[];
export declare function useActivitySubscriptionsQuery(): any;
export declare function useNotificationDeclarationQuery(): any;
export declare function useNotificationDeclarationMutation(): any;
export declare function findAllProfilesInQueryData(queryClient: QueryClient, did: string): Generator<AppBskyActorDefs.ProfileView, void>;
//# sourceMappingURL=activity-subscriptions.d.ts.map