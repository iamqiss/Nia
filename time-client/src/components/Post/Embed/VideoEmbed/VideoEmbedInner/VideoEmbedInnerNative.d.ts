import { type AppBskyEmbedVideo } from '@atproto/api';
export declare function VideoEmbedInnerNative({ ref, embed, setStatus, setIsLoading, setIsActive, }: {
    ref: React.Ref<{
        togglePlayback: () => void;
    }>;
    embed: AppBskyEmbedVideo.View;
    setStatus: (status: 'playing' | 'paused') => void;
    setIsLoading: (isLoading: boolean) => void;
    setIsActive: (isActive: boolean) => void;
}): any;
//# sourceMappingURL=VideoEmbedInnerNative.d.ts.map