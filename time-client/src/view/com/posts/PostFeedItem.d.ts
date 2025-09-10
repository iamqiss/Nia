import { type AppBskyActorDefs, AppBskyFeedDefs, AppBskyFeedPost, type ModerationDecision } from '@atproto/api';
import { type ReasonFeedSource } from '#/lib/api/feed/types';
interface FeedItemProps {
    record: AppBskyFeedPost.Record;
    reason: AppBskyFeedDefs.ReasonRepost | AppBskyFeedDefs.ReasonPin | ReasonFeedSource | {
        [k: string]: unknown;
        $type: string;
    } | undefined;
    moderation: ModerationDecision;
    parentAuthor: AppBskyActorDefs.ProfileViewBasic | undefined;
    showReplyTo: boolean;
    isThreadChild?: boolean;
    isThreadLastChild?: boolean;
    isThreadParent?: boolean;
    feedContext: string | undefined;
    reqId: string | undefined;
    hideTopBorder?: boolean;
    isParentBlocked?: boolean;
    isParentNotFound?: boolean;
}
export declare function PostFeedItem({ post, record, reason, feedContext, reqId, moderation, parentAuthor, showReplyTo, isThreadChild, isThreadLastChild, isThreadParent, hideTopBorder, isParentBlocked, isParentNotFound, rootPost, onShowLess, }: FeedItemProps & {
    post: AppBskyFeedDefs.PostView;
    rootPost: AppBskyFeedDefs.PostView;
    onShowLess?: (interaction: AppBskyFeedDefs.Interaction) => void;
}): React.ReactNode;
export {};
//# sourceMappingURL=PostFeedItem.d.ts.map