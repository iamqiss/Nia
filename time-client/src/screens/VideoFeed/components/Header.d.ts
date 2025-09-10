import { type VideoFeedSourceContext } from '#/screens/VideoFeed/types';
import { type ButtonProps } from '#/components/Button';
export declare function HeaderPlaceholder(): any;
export declare function Header({ sourceContext, }: {
    sourceContext: VideoFeedSourceContext;
}): any;
export declare function FeedHeader({ sourceContext, }: {
    sourceContext: Exclude<VideoFeedSourceContext, {
        type: 'author';
    }>;
}): any;
export declare function BackButton({ onPress, style, ...props }: Partial<ButtonProps>): any;
//# sourceMappingURL=Header.d.ts.map