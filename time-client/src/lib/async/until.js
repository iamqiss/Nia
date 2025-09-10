import { timeout } from './timeout';
export async function until(retries, delay, cond, fn) {
    while (retries > 0) {
        try {
            const v = await fn();
            if (cond(v, undefined)) {
                return true;
            }
        }
        catch (e) {
            // TODO: change the type signature of cond to accept undefined
            // however this breaks every existing usage of until -sfn
            if (cond(undefined, e)) {
                return true;
            }
        }
        await timeout(delay);
        retries--;
    }
    return false;
}
//# sourceMappingURL=until.js.map