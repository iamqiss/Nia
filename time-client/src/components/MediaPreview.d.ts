import { type StyleProp, type ViewStyle } from 'react-native';
import { type AppBskyFeedDefs } from '@atproto/api';
/**
 * Streamlined MediaPreview component which just handles images, gifs, and videos
 */
export declare function Embed({ embed, style, }: {
    embed: AppBskyFeedDefs.PostView['embed'];
    style?: StyleProp<ViewStyle>;
}): any;
export declare function Outer({ children, style, }: {
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}): any;
export declare function ImageItem({ thumbnail, alt, children, }: {
    thumbnail: string;
    alt?: string;
    children?: React.ReactNode;
}): any;
export declare function GifItem({ thumbnail, alt }: {
    thumbnail: string;
    alt?: string;
}): any;
export declare function VideoItem({ thumbnail, alt, }: {
    thumbnail?: string;
    alt?: string;
}): any;
//# sourceMappingURL=MediaPreview.d.ts.map