import { type StyleProp, type ViewStyle } from 'react-native';
import { type AppBskyFeedDefs, type ModerationDecision } from '@atproto/api';
export declare enum PostEmbedViewContext {
    ThreadHighlighted = "ThreadHighlighted",
    Feed = "Feed",
    FeedEmbedRecordWithMedia = "FeedEmbedRecordWithMedia"
}
export declare enum QuoteEmbedViewContext {
    FeedEmbedRecordWithMedia = "FeedEmbedRecordWithMedia"
}
export type CommonProps = {
    moderation?: ModerationDecision;
    onOpen?: () => void;
    style?: StyleProp<ViewStyle>;
    viewContext?: PostEmbedViewContext;
    isWithinQuote?: boolean;
    allowNestedQuotes?: boolean;
};
export type EmbedProps = CommonProps & {
    embed?: AppBskyFeedDefs.PostView['embed'];
};
//# sourceMappingURL=types.d.ts.map