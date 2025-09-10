import { envInt, envStr } from '@atproto/common';
export const readEnv = () => {
    return {
        port: envInt('CARD_PORT'),
        version: envStr('CARD_VERSION'),
        appviewUrl: envStr('CARD_APPVIEW_URL'),
        originVerify: envStr('CARD_ORIGIN_VERIFY'),
    };
};
export const envToCfg = (env) => {
    const serviceCfg = {
        port: env.port ?? 3000,
        version: env.version,
        appviewUrl: env.appviewUrl ?? 'https://api.bsky.app',
        originVerify: env.originVerify,
    };
    return {
        service: serviceCfg,
    };
};
//# sourceMappingURL=config.js.map