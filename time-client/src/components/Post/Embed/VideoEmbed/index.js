import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { ImageBackground } from 'expo-image';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ErrorBoundary } from '#/view/com/util/ErrorBoundary';
import { ConstrainedImage } from '#/view/com/util/images/AutoSizedImage';
import { atoms as a, useTheme } from '#/alf';
import { Button } from '#/components/Button';
import { useThrottledValue } from '#/components/hooks/useThrottledValue';
import { PlayButtonIcon } from '#/components/video/PlayButtonIcon';
import { VideoEmbedInnerNative } from './VideoEmbedInner/VideoEmbedInnerNative';
import * as VideoFallback from './VideoEmbedInner/VideoFallback';
export function VideoEmbed({ embed, crop }) {
    const t = useTheme();
    const [key, setKey] = useState(0);
    const renderError = useCallback((error) => (_jsx(VideoError, { error: error, retry: () => setKey(key + 1) })), [key]);
    let aspectRatio;
    const dims = embed.aspectRatio;
    if (dims) {
        aspectRatio = dims.width / dims.height;
        if (Number.isNaN(aspectRatio)) {
            aspectRatio = undefined;
        }
    }
    let constrained;
    let max;
    if (aspectRatio !== undefined) {
        const ratio = 1 / 2; // max of 1:2 ratio in feeds
        constrained = Math.max(aspectRatio, ratio);
        max = Math.max(aspectRatio, 0.25); // max of 1:4 in thread
    }
    const cropDisabled = crop === 'none';
    const contents = (_jsx(ErrorBoundary, { renderError: renderError, children: _jsx(InnerWrapper, { embed: embed }) }, key));
    return (_jsx(View, { style: [a.pt_xs], children: cropDisabled ? (_jsx(View, { style: [
                a.w_full,
                a.overflow_hidden,
                { aspectRatio: max ?? 1 },
                a.rounded_md,
                a.overflow_hidden,
                t.atoms.bg_contrast_25,
            ], children: contents })) : (_jsx(ConstrainedImage, { fullBleed: crop === 'square', aspectRatio: constrained || 1, children: contents })) }));
}
function InnerWrapper({ embed }) {
    const { _ } = useLingui();
    const ref = useRef(null);
    const [status, setStatus] = useState('pending');
    const [isLoading, setIsLoading] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const showSpinner = useThrottledValue(isActive && isLoading, 100);
    const showOverlay = !isActive ||
        isLoading ||
        (status === 'paused' && !isActive) ||
        status === 'pending';
    if (!isActive && status !== 'pending') {
        setStatus('pending');
    }
    return (_jsxs(_Fragment, { children: [_jsx(VideoEmbedInnerNative, { embed: embed, setStatus: setStatus, setIsLoading: setIsLoading, setIsActive: setIsActive, ref: ref }), _jsx(ImageBackground, { source: { uri: embed.thumbnail }, accessibilityIgnoresInvertColors: true, style: [
                    a.absolute,
                    a.inset_0,
                    {
                        backgroundColor: 'transparent', // If you don't add `backgroundColor` to the styles here,
                        // the play button won't show up on the first render on android 🥴😮‍💨
                        display: showOverlay ? 'flex' : 'none',
                    },
                ], cachePolicy: "memory-disk" // Preferring memory cache helps to avoid flicker when re-displaying on android
                , children: showOverlay && (_jsx(Button, { style: [a.flex_1, a.align_center, a.justify_center], onPress: () => {
                        ref.current?.togglePlayback();
                    }, label: _(msg `Play video`), children: showSpinner ? (_jsx(View, { style: [
                            a.rounded_full,
                            a.p_xs,
                            a.align_center,
                            a.justify_center,
                        ], children: _jsx(ActivityIndicator, { size: "large", color: "white" }) })) : (_jsx(PlayButtonIcon, {})) })) })] }));
}
function VideoError({ retry }) {
    return (_jsxs(VideoFallback.Container, { children: [_jsx(VideoFallback.Text, { children: _jsx(Trans, { children: "An error occurred while loading the video. Please try again later." }) }), _jsx(VideoFallback.RetryButton, { onPress: retry })] }));
}
//# sourceMappingURL=index.js.map