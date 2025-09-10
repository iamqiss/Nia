import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Pressable, View } from 'react-native';
import {} from 'react-native-reanimated';
import { Image } from 'expo-image';
import {} from '@atproto/api';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {} from '#/lib/media/types';
import { useLargeAltBadgeEnabled } from '#/state/preferences/large-alt-badge';
import { atoms as a, useTheme } from '#/alf';
import { MediaInsetBorder } from '#/components/MediaInsetBorder';
import { PostEmbedViewContext } from '#/components/Post/Embed/types';
import { Text } from '#/components/Typography';
export function GalleryItem({ images, index, imageStyle, onPress, onPressIn, onLongPress, viewContext, insetBorderStyle, containerRefs, thumbDimsRef, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const largeAltBadge = useLargeAltBadgeEnabled();
    const image = images[index];
    const hasAlt = !!image.alt;
    const hideBadges = viewContext === PostEmbedViewContext.FeedEmbedRecordWithMedia;
    return (_jsxs(View, { style: a.flex_1, ref: containerRefs[index], collapsable: false, children: [_jsxs(Pressable, { onPress: onPress
                    ? () => onPress(index, containerRefs, thumbDimsRef.current.slice())
                    : undefined, onPressIn: onPressIn ? () => onPressIn(index) : undefined, onLongPress: onLongPress ? () => onLongPress(index) : undefined, style: [
                    a.flex_1,
                    a.overflow_hidden,
                    t.atoms.bg_contrast_25,
                    imageStyle,
                ], accessibilityRole: "button", accessibilityLabel: image.alt || _(msg `Image`), accessibilityHint: "", children: [_jsx(Image, { source: { uri: image.thumb }, style: [a.flex_1], accessible: true, accessibilityLabel: image.alt, accessibilityHint: "", accessibilityIgnoresInvertColors: true, onLoad: e => {
                            thumbDimsRef.current[index] = {
                                width: e.source.width,
                                height: e.source.height,
                            };
                        } }), _jsx(MediaInsetBorder, { style: insetBorderStyle })] }), hasAlt && !hideBadges ? (_jsx(View, { accessible: false, style: [
                    a.absolute,
                    a.flex_row,
                    a.align_center,
                    a.rounded_xs,
                    t.atoms.bg_contrast_25,
                    {
                        gap: 3,
                        padding: 3,
                        bottom: a.p_xs.padding,
                        right: a.p_xs.padding,
                        opacity: 0.8,
                    },
                    largeAltBadge && [
                        {
                            gap: 4,
                            padding: 5,
                        },
                    ],
                ], children: _jsx(Text, { style: [a.font_heavy, largeAltBadge ? a.text_xs : { fontSize: 8 }], children: "ALT" }) })) : null] }));
}
//# sourceMappingURL=Gallery.js.map