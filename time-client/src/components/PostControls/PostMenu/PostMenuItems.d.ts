import { type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { type AppBskyFeedDefs, AppBskyFeedPost, type AppBskyFeedThreadgate, type RichText as RichTextAPI } from '@atproto/api';
import { type Shadow } from '#/state/cache/post-shadow';
declare let PostMenuItems: ({ post, postFeedContext, postReqId, record, richText, threadgateRecord, onShowLess, }: {
    testID: string;
    post: Shadow<AppBskyFeedDefs.PostView>;
    postFeedContext: string | undefined;
    postReqId: string | undefined;
    record: AppBskyFeedPost.Record;
    richText: RichTextAPI;
    style?: StyleProp<ViewStyle>;
    hitSlop?: PressableProps["hitSlop"];
    size?: "lg" | "md" | "sm";
    timestamp: string;
    threadgateRecord?: AppBskyFeedThreadgate.Record;
    onShowLess?: (interaction: AppBskyFeedDefs.Interaction) => void;
}) => React.ReactNode;
export { PostMenuItems };
//# sourceMappingURL=PostMenuItems.d.ts.map