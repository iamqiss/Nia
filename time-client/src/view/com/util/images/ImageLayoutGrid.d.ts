import { type StyleProp, type ViewStyle } from 'react-native';
import { type AnimatedRef } from 'react-native-reanimated';
import { type AppBskyEmbedImages } from '@atproto/api';
import { PostEmbedViewContext } from '#/components/Post/Embed/types';
import { type Dimensions } from '../../lightbox/ImageViewing/@types';
interface ImageLayoutGridProps {
    images: AppBskyEmbedImages.ViewImage[];
    onPress?: (index: number, containerRefs: AnimatedRef<any>[], fetchedDims: (Dimensions | null)[]) => void;
    onLongPress?: (index: number) => void;
    onPressIn?: (index: number) => void;
    style?: StyleProp<ViewStyle>;
    viewContext?: PostEmbedViewContext;
}
export declare function ImageLayoutGrid({ style, ...props }: ImageLayoutGridProps): any;
export {};
//# sourceMappingURL=ImageLayoutGrid.d.ts.map