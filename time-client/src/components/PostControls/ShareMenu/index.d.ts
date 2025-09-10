import { type Insets } from 'react-native';
import { type AppBskyFeedDefs, type AppBskyFeedPost, type AppBskyFeedThreadgate, type RichText as RichTextAPI } from '@atproto/api';
import { type Shadow } from '#/state/cache/post-shadow';
declare let ShareMenuButton: ({ testID, post, big, record, richText, timestamp, threadgateRecord, onShare, hitSlop, }: {
    testID: string;
    post: Shadow<AppBskyFeedDefs.PostView>;
    big?: boolean;
    record: AppBskyFeedPost.Record;
    richText: RichTextAPI;
    timestamp: string;
    threadgateRecord?: AppBskyFeedThreadgate.Record;
    onShare: () => void;
    hitSlop?: Insets;
}) => React.ReactNode;
export { ShareMenuButton };
//# sourceMappingURL=index.d.ts.map