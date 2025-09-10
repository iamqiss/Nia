import { envBool, envInt, envList, envStr } from '@atproto/common';
export const readEnv = () => {
    return {
        port: envInt('LINK_PORT'),
        version: envStr('LINK_VERSION'),
        hostnames: envList('LINK_HOSTNAMES'),
        appHostname: envStr('LINK_APP_HOSTNAME'),
        dbPostgresUrl: envStr('LINK_DB_POSTGRES_URL'),
        dbPostgresMigrationUrl: envStr('LINK_DB_POSTGRES_MIGRATION_URL'),
        dbPostgresSchema: envStr('LINK_DB_POSTGRES_SCHEMA'),
        dbPostgresPoolSize: envInt('LINK_DB_POSTGRES_POOL_SIZE'),
        dbPostgresPoolMaxUses: envInt('LINK_DB_POSTGRES_POOL_MAX_USES'),
        dbPostgresPoolIdleTimeoutMs: envInt('LINK_DB_POSTGRES_POOL_IDLE_TIMEOUT_MS'),
        safelinkEnabled: envBool('LINK_SAFELINK_ENABLED'),
        safelinkPdsUrl: envStr('LINK_SAFELINK_PDS_URL'),
        safelinkAgentIdentifier: envStr('LINK_SAFELINK_AGENT_IDENTIFIER'),
        safelinkAgentPass: envStr('LINK_SAFELINK_AGENT_PASS'),
    };
};
export const envToCfg = (env) => {
    const serviceCfg = {
        port: env.port ?? 3000,
        version: env.version,
        hostnames: env.hostnames,
        hostnamesSet: new Set(env.hostnames),
        appHostname: env.appHostname ?? 'bsky.app',
        safelinkEnabled: env.safelinkEnabled ?? false,
        safelinkPdsUrl: env.safelinkPdsUrl,
        safelinkAgentIdentifier: env.safelinkAgentIdentifier,
        safelinkAgentPass: env.safelinkAgentPass,
    };
    if (!env.dbPostgresUrl) {
        throw new Error('Must configure postgres url (LINK_DB_POSTGRES_URL)');
    }
    const dbCfg = {
        url: env.dbPostgresUrl,
        migrationUrl: env.dbPostgresMigrationUrl,
        schema: env.dbPostgresSchema,
        pool: {
            idleTimeoutMs: env.dbPostgresPoolIdleTimeoutMs ?? 10000,
            maxUses: env.dbPostgresPoolMaxUses ?? Infinity,
            size: env.dbPostgresPoolSize ?? 10,
        },
    };
    return {
        service: serviceCfg,
        db: dbCfg,
    };
};
//# sourceMappingURL=config.js.map