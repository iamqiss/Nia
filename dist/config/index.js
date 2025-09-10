import dotenv from 'dotenv';
dotenv.config();
export const config = {
    env: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT || 4000),
    databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
    jwt: {
        accessSecret: process.env.JWT_SECRET || 'change_me_access',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'change_me_refresh',
        accessTtlSec: Number(process.env.JWT_ACCESS_TTL_SEC || 60 * 15),
        refreshTtlSec: Number(process.env.JWT_REFRESH_TTL_SEC || 60 * 60 * 24 * 30),
    },
    crypto: {
        bcryptRounds: Number(process.env.BCRYPT_ROUNDS || 12),
        argon2: {
            memoryCost: Number(process.env.ARGON2_MEMORY || 19456),
            timeCost: Number(process.env.ARGON2_ITERATIONS || 2),
            parallelism: Number(process.env.ARGON2_PARALLELISM || 1),
        },
    },
    rateLimit: {
        windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000),
        max: Number(process.env.RATE_LIMIT_MAX || 120),
    },
};
//# sourceMappingURL=index.js.map