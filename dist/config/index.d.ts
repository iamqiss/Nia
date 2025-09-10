type Environment = 'development' | 'test' | 'production';
export declare const config: {
    readonly env: Environment;
    readonly port: number;
    readonly databaseUrl: string;
    readonly jwt: {
        readonly accessSecret: string;
        readonly refreshSecret: string;
        readonly accessTtlSec: number;
        readonly refreshTtlSec: number;
    };
    readonly crypto: {
        readonly bcryptRounds: number;
        readonly argon2: {
            readonly memoryCost: number;
            readonly timeCost: number;
            readonly parallelism: number;
        };
    };
    readonly rateLimit: {
        readonly windowMs: number;
        readonly max: number;
    };
};
export {};
//# sourceMappingURL=index.d.ts.map