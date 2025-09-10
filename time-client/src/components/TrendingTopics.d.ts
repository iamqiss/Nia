import { type AtUri } from '@atproto/api';
import { type TrendingTopic } from '#/state/queries/trending/useTrendingTopics';
import { type ViewStyleProp } from '#/alf';
import { type LinkProps } from '#/components/Link';
export declare function TrendingTopic({ topic: raw, size, style, }: {
    topic: TrendingTopic;
    size?: 'large' | 'small';
} & ViewStyleProp): any;
export declare function TrendingTopicSkeleton({ size, index, }: {
    size?: 'large' | 'small';
    index?: number;
}): any;
export declare function TrendingTopicLink({ topic: raw, children, ...rest }: {
    topic: TrendingTopic;
} & Omit<LinkProps, 'to' | 'label'>): any;
type ParsedTrendingTopic = {
    type: 'topic' | 'tag' | 'starter-pack' | 'unknown';
    label: string;
    displayName: string;
    url: string;
    uri: undefined;
} | {
    type: 'profile' | 'feed';
    label: string;
    displayName: string;
    url: string;
    uri: AtUri;
};
export declare function useTopic(raw: TrendingTopic): ParsedTrendingTopic;
export {};
//# sourceMappingURL=TrendingTopics.d.ts.map