import { type AppBskyNotificationListNotifications, type BskyAgent, type ModerationOpts } from '@atproto/api';
import { type QueryClient } from '@tanstack/react-query';
import { type FeedNotification, type FeedPage } from './types';
export declare function fetchPage({ agent, cursor, limit, queryClient, moderationOpts, fetchAdditionalData, reasons, }: {
    agent: BskyAgent;
    cursor: string | undefined;
    limit: number;
    queryClient: QueryClient;
    moderationOpts: ModerationOpts | undefined;
    fetchAdditionalData: boolean;
    reasons: string[];
}): Promise<{
    page: FeedPage;
    indexedAt: string | undefined;
}>;
export declare function shouldFilterNotif(notif: AppBskyNotificationListNotifications.Notification, moderationOpts: ModerationOpts | undefined): boolean;
export declare function groupNotifications(notifs: AppBskyNotificationListNotifications.Notification[]): FeedNotification[];
//# sourceMappingURL=util.d.ts.map