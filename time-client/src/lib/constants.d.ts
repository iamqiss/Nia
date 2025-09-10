import { type Insets } from 'react-native';
import { type AppBskyActorDefs } from '@atproto/api';
import { type ProxyHeaderValue } from '#/state/session/agent';
export declare const LOCAL_DEV_SERVICE: string;
export declare const STAGING_SERVICE = "https://staging.bsky.dev";
export declare const BSKY_SERVICE = "https://bsky.social";
export declare const BSKY_SERVICE_DID = "did:web:bsky.social";
export declare const PUBLIC_BSKY_SERVICE = "https://public.api.bsky.app";
export declare const DEFAULT_SERVICE = "https://bsky.social";
export declare const HELP_DESK_URL = "https://blueskyweb.zendesk.com/hc/en-us";
export declare const EMBED_SERVICE = "https://embed.bsky.app";
export declare const EMBED_SCRIPT = "https://embed.bsky.app/static/embed.js";
export declare const BSKY_DOWNLOAD_URL = "https://bsky.app/download";
export declare const STARTER_PACK_MAX_SIZE = 150;
export declare const JOINED_THIS_WEEK = 560000;
export declare const DISCOVER_DEBUG_DIDS: Record<string, true>;
export declare function FEEDBACK_FORM_URL({ email, handle, }: {
    email?: string;
    handle?: string;
}): string;
export declare const MAX_DISPLAY_NAME = 64;
export declare const MAX_DESCRIPTION = 256;
export declare const MAX_GRAPHEME_LENGTH = 300;
export declare const MAX_DM_GRAPHEME_LENGTH = 1000;
export declare const MAX_ALT_TEXT = 2000;
export declare const MAX_REPORT_REASON_GRAPHEME_LENGTH = 2000;
export declare function IS_TEST_USER(handle?: string): boolean | "" | undefined;
export declare function IS_PROD_SERVICE(url?: string): boolean | "" | undefined;
export declare const PROD_DEFAULT_FEED: (rkey: string) => string;
export declare const STAGING_DEFAULT_FEED: (rkey: string) => string;
export declare const PROD_FEEDS: string[];
export declare const STAGING_FEEDS: string[];
export declare const POST_IMG_MAX: {
    width: number;
    height: number;
    size: number;
};
export declare const STAGING_LINK_META_PROXY = "https://cardyb.staging.bsky.dev/v1/extract?url=";
export declare const PROD_LINK_META_PROXY = "https://cardyb.bsky.app/v1/extract?url=";
export declare function LINK_META_PROXY(serviceUrl: string): "https://cardyb.staging.bsky.dev/v1/extract?url=" | "https://cardyb.bsky.app/v1/extract?url=";
export declare const STATUS_PAGE_URL = "https://status.bsky.app/";
export declare const createHitslop: (size: number) => Insets;
export declare const HITSLOP_10: Insets;
export declare const HITSLOP_20: Insets;
export declare const HITSLOP_30: Insets;
export declare const LANG_DROPDOWN_HITSLOP: {
    top: number;
    bottom: number;
    left: number;
    right: number;
};
export declare const BACK_HITSLOP: Insets;
export declare const MAX_POST_LINES = 25;
export declare const BSKY_APP_ACCOUNT_DID = "did:plc:z72i7hdynmk6r22z27h6tvur";
export declare const BSKY_FEED_OWNER_DIDS: string[];
export declare const DISCOVER_FEED_URI = "at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot";
export declare const VIDEO_FEED_URI = "at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/thevids";
export declare const STAGING_VIDEO_FEED_URI = "at://did:plc:yofh3kx63drvfljkibw5zuxo/app.bsky.feed.generator/thevids";
export declare const VIDEO_FEED_URIS: string[];
export declare const DISCOVER_SAVED_FEED: {
    type: string;
    value: string;
    pinned: boolean;
};
export declare const TIMELINE_SAVED_FEED: {
    type: string;
    value: string;
    pinned: boolean;
};
export declare const VIDEO_SAVED_FEED: {
    type: string;
    value: string;
    pinned: boolean;
};
export declare const RECOMMENDED_SAVED_FEEDS: Pick<AppBskyActorDefs.SavedFeed, 'type' | 'value' | 'pinned'>[];
export declare const KNOWN_SHUTDOWN_FEEDS: string[];
export declare const GIF_SERVICE = "https://gifs.bsky.app";
export declare const GIF_SEARCH: (params: string) => string;
export declare const GIF_FEATURED: (params: string) => string;
export declare const MAX_LABELERS = 20;
export declare const VIDEO_SERVICE = "https://video.bsky.app";
export declare const VIDEO_SERVICE_DID = "did:web:video.bsky.app";
export declare const VIDEO_MAX_DURATION_MS: number;
/**
 * Maximum size of a video in megabytes, _not_ mebibytes. Backend uses
 * ISO megabytes.
 */
export declare const VIDEO_MAX_SIZE: number;
export declare const SUPPORTED_MIME_TYPES: readonly ["video/mp4", "video/mpeg", "video/webm", "video/quicktime", "image/gif"];
export type SupportedMimeTypes = (typeof SUPPORTED_MIME_TYPES)[number];
export declare const EMOJI_REACTION_LIMIT = 5;
export declare const urls: {
    website: {
        blog: {
            initialVerificationAnnouncement: string;
        };
    };
};
export declare const PUBLIC_APPVIEW = "https://api.bsky.app";
export declare const PUBLIC_APPVIEW_DID = "did:web:api.bsky.app";
export declare const PUBLIC_STAGING_APPVIEW_DID = "did:web:api.staging.bsky.dev";
export declare const DEV_ENV_APPVIEW = "http://localhost:2584";
export declare const BLUESKY_PROXY_HEADER: {
    value: string;
    get(): ProxyHeaderValue;
    set(value: string): void;
};
export declare const DM_SERVICE_HEADERS: {
    'atproto-proxy': string;
};
export declare const BLUESKY_MOD_SERVICE_HEADERS: {
    'atproto-proxy': string;
};
export declare const webLinks: {
    tos: string;
    privacy: string;
    community: string;
    communityDeprecated: string;
};
//# sourceMappingURL=constants.d.ts.map