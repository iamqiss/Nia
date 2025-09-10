import { useQuery } from '@tanstack/react-query';
import { resolveShortLink } from '#/lib/link-meta/resolve-short-link';
import { parseStarterPackUri } from '#/lib/strings/starter-pack';
import { STALE } from '#/state/queries/index';
const ROOT_URI = 'https://go.bsky.app/';
const RQKEY_ROOT = 'resolved-short-link';
export const RQKEY = (code) => [RQKEY_ROOT, code];
export function useResolvedStarterPackShortLink({ code }) {
    return useQuery({
        queryKey: RQKEY(code),
        queryFn: async () => {
            const uri = `${ROOT_URI}${code}`;
            const res = await resolveShortLink(uri);
            return parseStarterPackUri(res);
        },
        retry: 1,
        enabled: Boolean(code),
        staleTime: STALE.HOURS.ONE,
    });
}
//# sourceMappingURL=resolve-short-link.js.map