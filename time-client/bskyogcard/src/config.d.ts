export type Config = {
    service: ServiceConfig;
};
export type ServiceConfig = {
    port: number;
    version?: string;
    appviewUrl: string;
    originVerify?: string;
};
export type Environment = {
    port?: number;
    version?: string;
    appviewUrl?: string;
    originVerify?: string;
};
export declare const readEnv: () => Environment;
export declare const envToCfg: (env: Environment) => Config;
//# sourceMappingURL=config.d.ts.map