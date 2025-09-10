import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector, } from 'react-native-gesture-handler';
import Animated, { interpolate, runOnJS, runOnUI, useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming, } from 'react-native-reanimated';
import { useSafeAreaFrame, useSafeAreaInsets, } from 'react-native-safe-area-context';
import { useEventListener } from 'expo';
import {} from 'expo-video';
import { tokens } from '#/alf';
import { atoms as a } from '#/alf';
import { formatTime } from '#/components/Post/Embed/VideoEmbed/VideoEmbedInner/web-controls/utils';
import { Text } from '#/components/Typography';
// magic number that is roughly the min height of the write reply button
// we inset the video by this amount
export const VIDEO_PLAYER_BOTTOM_INSET = 57;
export function Scrubber({ active, player, seekingAnimationSV, scrollGesture, children, }) {
    const { width: screenWidth } = useSafeAreaFrame();
    const insets = useSafeAreaInsets();
    const currentTimeSV = useSharedValue(0);
    const durationSV = useSharedValue(0);
    const [currentSeekTime, setCurrentSeekTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const updateTime = (currentTime, duration) => {
        'worklet';
        currentTimeSV.set(currentTime);
        if (duration !== 0) {
            durationSV.set(duration);
        }
    };
    const isSeekingSV = useSharedValue(false);
    const seekProgressSV = useSharedValue(0);
    useAnimatedReaction(() => Math.round(seekProgressSV.get()), (progress, prevProgress) => {
        if (progress !== prevProgress) {
            runOnJS(setCurrentSeekTime)(progress);
        }
    });
    const seekBy = useCallback((time) => {
        player?.seekBy(time);
        setTimeout(() => {
            runOnUI(() => {
                'worklet';
                isSeekingSV.set(false);
                seekingAnimationSV.set(withTiming(0, { duration: 500 }));
            })();
        }, 50);
    }, [player, isSeekingSV, seekingAnimationSV]);
    const scrubPanGesture = useMemo(() => {
        return Gesture.Pan()
            .blocksExternalGesture(scrollGesture)
            .activeOffsetX([-10, 10])
            .failOffsetY([-10, 10])
            .onStart(() => {
            'worklet';
            seekProgressSV.set(currentTimeSV.get());
            isSeekingSV.set(true);
            seekingAnimationSV.set(withTiming(1, { duration: 500 }));
        })
            .onUpdate(evt => {
            'worklet';
            const progress = evt.x / screenWidth;
            seekProgressSV.set(clamp(progress * durationSV.get(), 0, durationSV.get()));
        })
            .onEnd(evt => {
            'worklet';
            isSeekingSV.get();
            const progress = evt.x / screenWidth;
            const newTime = clamp(progress * durationSV.get(), 0, durationSV.get());
            // optimisically set the progress bar
            seekProgressSV.set(newTime);
            // it's seek by, so offset by the current time
            // seekBy sets isSeekingSV back to false, so no need to do that here
            runOnJS(seekBy)(newTime - currentTimeSV.get());
        });
    }, [
        scrollGesture,
        seekingAnimationSV,
        seekBy,
        screenWidth,
        currentTimeSV,
        durationSV,
        isSeekingSV,
        seekProgressSV,
    ]);
    const timeStyle = useAnimatedStyle(() => {
        return {
            display: seekingAnimationSV.get() === 0 ? 'none' : 'flex',
            opacity: seekingAnimationSV.get(),
        };
    });
    const barStyle = useAnimatedStyle(() => {
        const currentTime = isSeekingSV.get()
            ? seekProgressSV.get()
            : currentTimeSV.get();
        const progress = currentTime === 0 ? 0 : currentTime / durationSV.get();
        const isSeeking = seekingAnimationSV.get();
        return {
            height: isSeeking * 3 + 1,
            opacity: interpolate(isSeeking, [0, 1], [0.4, 0.6]),
            width: `${progress * 100}%`,
        };
    });
    const trackStyle = useAnimatedStyle(() => {
        return {
            height: seekingAnimationSV.get() * 3 + 1,
        };
    });
    const childrenStyle = useAnimatedStyle(() => {
        return {
            opacity: 1 - seekingAnimationSV.get(),
        };
    });
    return (_jsxs(_Fragment, { children: [player && active && (_jsx(PlayerListener, { player: player, setDuration: setDuration, updateTime: updateTime })), _jsx(Animated.View, { style: [
                    a.absolute,
                    {
                        left: 0,
                        right: 0,
                        bottom: insets.bottom + 80,
                    },
                    timeStyle,
                ], pointerEvents: "none", children: _jsxs(Text, { style: [a.text_center, a.font_bold], children: [_jsx(Text, { style: [a.text_5xl, { fontVariant: ['tabular-nums'] }], children: formatTime(currentSeekTime) }), _jsx(Text, { style: [a.text_2xl, { opacity: 0.8 }], children: '  /  ' }), _jsx(Text, { style: [
                                a.text_5xl,
                                { opacity: 0.8 },
                                { fontVariant: ['tabular-nums'] },
                            ], children: formatTime(duration) })] }) }), _jsx(GestureDetector, { gesture: scrubPanGesture, children: _jsxs(View, { style: [
                        a.relative,
                        a.w_full,
                        a.justify_end,
                        {
                            paddingBottom: insets.bottom,
                            minHeight: 
                            // bottom padding
                            insets.bottom +
                                // scrubber height
                                tokens.space.lg +
                                // write reply height
                                VIDEO_PLAYER_BOTTOM_INSET,
                        },
                        a.z_10,
                    ], children: [_jsxs(View, { style: [a.w_full, a.relative], children: [_jsx(Animated.View, { style: [
                                        a.w_full,
                                        { backgroundColor: 'white', opacity: 0.2 },
                                        trackStyle,
                                    ] }), _jsx(Animated.View, { style: [
                                        a.absolute,
                                        { top: 0, left: 0, backgroundColor: 'white' },
                                        barStyle,
                                    ] })] }), _jsx(Animated.View, { style: [{ minHeight: VIDEO_PLAYER_BOTTOM_INSET }, childrenStyle], children: children })] }) })] }));
}
function PlayerListener({ player, setDuration, updateTime, }) {
    useEventListener(player, 'timeUpdate', evt => {
        const duration = player.duration;
        if (duration !== 0) {
            setDuration(Math.round(duration));
        }
        runOnUI(updateTime)(evt.currentTime, duration);
    });
    return null;
}
function clamp(num, min, max) {
    'worklet';
    return Math.min(Math.max(num, min), max);
}
//# sourceMappingURL=Scrubber.js.map