import { jsx as _jsx } from "react/jsx-runtime";
import { InteractionManager, View } from 'react-native';
import { measure, runOnJS, runOnUI, } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { useLightboxControls } from '#/state/lightbox';
import {} from '#/view/com/lightbox/ImageViewing/@types';
import { AutoSizedImage } from '#/view/com/util/images/AutoSizedImage';
import { ImageLayoutGrid } from '#/view/com/util/images/ImageLayoutGrid';
import { atoms as a } from '#/alf';
import { PostEmbedViewContext } from '#/components/Post/Embed/types';
import {} from '#/types/bsky/post';
import {} from './types';
export function ImageEmbed({ embed, ...rest }) {
    const { openLightbox } = useLightboxControls();
    const { images } = embed.view;
    if (images.length > 0) {
        const items = images.map(img => ({
            uri: img.fullsize,
            thumbUri: img.thumb,
            alt: img.alt,
            dimensions: img.aspectRatio ?? null,
        }));
        const _openLightbox = (index, thumbRects, fetchedDims) => {
            openLightbox({
                images: items.map((item, i) => ({
                    ...item,
                    thumbRect: thumbRects[i] ?? null,
                    thumbDimensions: fetchedDims[i] ?? null,
                    type: 'image',
                })),
                index,
            });
        };
        const onPress = (index, refs, fetchedDims) => {
            runOnUI(() => {
                'worklet';
                const rects = [];
                for (const r of refs) {
                    rects.push(measure(r));
                }
                runOnJS(_openLightbox)(index, rects, fetchedDims);
            })();
        };
        const onPressIn = (_) => {
            InteractionManager.runAfterInteractions(() => {
                Image.prefetch(items.map(i => i.uri));
            });
        };
        if (images.length === 1) {
            const image = images[0];
            return (_jsx(View, { style: [a.mt_sm, rest.style], children: _jsx(AutoSizedImage, { crop: rest.viewContext === PostEmbedViewContext.ThreadHighlighted
                        ? 'none'
                        : rest.viewContext ===
                            PostEmbedViewContext.FeedEmbedRecordWithMedia
                            ? 'square'
                            : 'constrained', image: image, onPress: (containerRef, dims) => onPress(0, [containerRef], [dims]), onPressIn: () => onPressIn(0), hideBadge: rest.viewContext === PostEmbedViewContext.FeedEmbedRecordWithMedia }) }));
        }
        return (_jsx(View, { style: [a.mt_sm, rest.style], children: _jsx(ImageLayoutGrid, { images: images, onPress: onPress, onPressIn: onPressIn, viewContext: rest.viewContext }) }));
    }
}
//# sourceMappingURL=ImageEmbed.js.map