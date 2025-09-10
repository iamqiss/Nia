import { type StyleProp, type ViewStyle } from 'react-native';
import { type AnimatedStyle } from 'react-native-reanimated';
import { type AppBskyFeedPostgate } from '@atproto/api';
import { type ThreadgateAllowUISetting } from '#/state/queries/threadgate';
export declare function ThreadgateBtn({ postgate, onChangePostgate, threadgateAllowUISettings, onChangeThreadgateAllowUISettings, }: {
    postgate: AppBskyFeedPostgate.Record;
    onChangePostgate: (v: AppBskyFeedPostgate.Record) => void;
    threadgateAllowUISettings: ThreadgateAllowUISetting[];
    onChangeThreadgateAllowUISettings: (v: ThreadgateAllowUISetting[]) => void;
    style?: StyleProp<AnimatedStyle<ViewStyle>>;
}): any;
//# sourceMappingURL=ThreadgateBtn.d.ts.map