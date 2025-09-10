import { type QueryClient } from '@tanstack/react-query';
export declare const RQKEY_LINK: (url: string) => string[];
export declare const RQKEY_GIF: (url: string) => string[];
import { type BskyAgent } from '@atproto/api';
import { type ResolvedLink } from '#/lib/api/resolve';
import { type Gif } from './tenor';
export declare function useResolveLinkQuery(url: string): any;
export declare function fetchResolveLinkQuery(queryClient: QueryClient, agent: BskyAgent, url: string): any;
export declare function precacheResolveLinkQuery(queryClient: QueryClient, url: string, resolvedLink: ResolvedLink): void;
export declare function useResolveGifQuery(gif: Gif): any;
export declare function fetchResolveGifQuery(queryClient: QueryClient, agent: BskyAgent, gif: Gif): any;
//# sourceMappingURL=resolve-link.d.ts.map