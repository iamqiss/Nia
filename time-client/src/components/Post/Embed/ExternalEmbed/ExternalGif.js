import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { ActivityIndicator, Pressable, } from 'react-native';
import { Image } from 'expo-image';
import {} from '@atproto/api';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {} from '#/lib/strings/embed-player';
import { isIOS, isNative, isWeb } from '#/platform/detection';
import { useExternalEmbedsPrefs } from '#/state/preferences';
import { atoms as a, useTheme } from '#/alf';
import { useDialogControl } from '#/components/Dialog';
import { EmbedConsentDialog } from '#/components/dialogs/EmbedConsent';
import { Fill } from '#/components/Fill';
import { PlayButtonIcon } from '#/components/video/PlayButtonIcon';
export function ExternalGif({ link, params, }) {
    const t = useTheme();
    const externalEmbedsPrefs = useExternalEmbedsPrefs();
    const { _ } = useLingui();
    const consentDialogControl = useDialogControl();
    // Tracking if the placer has been activated
    const [isPlayerActive, setIsPlayerActive] = React.useState(false);
    // Tracking whether the gif has been loaded yet
    const [isPrefetched, setIsPrefetched] = React.useState(false);
    // Tracking whether the image is animating
    const [isAnimating, setIsAnimating] = React.useState(true);
    // Used for controlling animation
    const imageRef = React.useRef(null);
    const load = React.useCallback(() => {
        setIsPlayerActive(true);
        Image.prefetch(params.playerUri).then(() => {
            // Replace the image once it's fetched
            setIsPrefetched(true);
        });
    }, [params.playerUri]);
    const onPlayPress = React.useCallback((event) => {
        // Don't propagate on web
        event.preventDefault();
        // Show consent if this is the first load
        if (externalEmbedsPrefs?.[params.source] === undefined) {
            consentDialogControl.open();
            return;
        }
        // If the player isn't active, we want to activate it and prefetch the gif
        if (!isPlayerActive) {
            load();
            return;
        }
        // Control animation on native
        setIsAnimating(prev => {
            if (prev) {
                if (isNative) {
                    imageRef.current?.stopAnimating();
                }
                return false;
            }
            else {
                if (isNative) {
                    imageRef.current?.startAnimating();
                }
                return true;
            }
        });
    }, [
        consentDialogControl,
        externalEmbedsPrefs,
        isPlayerActive,
        load,
        params.source,
    ]);
    return (_jsxs(_Fragment, { children: [_jsx(EmbedConsentDialog, { control: consentDialogControl, source: params.source, onAccept: load }), _jsxs(Pressable, { style: [
                    { height: 300 },
                    a.w_full,
                    a.overflow_hidden,
                    {
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                    },
                ], onPress: onPlayPress, accessibilityRole: "button", accessibilityHint: _(msg `Plays the GIF`), accessibilityLabel: _(msg `Play ${link.title}`), children: [_jsx(Image, { source: {
                            uri: !isPrefetched || (isWeb && !isAnimating)
                                ? link.thumb
                                : params.playerUri,
                        }, style: { flex: 1 }, ref: imageRef, autoplay: isAnimating, contentFit: "contain", accessibilityIgnoresInvertColors: true, accessibilityLabel: link.title, accessibilityHint: link.title, cachePolicy: isIOS ? 'disk' : 'memory-disk' }), (!isPrefetched || !isAnimating) && (_jsxs(Fill, { style: [a.align_center, a.justify_center], children: [_jsx(Fill, { style: [
                                    t.name === 'light' ? t.atoms.bg_contrast_975 : t.atoms.bg,
                                    {
                                        opacity: 0.3,
                                    },
                                ] }), !isAnimating || !isPlayerActive ? ( // Play button when not animating or not active
                            _jsx(PlayButtonIcon, {})) : (
                            // Activity indicator while gif loads
                            _jsx(ActivityIndicator, { size: "large", color: "white" }))] }))] })] }));
}
//# sourceMappingURL=ExternalGif.js.map