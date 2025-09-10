import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useRef } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedRef, } from 'react-native-reanimated';
import { Image } from 'expo-image';
import {} from '@atproto/api';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {} from '#/lib/media/types';
import { isNative } from '#/platform/detection';
import { useLargeAltBadgeEnabled } from '#/state/preferences/large-alt-badge';
import { atoms as a, useBreakpoints, useTheme } from '#/alf';
import { ArrowsDiagonalOut_Stroke2_Corner0_Rounded as Fullscreen } from '#/components/icons/ArrowsDiagonal';
import { MediaInsetBorder } from '#/components/MediaInsetBorder';
import { Text } from '#/components/Typography';
export function ConstrainedImage({ aspectRatio, fullBleed, children, }) {
    const t = useTheme();
    const { gtMobile } = useBreakpoints();
    /**
     * Computed as a % value to apply as `paddingTop`, this basically controls
     * the height of the image.
     */
    const outerAspectRatio = React.useMemo(() => {
        const ratio = isNative || !gtMobile
            ? Math.min(1 / aspectRatio, 16 / 9) // 9:16 bounding box
            : Math.min(1 / aspectRatio, 1); // 1:1 bounding box
        return `${ratio * 100}%`;
    }, [aspectRatio, gtMobile]);
    return (_jsx(View, { style: [a.w_full], children: _jsx(View, { style: [a.overflow_hidden, { paddingTop: outerAspectRatio }], children: _jsx(View, { style: [a.absolute, a.inset_0, a.flex_row], children: _jsx(View, { style: [
                        a.h_full,
                        a.rounded_md,
                        a.overflow_hidden,
                        t.atoms.bg_contrast_25,
                        fullBleed ? a.w_full : { aspectRatio },
                    ], children: children }) }) }) }));
}
export function AutoSizedImage({ image, crop = 'constrained', hideBadge, onPress, onLongPress, onPressIn, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const largeAlt = useLargeAltBadgeEnabled();
    const containerRef = useAnimatedRef();
    const fetchedDimsRef = useRef(null);
    let aspectRatio;
    const dims = image.aspectRatio;
    if (dims) {
        aspectRatio = dims.width / dims.height;
        if (Number.isNaN(aspectRatio)) {
            aspectRatio = undefined;
        }
    }
    let constrained;
    let max;
    let rawIsCropped;
    if (aspectRatio !== undefined) {
        const ratio = 1 / 2; // max of 1:2 ratio in feeds
        constrained = Math.max(aspectRatio, ratio);
        max = Math.max(aspectRatio, 0.25); // max of 1:4 in thread
        rawIsCropped = aspectRatio < constrained;
    }
    const cropDisabled = crop === 'none';
    const isCropped = rawIsCropped && !cropDisabled;
    const isContain = aspectRatio === undefined;
    const hasAlt = !!image.alt;
    const contents = (_jsxs(Animated.View, { ref: containerRef, collapsable: false, style: { flex: 1 }, children: [_jsx(Image, { contentFit: isContain ? 'contain' : 'cover', style: [a.w_full, a.h_full], source: image.thumb, accessible: true, accessibilityIgnoresInvertColors: true, accessibilityLabel: image.alt, accessibilityHint: "", onLoad: e => {
                    if (!isContain) {
                        fetchedDimsRef.current = {
                            width: e.source.width,
                            height: e.source.height,
                        };
                    }
                } }), _jsx(MediaInsetBorder, {}), (hasAlt || isCropped) && !hideBadge ? (_jsxs(View, { accessible: false, style: [
                    a.absolute,
                    a.flex_row,
                    {
                        bottom: a.p_xs.padding,
                        right: a.p_xs.padding,
                        gap: 3,
                    },
                    largeAlt && [
                        {
                            gap: 4,
                        },
                    ],
                ], children: [isCropped && (_jsx(View, { style: [
                            a.rounded_xs,
                            t.atoms.bg_contrast_25,
                            {
                                padding: 3,
                                opacity: 0.8,
                            },
                            largeAlt && [
                                {
                                    padding: 5,
                                },
                            ],
                        ], children: _jsx(Fullscreen, { fill: t.atoms.text_contrast_high.color, width: largeAlt ? 18 : 12 }) })), hasAlt && (_jsx(View, { style: [
                            a.justify_center,
                            a.rounded_xs,
                            t.atoms.bg_contrast_25,
                            {
                                padding: 3,
                                opacity: 0.8,
                            },
                            largeAlt && [
                                {
                                    padding: 5,
                                },
                            ],
                        ], children: _jsx(Text, { style: [a.font_heavy, largeAlt ? a.text_xs : { fontSize: 8 }], children: "ALT" }) }))] })) : null] }));
    if (cropDisabled) {
        return (_jsx(Pressable, { onPress: () => onPress?.(containerRef, fetchedDimsRef.current), onLongPress: onLongPress, onPressIn: onPressIn, 
            // alt here is what screen readers actually use
            accessibilityLabel: image.alt, accessibilityHint: _(msg `Views full image`), style: [
                a.w_full,
                a.rounded_md,
                a.overflow_hidden,
                t.atoms.bg_contrast_25,
                { aspectRatio: max ?? 1 },
            ], children: contents }));
    }
    else {
        return (_jsx(ConstrainedImage, { fullBleed: crop === 'square', aspectRatio: constrained ?? 1, children: _jsx(Pressable, { onPress: () => onPress?.(containerRef, fetchedDimsRef.current), onLongPress: onLongPress, onPressIn: onPressIn, 
                // alt here is what screen readers actually use
                accessibilityLabel: image.alt, accessibilityHint: _(msg `Views full image`), style: [a.h_full], children: contents }) }));
    }
}
//# sourceMappingURL=AutoSizedImage.js.map