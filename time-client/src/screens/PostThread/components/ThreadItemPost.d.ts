import { type AppBskyFeedThreadgate } from '@atproto/api';
import { type ThreadItem } from '#/state/queries/usePostThread/types';
import { type OnPostSuccessData } from '#/state/shell/composer';
export type ThreadItemPostProps = {
    item: Extract<ThreadItem, {
        type: 'threadPost';
    }>;
    overrides?: {
        moderation?: boolean;
        topBorder?: boolean;
    };
    onPostSuccess?: (data: OnPostSuccessData) => void;
    threadgateRecord?: AppBskyFeedThreadgate.Record;
};
export declare function ThreadItemPost({ item, overrides, onPostSuccess, threadgateRecord, }: ThreadItemPostProps): any;
export declare function ThreadItemPostSkeleton({ index }: {
    index: number;
}): any;
//# sourceMappingURL=ThreadItemPost.d.ts.map