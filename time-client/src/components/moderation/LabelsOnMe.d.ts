import { type StyleProp, type ViewStyle } from 'react-native';
import { type AppBskyFeedDefs, type ComAtprotoLabelDefs } from '@atproto/api';
import { type ButtonSize } from '#/components/Button';
export declare function LabelsOnMe({ type, labels, size, style, }: {
    type: 'account' | 'content';
    labels: ComAtprotoLabelDefs.Label[] | undefined;
    size?: ButtonSize;
    style?: StyleProp<ViewStyle>;
}): any;
export declare function LabelsOnMyPost({ post, style, }: {
    post: AppBskyFeedDefs.PostView;
    style?: StyleProp<ViewStyle>;
}): any;
//# sourceMappingURL=LabelsOnMe.d.ts.map