import { type StyleProp, type ViewStyle } from 'react-native';
import { type AppBskyFeedDefs } from '@atproto/api';
interface WhoCanReplyProps {
    post: AppBskyFeedDefs.PostView;
    isThreadAuthor: boolean;
    style?: StyleProp<ViewStyle>;
}
export declare function WhoCanReply({ post, isThreadAuthor, style }: WhoCanReplyProps): any;
export {};
//# sourceMappingURL=WhoCanReply.d.ts.map