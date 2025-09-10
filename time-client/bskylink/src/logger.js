import { subsystemLogger } from '@atproto/common';
import {} from 'pino';
export const httpLogger = subsystemLogger('bskylink');
export const dbLogger = subsystemLogger('bskylink:db');
export const redirectLogger = subsystemLogger('bskylink:redirect');
redirectLogger.info = (orig => (...args) => {
    const [msg, ...rest] = args;
    orig.apply(redirectLogger, [String(msg), ...rest]);
    console.log('[bskylink:redirect]', ...args);
})(redirectLogger.info);
//# sourceMappingURL=logger.js.map