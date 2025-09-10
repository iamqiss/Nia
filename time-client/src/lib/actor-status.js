import { useMemo } from 'react';
import { AppBskyEmbedExternal, } from '@atproto/api';
import { isAfter, parseISO } from 'date-fns';
import { useMaybeProfileShadow } from '#/state/cache/profile-shadow';
import { useLiveNowConfig } from '#/state/service-config';
import { useTickEveryMinute } from '#/state/shell';
export function useActorStatus(actor) {
    const shadowed = useMaybeProfileShadow(actor);
    const tick = useTickEveryMinute();
    const config = useLiveNowConfig();
    return useMemo(() => {
        tick; // revalidate every minute
        if (shadowed &&
            'status' in shadowed &&
            shadowed.status &&
            validateStatus(shadowed.did, shadowed.status, config) &&
            isStatusStillActive(shadowed.status.expiresAt)) {
            return {
                isActive: true,
                status: 'app.bsky.actor.status#live',
                embed: shadowed.status.embed, // temp_isStatusValid asserts this
                expiresAt: shadowed.status.expiresAt, // isStatusStillActive asserts this
                record: shadowed.status.record,
            };
        }
        else {
            return {
                status: '',
                isActive: false,
                record: {},
            };
        }
    }, [shadowed, config, tick]);
}
export function isStatusStillActive(timeStr) {
    if (!timeStr)
        return false;
    const now = new Date();
    const expiry = parseISO(timeStr);
    return isAfter(expiry, now);
}
export function validateStatus(did, status, config) {
    if (status.status !== 'app.bsky.actor.status#live')
        return false;
    const sources = config.find(cfg => cfg.did === did);
    if (!sources) {
        return false;
    }
    try {
        if (AppBskyEmbedExternal.isView(status.embed)) {
            const url = new URL(status.embed.external.uri);
            return sources.domains.includes(url.hostname);
        }
        else {
            return false;
        }
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=actor-status.js.map