import { useQuery } from '@tanstack/react-query';
import { STALE } from '#/state/queries/index';
import { useAgent } from '../session';
const RQKEY_LINK_ROOT = 'resolve-link';
export const RQKEY_LINK = (url) => [RQKEY_LINK_ROOT, url];
const RQKEY_GIF_ROOT = 'resolve-gif';
export const RQKEY_GIF = (url) => [RQKEY_GIF_ROOT, url];
import {} from '@atproto/api';
import { resolveGif, resolveLink } from '#/lib/api/resolve';
import {} from './tenor';
export function useResolveLinkQuery(url) {
    const agent = useAgent();
    return useQuery({
        staleTime: STALE.HOURS.ONE,
        queryKey: RQKEY_LINK(url),
        queryFn: async () => {
            return await resolveLink(agent, url);
        },
    });
}
export function fetchResolveLinkQuery(queryClient, agent, url) {
    return queryClient.fetchQuery({
        staleTime: STALE.HOURS.ONE,
        queryKey: RQKEY_LINK(url),
        queryFn: async () => {
            return await resolveLink(agent, url);
        },
    });
}
export function precacheResolveLinkQuery(queryClient, url, resolvedLink) {
    queryClient.setQueryData(RQKEY_LINK(url), resolvedLink);
}
export function useResolveGifQuery(gif) {
    const agent = useAgent();
    return useQuery({
        staleTime: STALE.HOURS.ONE,
        queryKey: RQKEY_GIF(gif.url),
        queryFn: async () => {
            return await resolveGif(agent, gif);
        },
    });
}
export function fetchResolveGifQuery(queryClient, agent, gif) {
    return queryClient.fetchQuery({
        staleTime: STALE.HOURS.ONE,
        queryKey: RQKEY_GIF(gif.url),
        queryFn: async () => {
            return await resolveGif(agent, gif);
        },
    });
}
//# sourceMappingURL=resolve-link.js.map