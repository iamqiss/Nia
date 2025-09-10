import { type AppBskyEmbedVideo } from '@atproto/api';
export declare function VideoEmbedInnerWeb({ embed, active, setActive, onScreen, lastKnownTime, }: {
    embed: AppBskyEmbedVideo.View;
    active: boolean;
    setActive: () => void;
    onScreen: boolean;
    lastKnownTime: React.MutableRefObject<number | undefined>;
}): any;
export declare class HLSUnsupportedError extends Error {
    constructor();
}
export declare class VideoNotFoundError extends Error {
    constructor();
}
//# sourceMappingURL=VideoEmbedInnerWeb.d.ts.map