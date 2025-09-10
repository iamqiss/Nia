import { type AppBskyUnspeccedDefs } from '@atproto/api';
import { type ViewStyleProp } from '#/alf';
export declare function ExploreTrendingTopics(): any;
export declare function TrendRow({ trend, rank, children, onPress, }: ViewStyleProp & {
    trend: AppBskyUnspeccedDefs.TrendView;
    rank: number;
    children?: React.ReactNode;
    onPress?: () => void;
}): any;
export declare function TrendingTopicRowSkeleton({}: {
    withPosts: boolean;
}): any;
//# sourceMappingURL=ExploreTrendingTopics.d.ts.map