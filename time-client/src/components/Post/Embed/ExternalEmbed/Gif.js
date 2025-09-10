import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View, } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { HITSLOP_20 } from '#/lib/constants';
import {} from '#/lib/strings/embed-player';
import { isWeb } from '#/platform/detection';
import { useAutoplayDisabled } from '#/state/preferences';
import { useLargeAltBadgeEnabled } from '#/state/preferences/large-alt-badge';
import { atoms as a, useTheme } from '#/alf';
import { Fill } from '#/components/Fill';
import { Loader } from '#/components/Loader';
import * as Prompt from '#/components/Prompt';
import { Text } from '#/components/Typography';
import { PlayButtonIcon } from '#/components/video/PlayButtonIcon';
import { GifView } from '../../../../../modules/expo-bluesky-gif-view';
import {} from '../../../../../modules/expo-bluesky-gif-view/src/GifView.types';
function PlaybackControls({ onPress, isPlaying, isLoaded, }) {
    const { _ } = useLingui();
    const t = useTheme();
    return (_jsx(Pressable, { accessibilityRole: "button", accessibilityHint: _(msg `Plays or pauses the GIF`), accessibilityLabel: isPlaying ? _(msg `Pause`) : _(msg `Play`), style: [
            a.absolute,
            a.align_center,
            a.justify_center,
            !isLoaded && a.border,
            t.atoms.border_contrast_medium,
            a.inset_0,
            a.w_full,
            a.h_full,
            {
                zIndex: 2,
                backgroundColor: !isLoaded
                    ? t.atoms.bg_contrast_25.backgroundColor
                    : undefined,
            },
        ], onPress: onPress, children: !isLoaded ? (_jsx(View, { children: _jsx(View, { style: [a.align_center, a.justify_center], children: _jsx(Loader, { size: "xl" }) }) })) : !isPlaying ? (_jsx(PlayButtonIcon, {})) : undefined }));
}
export function GifEmbed({ params, thumb, altText, isPreferredAltText, hideAlt, style = { width: '100%' }, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const autoplayDisabled = useAutoplayDisabled();
    const playerRef = React.useRef(null);
    const [playerState, setPlayerState] = React.useState({
        isPlaying: !autoplayDisabled,
        isLoaded: false,
    });
    const onPlayerStateChange = React.useCallback((e) => {
        setPlayerState(e.nativeEvent);
    }, []);
    const onPress = React.useCallback(() => {
        playerRef.current?.toggleAsync();
    }, []);
    return (_jsx(View, { style: [
            a.rounded_md,
            a.overflow_hidden,
            a.border,
            t.atoms.border_contrast_low,
            { aspectRatio: params.dimensions.width / params.dimensions.height },
            style,
        ], children: _jsxs(View, { style: [
                a.absolute,
                /*
                 * Aspect ratio was being clipped weirdly on web -esb
                 */
                {
                    top: -2,
                    bottom: -2,
                    left: -2,
                    right: -2,
                },
            ], children: [_jsx(PlaybackControls, { onPress: onPress, isPlaying: playerState.isPlaying, isLoaded: playerState.isLoaded }), _jsx(GifView, { source: params.playerUri, placeholderSource: thumb, style: [a.flex_1], autoplay: !autoplayDisabled, onPlayerStateChange: onPlayerStateChange, ref: playerRef, accessibilityHint: _(msg `Animated GIF`), accessibilityLabel: altText }), !playerState.isPlaying && (_jsx(Fill, { style: [
                        t.name === 'light' ? t.atoms.bg_contrast_975 : t.atoms.bg,
                        {
                            opacity: 0.3,
                        },
                    ] })), !hideAlt && isPreferredAltText && _jsx(AltText, { text: altText })] }) }));
}
function AltText({ text }) {
    const control = Prompt.usePromptControl();
    const largeAltBadge = useLargeAltBadgeEnabled();
    const { _ } = useLingui();
    return (_jsxs(_Fragment, { children: [_jsx(TouchableOpacity, { testID: "altTextButton", accessibilityRole: "button", accessibilityLabel: _(msg `Show alt text`), accessibilityHint: "", hitSlop: HITSLOP_20, onPress: control.open, style: styles.altContainer, children: _jsx(Text, { style: [styles.alt, largeAltBadge && a.text_xs], accessible: false, children: _jsx(Trans, { children: "ALT" }) }) }), _jsxs(Prompt.Outer, { control: control, children: [_jsx(Prompt.TitleText, { children: _jsx(Trans, { children: "Alt Text" }) }), _jsx(Prompt.DescriptionText, { selectable: true, children: text }), _jsx(Prompt.Actions, { children: _jsx(Prompt.Action, { onPress: () => control.close(), cta: _(msg `Close`), color: "secondary" }) })] })] }));
}
const styles = StyleSheet.create({
    altContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        borderRadius: 6,
        paddingHorizontal: isWeb ? 8 : 6,
        paddingVertical: isWeb ? 6 : 3,
        position: 'absolute',
        // Related to margin/gap hack. This keeps the alt label in the same position
        // on all platforms
        right: isWeb ? 8 : 5,
        bottom: isWeb ? 8 : 5,
        zIndex: 2,
    },
    alt: {
        color: 'white',
        fontSize: isWeb ? 10 : 7,
        fontWeight: '600',
    },
});
//# sourceMappingURL=Gif.js.map