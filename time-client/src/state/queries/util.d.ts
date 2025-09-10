import { type AppBskyActorDefs, AppBskyEmbedRecord, type AppBskyFeedDefs, type AtUri } from '@atproto/api';
import { type QueryClient, type QueryKey } from '@tanstack/react-query';
export declare function truncateAndInvalidate<T = any>(queryClient: QueryClient, queryKey: QueryKey): Promise<any>;
export declare function didOrHandleUriMatches(atUri: AtUri, record: {
    uri: string;
    author: AppBskyActorDefs.ProfileViewBasic;
}): boolean;
export declare function getEmbeddedPost(v: unknown): AppBskyEmbedRecord.ViewRecord | undefined;
export declare function embedViewRecordToPostView(v: AppBskyEmbedRecord.ViewRecord): AppBskyFeedDefs.PostView;
//# sourceMappingURL=util.d.ts.map