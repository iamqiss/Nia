import type * as bsky from '#/types/bsky';
export declare function createStarterPackLinkFromAndroidReferrer(referrerQueryString: string): string | null;
export declare function parseStarterPackUri(uri?: string): {
    name: string;
    rkey: string;
} | null;
export declare function createStarterPackGooglePlayUri(name: string, rkey: string): string | null;
export declare function httpStarterPackUriToAtUri(httpUri?: string): string | null;
export declare function getStarterPackOgCard(didOrStarterPack: bsky.starterPack.AnyStarterPackView | string, rkey?: string): string;
export declare function createStarterPackUri({ did, rkey, }: {
    did: string;
    rkey: string;
}): string;
export declare function startUriToStarterPackUri(uri: string): string;
//# sourceMappingURL=starter-pack.d.ts.map