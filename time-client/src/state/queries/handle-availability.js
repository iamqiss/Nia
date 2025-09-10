import { ComAtprotoTempCheckHandleAvailability } from '@atproto/api';
import { useQuery } from '@tanstack/react-query';
import { BSKY_SERVICE, BSKY_SERVICE_DID, PUBLIC_BSKY_SERVICE, } from '#/lib/constants';
import { createFullHandle } from '#/lib/strings/handles';
import { logger } from '#/logger';
import { useDebouncedValue } from '#/components/live/utils';
import * as bsky from '#/types/bsky';
import { Agent } from '../session/agent';
export const RQKEY_handleAvailability = (handle, domain, serviceDid) => ['handle-availability', { handle, domain, serviceDid }];
export function useHandleAvailabilityQuery({ username, serviceDomain, serviceDid, enabled, birthDate, email, }, debounceDelayMs = 500) {
    const name = username.trim();
    const debouncedHandle = useDebouncedValue(name, debounceDelayMs);
    return {
        debouncedUsername: debouncedHandle,
        enabled: enabled && name === debouncedHandle,
        query: useQuery({
            enabled: enabled && name === debouncedHandle,
            queryKey: RQKEY_handleAvailability(debouncedHandle, serviceDomain, serviceDid),
            queryFn: async () => {
                const handle = createFullHandle(name, serviceDomain);
                return await checkHandleAvailability(handle, serviceDid, {
                    email,
                    birthDate,
                    typeahead: true,
                });
            },
        }),
    };
}
export async function checkHandleAvailability(handle, serviceDid, { email, birthDate, typeahead, }) {
    if (serviceDid === BSKY_SERVICE_DID) {
        const agent = new Agent(null, { service: BSKY_SERVICE });
        // entryway has a special API for handle availability
        const { data } = await agent.com.atproto.temp.checkHandleAvailability({
            handle,
            birthDate,
            email,
        });
        if (bsky.dangerousIsType(data.result, ComAtprotoTempCheckHandleAvailability.isResultAvailable)) {
            logger.metric('signup:handleAvailable', { typeahead }, { statsig: true });
            return { available: true };
        }
        else if (bsky.dangerousIsType(data.result, ComAtprotoTempCheckHandleAvailability.isResultUnavailable)) {
            logger.metric('signup:handleTaken', { typeahead }, { statsig: true });
            return {
                available: false,
                suggestions: data.result.suggestions,
            };
        }
        else {
            throw new Error(`Unexpected result of \`checkHandleAvailability\`: ${JSON.stringify(data.result)}`);
        }
    }
    else {
        // 3rd party PDSes won't have this API so just try and resolve the handle
        const agent = new Agent(null, { service: PUBLIC_BSKY_SERVICE });
        try {
            const res = await agent.resolveHandle({
                handle,
            });
            if (res.data.did) {
                logger.metric('signup:handleTaken', { typeahead }, { statsig: true });
                return { available: false };
            }
        }
        catch { }
        logger.metric('signup:handleAvailable', { typeahead }, { statsig: true });
        return { available: true };
    }
}
//# sourceMappingURL=handle-availability.js.map