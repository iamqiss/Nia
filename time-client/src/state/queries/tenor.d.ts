export declare const RQKEY_ROOT = "gif-service";
export declare const RQKEY_FEATURED: string[];
export declare const RQKEY_SEARCH: (query: string) => string[];
export declare function useFeaturedGifsQuery(): any;
export declare function useGifSearchQuery(query: string): any;
export declare function tenorUrlToBskyGifUrl(tenorUrl: string): string;
export type Gif = {
    /**
     * A Unix timestamp that represents when this post was created.
     */
    created: number;
    /**
     * Returns true if this post contains audio.
     * Note: Only video formats support audio. The GIF image file format can't contain audio information.
     */
    hasaudio: boolean;
    /**
     * Tenor result identifier
     */
    id: string;
    /**
     * A dictionary with a content format as the key and a Media Object as the value.
     */
    media_formats: Record<ContentFormats, MediaObject>;
    /**
     * An array of tags for the post
     */
    tags: string[];
    /**
     * The title of the post
     */
    title: string;
    /**
     * A textual description of the content.
     * We recommend that you use content_description for user accessibility features.
     */
    content_description: string;
    /**
     * The full URL to view the post on tenor.com.
     */
    itemurl: string;
    /**
     * Returns true if this post contains captions.
     */
    hascaption: boolean;
    /**
     * Comma-separated list to signify whether the content is a sticker or static image, has audio, or is any combination of these. If sticker and static aren't present, then the content is a GIF. A blank flags field signifies a GIF without audio.
     */
    flags: string;
    /**
     * The most common background pixel color of the content
     */
    bg_color?: string;
    /**
     * A short URL to view the post on tenor.com.
     */
    url: string;
};
type MediaObject = {
    /**
     * A URL to the media source
     */
    url: string;
    /**
     * Width and height of the media in pixels
     */
    dims: [number, number];
    /**
     * Represents the time in seconds for one loop of the content. If the content is static, the duration is set to 0.
     */
    duration: number;
    /**
     * Size of the file in bytes
     */
    size: number;
};
type ContentFormats = 'preview' | 'gif' | 'tinygif';
export {};
//# sourceMappingURL=tenor.d.ts.map