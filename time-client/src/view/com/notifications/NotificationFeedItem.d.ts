import { type ModerationOpts } from '@atproto/api';
import { type FeedNotification } from '#/state/queries/notifications/feed';
declare let NotificationFeedItem: ({ item, moderationOpts, highlightUnread, hideTopBorder, }: {
    item: FeedNotification;
    moderationOpts: ModerationOpts;
    highlightUnread: boolean;
    hideTopBorder?: boolean;
}) => React.ReactNode;
export { NotificationFeedItem };
//# sourceMappingURL=NotificationFeedItem.d.ts.map