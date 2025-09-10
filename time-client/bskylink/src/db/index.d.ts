import { Kysely, Migrator } from 'kysely';
import { default as Pg } from 'pg';
import { type DbSchema } from './schema.js';
export declare class Database {
    db: Kysely<DbSchema>;
    cfg: PgConfig;
    migrator: Migrator;
    destroyed: boolean;
    constructor(db: Kysely<DbSchema>, cfg: PgConfig);
    static postgres(opts: PgOptions): Database;
    transaction<T>(fn: (db: Database) => Promise<T>): Promise<T>;
    get schema(): string | undefined;
    get isTransaction(): any;
    assertTransaction(): void;
    assertNotTransaction(): void;
    close(): Promise<void>;
    migrateToOrThrow(migration: string): Promise<any>;
    migrateToLatestOrThrow(): Promise<any>;
}
export default Database;
export type PgConfig = {
    pool: Pg.Pool;
    url: string;
    schema?: string;
    txLockNonce?: string;
};
type PgOptions = {
    url: string;
    pool?: Pg.Pool;
    schema?: string;
    poolSize?: number;
    poolMaxUses?: number;
    poolIdleTimeoutMs?: number;
    txLockNonce?: string;
};
//# sourceMappingURL=index.d.ts.map