import { type StyleProp, type ViewStyle } from 'react-native';
import { type AppBskyFeedDefs, type AppBskyFeedPost, type AppBskyFeedThreadgate, type RichText as RichTextAPI } from '@atproto/api';
import { type Shadow } from '#/state/cache/types';
declare let PostControls: ({ big, post, record, richText, feedContext, reqId, style, onPressReply, onPostReply, logContext, threadgateRecord, onShowLess, viaRepost, variant, }: {
    big?: boolean;
    post: Shadow<AppBskyFeedDefs.PostView>;
    record: AppBskyFeedPost.Record;
    richText: RichTextAPI;
    feedContext?: string | undefined;
    reqId?: string | undefined;
    style?: StyleProp<ViewStyle>;
    onPressReply: () => void;
    onPostReply?: (postUri: string | undefined) => void;
    logContext: "FeedItem" | "PostThreadItem" | "Post" | "ImmersiveVideo";
    threadgateRecord?: AppBskyFeedThreadgate.Record;
    onShowLess?: (interaction: AppBskyFeedDefs.Interaction) => void;
    viaRepost?: {
        uri: string;
        cid: string;
    };
    variant?: "compact" | "normal" | "large";
}) => React.ReactNode;
export { PostControls };
//# sourceMappingURL=index.d.ts.map