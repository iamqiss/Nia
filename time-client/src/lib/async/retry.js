import { timeout } from '#/lib/async/timeout';
import { isNetworkError } from '#/lib/strings/errors';
export async function retry(retries, shouldRetry, action, delay) {
    let lastErr;
    while (retries > 0) {
        try {
            return await action();
        }
        catch (e) {
            lastErr = e;
            if (shouldRetry(e)) {
                if (delay) {
                    await timeout(delay);
                }
                retries--;
                continue;
            }
            throw e;
        }
    }
    throw lastErr;
}
export async function networkRetry(retries, fn) {
    return retry(retries, isNetworkError, fn);
}
//# sourceMappingURL=retry.js.map