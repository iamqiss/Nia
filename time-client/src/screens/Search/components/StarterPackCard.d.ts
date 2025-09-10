import { type AppBskyGraphDefs } from '@atproto/api';
import * as bsky from '#/types/bsky';
export declare function StarterPackCard({ view, }: {
    view: AppBskyGraphDefs.StarterPackView;
}): any;
export declare function AvatarStack({ profiles, numPending, total, }: {
    profiles: bsky.profile.AnyProfileView[];
    numPending: number;
    total?: number;
}): any;
export declare function StarterPackCardSkeleton(): any;
//# sourceMappingURL=StarterPackCard.d.ts.map