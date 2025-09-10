import React from 'react';
import { type AnimatedRef } from 'react-native-reanimated';
import { type AppBskyEmbedImages } from '@atproto/api';
import { type Dimensions } from '#/lib/media/types';
export declare function ConstrainedImage({ aspectRatio, fullBleed, children, }: {
    aspectRatio: number;
    fullBleed?: boolean;
    children: React.ReactNode;
}): any;
export declare function AutoSizedImage({ image, crop, hideBadge, onPress, onLongPress, onPressIn, }: {
    image: AppBskyEmbedImages.ViewImage;
    crop?: 'none' | 'square' | 'constrained';
    hideBadge?: boolean;
    onPress?: (containerRef: AnimatedRef<any>, fetchedDims: Dimensions | null) => void;
    onLongPress?: () => void;
    onPressIn?: () => void;
}): any;
//# sourceMappingURL=AutoSizedImage.d.ts.map