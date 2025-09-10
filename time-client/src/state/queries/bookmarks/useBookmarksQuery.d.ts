import { type AppBskyFeedDefs } from '@atproto/api';
import { type QueryClient } from '@tanstack/react-query';
export declare const bookmarksQueryKeyRoot = "bookmarks";
export declare const createBookmarksQueryKey: () => string[];
export declare function useBookmarksQuery(): any;
export declare function truncateAndInvalidate(qc: QueryClient): Promise<any>;
export declare function optimisticallySaveBookmark(qc: QueryClient, post: AppBskyFeedDefs.PostView): Promise<void>;
export declare function optimisticallyDeleteBookmark(qc: QueryClient, { uri }: {
    uri: string;
}): Promise<void>;
//# sourceMappingURL=useBookmarksQuery.d.ts.map