import { type AppBskyEmbedVideo } from '@atproto/api';
export declare function VideoEmbed({ embed, crop, }: {
    embed: AppBskyEmbedVideo.View;
    crop?: 'none' | 'square' | 'constrained';
}): any;
/**
 * Awkward data flow here, but we need to hide the video when it's not near the screen.
 * But also, ViewportObserver _must_ not be within a `overflow: hidden` container.
 * So we put it at the top level of the component tree here, then hide the children of
 * the auto-resizing container.
 */
export declare const OnlyNearScreen: ({ children }: {
    children: React.ReactNode;
}) => any;
//# sourceMappingURL=index.web.d.ts.map