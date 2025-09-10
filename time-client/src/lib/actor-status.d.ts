import { type AppBskyActorDefs } from '@atproto/api';
import type * as bsky from '#/types/bsky';
export declare function useActorStatus(actor?: bsky.profile.AnyProfileView): any;
export declare function isStatusStillActive(timeStr: string | undefined): any;
export declare function validateStatus(did: string, status: AppBskyActorDefs.StatusView, config: {
    did: string;
    domains: string[];
}[]): boolean;
//# sourceMappingURL=actor-status.d.ts.map