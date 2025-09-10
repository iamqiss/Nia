import { useQuery } from '@tanstack/react-query';
import { DM_SERVICE_HEADERS } from '#/lib/constants';
import { useAgent } from '#/state/session';
import { STALE } from '..';
const RQKEY_ROOT = 'convo-availability';
export const RQKEY = (did) => [RQKEY_ROOT, did];
export function useGetConvoAvailabilityQuery(did) {
    const agent = useAgent();
    return useQuery({
        queryKey: RQKEY(did),
        queryFn: async () => {
            const { data } = await agent.chat.bsky.convo.getConvoAvailability({ members: [did] }, { headers: DM_SERVICE_HEADERS });
            return data;
        },
        staleTime: STALE.INFINITY,
    });
}
//# sourceMappingURL=get-convo-availability.js.map