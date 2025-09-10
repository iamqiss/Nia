import { type Insets } from 'react-native';
import { type AppBskyFeedDefs, type AppBskyFeedPost, type AppBskyFeedThreadgate, type RichText as RichTextAPI } from '@atproto/api';
import { type Shadow } from '#/state/cache/post-shadow';
declare let PostMenuButton: ({ testID, post, postFeedContext, postReqId, big, record, richText, timestamp, threadgateRecord, onShowLess, hitSlop, }: {
    testID: string;
    post: Shadow<AppBskyFeedDefs.PostView>;
    postFeedContext: string | undefined;
    postReqId: string | undefined;
    big?: boolean;
    record: AppBskyFeedPost.Record;
    richText: RichTextAPI;
    timestamp: string;
    threadgateRecord?: AppBskyFeedThreadgate.Record;
    onShowLess?: (interaction: AppBskyFeedDefs.Interaction) => void;
    hitSlop?: Insets;
}) => React.ReactNode;
export { PostMenuButton };
//# sourceMappingURL=index.d.ts.map