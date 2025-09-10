import { AtUri } from '@atproto/api';
import { useQuery, } from '@tanstack/react-query';
import { STALE } from '#/state/queries';
import { useAgent } from '#/state/session';
import { useUnstableProfileViewCache } from './profile';
const RQKEY_ROOT = 'resolved-did';
export const RQKEY = (didOrHandle) => [RQKEY_ROOT, didOrHandle];
export function useResolveUriQuery(uri) {
    const urip = new AtUri(uri || '');
    const res = useResolveDidQuery(urip.host);
    if (res.data) {
        urip.host = res.data;
        return {
            ...res,
            data: { did: urip.host, uri: urip.toString() },
        };
    }
    return res;
}
export function useResolveDidQuery(didOrHandle) {
    const agent = useAgent();
    const { getUnstableProfile } = useUnstableProfileViewCache();
    return useQuery({
        staleTime: STALE.HOURS.ONE,
        queryKey: RQKEY(didOrHandle ?? ''),
        queryFn: async () => {
            if (!didOrHandle)
                return '';
            // Just return the did if it's already one
            if (didOrHandle.startsWith('did:'))
                return didOrHandle;
            const res = await agent.resolveHandle({ handle: didOrHandle });
            return res.data.did;
        },
        initialData: () => {
            // Return undefined if no did or handle
            if (!didOrHandle)
                return;
            const profile = getUnstableProfile(didOrHandle);
            return profile?.did;
        },
        enabled: !!didOrHandle,
    });
}
export function precacheResolvedUri(queryClient, handle, did) {
    queryClient.setQueryData(RQKEY(handle), did);
}
//# sourceMappingURL=resolve-uri.js.map