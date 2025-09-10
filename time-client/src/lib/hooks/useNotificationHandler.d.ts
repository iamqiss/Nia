import * as Notifications from 'expo-notifications';
export type NotificationReason = 'like' | 'repost' | 'follow' | 'mention' | 'reply' | 'quote' | 'chat-message' | 'starterpack-joined' | 'like-via-repost' | 'repost-via-repost' | 'verified' | 'unverified' | 'subscribed-post';
/**
 * Manually overridden type, but retains the possibility of
 * `notification.request.trigger.payload` being `undefined`, as specified in
 * the source types.
 */
export type NotificationPayload = undefined | {
    reason: Exclude<NotificationReason, 'chat-message'>;
    uri: string;
    subject: string;
    recipientDid: string;
} | {
    reason: 'chat-message';
    convoId: string;
    messageId: string;
    recipientDid: string;
};
export declare function useNotificationsHandler(): void;
export declare function storePayloadForAccountSwitch(payload: NotificationPayload): void;
export declare function getNotificationPayload(e: Notifications.Notification): NotificationPayload | null;
export declare function notificationToURL(payload: NotificationPayload): string | null;
//# sourceMappingURL=useNotificationHandler.d.ts.map