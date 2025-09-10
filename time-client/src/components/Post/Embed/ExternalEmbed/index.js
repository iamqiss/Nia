import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useCallback } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import {} from '@atproto/api';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { parseAltFromGIFDescription } from '#/lib/gif-alt-text';
import { useHaptics } from '#/lib/haptics';
import { shareUrl } from '#/lib/sharing';
import { parseEmbedPlayerFromUrl } from '#/lib/strings/embed-player';
import { toNiceDomain } from '#/lib/strings/url-helpers';
import { isNative } from '#/platform/detection';
import { useExternalEmbedsPrefs } from '#/state/preferences';
import { atoms as a, useTheme } from '#/alf';
import { Divider } from '#/components/Divider';
import { Earth_Stroke2_Corner0_Rounded as Globe } from '#/components/icons/Globe';
import { Link } from '#/components/Link';
import { Text } from '#/components/Typography';
import { ExternalGif } from './ExternalGif';
import { ExternalPlayer } from './ExternalPlayer';
import { GifEmbed } from './Gif';
export const ExternalEmbed = ({ link, onOpen, style, hideAlt, }) => {
    const { _ } = useLingui();
    const t = useTheme();
    const playHaptic = useHaptics();
    const externalEmbedPrefs = useExternalEmbedsPrefs();
    const niceUrl = toNiceDomain(link.uri);
    const imageUri = link.thumb;
    const embedPlayerParams = React.useMemo(() => {
        const params = parseEmbedPlayerFromUrl(link.uri);
        if (params && externalEmbedPrefs?.[params.source] !== 'hide') {
            return params;
        }
    }, [link.uri, externalEmbedPrefs]);
    const hasMedia = Boolean(imageUri || embedPlayerParams);
    const onPress = useCallback(() => {
        playHaptic('Light');
        onOpen?.();
    }, [playHaptic, onOpen]);
    const onShareExternal = useCallback(() => {
        if (link.uri && isNative) {
            playHaptic('Heavy');
            shareUrl(link.uri);
        }
    }, [link.uri, playHaptic]);
    if (embedPlayerParams?.source === 'tenor') {
        const parsedAlt = parseAltFromGIFDescription(link.description);
        return (_jsx(View, { style: style, children: _jsx(GifEmbed, { params: embedPlayerParams, thumb: link.thumb, altText: parsedAlt.alt, isPreferredAltText: parsedAlt.isPreferred, hideAlt: hideAlt }) }));
    }
    return (_jsx(Link, { label: link.title || _(msg `Open link to ${niceUrl}`), to: link.uri, shouldProxy: true, onPress: onPress, onLongPress: onShareExternal, children: ({ hovered }) => (_jsxs(View, { style: [
                a.transition_color,
                a.flex_col,
                a.rounded_md,
                a.overflow_hidden,
                a.w_full,
                a.border,
                style,
                hovered
                    ? t.atoms.border_contrast_high
                    : t.atoms.border_contrast_low,
            ], children: [imageUri && !embedPlayerParams ? (_jsx(Image, { style: {
                        aspectRatio: 1.91,
                    }, source: { uri: imageUri }, accessibilityIgnoresInvertColors: true })) : undefined, embedPlayerParams?.isGif ? (_jsx(ExternalGif, { link: link, params: embedPlayerParams })) : embedPlayerParams ? (_jsx(ExternalPlayer, { link: link, params: embedPlayerParams })) : undefined, _jsxs(View, { style: [
                        a.flex_1,
                        a.pt_sm,
                        { gap: 3 },
                        hasMedia && a.border_t,
                        hovered
                            ? t.atoms.border_contrast_high
                            : t.atoms.border_contrast_low,
                    ], children: [_jsxs(View, { style: [{ gap: 3 }, a.pb_xs, a.px_md], children: [!embedPlayerParams?.isGif && !embedPlayerParams?.dimensions && (_jsx(Text, { emoji: true, numberOfLines: 3, style: [a.text_md, a.font_bold, a.leading_snug], children: link.title || link.uri })), link.description ? (_jsx(Text, { emoji: true, numberOfLines: link.thumb ? 2 : 4, style: [a.text_sm, a.leading_snug], children: link.description })) : undefined] }), _jsxs(View, { style: [a.px_md], children: [_jsx(Divider, {}), _jsxs(View, { style: [
                                        a.flex_row,
                                        a.align_center,
                                        a.gap_2xs,
                                        a.pb_sm,
                                        {
                                            paddingTop: 6, // off menu
                                        },
                                    ], children: [_jsx(Globe, { size: "xs", style: [
                                                a.transition_color,
                                                hovered
                                                    ? t.atoms.text_contrast_medium
                                                    : t.atoms.text_contrast_low,
                                            ] }), _jsx(Text, { numberOfLines: 1, style: [
                                                a.transition_color,
                                                a.text_xs,
                                                a.leading_snug,
                                                hovered
                                                    ? t.atoms.text_contrast_high
                                                    : t.atoms.text_contrast_medium,
                                            ], children: toNiceDomain(link.uri) })] })] })] })] })) }));
};
//# sourceMappingURL=index.js.map