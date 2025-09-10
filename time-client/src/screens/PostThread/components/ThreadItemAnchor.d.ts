import { type AppBskyFeedThreadgate } from '@atproto/api';
import { type ThreadItem } from '#/state/queries/usePostThread/types';
import { type OnPostSuccessData } from '#/state/shell/composer';
import { type PostSource } from '#/state/unstable-post-source';
export declare function ThreadItemAnchor({ item, onPostSuccess, threadgateRecord, postSource, }: {
    item: Extract<ThreadItem, {
        type: 'threadPost';
    }>;
    onPostSuccess?: (data: OnPostSuccessData) => void;
    threadgateRecord?: AppBskyFeedThreadgate.Record;
    postSource?: PostSource;
}): any;
export declare function ThreadItemAnchorSkeleton(): any;
//# sourceMappingURL=ThreadItemAnchor.d.ts.map