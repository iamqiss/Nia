import { type AppBskyActorDefs, type AppBskyFeedDefs, type ModerationDecision } from '@atproto/api';
import { type VideoFeedSourceContext } from '#/screens/VideoFeed/types';
export declare function VideoPostCard({ post, sourceContext, moderation, onInteract, }: {
    post: AppBskyFeedDefs.PostView;
    sourceContext: VideoFeedSourceContext;
    moderation: ModerationDecision;
    /**
     * Callback for metrics etc
     */
    onInteract?: () => void;
}): any;
export declare function VideoPostCardPlaceholder(): any;
export declare function VideoPostCardTextPlaceholder({ author, }: {
    author?: AppBskyActorDefs.ProfileViewBasic;
}): any;
export declare function CompactVideoPostCard({ post, sourceContext, moderation, onInteract, }: {
    post: AppBskyFeedDefs.PostView;
    sourceContext: VideoFeedSourceContext;
    moderation: ModerationDecision;
    /**
     * Callback for metrics etc
     */
    onInteract?: () => void;
}): any;
export declare function CompactVideoPostCardPlaceholder(): any;
//# sourceMappingURL=VideoPostCard.d.ts.map