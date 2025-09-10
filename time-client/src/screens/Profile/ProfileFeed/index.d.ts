import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { type CommonNavigatorParams } from '#/lib/routes/types';
import { type FeedSourceFeedInfo } from '#/state/queries/feed';
import { type FeedParams } from '#/state/queries/post-feed';
import { type UsePreferencesQueryResponse } from '#/state/queries/preferences';
type Props = NativeStackScreenProps<CommonNavigatorParams, 'ProfileFeed'>;
export declare function ProfileFeedScreen(props: Props): any;
export declare function ProfileFeedScreenInner({ feedInfo, feedParams, }: {
    preferences: UsePreferencesQueryResponse;
    feedInfo: FeedSourceFeedInfo;
    feedParams: FeedParams | undefined;
}): any;
export {};
//# sourceMappingURL=index.d.ts.map