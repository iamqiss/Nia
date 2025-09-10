import { type FeedDescriptor } from '#/state/queries/post-feed';
import type * as bsky from '#/types/bsky';
export declare function SuggestedFollowPlaceholder(): any;
export declare function SuggestedFeedsCardPlaceholder(): any;
export declare function SuggestedFollows({ feed }: {
    feed: FeedDescriptor;
}): any;
export declare function SuggestedFollowsProfile({ did }: {
    did: string;
}): any;
export declare function SuggestedFollowsHome(): any;
export declare function ProfileGrid({ isSuggestionsLoading, error, profiles, recId, viewContext, }: {
    isSuggestionsLoading: boolean;
    profiles: bsky.profile.AnyProfileView[];
    recId?: number;
    error: Error | null;
    viewContext: 'profile' | 'profileHeader' | 'feed';
}): any;
export declare function SuggestedFeeds(): any;
export declare function ProgressGuide(): any;
//# sourceMappingURL=FeedInterstitials.d.ts.map