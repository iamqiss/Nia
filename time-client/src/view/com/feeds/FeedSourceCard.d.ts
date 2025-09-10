import { type StyleProp, type ViewStyle } from 'react-native';
import { type $Typed, AppBskyFeedDefs, type AppBskyGraphDefs } from '@atproto/api';
import { type FeedSourceInfo } from '#/state/queries/feed';
type FeedSourceCardProps = {
    feedUri: string;
    feedData?: $Typed<AppBskyFeedDefs.GeneratorView> | $Typed<AppBskyGraphDefs.ListView>;
    style?: StyleProp<ViewStyle>;
    showSaveBtn?: boolean;
    showDescription?: boolean;
    showLikes?: boolean;
    pinOnSave?: boolean;
    showMinimalPlaceholder?: boolean;
    hideTopBorder?: boolean;
    link?: boolean;
};
export declare function FeedSourceCard({ feedUri, feedData, ...props }: FeedSourceCardProps): any;
export declare function FeedSourceCardWithoutData({ feedUri, ...props }: Omit<FeedSourceCardProps, 'feedData'>): any;
export declare function FeedSourceCardLoaded({ feedUri, feed, style, showDescription, showLikes, showMinimalPlaceholder, hideTopBorder, link, error, }: {
    feedUri: string;
    feed?: FeedSourceInfo;
    style?: StyleProp<ViewStyle>;
    showDescription?: boolean;
    showLikes?: boolean;
    showMinimalPlaceholder?: boolean;
    hideTopBorder?: boolean;
    link?: boolean;
    error?: unknown;
}): any;
export {};
//# sourceMappingURL=FeedSourceCard.d.ts.map