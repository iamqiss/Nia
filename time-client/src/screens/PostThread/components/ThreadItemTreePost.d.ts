import { type AppBskyFeedThreadgate } from '@atproto/api';
import { type ThreadItem } from '#/state/queries/usePostThread/types';
import { type OnPostSuccessData } from '#/state/shell/composer';
export declare function ThreadItemTreePost({ item, overrides, onPostSuccess, threadgateRecord, }: {
    item: Extract<ThreadItem, {
        type: 'threadPost';
    }>;
    overrides?: {
        moderation?: boolean;
        topBorder?: boolean;
    };
    onPostSuccess?: (data: OnPostSuccessData) => void;
    threadgateRecord?: AppBskyFeedThreadgate.Record;
}): any;
export declare function ThreadItemTreePostSkeleton({ index }: {
    index: number;
}): any;
//# sourceMappingURL=ThreadItemTreePost.d.ts.map