/**
 * NOTE
 * The ./unread.ts API:
 *
 * - Provides a `checkUnread()` function to sync with the server,
 * - Periodically calls `checkUnread()`, and
 * - Caches the first page of notifications.
 *
 * IMPORTANT: This query uses ./unread.ts's cache as its first page,
 * IMPORTANT: which means the cache-freshness of this query is driven by the unread API.
 *
 * Follow these rules:
 *
 * 1. Call `checkUnread()` if you want to fetch latest in the background.
 * 2. Call `checkUnread({invalidate: true})` if you want latest to sync into this query's results immediately.
 * 3. Don't call this query's `refetch()` if you're trying to sync latest; call `checkUnread()` instead.
 */
import { type AppBskyActorDefs, AppBskyFeedDefs } from '@atproto/api';
import { type QueryClient } from '@tanstack/react-query';
export type { FeedNotification, FeedPage, NotificationType } from './types';
export declare function RQKEY(filter: 'all' | 'mentions'): string[];
export declare function useNotificationFeedQuery(opts: {
    enabled?: boolean;
    filter: 'all' | 'mentions';
}): any;
export declare function findAllPostsInQueryData(queryClient: QueryClient, uri: string): Generator<AppBskyFeedDefs.PostView, void>;
export declare function findAllProfilesInQueryData(queryClient: QueryClient, did: string): Generator<AppBskyActorDefs.ProfileViewBasic, void>;
//# sourceMappingURL=feed.d.ts.map