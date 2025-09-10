import { type NativeGesture } from 'react-native-gesture-handler';
import { type SharedValue } from 'react-native-reanimated';
import { type VideoPlayer } from 'expo-video';
export declare const VIDEO_PLAYER_BOTTOM_INSET = 57;
export declare function Scrubber({ active, player, seekingAnimationSV, scrollGesture, children, }: {
    active: boolean;
    player?: VideoPlayer;
    seekingAnimationSV: SharedValue<number>;
    scrollGesture: NativeGesture;
    children?: React.ReactNode;
}): any;
//# sourceMappingURL=Scrubber.d.ts.map