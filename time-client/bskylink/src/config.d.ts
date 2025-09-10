export type Config = {
    service: ServiceConfig;
    db: DbConfig;
};
export type ServiceConfig = {
    port: number;
    version?: string;
    hostnames: string[];
    hostnamesSet: Set<string>;
    appHostname: string;
    safelinkEnabled: boolean;
    safelinkPdsUrl?: string;
    safelinkAgentIdentifier?: string;
    safelinkAgentPass?: string;
};
export type DbConfig = {
    url: string;
    migrationUrl?: string;
    pool: DbPoolConfig;
    schema?: string;
};
export type DbPoolConfig = {
    size: number;
    maxUses: number;
    idleTimeoutMs: number;
};
export type Environment = {
    port?: number;
    version?: string;
    hostnames: string[];
    appHostname?: string;
    dbPostgresUrl?: string;
    dbPostgresMigrationUrl?: string;
    dbPostgresSchema?: string;
    dbPostgresPoolSize?: number;
    dbPostgresPoolMaxUses?: number;
    dbPostgresPoolIdleTimeoutMs?: number;
    safelinkEnabled?: boolean;
    safelinkPdsUrl?: string;
    safelinkAgentIdentifier?: string;
    safelinkAgentPass?: string;
};
export declare const readEnv: () => Environment;
export declare const envToCfg: (env: Environment) => Config;
//# sourceMappingURL=config.d.ts.map