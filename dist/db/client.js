import { PrismaClient } from '@prisma/client';
import { config } from '../config/index.js';
export const prisma = global.__prismaClient || new PrismaClient({
    log: config.env === 'development' ? ['query', 'error', 'warn'] : ['error'],
});
if (config.env !== 'production') {
    global.__prismaClient = prisma;
}
//# sourceMappingURL=client.js.map