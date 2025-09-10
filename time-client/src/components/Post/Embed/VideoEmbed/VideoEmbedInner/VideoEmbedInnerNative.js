import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useImperativeHandle, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import {} from '@atproto/api';
import { BlueskyVideoView } from '@haileyok/bluesky-video';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { HITSLOP_30 } from '#/lib/constants';
import { useAutoplayDisabled } from '#/state/preferences';
import { atoms as a, useTheme } from '#/alf';
import { useIsWithinMessage } from '#/components/dms/MessageContext';
import { Mute_Stroke2_Corner0_Rounded as MuteIcon } from '#/components/icons/Mute';
import { Pause_Filled_Corner0_Rounded as PauseIcon } from '#/components/icons/Pause';
import { Play_Filled_Corner0_Rounded as PlayIcon } from '#/components/icons/Play';
import { SpeakerVolumeFull_Stroke2_Corner0_Rounded as UnmuteIcon } from '#/components/icons/Speaker';
import { MediaInsetBorder } from '#/components/MediaInsetBorder';
import { useVideoMuteState } from '#/components/Post/Embed/VideoEmbed/VideoVolumeContext';
import { TimeIndicator } from './TimeIndicator';
export function VideoEmbedInnerNative({ ref, embed, setStatus, setIsLoading, setIsActive, }) {
    const { _ } = useLingui();
    const videoRef = useRef(null);
    const autoplayDisabled = useAutoplayDisabled();
    const isWithinMessage = useIsWithinMessage();
    const [muted, setMuted] = useVideoMuteState();
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [error, setError] = useState();
    useImperativeHandle(ref, () => ({
        togglePlayback: () => {
            videoRef.current?.togglePlayback();
        },
    }));
    if (error) {
        throw new Error(error);
    }
    return (_jsxs(View, { style: [a.flex_1, a.relative], children: [_jsx(BlueskyVideoView, { url: embed.playlist, autoplay: !autoplayDisabled && !isWithinMessage, beginMuted: autoplayDisabled ? false : muted, style: [a.rounded_sm], onActiveChange: e => {
                    setIsActive(e.nativeEvent.isActive);
                }, onLoadingChange: e => {
                    setIsLoading(e.nativeEvent.isLoading);
                }, onMutedChange: e => {
                    setMuted(e.nativeEvent.isMuted);
                }, onStatusChange: e => {
                    setStatus(e.nativeEvent.status);
                    setIsPlaying(e.nativeEvent.status === 'playing');
                }, onTimeRemainingChange: e => {
                    setTimeRemaining(e.nativeEvent.timeRemaining);
                }, onError: e => {
                    setError(e.nativeEvent.error);
                }, ref: videoRef, accessibilityLabel: embed.alt ? _(msg `Video: ${embed.alt}`) : _(msg `Video`), accessibilityHint: "" }), _jsx(VideoControls, { enterFullscreen: () => {
                    videoRef.current?.enterFullscreen(true);
                }, toggleMuted: () => {
                    videoRef.current?.toggleMuted();
                }, togglePlayback: () => {
                    videoRef.current?.togglePlayback();
                }, isPlaying: isPlaying, timeRemaining: timeRemaining }), _jsx(MediaInsetBorder, {})] }));
}
function VideoControls({ enterFullscreen, toggleMuted, togglePlayback, timeRemaining, isPlaying, }) {
    const { _ } = useLingui();
    const t = useTheme();
    const [muted] = useVideoMuteState();
    // show countdown when:
    // 1. timeRemaining is a number - was seeing NaNs
    // 2. duration is greater than 0 - means metadata has loaded
    // 3. we're less than 5 second into the video
    const showTime = !isNaN(timeRemaining);
    return (_jsxs(View, { style: [a.absolute, a.inset_0], children: [_jsx(Pressable, { onPress: enterFullscreen, style: a.flex_1, accessibilityLabel: _(msg `Video`), accessibilityHint: _(msg `Enters full screen`), accessibilityRole: "button" }), _jsx(ControlButton, { onPress: togglePlayback, label: isPlaying ? _(msg `Pause`) : _(msg `Play`), accessibilityHint: _(msg `Plays or pauses the video`), style: { left: 6 }, children: isPlaying ? (_jsx(PauseIcon, { width: 13, fill: t.palette.white })) : (_jsx(PlayIcon, { width: 13, fill: t.palette.white })) }), showTime && _jsx(TimeIndicator, { time: timeRemaining, style: { left: 33 } }), _jsx(ControlButton, { onPress: toggleMuted, label: muted
                    ? _(msg({ message: `Unmute`, context: 'video' }))
                    : _(msg({ message: `Mute`, context: 'video' })), accessibilityHint: _(msg `Toggles the sound`), style: { right: 6 }, children: muted ? (_jsx(MuteIcon, { width: 13, fill: t.palette.white })) : (_jsx(UnmuteIcon, { width: 13, fill: t.palette.white })) })] }));
}
function ControlButton({ onPress, children, label, accessibilityHint, style, }) {
    return (_jsx(View, { style: [
            a.absolute,
            a.rounded_full,
            a.justify_center,
            {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                paddingHorizontal: 4,
                paddingVertical: 4,
                bottom: 6,
                minHeight: 21,
                minWidth: 21,
            },
            style,
        ], children: _jsx(Pressable, { onPress: onPress, style: a.flex_1, accessibilityLabel: label, accessibilityHint: accessibilityHint, accessibilityRole: "button", hitSlop: HITSLOP_30, children: children }) }));
}
//# sourceMappingURL=VideoEmbedInnerNative.js.map