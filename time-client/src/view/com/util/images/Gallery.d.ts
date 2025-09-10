import { type StyleProp, type ViewStyle } from 'react-native';
import { type AnimatedRef } from 'react-native-reanimated';
import { type ImageStyle } from 'expo-image';
import { type AppBskyEmbedImages } from '@atproto/api';
import { type Dimensions } from '#/lib/media/types';
import { PostEmbedViewContext } from '#/components/Post/Embed/types';
type EventFunction = (index: number) => void;
interface Props {
    images: AppBskyEmbedImages.ViewImage[];
    index: number;
    onPress?: (index: number, containerRefs: AnimatedRef<any>[], fetchedDims: (Dimensions | null)[]) => void;
    onLongPress?: EventFunction;
    onPressIn?: EventFunction;
    imageStyle?: StyleProp<ImageStyle>;
    viewContext?: PostEmbedViewContext;
    insetBorderStyle?: StyleProp<ViewStyle>;
    containerRefs: AnimatedRef<any>[];
    thumbDimsRef: React.MutableRefObject<(Dimensions | null)[]>;
}
export declare function GalleryItem({ images, index, imageStyle, onPress, onPressIn, onLongPress, viewContext, insetBorderStyle, containerRefs, thumbDimsRef, }: Props): any;
export {};
//# sourceMappingURL=Gallery.d.ts.map