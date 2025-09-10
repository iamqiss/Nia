export declare const embedPlayerSources: readonly ["youtube", "youtubeShorts", "twitch", "spotify", "soundcloud", "appleMusic", "vimeo", "giphy", "tenor", "flickr"];
export type EmbedPlayerSource = (typeof embedPlayerSources)[number];
export type EmbedPlayerType = 'youtube_video' | 'youtube_short' | 'twitch_video' | 'spotify_album' | 'spotify_playlist' | 'spotify_song' | 'soundcloud_track' | 'soundcloud_set' | 'apple_music_playlist' | 'apple_music_album' | 'apple_music_song' | 'vimeo_video' | 'giphy_gif' | 'tenor_gif' | 'flickr_album';
export declare const externalEmbedLabels: Record<EmbedPlayerSource, string>;
export interface EmbedPlayerParams {
    type: EmbedPlayerType;
    playerUri: string;
    isGif?: boolean;
    source: EmbedPlayerSource;
    metaUri?: string;
    hideDetails?: boolean;
    dimensions?: {
        height: number;
        width: number;
    };
}
export declare function parseEmbedPlayerFromUrl(url: string): EmbedPlayerParams | undefined;
export declare function getPlayerAspect({ type, hasThumb, width, }: {
    type: EmbedPlayerParams['type'];
    hasThumb: boolean;
    width: number;
}): {
    aspectRatio?: number;
    height?: number;
};
export declare function getGifDims(originalHeight: number, originalWidth: number, viewWidth: number): {
    height: number;
    width: number;
};
export declare function getGiphyMetaUri(url: URL): string | undefined;
export declare function parseTenorGif(urlp: URL): {
    success: false;
} | {
    success: true;
    playerUri: string;
    dimensions: {
        height: number;
        width: number;
    };
};
export declare function isTenorGifUri(url: URL | string): boolean;
//# sourceMappingURL=embed-player.d.ts.map