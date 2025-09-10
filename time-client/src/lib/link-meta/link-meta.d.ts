import { type BskyAgent } from '@atproto/api';
export declare enum LikelyType {
    HTML = 0,
    Text = 1,
    Image = 2,
    Video = 3,
    Audio = 4,
    AtpData = 5,
    Other = 6
}
export interface LinkMeta {
    error?: string;
    likelyType: LikelyType;
    url: string;
    title?: string;
    description?: string;
    image?: string;
}
export declare function getLinkMeta(agent: BskyAgent, url: string, timeout?: number): Promise<LinkMeta>;
export declare function getLikelyType(url: URL | string): LikelyType;
//# sourceMappingURL=link-meta.d.ts.map